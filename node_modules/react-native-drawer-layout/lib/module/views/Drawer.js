"use strict";

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import useLatestCallback from 'use-latest-callback';
import { DrawerProgressContext } from "../utils/DrawerProgressContext.js";
import { getDrawerWidthWeb } from "../utils/getDrawerWidth.js";
import { useFakeSharedValue } from "../utils/useFakeSharedValue.js";
import { Overlay } from './Overlay';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Drawer({
  direction = 'ltr',
  drawerPosition = direction === 'rtl' ? 'right' : 'left',
  drawerStyle,
  drawerType = 'front',
  onClose,
  onTransitionStart,
  onTransitionEnd,
  open,
  overlayStyle,
  overlayAccessibilityLabel,
  renderDrawerContent,
  children,
  style
}) {
  const drawerWidth = getDrawerWidthWeb({
    drawerStyle
  });
  const progress = useFakeSharedValue(open ? 1 : 0);
  React.useEffect(() => {
    progress.value = open ? 1 : 0;
  }, [open, progress]);
  const drawerRef = React.useRef(null);
  const onTransitionStartLatest = useLatestCallback(e => {
    if (e.target === e.currentTarget && e.propertyName === 'transform') {
      onTransitionStart?.(open === false);
    }
  });
  const onTransitionEndLatest = useLatestCallback(e => {
    if (e.target === e.currentTarget && e.propertyName === 'transform') {
      onTransitionEnd?.(open === false);
    }
  });
  React.useEffect(() => {
    const element = drawerRef.current;
    element?.addEventListener('transitionstart', onTransitionStartLatest);
    element?.addEventListener('transitionend', onTransitionEndLatest);
    return () => {
      element?.removeEventListener('transitionstart', onTransitionStartLatest);
      element?.removeEventListener('transitionend', onTransitionEndLatest);
    };
  }, [onTransitionEndLatest, onTransitionStartLatest]);
  const isOpen = drawerType === 'permanent' ? true : open;
  const isRight = drawerPosition === 'right';
  const drawerTranslateX =
  // The drawer stays in place at open position when `drawerType` is `back`
  open || drawerType === 'back' ? drawerPosition === 'left' ? '100%' : '-100%' : 0;
  const drawerAnimatedStyle = drawerType !== 'permanent' ? {
    transition: 'transform 0.3s',
    transform: `translateX(${drawerTranslateX})`
  } : null;
  const contentTranslateX = open ?
  // The screen content stays in place when `drawerType` is `front`
  drawerType === 'front' ? 0 : `calc(${drawerWidth} * ${drawerPosition === 'left' ? 1 : -1})` : 0;
  const contentAnimatedStyle = drawerType !== 'permanent' ? {
    transition: 'transform 0.3s',
    transform: `translateX(${contentTranslateX})`
  } : null;
  const drawerElement = /*#__PURE__*/_jsx(View, {
    ref: drawerRef,
    style: [styles.drawer, {
      position: drawerType === 'permanent' ? 'relative' : 'absolute',
      zIndex: drawerType === 'back' ? -1 : 1
    },
    // FIXME: width contains `px` on web
    {
      width: drawerWidth
    },
    // @ts-expect-error offset contains `calc` for web
    drawerType !== 'permanent' ?
    // Position drawer off-screen by default in closed state
    // And add a translation only when drawer is open
    // So changing position in closed state won't trigger a visible transition
    drawerPosition === 'right' ? {
      right: `calc(${drawerWidth} * -1)`
    } : {
      left: `calc(${drawerWidth} * -1)`
    } : null, drawerAnimatedStyle, drawerStyle],
    children: renderDrawerContent()
  }, "drawer");
  const mainContent = /*#__PURE__*/_jsxs(View, {
    style: [styles.content, contentAnimatedStyle],
    children: [/*#__PURE__*/_jsx(View, {
      "aria-hidden": isOpen && drawerType !== 'permanent',
      style: styles.content,
      children: children
    }), drawerType !== 'permanent' ? /*#__PURE__*/_jsx(Overlay, {
      open: open,
      progress: progress,
      onPress: () => onClose(),
      style: overlayStyle,
      accessibilityLabel: overlayAccessibilityLabel
    }) : null]
  }, "content");
  return /*#__PURE__*/_jsx(DrawerProgressContext.Provider, {
    value: progress,
    children: /*#__PURE__*/_jsxs(View, {
      style: [styles.container, style],
      children: [!isRight && drawerElement, mainContent, isRight && drawerElement]
    })
  });
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  drawer: {
    top: 0,
    bottom: 0,
    maxWidth: '100%',
    backgroundColor: 'white'
  },
  content: {
    flex: 1
  }
});
//# sourceMappingURL=Drawer.js.map