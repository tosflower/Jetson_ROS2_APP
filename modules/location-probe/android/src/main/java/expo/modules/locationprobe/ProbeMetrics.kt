package expo.modules.locationprobe

/** 全部使用 Android 同一开机时钟；既不受自动校时影响，也不把重复回调当作新位置。 */
internal class ProbeMetrics(private val startedNs: Long) {
  private class Summary {
    var count = 0
    private var sum = 0.0
    private var minimum: Double? = null
    private var maximum: Double? = null

    fun add(value: Double) {
      count++
      sum += value
      minimum = minimum?.let { minOf(it, value) } ?: value
      maximum = maximum?.let { maxOf(it, value) } ?: value
    }

    fun snapshot(): Map<String, Any?> = mapOf(
      "count" to count, "meanMs" to if (count == 0) null else sum / count,
      "minMs" to minimum, "maxMs" to maximum
    )
  }

  var callbackCount = 0
    private set
  var newFixCount = 0
    private set
  private var duplicates = 0
  private var outOfOrder = 0
  private var invalid = 0
  private var lastCallbackNs: Long? = null
  private var latestSampleNs: Long? = null
  private var firstCallbackMs: Double? = null
  private var firstFreshFixMs: Double? = null
  private var lastCallbackIntervalMs: Double? = null
  private var lastSampleIntervalMs: Double? = null
  private var lastCallbackAgeMs: Double? = null
  private val callbackIntervals = Summary()
  private val sampleIntervals = Summary()
  private val callbackAges = Summary()

  /** 返回 new/duplicate/out_of_order/invalid，供 CSV 和界面区分真实新采样。 */
  fun record(sampleNs: Long, receivedNs: Long): String {
    callbackCount++
    if (firstCallbackMs == null) firstCallbackMs = milliseconds(receivedNs - startedNs)
    lastCallbackNs?.let {
      lastCallbackIntervalMs = milliseconds(receivedNs - it)
      callbackIntervals.add(lastCallbackIntervalMs!!)
    }
    lastCallbackNs = receivedNs
    if (sampleNs <= 0 || sampleNs > receivedNs) {
      invalid++
      return "invalid"
    }
    lastCallbackAgeMs = milliseconds(receivedNs - sampleNs)
    if (sampleNs == latestSampleNs) {
      duplicates++
      return "duplicate"
    }
    if (latestSampleNs != null && sampleNs < latestSampleNs!!) {
      outOfOrder++
      return "out_of_order"
    }
    latestSampleNs?.let {
      lastSampleIntervalMs = milliseconds(sampleNs - it)
      sampleIntervals.add(lastSampleIntervalMs!!)
    }
    latestSampleNs = sampleNs
    newFixCount++
    callbackAges.add(lastCallbackAgeMs!!)
    // 首次回调可能是缓存；另记首次收到测试启动后生成的新位置的耗时。
    if (sampleNs >= startedNs && firstFreshFixMs == null) {
      firstFreshFixMs = milliseconds(receivedNs - startedNs)
    }
    return "new"
  }

  fun snapshot(nowNs: Long): Map<String, Any?> = mapOf(
    "callbackCount" to callbackCount, "newFixCount" to newFixCount,
    "duplicateCount" to duplicates, "outOfOrderCount" to outOfOrder, "invalidCount" to invalid,
    "firstCallbackMs" to firstCallbackMs, "firstFreshFixMs" to firstFreshFixMs,
    "lastCallbackIntervalMs" to lastCallbackIntervalMs, "lastSampleIntervalMs" to lastSampleIntervalMs,
    "lastCallbackAgeMs" to lastCallbackAgeMs,
    "currentAgeMs" to latestSampleNs?.let { milliseconds(nowNs - it) },
    "silenceMs" to lastCallbackNs?.let { milliseconds(nowNs - it) },
    "callbackIntervals" to callbackIntervals.snapshot(), "sampleIntervals" to sampleIntervals.snapshot(),
    "callbackAges" to callbackAges.snapshot()
  )

  private fun milliseconds(nanoseconds: Long): Double = nanoseconds / 1_000_000.0
}
