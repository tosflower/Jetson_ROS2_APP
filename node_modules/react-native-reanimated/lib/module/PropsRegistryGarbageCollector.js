'use strict';

import { unprocessColor, unprocessColorsInProps } from "./common/style/processors/colors.js";
import { ReanimatedModule } from './ReanimatedModule';
const FLUSH_INTERVAL_MS = 500;
export const PropsRegistryGarbageCollector = {
  viewsMap: new Map(),
  intervalId: null,
  registerView(viewTag, component) {
    if (this.viewsMap.has(viewTag)) {
      // In case of nested AnimatedComponents (like <GestureDetector> with <Animated.View> inside),
      // `registerView` method is called first for the inner component (e.g. <Animated.View>)
      // and then second time for the outer component (e.g. <GestureDetector>).
      // Both of these components have the same viewTag so the inner component will be overwritten
      // with the outer one. That's why we need to skip the logic during any subsequent calls.
      return;
    }
    this.viewsMap.set(viewTag, component);
    if (this.viewsMap.size === 1) {
      this.registerInterval();
    }
  },
  unregisterView(viewTag) {
    const deleted = this.viewsMap.delete(viewTag);
    if (deleted && this.viewsMap.size === 0) {
      this.unregisterInterval();
    }
  },
  syncPropsBackToReact() {
    const settledUpdates = ReanimatedModule.getSettledUpdates();
    for (const {
      viewTag,
      styleProps
    } of settledUpdates) {
      if (styleProps === null) {
        continue;
      }
      const component = this.viewsMap.get(viewTag);
      unprocessProps(styleProps);
      component?._syncStylePropsBackToReact(styleProps);
    }
  },
  registerInterval() {
    this.intervalId = setInterval(this.syncPropsBackToReact.bind(this), FLUSH_INTERVAL_MS);
  },
  unregisterInterval() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
};
export function unprocessProps(props) {
  unprocessColorsInProps(props);
  unprocessBoxShadow(props);
  unprocessBackgroundImage(props);
}
function unprocessBoxShadow(props) {
  if (Array.isArray(props.boxShadow)) {
    // @ts-ignore props is readonly
    props.boxShadow = props.boxShadow.map(boxShadow => ({
      ...boxShadow,
      color: unprocessColor(boxShadow.color)
    }));
  }
}
function unprocessBackgroundImage(props) {
  if (!Array.isArray(props.backgroundImage)) {
    return;
  }
  // @ts-ignore props is readonly
  props.backgroundImage = props.backgroundImage.map(backgroundImage => {
    const colorStops = backgroundImage.colorStops.map(unprocessColorStop);
    if (backgroundImage.type === 'linear-gradient') {
      return {
        ...backgroundImage,
        direction: unprocessDirection(backgroundImage.direction),
        colorStops
      };
    }
    return {
      ...backgroundImage,
      colorStops
    };
  });
}
function unprocessDirection({
  type,
  value
}) {
  return type === 'angle' ? `${value}deg` : value;
}
function unprocessColorStop({
  color,
  position
}) {
  return {
    color: color === null ? null : unprocessColor(color),
    positions: position === null ? undefined : [position]
  };
}
//# sourceMappingURL=PropsRegistryGarbageCollector.js.map