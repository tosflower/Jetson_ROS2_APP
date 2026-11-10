package expo.modules.locationprobe

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.location.GnssStatus
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.HandlerThread
import android.os.SystemClock
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.ArrayDeque

/** 独立订阅系统 gps/network，不经过 GMS、地图、WebSocket 或 JS 计时器。 */
class LocationProbeModule : Module() {
  private val worker = HandlerThread("location-probe").apply { start() }
  private val handler = Handler(worker.looper)
  private var manager: LocationManager? = null
  private var running = false
  @Volatile private var destroyed = false
  private var startedNs = 0L
  private var intervalMs = 1000L
  private var snapshotId = 0L
  private var reason = "尚未开始测试"
  private var satellitesSeen: Int? = null
  private var satellitesUsed: Int? = null
  private var gnssCallback: GnssStatus.Callback? = null
  private val listeners = mutableMapOf<String, LocationListener>()
  private val states = mutableMapOf<String, ProviderState>()
  private val log = ArrayDeque<String>()
  private var droppedLogCount = 0

  private class ProviderState(startedNs: Long) {
    val metrics = ProbeMetrics(startedNs)
    var status = "未选择"
    var lastFix: Map<String, Any?>? = null
  }

  private val ticker = object : Runnable {
    override fun run() {
      if (!running || destroyed) return
      emitSnapshot()
      handler.postDelayed(this, 1000)
    }
  }

  override fun definition() = ModuleDefinition {
    Name("LocationProbe")
    Events("onSnapshot")

    AsyncFunction("getStatusAsync") { promise: Promise ->
      onWorker(promise) { snapshot() }
    }
    AsyncFunction("startAsync") { providers: List<String>, requestedIntervalMs: Double, promise: Promise ->
      onWorker(promise) {
        require(providers.isNotEmpty() && providers.all { it == "gps" || it == "network" }) {
          "请选择 GNSS、网络定位或同时测试"
        }
        require(requestedIntervalMs.isFinite() && requestedIntervalMs in 250.0..60_000.0) {
          "请求间隔必须在 250～60000 毫秒之间"
        }
        start(providers.distinct(), requestedIntervalMs.toLong())
        snapshot()
      }
    }
    AsyncFunction("stopAsync") { promise: Promise ->
      onWorker(promise) { stop("测试已停止"); snapshot() }
    }
    AsyncFunction("getLogAsync") { promise: Promise ->
      onWorker(promise) {
        "# device=${Build.MANUFACTURER} ${Build.MODEL}; api=${Build.VERSION.SDK_INT}; interval_ms=$intervalMs; dropped_rows=$droppedLogCount\n" +
          "requested_provider,actual_provider,event,callback_elapsed_ns,sample_elapsed_ns,sample_unix_ms,callback_age_ms,accuracy_m,latitude,longitude\n" +
          log.joinToString("\n")
      }
    }
    OnActivityEntersBackground {
      handler.post { if (running) stop("App 进入后台，测试已停止；回到前台后请重新开始") }
    }
    OnDestroy {
      destroyed = true
      handler.post { stop("模块已关闭"); worker.quitSafely() }
    }
  }

  private fun context(): Context = appContext.reactContext
    ?: throw IllegalStateException("应用上下文尚未准备好")

  private fun locationManager(): LocationManager = manager ?: run {
    (context().getSystemService(Context.LOCATION_SERVICE) as LocationManager).also { manager = it }
  }

  private fun permitted(permission: String): Boolean = context().checkSelfPermission(permission) == PackageManager.PERMISSION_GRANTED

  private fun onWorker(promise: Promise, action: () -> Any?) {
    if (destroyed || !handler.post {
        try { promise.resolve(action()) }
        catch (error: Exception) { promise.reject("ERR_LOCATION_PROBE", error.message, error) }
      }) {
      promise.reject("ERR_LOCATION_PROBE", "定位测试模块已关闭", null)
    }
  }

