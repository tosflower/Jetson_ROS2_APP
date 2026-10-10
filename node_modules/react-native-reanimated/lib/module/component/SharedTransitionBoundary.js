'use strict';

import { StyleSheet } from 'react-native';
import REASharedTransitionBoundary from '../specs/SharedTransitionBoundaryProvider';
import { jsx as _jsx } from "react/jsx-runtime";
export function SharedTransitionBoundary({
  isActive,
  children
}) {
  return /*#__PURE__*/_jsx(REASharedTransitionBoundary, {
    style: styles.contents,
    isActive: isActive,
    children: children
  });
}

// is-tree-shakable-suppress
const styles = StyleSheet.create({
  contents: {
    overflow: 'visible',
    display: 'contents'
  }
});
//# sourceMappingURL=SharedTransitionBoundary.js.map