export type ConnectionSurface = 'gateway' | 'image';

/** 决定某个 WebSocket 关闭后应更新哪一块 UI 状态。 */
export function closeStatusTarget(surface: ConnectionSurface): ConnectionSurface {
  return surface;
}
