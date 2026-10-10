const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const ts = require('typescript');

// 直接运行生产几何函数，验证用户操作结果，不依赖原生手势环境。
const compiled = ts.transpileModule(readFileSync(`${__dirname}/image-geometry.ts`, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const exported = {};
new Function('exports', compiled)(exported);
const { fittedImageSize, clampImageTransform: clamp, zoomImageAt: zoom,
  startImageGesture: start, moveImageGesture: move } = exported;
const square = { width: 400, height: 400 };

test('宽幅画面保留比例，未填满视口的方向不能拖离中心', () => {
  const viewport = { width: 300, height: 300 };
  const image = { width: 1200, height: 600 };
  assert.deepEqual(fittedImageSize(viewport, image), { width: 300, height: 150 });
  assert.deepEqual(clamp({ scale: 2, x: 900, y: 900 }, viewport, image), { scale: 2, x: 150, y: 0 });
  assert.deepEqual(clamp({ scale: 4, x: -900, y: -900 }, viewport, image), { scale: 4, x: -450, y: -150 });
});

test('旋转后的边界以新视口重新计算，还原时画面居中', () => {
  const image = { width: 1200, height: 600 };
  const transform = clamp({ scale: 2, x: 900, y: 900 }, { width: 600, height: 300 }, image);
  assert.deepEqual(transform, { scale: 2, x: 300, y: 150 });
  assert.deepEqual(clamp(transform, { width: 300, height: 600 }, image), { scale: 2, x: 150, y: 0 });
  assert.deepEqual(zoom(transform, 1, { x: 40, y: 20 }, { width: 300, height: 600 }, image), { scale: 1, x: 0, y: 0 });
});

test('局部放大保留手指下的图像点，最大倍率封顶后不继续漂移', () => {
  const transform = zoom({ scale: 1, x: 0, y: 0 }, 2, { x: 100, y: -50 }, square, square);
  assert.deepEqual(transform, { scale: 2, x: -100, y: 50 });
  const maximum = zoom(transform, 4, { x: 100, y: -50 }, square, square);
  assert.deepEqual(zoom(maximum, 8, { x: 100, y: -50 }, square, square), maximum);
  assert.deepEqual(clamp({ scale: 0.1, x: 100, y: -50 }, square, square), { scale: 1, x: 0, y: 0 });
});

test('拖动中加入第二指和抬起第一指都不跳变，剩余手指可以接着拖动', () => {
  let gesture = start({ scale: 2, x: 0, y: 0 }, [{ id: 1, x: 0, y: 0 }]);
  gesture = move(gesture, [{ id: 1, x: 40, y: 20 }], square, square);
  assert.deepEqual(gesture.current, { scale: 2, x: 40, y: 20 });
  gesture = move(gesture, [{ id: 1, x: 40, y: 20 }, { id: 2, x: 140, y: 20 }], square, square);
  assert.deepEqual(gesture.current, { scale: 2, x: 40, y: 20 });
  gesture = move(gesture, [{ id: 2, x: 190, y: 20 }, { id: 1, x: -10, y: 20 }], square, square);
  assert.deepEqual(gesture.current, { scale: 4, x: -10, y: 20 });
  gesture = move(gesture, [{ id: 2, x: 190, y: 20 }], square, square);
  assert.deepEqual(gesture.current, { scale: 4, x: -10, y: 20 });
  gesture = move(gesture, [{ id: 2, x: 200, y: 50 }], square, square);
  assert.deepEqual(gesture.current, { scale: 4, x: 0, y: 50 });
  assert.equal(move(gesture, [], square, square), null);
});

test('尚未获得图像或视口尺寸时不产生非法变换', () => {
  assert.deepEqual(fittedImageSize(square, { width: 0, height: 0 }), { width: 0, height: 0 });
  assert.deepEqual(clamp({ scale: NaN, x: Infinity, y: NaN }, { width: 0, height: 0 }, square), { scale: 1, x: 0, y: 0 });
});
