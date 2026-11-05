const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const ts = require('typescript');

function compile(file) {
  return ts.transpileModule(readFileSync(`${__dirname}/${file}`, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
}

const transform = {};
new Function('exports', compile('frame-transform.ts'))(transform);
const messages = {};
new Function('exports', 'require', compile('messages.ts'))(messages, (id) => {
  if (id === './frame-transform') return transform;
  throw new Error(`未知测试依赖：${id}`);
});

test('时间戳转换后 nanosec 保持在 ROS 2 合法范围', () => {
  const result = messages.rosTimeFromUnixMilliseconds(1_700_000_000_123.5);
  assert.equal(result.sec, 1_700_000_000);
  assert.equal(result.nanosec, 123_500_000);
});

test('IMU 单位转换正确，未知姿态不伪造单位四元数', () => {
  const message = messages.buildImuMessage(
    { x: 1, y: -2, z: 0.5 },
    { x: 0.1, y: 0.2, z: -0.3 },
    1000,
  );
  assert.deepEqual(message.linear_acceleration, { x: 9.80665, y: -19.6133, z: 4.903325 });
  assert.deepEqual(message.angular_velocity, { x: 0.1, y: 0.2, z: -0.3 });
  assert.deepEqual(message.orientation, { x: 0, y: 0, z: 0, w: 0 });
  assert.equal(message.orientation_covariance[0], -1);
});

test('磁力计从 μT 转为 T', () => {
  const message = messages.buildMagneticFieldMessage({ x: 50, y: -25, z: 10 }, 1000);
  assert.ok(Math.abs(message.magnetic_field.x - 0.00005) < 1e-12);
  assert.ok(Math.abs(message.magnetic_field.y + 0.000025) < 1e-12);
  assert.ok(Math.abs(message.magnetic_field.z - 0.00001) < 1e-12);
});

test('GPS 精度转为对角协方差，海拔缺失时拒绝伪造 0', () => {
  const sample = {
    timestamp: 2000,
    coords: { latitude: 31.2, longitude: 121.5, altitude: 12, accuracy: 3, altitudeAccuracy: 5 },
  };
  const message = messages.buildNavSatFixMessage(sample);
  assert.deepEqual(message.position_covariance, [9, 0, 0, 0, 9, 0, 0, 0, 25]);
  assert.equal(message.position_covariance_type, 2);
  assert.equal(messages.buildNavSatFixMessage({ ...sample, coords: { ...sample.coords, altitude: null } }), null);
});

test('海拔缺失时仍可生成包含经纬度的 GPS 数据消息', () => {
  const sample = {
    timestamp: 2000,
    coords: { latitude: 31.2, longitude: 121.5, altitude: null, accuracy: 3, altitudeAccuracy: null },
  };
  const message = messages.buildGpsDataMessage(sample);
  assert.deepEqual(JSON.parse(message.data), {
    latitude: 31.2, longitude: 121.5, altitude: null, accuracy_m: 3, timestamp_ms: 2000,
  });
});

test('航向角叠加安装偏角后规范到 0 至 360 度', () => {
  assert.deepEqual(messages.buildHeadingMessage(350, 20), { data: 10 });
  assert.deepEqual(messages.buildHeadingMessage(10, -30), { data: 340 });
  assert.equal(messages.buildHeadingMessage(Number.NaN), null);
});
