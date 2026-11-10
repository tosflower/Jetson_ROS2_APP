package expo.modules.locationprobe

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class ProbeMetricsTest {
  private fun ns(seconds: Double) = (seconds * 1_000_000_000).toLong()
  private fun number(values: Map<String, Any?>, key: String) = (values[key] as Number).toDouble()

  @Test fun distinguishesCallbackIntervalSampleIntervalAndAge() {
    val metrics = ProbeMetrics(ns(100.0))
    metrics.record(ns(100.95), ns(101.0))
    metrics.record(ns(101.95), ns(102.0))
    val values = metrics.snapshot(ns(103.0))
    assertEquals(1000.0, number(values, "lastCallbackIntervalMs"), 0.001)
    assertEquals(1000.0, number(values, "lastSampleIntervalMs"), 0.001)
    assertEquals(50.0, number(values, "lastCallbackAgeMs"), 0.001)
    assertEquals(1050.0, number(values, "currentAgeMs"), 0.001)
    assertEquals(1000.0, number(values, "silenceMs"), 0.001)
  }

  @Test fun cachedInitialPositionIsNotTheFirstFreshFix() {
    val metrics = ProbeMetrics(ns(100.0))
    metrics.record(ns(80.0), ns(100.1))
    assertNull(metrics.snapshot(ns(100.1))["firstFreshFixMs"])
    metrics.record(ns(101.0), ns(101.05))
    val values = metrics.snapshot(ns(101.05))
    assertEquals(100.0, number(values, "firstCallbackMs"), 0.001)
    assertEquals(1050.0, number(values, "firstFreshFixMs"), 0.001)
  }

  @Test fun repeatedAndOutOfOrderCallbacksDoNotRefreshLatestPositionAge() {
    val metrics = ProbeMetrics(ns(100.0))
    assertEquals("new", metrics.record(ns(101.0), ns(101.1)))
    assertEquals("duplicate", metrics.record(ns(101.0), ns(102.0)))
    assertEquals("out_of_order", metrics.record(ns(100.0), ns(103.0)))
    val values = metrics.snapshot(ns(105.0))
    assertEquals(1.0, number(values, "newFixCount"), 0.0)
    assertEquals(1.0, number(values, "duplicateCount"), 0.0)
    assertEquals(1.0, number(values, "outOfOrderCount"), 0.0)
    assertEquals(4000.0, number(values, "currentAgeMs"), 0.001)
    @Suppress("UNCHECKED_CAST")
    val sampleIntervals = values["sampleIntervals"] as Map<String, Any?>
    assertEquals(0.0, number(sampleIntervals, "count"), 0.0)
  }

  @Test fun catchingUpEvery170msDoesNotBecomeANew170msGnssSample() {
    val metrics = ProbeMetrics(ns(100.0))
    metrics.record(ns(100.0), ns(111.0))
    metrics.record(ns(100.0), ns(111.17))
    metrics.record(ns(100.0), ns(111.34))
    metrics.record(ns(120.0), ns(120.1))
    val values = metrics.snapshot(ns(120.1))
    assertEquals(2.0, number(values, "newFixCount"), 0.0)
    assertEquals(2.0, number(values, "duplicateCount"), 0.0)
    assertEquals(20_000.0, number(values, "lastSampleIntervalMs"), 0.001)
    assertEquals(100.0, number(values, "lastCallbackAgeMs"), 0.001)
  }

  @Test fun rejectsFutureAndMissingMonotonicSampleTimes() {
    val metrics = ProbeMetrics(ns(100.0))
    assertEquals("invalid", metrics.record(0, ns(101.0)))
    assertEquals("invalid", metrics.record(ns(105.0), ns(102.0)))
    val values = metrics.snapshot(ns(103.0))
    assertEquals(2.0, number(values, "invalidCount"), 0.0)
    assertNull(values["currentAgeMs"])
    assertNull(values["firstFreshFixMs"])
  }
}
