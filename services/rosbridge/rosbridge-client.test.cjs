const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const ts = require('typescript');

function compile(file) {
  return ts.transpileModule(readFileSync(`${__dirname}/${file}`, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
}

const protocol = {};
new Function('exports', compile('protocol.ts'))(protocol);
const clientExports = {};
new Function('exports', 'require', compile('rosbridge-client.ts'))(
  clientExports,
  (id) => {
    if (id === './protocol') return protocol;
    throw new Error(`未知测试依赖：${id}`);
  },
);
const { RosbridgeClient } = clientExports;

class FakeSocket {
  constructor(url) {
    this.url = url;
    this.readyState = 0;
    this.sent = [];
    this.onopen = null;
    this.onmessage = null;
    this.onerror = null;
    this.onclose = null;
  }

  open() {
    this.readyState = 1;
    this.onopen?.();
  }

  receive(value) {
    this.onmessage?.({ data: JSON.stringify(value) });
  }

  serverClose() {
    this.readyState = 3;
    this.onclose?.({ code: 1006, reason: '测试断线' });
  }

  send(value) {
    this.sent.push(JSON.parse(value));
  }

  close() {
    this.readyState = 3;
    this.onclose?.({ code: 1000, reason: '客户端断开' });
  }
}

test('重连后只恢复一次有效订阅，并忽略非法消息', async () => {
  const sockets = [];
  const received = [];
  const client = new RosbridgeClient({
    createSocket: (url) => {
      const socket = new FakeSocket(url);
      sockets.push(socket);
      return socket;
    },
    reconnectDelaysMs: [0],
  });
  const unsubscribe = client.subscribe('/robot/status', 'std_msgs/msg/String', (message) => received.push(message));
  client.advertise('/phone/gps', 'sensor_msgs/msg/NavSatFix');
  assert.throws(() => client.publish('/phone/gps', { latitude: 31.2 }), /未连接/);

  const initialConnection = client.connect('ws://robot.local:9090');
  sockets[0].open();
  await initialConnection;
  assert.equal(sockets[0].sent.filter((message) => message.op === 'subscribe').length, 1);
  assert.equal(sockets[0].sent.filter((message) => message.op === 'advertise').length, 1);
  client.advertise('/phone/gps', 'sensor_msgs/msg/NavSatFix');
  assert.equal(sockets[0].sent.filter((message) => message.op === 'advertise').length, 1);
  client.publish('/phone/gps', { latitude: 31.2 });
  assert.deepEqual(sockets[0].sent.at(-1), {
    op: 'publish', topic: '/phone/gps', msg: { latitude: 31.2 },
  });
  sockets[0].receive({ op: 'publish', topic: '/robot/status', msg: { data: 'ready' } });
  sockets[0].receive({ op: 'publish', topic: '/robot/status' });
  assert.deepEqual(received, [{ data: 'ready' }]);

  sockets[0].serverClose();
  await new Promise((resolve) => setTimeout(resolve, 5));
  assert.equal(sockets.length, 2);
  sockets[1].open();
  assert.equal(sockets[1].sent.filter((message) => message.op === 'subscribe').length, 1);
  assert.equal(sockets[1].sent.filter((message) => message.op === 'advertise').length, 1);
  await client.connect('ws://robot.local:9090');
  assert.equal(sockets.length, 2);

  unsubscribe();
  assert.equal(sockets[1].sent.at(-1).op, 'unsubscribe');
  client.unadvertise('/phone/gps');
  assert.equal(sockets[1].sent.at(-1).op, 'unadvertise');
  assert.throws(() => client.publish('/phone/gps', { latitude: 31.2 }), /尚未 advertise/);
  client.disconnect();
});

test('连接超时后关闭旧连接并进入自动重连', async () => {
  const sockets = [];
  const states = [];
  const errors = [];
  const client = new RosbridgeClient({
    createSocket: (url) => {
      const socket = new FakeSocket(url);
      sockets.push(socket);
      return socket;
    },
    connectionTimeoutMs: 0,
    reconnectDelaysMs: [50],
    onStateChange: (state) => states.push(state),
    onError: (message) => errors.push(message),
  });

  await assert.rejects(client.connect('ws://robot.local:9090'));
  assert.equal(sockets[0].readyState, 3);
  assert.equal(states.at(-1), 'reconnecting');
  assert.match(errors.at(-1), /连接超时/);
  client.disconnect();
});

test('Service 依靠唯一 id 匹配响应，并在断线时清理未完成请求', async () => {
  const sockets = [];
  const client = new RosbridgeClient({
    createSocket: (url) => {
      const socket = new FakeSocket(url);
      sockets.push(socket);
      return socket;
    },
    reconnectDelaysMs: [1000],
  });
  const connection = client.connect('ws://robot.local:9090');
  sockets[0].open();
  await connection;

  const success = client.callService('/set_enabled', { data: true }, 1000);
  const request = sockets[0].sent.at(-1);
  assert.equal(request.op, 'call_service');
  assert.equal(request.service, '/set_enabled');
  sockets[0].receive({
    op: 'service_response',
    id: request.id,
    service: '/set_enabled',
    result: true,
    values: { success: true, message: 'ok' },
  });
  assert.deepEqual(await success, { success: true, message: 'ok' });

  await assert.rejects(client.callService('/slow_service', {}, 1), /调用超时/);

  const interrupted = client.callService('/set_enabled', { data: false }, 1000);
  sockets[0].serverClose();
  await assert.rejects(interrupted, /连接已中断/);
  client.disconnect();
});

test('内置手机桥先认证，确认后才恢复订阅与发布', async () => {
  const sockets = [];
  const client = new RosbridgeClient({ createSocket: (url) => {
    const socket = new FakeSocket(url);
    sockets.push(socket);
    return socket;
  } });
  client.advertise('/phone/gps_data', 'std_msgs/msg/String');
  client.subscribe('/rosout', 'rcl_interfaces/msg/Log', () => {});
  const connection = client.connect('ws://robot.local:9090', 'login-token');
  sockets[0].open();
  assert.deepEqual(sockets[0].sent, [{ op: 'auth', token: 'login-token' }]);
  assert.equal(client.getConnectionState(), 'connecting');
  sockets[0].receive({ op: 'auth_response', result: true });
  await connection;
  assert.deepEqual(sockets[0].sent.map((message) => message.op), ['auth', 'subscribe', 'advertise']);
  client.disconnect();
});

test('网关拒绝发布时显示错误，但保持已认证的连接', async () => {
  const errors = [];
  let socket;
  const client = new RosbridgeClient({
    createSocket: (url) => { socket = new FakeSocket(url); return socket; },
    onError: (message) => errors.push(message),
  });
  const connection = client.connect('ws://robot.local:9090', 'login-token');
  socket.open();
  socket.receive({ op: 'auth_response', result: true });
  await connection;
  socket.receive({ op: 'status', level: 'error', msg: '话题未 advertise 或消息格式错误' });
  assert.deepEqual(errors, ['话题未 advertise 或消息格式错误']);
  assert.equal(client.getConnectionState(), 'connected');
  client.disconnect();
});