  @Suppress("MissingPermission")
  private fun start(providers: List<String>, requestedIntervalMs: Long) {
    stopSubscriptions()
    states.clear()
    log.clear()
    droppedLogCount = 0
    satellitesSeen = null
    satellitesUsed = null
    intervalMs = requestedIntervalMs
    startedNs = SystemClock.elapsedRealtimeNanos()
    val service = locationManager()
    val fine = permitted(Manifest.permission.ACCESS_FINE_LOCATION)
    val coarse = permitted(Manifest.permission.ACCESS_COARSE_LOCATION)
    for (provider in listOf("gps", "network")) {
      val state = ProviderState(startedNs)
      states[provider] = state
      if (provider !in providers) continue
      if (provider !in service.allProviders) { state.status = "系统不提供此定位来源"; continue }
      if (!fine && (provider == "gps" || !coarse)) {
        state.status = if (provider == "gps") "缺少精确位置权限" else "缺少定位权限"
        continue
      }
      if (!service.isProviderEnabled(provider)) { state.status = "此定位来源未开启"; continue }
      val listener = object : LocationListener {
        override fun onLocationChanged(location: Location) { record(provider, state, location) }
        override fun onProviderEnabled(name: String) {
          if (running && states[provider] === state) { state.status = "已开启，等待位置"; emitSnapshot() }
        }
        override fun onProviderDisabled(name: String) {
          if (running && states[provider] === state) { state.status = "此定位来源已关闭"; emitSnapshot() }
        }
        @Deprecated("兼容旧版 Android 的 LocationListener")
        override fun onStatusChanged(name: String?, status: Int, extras: Bundle?) { }
      }
      try {
        // 使用显式 provider，避免自动挑选 fused 后无法区分 GNSS 与网络定位。
        service.requestLocationUpdates(provider, intervalMs, 0f, listener, worker.looper)
        listeners[provider] = listener
        state.status = "等待首次定位"
      } catch (error: Exception) { state.status = "订阅失败：${error.message}" }
    }
    if ("gps" in listeners) {
      val callback = object : GnssStatus.Callback() {
        override fun onSatelliteStatusChanged(status: GnssStatus) {
          if (!running || gnssCallback !== this) return
          satellitesSeen = status.satelliteCount
          satellitesUsed = (0 until status.satelliteCount).count { status.usedInFix(it) }
        }
      }
      try { service.registerGnssStatusCallback(callback, handler); gnssCallback = callback }
      catch (_: Exception) { /* 卫星状态不可用不应中断位置回调测试。 */ }
    }
    running = listeners.isNotEmpty()
    reason = if (running) "正在本机测试；不发送到开发板" else "未能订阅定位，请检查下方状态和系统权限"
    emitSnapshot()
    if (running) handler.postDelayed(ticker, 1000)
  }

  private fun record(provider: String, state: ProviderState, location: Location) {
    if (!running || states[provider] !== state) return
    val receivedNs = SystemClock.elapsedRealtimeNanos()
    val event = state.metrics.record(location.elapsedRealtimeNanos, receivedNs)
    if (event == "new") {
      state.lastFix = mapOf("latitude" to location.latitude, "longitude" to location.longitude,
        "actualProvider" to location.provider,
        "accuracyM" to if (location.hasAccuracy()) location.accuracy.toDouble() else null,
        "sampleUnixMs" to location.time)
      state.status = "正在接收"
    }
    val age = (receivedNs - location.elapsedRealtimeNanos) / 1_000_000.0
    val row = listOf(provider, location.provider ?: "", event, receivedNs, location.elapsedRealtimeNanos, location.time,
      age, if (location.hasAccuracy()) location.accuracy else "", location.latitude, location.longitude).joinToString(",")
    // 有界日志避免长时间测试耗尽内存；导出中明确注明已丢弃的旧行数量。
    if (log.size >= 2000) { log.removeFirst(); droppedLogCount++ }
    log.addLast(row)
  }

  private fun stopSubscriptions() {
    running = false
    handler.removeCallbacks(ticker)
    listeners.values.forEach { try { manager?.removeUpdates(it) } catch (_: Exception) { } }
    listeners.clear()
    gnssCallback?.let { try { manager?.unregisterGnssStatusCallback(it) } catch (_: Exception) { } }
    gnssCallback = null
  }

  private fun stop(message: String) {
    stopSubscriptions()
    reason = message
    states.values.filter { it.status == "正在接收" || it.status == "等待首次定位" }.forEach { it.status = "已停止" }
    if (!destroyed) emitSnapshot()
  }

  private fun snapshot(): Map<String, Any?> {
    val service = locationManager()
    val now = SystemClock.elapsedRealtimeNanos()
    snapshotId++
    return mapOf(
      "id" to snapshotId, "createdAtMs" to System.currentTimeMillis(), "running" to running, "reason" to reason,
      "device" to "${Build.MANUFACTURER} ${Build.MODEL}", "apiLevel" to Build.VERSION.SDK_INT,
      "gpsHardware" to context().packageManager.hasSystemFeature(PackageManager.FEATURE_LOCATION_GPS),
      "finePermission" to permitted(Manifest.permission.ACCESS_FINE_LOCATION),
      "coarsePermission" to permitted(Manifest.permission.ACCESS_COARSE_LOCATION),
      "requestedIntervalMs" to intervalMs,
      "elapsedMs" to if (startedNs == 0L) 0.0 else (now - startedNs) / 1_000_000.0,
      "satellitesSeen" to satellitesSeen, "satellitesUsed" to satellitesUsed,
      "providers" to listOf("gps", "network").map { provider ->
        val state = states[provider]
        mapOf("provider" to provider, "available" to (provider in service.allProviders),
          "enabled" to runCatching { service.isProviderEnabled(provider) }.getOrDefault(false),
          "status" to (state?.status ?: "尚未开始"), "metrics" to state?.metrics?.snapshot(now), "lastFix" to state?.lastFix)
      },
      "recentRows" to log.toList().takeLast(8), "logCount" to log.size, "droppedLogCount" to droppedLogCount
    )
  }

  private fun emitSnapshot() {
    if (!destroyed) sendEvent("onSnapshot", snapshot())
  }
}
