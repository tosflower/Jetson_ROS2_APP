package expo.modules.jetsondiscovery

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.nsd.NsdManager
import android.net.nsd.NsdServiceInfo
import android.net.wifi.WifiManager
import android.os.Build
import android.os.Handler
import android.os.Looper
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.Inet4Address
import java.util.concurrent.atomic.AtomicBoolean

class JetsonDiscoveryModule : Module() {
  private val serviceType = "_jetson-gateway._tcp."

  override fun definition() = ModuleDefinition {
    Name("JetsonDiscovery")

    AsyncFunction<String?>("getWifiGatewayAddressAsync") {
      val context = appContext.reactContext ?: return@AsyncFunction null
      val connectivity = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
      // Jetson 热点可无互联网；遍历全部网络，避免蜂窝网络成为 activeNetwork。
      connectivity.allNetworks.firstNotNullOfOrNull { network ->
        val capabilities = connectivity.getNetworkCapabilities(network)
        if (capabilities?.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) != true) return@firstNotNullOfOrNull null
        connectivity.getLinkProperties(network)?.routes
          ?.firstOrNull { it.isDefaultRoute && it.gateway is Inet4Address }
          ?.gateway?.hostAddress
      }
    }

    AsyncFunction("discoverJetsonAsync") { promise: Promise ->
      val context = appContext.reactContext
      if (context == null) {
        promise.resolve(null)
        return@AsyncFunction
      }
      val manager = context.getSystemService(Context.NSD_SERVICE) as NsdManager
      val wifi = context.applicationContext.getSystemService(Context.WIFI_SERVICE) as? WifiManager
      val multicastLock = wifi?.createMulticastLock("jetson-gateway-discovery")
      try {
        multicastLock?.setReferenceCounted(false)
        multicastLock?.acquire()
      } catch (_: Exception) { /* 部分设备禁用多播锁，仍尝试系统 NSD。 */ }
      val handler = Handler(Looper.getMainLooper())
      val completed = AtomicBoolean(false)
      val started = AtomicBoolean(false)
      lateinit var listener: NsdManager.DiscoveryListener

      fun finish(address: String?, port: Int = 8080) {
        if (!completed.compareAndSet(false, true)) return
        handler.post {
          if (started.get()) {
            try { manager.stopServiceDiscovery(listener) } catch (_: Exception) { }
          }
          if (multicastLock?.isHeld == true) multicastLock.release()
          promise.resolve(if (address == null) null else mapOf("address" to address, "port" to port))
        }
      }

      listener = object : NsdManager.DiscoveryListener {
        override fun onDiscoveryStarted(type: String) { started.set(true) }
        override fun onDiscoveryStopped(type: String) { started.set(false) }
        override fun onStartDiscoveryFailed(type: String, code: Int) { finish(null) }
        override fun onStopDiscoveryFailed(type: String, code: Int) { started.set(false) }
        override fun onServiceLost(service: NsdServiceInfo) { }
        override fun onServiceFound(service: NsdServiceInfo) {
          if (!service.serviceType.startsWith("_jetson-gateway._tcp") || completed.get()) return
          try {
            manager.resolveService(service, object : NsdManager.ResolveListener {
              override fun onResolveFailed(service: NsdServiceInfo, code: Int) { }
              override fun onServiceResolved(service: NsdServiceInfo) {
                // Android 14 起读取全部地址；旧版本使用单一 host 字段。
                val address = if (Build.VERSION.SDK_INT >= 34) {
                  service.hostAddresses.firstOrNull { it is Inet4Address }?.hostAddress
                } else {
                  (service.host as? Inet4Address)?.hostAddress
                }
                if (address != null) finish(address, service.port)
              }
            })
          } catch (_: Exception) { /* 系统 NSD 忙时继续等待其他服务。 */ }
        }
      }
      try {
        manager.discoverServices(serviceType, NsdManager.PROTOCOL_DNS_SD, listener)
        handler.postDelayed({ finish(null) }, 4000)
      } catch (_: Exception) {
        finish(null)
      }
    }
  }
}
