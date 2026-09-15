export type ImageSize = { width: number; height: number };
export type ImagePoint = { x: number; y: number };
export type ImageTransform = ImagePoint & { scale: number };
export type ImageTouch = ImagePoint & { id: number | string };

export const MIN_IMAGE_SCALE = 1;
export const MAX_IMAGE_SCALE = 4;
export const INITIAL_IMAGE_TRANSFORM: ImageTransform = { scale: 1, x: 0, y: 0 };

const limit = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

/** 与 contentFit="contain" 使用相同尺寸；拖动范围依据实际画面，不能把黑边算成图像。 */
export function fittedImageSize(viewport: ImageSize, image: ImageSize): ImageSize {
  if (![viewport.width, viewport.height, image.width, image.height].every((value) => Number.isFinite(value) && value > 0)) {
    return { width: 0, height: 0 };
  }
  const ratio = Math.min(viewport.width / image.width, viewport.height / image.height);
  return { width: image.width * ratio, height: image.height * ratio };
}

export function clampImageTransform(transform: ImageTransform, viewport: ImageSize, image: ImageSize): ImageTransform {
  const scale = limit(Number.isFinite(transform.scale) ? transform.scale : 1, MIN_IMAGE_SCALE, MAX_IMAGE_SCALE);
  const fitted = fittedImageSize(viewport, image);
  const maxX = Math.max(0, (fitted.width * scale - viewport.width) / 2);
  const maxY = Math.max(0, (fitted.height * scale - viewport.height) / 2);
  return {
    scale,
    x: maxX > 0 ? limit(Number.isFinite(transform.x) ? transform.x : 0, -maxX, maxX) : 0,
    y: maxY > 0 ? limit(Number.isFinite(transform.y) ? transform.y : 0, -maxY, maxY) : 0,
  };
}

/** focal 使用相对视口中心的坐标；缩放时尽量保留手指下方的图像位置。 */
export function zoomImageAt(transform: ImageTransform, scale: number, focal: ImagePoint,
  viewport: ImageSize, image: ImageSize): ImageTransform {
  const nextScale = limit(scale, MIN_IMAGE_SCALE, MAX_IMAGE_SCALE);
  const ratio = nextScale / transform.scale;
  return clampImageTransform({
    scale: nextScale,
    x: focal.x - (focal.x - transform.x) * ratio,
    y: focal.y - (focal.y - transform.y) * ratio,
  }, viewport, image);
}

export type ImageGesture = {
  ids: (number | string)[];
  origin: ImagePoint;
  distance: number;
  start: ImageTransform;
  current: ImageTransform;
};

function touchGeometry(touches: ImageTouch[]): { ids: (number | string)[]; origin: ImagePoint; distance: number } | null {
  // 固定手指顺序，避免原生 touches 数组换序时重新锚定手势。
  const [first, second] = [...touches].sort((left, right) => String(left.id).localeCompare(String(right.id))).slice(0, 2);
  if (!first) return null;
  if (!second) return { ids: [first.id], origin: first, distance: 0 };
  return {
    ids: [first.id, second.id],
    origin: { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 },
    distance: Math.hypot(second.x - first.x, second.y - first.y),
  };
}

export function startImageGesture(transform: ImageTransform, touches: ImageTouch[]): ImageGesture | null {
  const geometry = touchGeometry(touches);
  return geometry ? { ...geometry, start: transform, current: transform } : null;
}

export function moveImageGesture(gesture: ImageGesture, touches: ImageTouch[],
  viewport: ImageSize, image: ImageSize): ImageGesture | null {
  const geometry = touchGeometry(touches);
  if (!geometry) return null;
  if (geometry.ids.join(',') !== gesture.ids.join(',') || (geometry.ids.length === 2 && gesture.distance < 1)) {
    // 单指、双指之间切换时从当前画面重新锚定，防止抬起一根手指造成位置跳变。
    return startImageGesture(gesture.current, touches);
  }
  const scale = limit(gesture.start.scale * (geometry.ids.length === 2 ? geometry.distance / gesture.distance : 1),
    MIN_IMAGE_SCALE, MAX_IMAGE_SCALE);
  const ratio = scale / gesture.start.scale;
  const current = clampImageTransform({
    scale,
    x: geometry.origin.x - (gesture.origin.x - gesture.start.x) * ratio,
    y: geometry.origin.y - (gesture.origin.y - gesture.start.y) * ratio,
  }, viewport, image);
  return { ...gesture, current };
}
