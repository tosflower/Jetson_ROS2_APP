const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const ts = require('typescript');

const routing = {};
new Function('exports', ts.transpileModule(readFileSync(`${__dirname}/amap-routing.ts`, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText)(routing);
const { requestRidingRoute, parseRidingRoute, mapCoordinate, formatRouteDistance, formatRouteDuration } = routing;

const origin = [116.4, 39.9];
const target = [116.41, 39.91];
const result = {
  routes: [{ distance: 1250, time: 900, rides: [
    { path: [{ lng: origin[0], lat: origin[1] }, [116.405, 39.905]] },
    { path: [[116.405, 39.905], target] },
  ] }],
};
function sdk(search) {
  return {
    plugin(name, callback) { assert.equal(name, 'AMap.Riding'); callback(); },
    Riding: class {
      constructor(options) { assert.deepEqual(options, { policy: 1 }); }
      search(...args) { search(...args); }
    },
  };
}

test('路线查询原样传入已转换的地图起终点，并读取米/秒及完整路段', async () => {
  const amap = sdk((start, end, callback) => {
    assert.deepEqual(start, origin);
    assert.deepEqual(end, target);
    callback('complete', result);
  });
  const route = await requestRidingRoute(amap, origin, target, new AbortController().signal);
  assert.equal(route.distance, 1250);
  assert.equal(route.duration, 900);
  assert.deepEqual(route.path, [origin, [116.405, 39.905], [116.405, 39.905], target]);
  assert.equal(formatRouteDistance(route.distance), '1.3 公里');
  assert.equal(formatRouteDuration(route.duration), '约 15 分钟');
  assert.equal(formatRouteDuration(3599), '约 1 小时');
});

test('无路线与服务失败返回可重试原因，不产生虚构距离', async () => {
  await assert.rejects(requestRidingRoute(sdk((a, b, cb) => cb('no_data', {})), origin, target,
    new AbortController().signal), /暂无骑行路线/);
  await assert.rejects(requestRidingRoute(sdk((a, b, cb) => cb('error', 'INVALID_USER_KEY')), origin, target,
    new AbortController().signal), /服务权限/);
});

test('缺失、负值或无效坐标的结果被拒绝，不把缺失路段连接成直线', () => {
  for (const data of [
    {}, { routes: [] },
    { routes: [{ ...result.routes[0], time: Number.NaN }] },
    { routes: [{ ...result.routes[0], distance: -1 }] },
    { routes: [{ ...result.routes[0], rides: [{ path: [origin, [999, 39], target] }] }] },
    { routes: [{ ...result.routes[0], rides: [{ path: [origin] }] }] },
  ]) assert.throws(() => parseRidingRoute(data));
  assert.equal(mapCoordinate({ lng: 116, lat: Infinity }), null);
});

test('插件加载前取消后不会创建服务实例或发请求', async () => {
  const controller = new AbortController();
  let loaded;
  let searches = 0;
  const amap = sdk(() => { searches += 1; });
  amap.plugin = (_, callback) => { loaded = callback; };
  const pending = requestRidingRoute(amap, origin, target, controller.signal);
  const rejected = assert.rejects(pending, /已取消/);
  controller.abort();
  loaded();
  await rejected;
  assert.equal(searches, 0);
});

test('改选终点或清除时取消在途请求，迟到成功回调不能恢复旧路线', async () => {
  const controller = new AbortController();
  let reply;
  const pending = requestRidingRoute(sdk((a, b, callback) => { reply = callback; }), origin, target, controller.signal);
  const rejected = assert.rejects(pending, /已取消/);
  controller.abort();
  reply('complete', result);
  await rejected;
});

test('插件加载和查询都受超时限制，超时后忽略迟到回调', async () => {
  let loaded;
  let searches = 0;
  const amap = sdk(() => { searches += 1; });
  amap.plugin = (_, callback) => { loaded = callback; };
  await assert.rejects(requestRidingRoute(amap, origin, target, new AbortController().signal, 10), /超时/);
  loaded();
  assert.equal(searches, 0);
  let reply;
  await assert.rejects(requestRidingRoute(sdk((a, b, cb) => { reply = cb; }), origin, target,
    new AbortController().signal, 10), /超时/);
  assert.doesNotThrow(() => reply('complete', result));
});

test('已经取消的请求不加载插件，插件抛出异常也能结束等待', async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(requestRidingRoute({ plugin() { throw new Error('不应执行'); } }, origin, target,
    controller.signal), /已取消/);
  await assert.rejects(requestRidingRoute({ plugin() { throw new Error('加载错误'); } }, origin, target,
    new AbortController().signal), /插件加载失败/);
});


const poiResult = { poiList: { pois: [
  { id: 'east-gate', name: '大学东门', cityname: '上海市', adname: '杨浦区', address: '大学路 1 号', location: { lng: 121.5, lat: 31.3 } },
  { id: 'invalid', name: '缺少坐标', location: '' },
  { id: 'east-gate', name: '重复地点', location: [121.5, 31.3] },
  { name: '公园入口', address: [], location: [121.51, 31.31] },
] } };
function placeSdk(search) {
  return {
    plugin(name, callback) { assert.equal(name, 'AMap.PlaceSearch'); callback(); },
    PlaceSearch: class {
      constructor(options) { assert.deepEqual(options, { pageSize: 8, pageIndex: 1, extensions: 'base' }); }
      search(...args) { search(...args); }
    },
  };
}

test('骑行只接受 rides 路段，不把步行 steps 结果误当成骑行路线', () => {
  assert.throws(() => parseRidingRoute({ routes: [{ distance: 100, time: 60, steps: [{ path: [origin, target] }] }] }));
});

test('搜索返回名称、地址和地图坐标，过滤无坐标与重复地点', async () => {
  const results = await routing.searchPlaces(placeSdk((keyword, callback) => {
    assert.equal(keyword, '大学');
    callback('complete', poiResult);
  }), ' 大学 ', new AbortController().signal);
  assert.equal(results.length, 2);
  assert.deepEqual(results[0], { id: 'east-gate', name: '大学东门', address: '上海市 杨浦区 大学路 1 号', location: [121.5, 31.3] });
  assert.equal(results[1].address, '');
});

test('空关键词不请求服务，无结果可继续换关键词，服务错误可重试', async () => {
  assert.deepEqual(await routing.searchPlaces({}, '  ', new AbortController().signal), []);
  assert.deepEqual(await routing.searchPlaces(placeSdk((keyword, cb) => cb('no_data', {})), '不存在', new AbortController().signal), []);
  await assert.rejects(routing.searchPlaces(placeSdk((keyword, cb) => cb('error', 'INVALID_USER_KEY')), '公园',
    new AbortController().signal), /搜索服务权限/);
  await assert.rejects(routing.searchPlaces(placeSdk((keyword, cb) => cb('complete', {})), '公园',
    new AbortController().signal), /数据不完整/);
});

test('修改搜索词或选点时取消在途搜索，旧结果不能重新出现', async () => {
  let callback;
  const controller = new AbortController();
  const pending = routing.searchPlaces(placeSdk((keyword, cb) => { callback = cb; }), '大学', controller.signal);
  const rejected = assert.rejects(pending, /已取消/);
  controller.abort();
  callback('complete', poiResult);
  await rejected;
});

test('地点搜索超时后可以重新查询，迟到回调不影响新请求', async () => {
  let reply;
  await assert.rejects(routing.searchPlaces(placeSdk((keyword, cb) => { reply = cb; }), '大学',
    new AbortController().signal, 10), /超时/);
  const results = await routing.searchPlaces(placeSdk((keyword, cb) => cb('complete', poiResult)), '大学',
    new AbortController().signal);
  reply('complete', { poiList: { pois: [] } });
  assert.equal(results.length, 2);
});
