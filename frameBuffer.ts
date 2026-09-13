export type BufferedFrame = { id: number; uri: string; tag?: number };

export type FrameBuffer = {
  front: BufferedFrame | null;
  loading: BufferedFrame | null;
  pending: string | null;
  pendingTag?: number;
  sequence: number;
};

export type FrameAction =
  | { type: 'receive'; uri: string; tag?: number }
  | { type: 'loaded' | 'failed'; id: number };

export const initialFrameBuffer: FrameBuffer = {
  front: null, loading: null, pending: null, sequence: 0,
};

/** 旧帧持续显示；同一时间只加载一帧，其余输入只保留最新帧。 */
export function reduceFrameBuffer(state: FrameBuffer, action: FrameAction): FrameBuffer {
  if (action.type === 'receive') {
    if (state.loading) {
      return { ...state, pending: action.uri, pendingTag: action.tag };
    }
    if (state.front?.uri === action.uri && state.front?.tag === action.tag) return state;
    const sequence = state.sequence + 1;
    return { ...state, sequence, loading: { id: sequence, uri: action.uri, tag: action.tag } };
  }

  // 已移除图片的迟到回调不能切换当前画面。
  if (state.loading?.id !== action.id) return state;
  const front = action.type === 'loaded' ? state.loading : state.front;
  const uri = state.pending;
  const sequence = state.sequence + 1;
  return {
    front,
    loading: uri && (uri !== front?.uri || state.pendingTag !== front?.tag)
      ? { id: sequence, uri, tag: state.pendingTag } : null,
    pending: null,
    pendingTag: undefined,
    sequence,
  };
}
