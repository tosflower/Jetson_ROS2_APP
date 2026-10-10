"use strict";

import * as React from 'react';
import { View } from 'react-native';

// FIXME: Inline this type instead of getting it from react-native-gesture-handler
// Otherwise, we get a type error:
// Exported variable 'GestureDetector' has or is using name 'GestureDetectorProps' from external module ".." but cannot be named.
import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
export const GestureDetector = ({
  gesture: _0,
  userSelect: _1,
  children
}) => {
  return /*#__PURE__*/_jsx(_Fragment, {
    children: children
  });
};
export const GestureHandlerRootView = View;
export const Gesture = undefined;
export let GestureState = /*#__PURE__*/function (GestureState) {
  GestureState[GestureState["UNDETERMINED"] = 0] = "UNDETERMINED";
  GestureState[GestureState["FAILED"] = 1] = "FAILED";
  GestureState[GestureState["BEGAN"] = 2] = "BEGAN";
  GestureState[GestureState["CANCELLED"] = 3] = "CANCELLED";
  GestureState[GestureState["ACTIVE"] = 4] = "ACTIVE";
  GestureState[GestureState["END"] = 5] = "END";
  return GestureState;
}({});
//# sourceMappingURL=GestureHandler.js.map