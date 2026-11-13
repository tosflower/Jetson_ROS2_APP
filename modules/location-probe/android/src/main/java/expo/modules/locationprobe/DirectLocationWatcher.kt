package expo.modules.locationprobe

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Build
import android.os.Bundle
import android.os.Looper
import android.os.SystemClock

/** 正常采集使用独立监听；与诊断测试的订阅、计数和停止操作互不混用。 */
internal class DirectLocationWatcher(
  private val context: () -> Context,
  private val looper: Looper,
  private val onPosition: (Map<String, Any?>) -> Unit,
  private val onError: (Map<String, Any?>) -> Unit
) {
  private var manager: LocationManager? = null
  private var listener: LocationListener? = null
  private var sessionId: String? = null

  @Suppress("MissingPermission")
  fun start(id: String, provider: String) {
    require(provider == LocationManager.GPS_PROVIDER || provider == LocationManager.NETWORK_PROVIDER) {
      "仅支持 GNSS 或网络定位"
    }
    val ctx = context()
    val fine = ctx.checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
    val coarse = ctx.checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED
    check(if (provider == LocationManager.GPS_PROVIDER) fine else fine || coarse) {
      if (provider == LocationManager.GPS_PROVIDER) "GNSS 模式需要精确位置权限" else "网络定位需要位置权限"
    }
    val service = ctx.getSystemService(Context.LOCATION_SERVICE) as LocationManager
    check(provider in service.allProviders) { "设备不支持所选定位来源：$provider" }
    check(service.isProviderEnabled(provider)) { "所选定位来源未开启：$provider，请检查系统位置设置" }
    stop()
    manager = service
    sessionId = id
    val next = object : LocationListener {
      override fun onLocationChanged(location: Location) {
        if (listener !== this || sessionId != id) return
        val receivedNs = SystemClock.elapsedRealtimeNanos()
        onPosition(mapOf(
          "sessionId" to id, "provider" to location.provider,
          "timestamp" to location.time.toDouble(),
          // 与独立定位测试使用相同的单调时钟；UTC 时间戳仍原样保留给地图和 ROS。
          "nativeTiming" to mapOf(
            "sampleMonotonicMs" to location.elapsedRealtimeNanos / 1_000_000.0,
            "receivedMonotonicMs" to receivedNs / 1_000_000.0
          ),
          "mocked" to if (Build.VERSION.SDK_INT >= 31) location.isMock else location.isFromMockProvider,
          "coords" to mapOf(
            "latitude" to location.latitude, "longitude" to location.longitude,
            "accuracy" to if (location.hasAccuracy()) location.accuracy.toDouble() else null,
            "altitude" to if (location.hasAltitude()) location.altitude else null,
            "altitudeAccuracy" to if (Build.VERSION.SDK_INT >= 26 && location.hasVerticalAccuracy()) location.verticalAccuracyMeters.toDouble() else null,
            "speed" to if (location.hasSpeed()) location.speed.toDouble() else null,
            "heading" to if (location.hasBearing()) location.bearing.toDouble() else null
          )
        ))
      }
      override fun onProviderEnabled(name: String) { }
      override fun onProviderDisabled(name: String) {
        if (listener === this && sessionId == id) {
          onError(mapOf("sessionId" to id, "message" to "所选定位来源已关闭：$name"))
        }
      }
      @Deprecated("兼容旧版 Android 的 LocationListener")
      override fun onStatusChanged(name: String?, status: Int, extras: Bundle?) { }
    }
    listener = next
    try {
      // 请求尽快获得新采样；不注入缓存、不等待网络辅助，也不伪造系统更新频率。
      service.requestLocationUpdates(provider, 1000L, 0f, next, looper)
    } catch (error: Exception) {
      stop(id)
      throw error
    }
  }

  fun stop(id: String? = null) {
    // 旧 JS 会话迟到的释放操作不能取消刚切换的新来源。
    if (id != null && id != sessionId) return
    val previous = listener
    listener = null
    sessionId = null
    previous?.let { try { manager?.removeUpdates(it) } catch (_: Exception) { } }
  }
}
