import { useEffect, useReducer, useRef } from 'react';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { initialFrameBuffer, reduceFrameBuffer } from './frameBuffer';

/** 两层图片交替显示，避免替换 source 时把尚未解码的图片直接交给可见层。 */
export default function BufferedImage({ uri, tag, onFrameLoaded, active = true, onImageSize }: {
  uri: string;
  tag?: number;
  onFrameLoaded?: (tag: number) => void;
  active?: boolean;
  onImageSize?: (width: number, height: number) => void;
}): React.JSX.Element {
  const [buffer, dispatch] = useReducer(reduceFrameBuffer, initialFrameBuffer);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    // 全屏页覆盖预览时暂停预览解码，避免同一帧发出两份加载回执。
    if (active) dispatch({ type: 'receive', uri, tag });
  }, [active, uri, tag]);

  return (
    <View style={styles.container}>
      {[buffer.front, active ? buffer.loading : null].map((frame) => frame && (
        <Image
          // 加载完成后沿用相同 key 和 URI，保留已解码的原生图片实例。
          key={frame.id}
          source={{ uri: frame.uri }}
          contentFit="contain"
          transition={0}
          style={[StyleSheet.absoluteFill, { opacity: frame === buffer.front ? 1 : 0 }]}
          onLoad={(event) => {
            if (!activeRef.current) return;
            // 只记录正在加载的帧；onLoad 表示原生加载完成，不等于屏幕呈现。
            if (buffer.loading?.id === frame.id) {
              onImageSize?.(event.source.width, event.source.height);
              if (frame.tag !== undefined) onFrameLoaded?.(frame.tag);
            }
            dispatch({ type: 'loaded', id: frame.id });
          }}
          onError={() => {
            if (activeRef.current) dispatch({ type: 'failed', id: frame.id });
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: '100%', width: '100%' },
});
