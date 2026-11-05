'use strict';

import { isSharedValue } from "../isSharedValue.js";
import { startMapper, stopMapper } from '../mappers';
import { updateProps } from "../updateProps/index.js";
import { makeViewDescriptorsSet } from "../ViewDescriptorsSet.js";
import { flattenArray } from "./utils.js";
function isInlineStyleTransform(transform) {
  if (!Array.isArray(transform)) {
    return false;
  }
  return transform.some(t => hasInlineStyles(t));
}
function inlinePropsHasChanged(props1, props2) {
  if (Object.keys(props1).length !== Object.keys(props2).length) {
    return true;
  }
  for (const key of Object.keys(props1)) {
    if (props1[key] !== props2[key]) {
      return true;
    }
  }
  return false;
}
function getInlinePropsUpdate(styleValue) {
  'worklet';

  if (isSharedValue(styleValue)) {
    return styleValue.value;
  }
  if (Array.isArray(styleValue)) {
    return styleValue.map(getInlinePropsUpdate);
  }
  if (styleValue && typeof styleValue === 'object') {
    const update = {};
    for (const [key, value] of Object.entries(styleValue)) {
      update[key] = getInlinePropsUpdate(value);
    }
    return update;
  }
  return styleValue;
}
function extractSharedValuesMapFromProps(props) {
  const inlineStyleProps = {};
  const inlineTopLevelProps = {};
  for (const key in props) {
    const value = props[key];
    if (key === 'style') {
      const styles = flattenArray(props.style ?? []);
      styles.forEach(style => {
        if (!style) {
          return;
        }
        if (__DEV__ && '_requiresAnimatedComponent' in style) {
          return;
        }
        for (const [styleKey, styleValue] of Object.entries(style)) {
          if (isSharedValue(styleValue)) {
            inlineStyleProps[styleKey] = styleValue;
          } else if (styleKey === 'transform' && isInlineStyleTransform(styleValue)) {
            inlineStyleProps[styleKey] = styleValue;
          }
        }
      });
    } else if (isSharedValue(value)) {
      inlineTopLevelProps[key] = value;
    }
  }
  return {
    inlineStyleProps,
    inlineTopLevelProps
  };
}
export function hasInlineStyles(style) {
  if (!style) {
    return false;
  }
  return Object.keys(style).some(key => {
    const styleValue = style[key];
    return isSharedValue(styleValue) || key === 'transform' && isInlineStyleTransform(styleValue);
  });
}
export function getInlineStyle(style, isFirstRender) {
  if (isFirstRender) {
    return getInlinePropsUpdate(style);
  }
  const newStyle = {};
  for (const [key, styleValue] of Object.entries(style)) {
    if (!isSharedValue(styleValue) && !(key === 'transform' && isInlineStyleTransform(styleValue))) {
      newStyle[key] = styleValue;
    }
  }
  return newStyle;
}
export class InlinePropManager {
  _inlinePropsViewDescriptors = null;
  _inlinePropsMapperId = null;
  _inlineStyleProps = {};
  _inlineTopLevelProps = {};
  attachInlineProps(animatedComponent, viewInfo) {
    const {
      inlineStyleProps,
      inlineTopLevelProps
    } = extractSharedValuesMapFromProps(animatedComponent.props);
    const hasChanged = inlinePropsHasChanged(inlineStyleProps, this._inlineStyleProps) || inlinePropsHasChanged(inlineTopLevelProps, this._inlineTopLevelProps);
    if (hasChanged) {
      if (!this._inlinePropsViewDescriptors) {
        this._inlinePropsViewDescriptors = makeViewDescriptorsSet();
        const {
          viewTag,
          shadowNodeWrapper
        } = viewInfo;
        this._inlinePropsViewDescriptors.add({
          tag: viewTag,
          shadowNodeWrapper: shadowNodeWrapper
        });
      }
      const shareableViewDescriptors = this._inlinePropsViewDescriptors.shareableViewDescriptors;
      const hasInlineStyleProps = Object.keys(inlineStyleProps).length > 0;
      const hasInlineTopLevelProps = Object.keys(inlineTopLevelProps).length > 0;
      const hasInlineProps = hasInlineStyleProps || hasInlineTopLevelProps;
      const updaterFunction = () => {
        'worklet';

        if (hasInlineStyleProps) {
          updateProps(shareableViewDescriptors, getInlinePropsUpdate(inlineStyleProps));
        }
        if (hasInlineTopLevelProps) {
          // Shared values passed directly as top-level props are animated
          // props, not styles — process them like `useAnimatedProps` updates
          // (in particular, don't run them through the style props builder,
          // which drops non-style keys).
          updateProps(shareableViewDescriptors, getInlinePropsUpdate(inlineTopLevelProps), true);
        }
      };
      this._inlineStyleProps = inlineStyleProps;
      this._inlineTopLevelProps = inlineTopLevelProps;
      if (this._inlinePropsMapperId) {
        stopMapper(this._inlinePropsMapperId);
      }
      this._inlinePropsMapperId = null;
      if (hasInlineProps) {
        this._inlinePropsMapperId = startMapper(updaterFunction, [inlineStyleProps, inlineTopLevelProps]);
      }
    }
  }
  detachInlineProps() {
    if (this._inlinePropsMapperId) {
      stopMapper(this._inlinePropsMapperId);
      this._inlinePropsMapperId = null;
    }
    this._inlinePropsViewDescriptors = null;
    this._inlineStyleProps = {};
    this._inlineTopLevelProps = {};
  }
}
//# sourceMappingURL=InlinePropManager.js.map