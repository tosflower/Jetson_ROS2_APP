import { useCallback, useMemo, useRef, useState } from 'react';
import { GestureResponderEvent, LayoutChangeEvent, PanResponder, Pressable, Text, View } from 'react-native';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import BufferedImage from '@/BufferedImage';
import {
  clampImageTransform,
  ImageGesture,
  ImagePoint,
  ImageSize,
  ImageTouch,
  ImageTransform,
  INITIAL_IMAGE_TRANSFORM,
  MAX_IMAGE_SCALE,
  MIN_IMAGE_SCALE,
  moveImageGesture,
  startImageGesture,
  zoomImageAt,
} from '@/ui/image-geometry';

/** 实时图像保持双缓冲；缩放变换独立于图像帧，连续接收新帧时不重置手势。 */
export default function ZoomableImage({ uri, tag, onFrameLoaded }: {
  uri: string;
  tag?: number;
  onFrameLoaded?: (tag: number) => void;
}): React.JSX.Element {
  const viewport = useRef<ImageSize>({ width: 0, height: 0 });
  const imageSize = useRef<ImageSize>({ width: 0, height: 0 });
  const transform = useRef<ImageTransform>(INITIAL_IMAGE_TRANSFORM);
  const gesture = useRef<ImageGesture | null>(null);
  const touchStart = useRef<{ point: ImagePoint; time: number; moved: boolean } | null>(null);
  const lastTap = useRef<{ point: ImagePoint; time: number } | null>(null);
  const [displayScale, setDisplayScale] = useState(1);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const commit = useCallback((next: ImageTransform, animate = false): void => {
    transform.current = next;
    scale.set(animate ? withTiming(next.scale, { duration: 160 }) : next.scale);
    translateX.set(animate ? withTiming(next.x, { duration: 160 }) : next.x);
    translateY.set(animate ? withTiming(next.y, { duration: 160 }) : next.y);
    setDisplayScale(next.scale);
  }, [scale, translateX, translateY]);

  const zoomTo = useCallback((nextScale: number, focal: ImagePoint = { x: 0, y: 0 }): void => {
    gesture.current = null;
    commit(zoomImageAt(transform.current, nextScale, focal, viewport.current, imageSize.current), true);
  }, [commit]);

  const touchesFor = useCallback((event: GestureResponderEvent): ImageTouch[] => {
    return event.nativeEvent.touches.map((touch) => ({
      id: touch.identifier,
      // 图像层禁止命中测试，location 坐标始终相对于未变换的视口。
      x: touch.locationX - viewport.current.width / 2,
      y: touch.locationY - viewport.current.height / 2,
    }));
  }, []);

  const updateGesture = useCallback((event: GestureResponderEvent): void => {
    const touches = touchesFor(event);
    const first = touches[0];
    if (touchStart.current && (touches.length > 1 || (first
      && Math.hypot(first.x - touchStart.current.point.x, first.y - touchStart.current.point.y) > 8))) {
      touchStart.current.moved = true;
      lastTap.current = null;
    }
    const next = gesture.current
      ? moveImageGesture(gesture.current, touches, viewport.current, imageSize.current)
      : startImageGesture(transform.current, touches);
    gesture.current = next;
    if (next) commit(next.current);
  }, [commit, touchesFor]);

  const onGestureStart = useCallback((event: GestureResponderEvent): void => {
    // 在按钮缩放动画中开始触摸时，从屏幕当前值接手，避免跳到动画终点。
    const current = { scale: scale.get(), x: translateX.get(), y: translateY.get() };
    cancelAnimation(scale);
    cancelAnimation(translateX);
    cancelAnimation(translateY);
    commit(clampImageTransform(current, viewport.current, imageSize.current));
    const touches = touchesFor(event);
    gesture.current = startImageGesture(transform.current, touches);
    touchStart.current = touches[0]
      ? { point: touches[0], time: Date.now(), moved: touches.length > 1 }
      : null;
  }, [commit, scale, touchesFor, translateX, translateY]);

  const onGestureRelease = useCallback((): void => {
    const start = touchStart.current;
    gesture.current = null;
    touchStart.current = null;
    if (!start || start.moved || Date.now() - start.time > 250) return;
    const previous = lastTap.current;
    if (previous && Date.now() - previous.time < 300
      && Math.hypot(previous.point.x - start.point.x, previous.point.y - start.point.y) < 28) {
      lastTap.current = null;
      zoomTo(transform.current.scale > 1.05 ? 1 : 2, start.point);
    } else {
      lastTap.current = { point: start.point, time: Date.now() };
    }
  }, [zoomTo]);

  const responder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: onGestureStart,
    onPanResponderStart: updateGesture,
    onPanResponderMove: updateGesture,
    onPanResponderEnd: updateGesture,
    onPanResponderRelease: onGestureRelease,
    onPanResponderTerminationRequest: () => false,
    onPanResponderTerminate: () => {
      gesture.current = null;
      touchStart.current = null;
      lastTap.current = null;
    },
  }), [onGestureRelease, onGestureStart, updateGesture]);

  const onLayout = useCallback((event: LayoutChangeEvent): void => {
    const { width, height } = event.nativeEvent.layout;
    if (width === viewport.current.width && height === viewport.current.height) return;
    viewport.current = { width, height };
    gesture.current = null;
    touchStart.current = null;
    lastTap.current = null;
    // 横竖屏或分屏改变视口后重新适应画面，避免旧偏移把图像留在屏幕外。
    commit(INITIAL_IMAGE_TRANSFORM);
  }, [commit]);

  const onImageSize = useCallback((width: number, height: number): void => {
    if (width <= 0 || height <= 0 || (width === imageSize.current.width && height === imageSize.current.height)) return;
    imageSize.current = { width, height };
    gesture.current = null;
    commit(clampImageTransform(transform.current, viewport.current, imageSize.current));
  }, [commit]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.get() }, { translateY: translateY.get() }, { scale: scale.get() }],
  }));
  const canShrink = displayScale > MIN_IMAGE_SCALE + 0.01;
  const canEnlarge = displayScale < MAX_IMAGE_SCALE - 0.01;

  return (
    <View style={{ flex: 1, minHeight: 0, backgroundColor: '#050709' }}>
      <View
        {...responder.panHandlers}
        onLayout={onLayout}
        accessibilityRole="image"
        accessibilityLabel="实时图像。支持双指缩放、放大后拖动和双击放大或还原。"
        style={{ flex: 1, minHeight: 0, overflow: 'hidden', backgroundColor: '#000000' }}>
        <Animated.View pointerEvents="none" style={[{ position: 'absolute', inset: 0 }, animatedStyle]}>
          <BufferedImage uri={uri} tag={tag} onFrameLoaded={onFrameLoaded} onImageSize={onImageSize} />
        </Animated.View>
      </View>
      <View style={{ gap: 8, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10, backgroundColor: '#11161E' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="缩小图像"
            accessibilityState={{ disabled: !canShrink }}
            disabled={!canShrink}
            onPress={() => zoomTo(transform.current.scale - 0.5)}
            style={({ pressed }) => ({
              flex: 1, minHeight: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 14,
              backgroundColor: pressed ? '#34445A' : '#202B3A', opacity: canShrink ? 1 : 0.45,
            })}>
            <Text style={{ color: '#F4F7FB', fontSize: 16, fontWeight: '700' }}>− 缩小</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`当前缩放 ${Math.round(displayScale * 100)}%，点按还原图像`}
            onPress={() => zoomTo(1)}
            style={({ pressed }) => ({
              minWidth: 100, minHeight: 52, alignItems: 'center', justifyContent: 'center', gap: 2,
              borderRadius: 14, backgroundColor: pressed ? '#202B3A' : 'transparent',
            })}>
            <Text style={{ color: '#FFFFFF', fontSize: 19, fontWeight: '700', fontVariant: ['tabular-nums'] }}>
              {Math.round(displayScale * 100)}%
            </Text>
            <Text style={{ color: '#AEBED1', fontSize: 12 }}>{canShrink ? '点按还原' : '适应屏幕'}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="放大图像"
            accessibilityState={{ disabled: !canEnlarge }}
            disabled={!canEnlarge}
            onPress={() => zoomTo(transform.current.scale + 0.5)}
            style={({ pressed }) => ({
              flex: 1, minHeight: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 14,
              backgroundColor: pressed ? '#34445A' : '#202B3A', opacity: canEnlarge ? 1 : 0.45,
            })}>
            <Text style={{ color: '#F4F7FB', fontSize: 16, fontWeight: '700' }}>＋ 放大</Text>
          </Pressable>
        </View>
        <Text style={{ color: '#AEBED1', fontSize: 12, textAlign: 'center' }}>双指缩放 · 放大后拖动 · 双击放大或还原</Text>
      </View>
    </View>
  );
}
