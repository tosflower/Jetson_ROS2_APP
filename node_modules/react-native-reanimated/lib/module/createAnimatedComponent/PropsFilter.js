'use strict';

import { initialUpdaterRun } from "../animation/index.js";
import { isCSSConfigProp } from "../css/utils/index.js";
import { isSharedValue } from "../isSharedValue.js";
import { WorkletEventHandler } from "../WorkletEventHandler.js";
import { getInlineStyle, hasInlineStyles } from "./InlinePropManager.js";
import { flattenArray, has } from "./utils.js";
function dummyListener() {
  // empty listener we use to assign to listener properties for which animated
  // event is used.
}
export class PropsFilter {
  _initialPropsMap = new Map();
  filterNonAnimatedProps(component) {
    const inputProps = component.props;
    const props = {};
    for (const key in inputProps) {
      const value = inputProps[key];
      if (key === 'style') {
        const styleProp = inputProps.style;
        const styles = flattenArray(styleProp ?? []);
        const processedStyle = styles.map(style => {
          if (style?.viewDescriptors) {
            const handle = style;
            if (component._isFirstRender) {
              this._initialPropsMap.set(handle, {
                ...handle.initial.value,
                ...initialUpdaterRun(handle.initial.updater)
              });
            }
            return this._initialPropsMap.get(handle) ?? {};
          } else if (hasInlineStyles(style)) {
            return getInlineStyle(style, component._isFirstRender);
          } else {
            return style;
          }
        });
        // keep styles as they were passed by the user
        // it will help other libs to interpret styles correctly
        props[key] = processedStyle;
      } else if (key === 'animatedProps') {
        // Handled in a second pass after this loop so that animatedProps
        // values always take precedence over inline props with the same key,
        // regardless of JSX attribute order.
        continue;
      } else if (has('workletEventHandler', value) && value.workletEventHandler instanceof WorkletEventHandler) {
        if (value.workletEventHandler.eventNames.length > 0) {
          value.workletEventHandler.eventNames.forEach(eventName => {
            props[eventName] = has('listeners', value.workletEventHandler) ? value.workletEventHandler.listeners[eventName] : dummyListener;
          });
        } else {
          props[key] = dummyListener;
        }
      } else if (isSharedValue(value)) {
        if (component._isFirstRender) {
          props[key] = value.value;
        }
      } else {
        props[key] = value;
      }
    }

    // Second pass: apply animatedProps last so it always wins over inline
    // props that share a key. This makes the precedence deterministic and
    // independent of the order in which attributes were written in JSX.
    const animatedPropsProp = inputProps.animatedProps;
    if (animatedPropsProp) {
      const animatedPropsArray = flattenArray(animatedPropsProp);
      animatedPropsArray.forEach(animatedProps => {
        if (!animatedProps) {
          return;
        }
        if (animatedProps.viewDescriptors && animatedProps.initial) {
          const initialValue = animatedProps.initial.value;
          for (const initialValueKey in initialValue) {
            props[initialValueKey] = initialValue[initialValueKey];
          }
        } else {
          for (const animatedPropKey in animatedProps) {
            if (!isCSSConfigProp(animatedPropKey)) {
              props[animatedPropKey] = animatedProps[animatedPropKey];
            }
          }
        }
      });
    }
    return props;
  }
}
//# sourceMappingURL=PropsFilter.js.map