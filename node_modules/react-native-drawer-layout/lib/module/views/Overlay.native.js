"use strict";

import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedProps, useAnimatedStyle } from 'react-native-reanimated';
import { jsx as _jsx } from "react/jsx-runtime";
const PROGRESS_EPSILON = 0.05;
export function Overlay({
  progress,
  onPress,
  style,
  accessibilityLabel = 'Close drawer',
  ...rest
}) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value
    };
  }, [progress]);
  const animatedProps = useAnimatedProps(() => {
    const active = progress.value > PROGRESS_EPSILON;
    return {
      pointerEvents: active ? 'auto' : 'none',
      'aria-hidden': !active
    };
  }, [progress]);
  return /*#__PURE__*/_jsx(Animated.View, {
    ...rest,
    style: [StyleSheet.absoluteFill, styles.overlay, animatedStyle, style],
    animatedProps: animatedProps,
    children: /*#__PURE__*/_jsx(Pressable, {
      onPress: onPress,
      style: styles.pressable,
      role: "button",
      "aria-label": accessibilityLabel,
      accessible: true
    })
  });
}
const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  pressable: {
    flex: 1,
    pointerEvents: 'auto'
  }
});
//# sourceMappingURL=Overlay.native.js.map