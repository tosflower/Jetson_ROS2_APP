const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const ts = require('typescript');
const modules = {};
function load(name) {
  if (modules[name]) return modules[name];
  const exports = modules[name] = {};
  const js = ts.transpileModule(readFileSync(path.join(__dirname, `${name}.ts`), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  new Function('exports', 'require', js)(exports, relative => load(relative.replace('./', '')));
  return exports;
}
const { buildNavigationRoute: build, distanceMetres: distance, startProgress: start, updateProgress: update, projectOnRoute: project } = load('route-geometry');
const { makeNavigationStatus: status } = load('navigation-status');
const { NavigationPublisher, routePayload, NAVIGATION_ROUTE_TOPIC: ROUTE, NAVIGATION_STATUS_TOPIC: STATUS } = load('navigation-publisher');
const now = 100000;
const a = [121.47, 31.23], b = [121.471, 31.23], c = [121.471, 31.231];
const route = () => build([a, b, c], 220, 60, 'test-route', now);
const sample = (position = a, timestamp = now, speedMps = 3, accuracyM = 3) => ({ position, timestamp, speedMps, accuracyM });

test('道路航点保留首尾及转弯；所有等距航点都位于原始折线', () => {
  const r = route();
  assert.deepEqual(r.waypoints[0].position, a);
  assert.deepEqual(r.waypoints.at(-1).position, c);
  assert.ok(r.waypoints.some(w => JSON.stringify(w.position) === JSON.stringify(b)));
  assert.ok(r.waypoints.length > 5);
  r.waypoints.forEach((w, i) => {
    assert.equal(w.index, i);
    assert.ok(project(r, w.position).offRouteM < 0.1);
    if (i) assert.ok(w.distanceAlongM > r.waypoints[i-1].distanceAlongM);
  });
  assert.equal(r.waypoints.at(-1).distanceAlongM, r.geometryLengthM);
});
test('清理重复点；非法坐标和无长度路线不能发出', () => {
  assert.deepEqual(build([a, a, b, b, c], 200, 60, 'x', now).path, [a, b, c]);
  for (const points of [[a, a], [[Infinity, 31], b], [[200, 31], b]]) assert.throws(() => build(points, 200, 60, 'x', now));
  assert.throws(() => build([a, b], NaN, 60, 'x', now));
});
test('开始需要新鲜准确的 GPS，且必须靠近路线起点', () => {
  for (const fix of [sample(a, now - 11000), sample(a, now, 1, 80), sample(c), sample(a, now + 3000)]) {
    assert.throws(() => start(route(), fix, now));
  }
  assert.equal(start(route(), sample(), now).travelledM, 0);
});
test('沿折线更新剩余距离、实际行驶里程；重复采样不会重复累计', () => {
  const r = route();
  const p = start(r, sample(), now);
  const moved = sample([121.4702, 31.23], now + 2000);
  const next = update(r, p, moved, now + 2000);
  assert.ok(next.travelledM > 18 && next.travelledM < 20);
  assert.ok(next.remainingM < 220 && next.remainingM > 190);
  assert.equal(update(r, next, moved, now + 2000), next);
  assert.ok(next.remainingM > distance(moved.position, c), '剩余距离是沿道路，不是直线');
});
test('停车漂移、过期/低精度定位和异常跳点不增加里程', () => {
  const r = route(), p = start(r, sample(), now);
  for (const fix of [sample([121.47002,31.23], now+1000), sample(b,now+1000,0), sample(b,now-1), sample(b,now+1000,3,100), sample(c,now+1000)]) {
    assert.equal(update(r,p,fix,now+1000).travelledM,0);
  }
});
test('定位长时间中断不把缺失区间计入里程', () => {
  const r = route(), p = start(r, sample(), now);
  const afterGap = update(r,p,sample(b,now+20000),now+20000);
  assert.equal(afterGap.travelledM,0);
  assert.equal(afterGap.remainingM,p.remainingM);
});
test('偏离道路不错误推进剩余距离，状态明确为偏航', () => {
  const r = route(), p = start(r,sample(),now);
  const fix = sample([121.47,31.2304],now+3000);
  const next = update(r,p,fix,now+3000);
  assert.equal(next.remainingM,p.remainingM);
  assert.equal(status(r,'tracking',next,fix,now+3000).fixState,'off_route');
  assert.equal(status(r,'tracking',next,fix,now+3000).remainingM,p.remainingM);
  assert.equal(status(r,'tracking',next,fix,now+3000).state,'tracking');
  assert.notEqual(status(r,'tracking',next,fix,now+3000).nextWaypoint,null);
  assert.notEqual(status(r,'tracking',next,fix,now+3000).nextWaypointBearingDegrees,null);
});
test('投影窗口限制交叉路线的跳跃进度', () => {
  const r=build([a,b,c,[121.47,31.231],a,b],600,60,'loop',now);
  const projected=project(r,[121.4702,31.23],0,50);
  assert.ok(projected.alongM<25);
});
test('GPS 过期隐藏速度与剩余距离，保留已行驶里程；无速度不伪造零速', () => {
  const r=route(),p=start(r,sample(),now);
  const stale=status(r,'tracking',p,sample(),now+11000);
  assert.equal(stale.fixState,'stale'); assert.equal(stale.speedMps,null); assert.equal(stale.remainingM,null);
  assert.equal(stale.travelledM,0);
  assert.equal(status(r,'tracking',p,sample(a,now,-1),now).speedMps,null);
});
function transport() {
  const messages=[],ads=[],unads=[];
  return {messages,ads,unads,advertiseTopic:(topic,type)=>ads.push([topic,type]),unadvertiseTopic:topic=>unads.push(topic),publishTopic:(topic,msg)=>messages.push([topic,JSON.parse(msg.data)])};
}
test('ROS 数据明确标注 GCJ-02，并保留道路折线与航点；无伪造的 Nav2 goal', () => {
  const t=transport(),pub=new NavigationPublisher(t),r=route();pub.setConnected(true);
  pub.handle({kind:'route',route:r,status:status(r,'preview',null,sample(),now)});
  const payload=t.messages.find(m=>m[0]===ROUTE)[1];
  assert.equal(payload.coordinate_system,'GCJ-02');assert.equal(payload.requires_nav2_coordinate_transform,true);
  assert.deepEqual(payload.path,r.path);assert.equal(payload.waypoints[0].longitude,a[0]);
  assert.equal(t.messages.find(m=>m[0]===STATUS)[1].nav2_goal_sent,false);
  assert.ok(t.ads.every(a=>a[1]==='std_msgs/msg/String'));
  assert.equal(routePayload(null).waypoints.length,0);
});
test('离线开始/停止后重连只回放最终 stopped 数据，不复活导航；清除后不重放旧航点', () => {
  const t=transport(),pub=new NavigationPublisher(t),r=route();
  assert.equal(pub.handle({kind:'start',route:r,status:status(r,'tracking',null,sample(),now)}).delivered,false);
  pub.handle({kind:'stop',status:status(r,'stopped',null,sample(),now+1)});
  assert.equal(t.messages.length,0);pub.setConnected(true);
  assert.equal(t.messages.at(-1)[1].state,'stopped');
  pub.setConnected(false);pub.handle({kind:'clear',status:status(null,'cleared',null,null,now+2)});pub.setConnected(true);
  assert.deepEqual(t.messages.at(-2)[1].path,[]); assert.equal(t.messages.at(-1)[1].state,'cleared');
});
test('GPS 状态限频 1 Hz，停止立即发送，卸载会结束定位会话并释放话题', () => {
  const t=transport(),pub=new NavigationPublisher(t),r=route();pub.setConnected(true);
  pub.handle({kind:'start',route:r,status:status(r,'tracking',null,sample(),now)});
  const count=t.messages.length;
  pub.handle({kind:'update',status:status(r,'tracking',null,sample(),now+100)});assert.equal(t.messages.length,count);
  pub.handle({kind:'update',status:status(r,'tracking',null,sample(),now+1000)});assert.equal(t.messages.length,count+1);
  pub.handle({kind:'stop',status:status(r,'stopped',null,sample(),now+1001)});assert.equal(t.messages.at(-1)[1].state,'stopped');
  pub.handle({kind:'start',route:r,status:status(r,'tracking',null,sample(),now+1002)});pub.dispose();
  assert.equal(t.messages.at(-1)[1].state,'stopped');assert.deepEqual(t.unads,[ROUTE,STATUS]);
});
test('发送错误保留数据并报告失败，重连可重发', () => {
  const t=transport(),real=t.publishTopic; t.publishTopic=()=>{throw Error('disconnected');};
  const pub=new NavigationPublisher(t),r=route();pub.setConnected(true);
  assert.equal(pub.handle({kind:'route',route:r,status:status(r,'preview',null,sample(),now)}).delivered,false);
  t.publishTopic=real; assert.equal(pub.setConnected(true).delivered,true);assert.equal(t.messages.at(-2)[1].route_id,r.id);
});

const { CoordinateConverter } = load('coordinate-converter');
const { navigationFixMessage } = load('navigation-status');
test('坐标转换慢于 GPS 更新时不取消在途结果，只转换最新待处理点', () => {
  const requests=[], fixes=[];
  const q=new CoordinateConverter((point,done)=>requests.push({point,done}),fix=>fixes.push(fix),()=>assert.fail('转换失败'));
  q.submit(sample(a));q.submit(sample(b,now+500));q.submit(sample(c,now+1000));
  assert.equal(requests.length,1);
  requests[0].done([a[0]+.006,a[1]+.002]);
  assert.equal(fixes.length,1);assert.equal(fixes[0].timestamp,now);
  assert.equal(requests.length,2);assert.deepEqual(requests[1].point,c);
  requests[1].done([c[0]+.006,c[1]+.002]);
  assert.equal(fixes[1].timestamp,now+1000);q.dispose();
});
test('位置相同的最新 GPS 保留新时间戳/精度/速度，无须再次转换', () => {
  const requests=[],fixes=[];
  const q=new CoordinateConverter((point,done)=>requests.push(done),fix=>fixes.push(fix),()=>assert.fail());
  q.submit(sample(a));q.submit(sample(a,now+500,4,6));requests[0]([121.476,31.232]);
  assert.equal(fixes[0].timestamp,now+500);assert.equal(fixes[0].speedMps,4);
  q.submit(sample(a,now+1000,5,7));assert.equal(requests.length,1);
  assert.equal(fixes[1].timestamp,now+1000);assert.equal(fixes[1].accuracyM,7);q.dispose();
});
test('转换超时后继续处理最新点，迟到回调和卸载后回调不会覆盖定位', async () => {
  const requests=[],fixes=[],errors=[];
  const q=new CoordinateConverter((point,done)=>requests.push(done),fix=>fixes.push(fix),()=>errors.push(true),15);
  q.submit(sample(a));q.submit(sample(b,now+500));
  await new Promise(resolve=>setTimeout(resolve,20));
  assert.equal(errors.length,1);assert.equal(requests.length,2);
  requests[0]([121,31]);assert.equal(fixes.length,0);
  requests[1]([121.477,31.232]);assert.equal(fixes.length,1);
  q.submit(sample(c,now+1000));q.dispose();requests[2]([121.477,31.233]);assert.equal(fixes.length,1);
});
test('提示区分 GPS 超时、精度不足和等待转换，不把低精度说成没更新', () => {
  assert.match(navigationFixMessage('stale',sample(a,now-12000),now),/12 秒未更新/);
  assert.match(navigationFixMessage('poor_accuracy',sample(a,now,2,85),now),/精度不足（±85 米）/);
  assert.match(navigationFixMessage('unavailable',null,now),/坐标转换/);
});


const { bearingDegrees } = load('route-geometry');
test('航点方位角以北为零，覆盖四方位、跨零点及重合位置', () => {
  for (const [to,expected] of [[[0,1],0],[[1,0],90],[[0,-1],180],[[-1,0],270]]) {
    assert.ok(Math.abs(bearingDegrees([0,0],to)-expected)<1e-6);
  }
  const northwest=bearingDegrees([0,0],[-.001,1]);assert.ok(northwest>359 && northwest<360);
  assert.equal(bearingDegrees(a,a),null);
  assert.equal(bearingDegrees([NaN,0],a),null);
});
test('下一航点角度随当前位置变化、偏航时继续提供，失效定位和路线末端不虚构角度', () => {
  const r=route(),p=start(r,sample(),now);
  const initial=status(r,'tracking',p,sample(),now);
  assert.ok(Math.abs(initial.nextWaypointBearingDegrees-90)<.01);
  const off=sample([121.47,31.2304],now+3000);
  const q=update(r,p,off,now+3000),offStatus=status(r,'tracking',q,off,now+3000);
  assert.equal(offStatus.nextWaypoint,initial.nextWaypoint);
  assert.ok(offStatus.nextWaypointBearingDegrees>90 && offStatus.nextWaypointBearingDegrees<180);
  assert.equal(status(r,'tracking',q,off,now+20000).nextWaypointBearingDegrees,null);
  assert.equal(status(r,'tracking',{...p,alongM:r.geometryLengthM},sample(c),now).nextWaypointBearingDegrees,null);
  assert.doesNotMatch(navigationFixMessage('off_route',off,now),/停止/);
});

const { PositionEstimator, estimatedProgress } = load('position-estimator');
test('推算按速度前进，航向改变后只影响后续位移，保留真实 GPS 时间戳', () => {
  const estimator = new PositionEstimator(), fix = sample(a, now, 5);
  estimator.update(fix, 90, now, now);
  const east = estimator.update(fix, 90, now, now + 1000);
  assert.ok(Math.abs(distance(a, east.position) - 5) < .01);
  assert.ok(Math.abs(bearingDegrees(a, east.position) - 90) < .01);
  const north = estimator.update(fix, 0, now + 1000, now + 2000);
  assert.ok(Math.abs(distance(east.position, north.position) - 5) < .01);
  assert.ok(Math.abs(bearingDegrees(east.position, north.position)) < .01);
  assert.equal(north.timestamp, now);
  const corrected = estimator.update(sample(b, now + 2000, 0), 90, now + 2000, now + 2200);
  assert.deepEqual(corrected.position, b);
});
test('缺失速度/航向、低速、失效定位和后台间隔均不推算', () => {
  for (const [fix, heading, headingTime, elapsed] of [
    [sample(a, now, null), 90, now, 1000], [sample(a, now, -1), 90, now, 1000],
    [sample(a, now, .2), 90, now, 1000], [sample(), null, now, 1000],
    [sample(), 90, now - 11000, 1000], [sample(a, now, 5, 80), 90, now, 1000],
    [sample(), 90, now, 11000], [sample(), 90, now, 2000],
  ]) {
    const estimator = new PositionEstimator();
    estimator.update(fix, heading, headingTime, now);
    assert.deepEqual(estimator.update(fix, heading, headingTime, now + elapsed).position, a);
  }
});
test('推算进度推动下一航点但不重复增加 GPS 里程，真实 GPS 过期仍报过期', () => {
  const r = route(), fix = sample(a, now, 10), p = start(r, fix, now);
  const estimator = new PositionEstimator();
  estimator.update(fix, 90, now, now);
  estimator.update(fix, 90, now, now + 1000);
  const estimate = estimator.update(fix, 90, now, now + 2000);
  const projected = estimatedProgress(r, p, fix, estimate, now + 2000);
  assert.ok(projected.alongM > 19);
  assert.equal(projected.travelledM, 0);
  assert.equal(p.alongM, 0);
  assert.equal(status(r, 'tracking', projected, estimate, now + 2000).nextWaypoint, 2);
  assert.equal(status(r, 'tracking', projected, estimate, now + 11000).fixState, 'stale');
  assert.equal(estimatedProgress(r, p, fix, estimate, now + 11000), p);
});
