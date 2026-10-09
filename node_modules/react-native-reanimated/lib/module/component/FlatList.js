'use strict';

import { useMemo, useRef } from 'react';
import { FlatList } from 'react-native';
import { createAnimatedComponent } from "../createAnimatedComponent/index.js";
import { LayoutAnimationConfig } from "./LayoutAnimationConfig.js";
import { AnimatedView } from "./View.js";
import { jsx as _jsx } from "react/jsx-runtime";
const AnimatedFlatList = /* is-tree-shakable-suppress */
createAnimatedComponent(FlatList);

// eslint-disable-next-line @typescript-eslint/no-explicit-any

const createCellRendererComponent = (itemLayoutAnimationRef, cellRendererComponentStyleRef) => {
  const CellRendererComponent = props => {
    return /*#__PURE__*/_jsx(AnimatedView
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    , {
      layout: itemLayoutAnimationRef?.current,
      onLayout: props.onLayout,
      style: [props.style, typeof cellRendererComponentStyleRef?.current === 'function' ? cellRendererComponentStyleRef?.current({
        index: props.index,
        item: props.item
      }) : cellRendererComponentStyleRef?.current],
      children: props.children
    });
  };
  return CellRendererComponent;
};

// Since createAnimatedComponent return type is ComponentClass that has the props of the argument,
// but not things like NativeMethods, etc. we need to add them manually by extending the type.

// We need explicit any here, because this is the exact same type that is used in React Native types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FlatListRender = function (props) {
  const {
    itemLayoutAnimation,
    skipEnteringExitingAnimations,
    CellRendererComponentStyle,
    ref,
    ...restProps
  } = props;

  // Set default scrollEventThrottle, because user expects
  // to have continuous scroll events and
  // react-native defaults it to 50 for FlatLists.
  // We set it to 1, so we have peace until
  // there are 960 fps screens.
  if (!('scrollEventThrottle' in restProps)) {
    restProps.scrollEventThrottle = 1;
  }
  const itemLayoutAnimationRef = useRef(itemLayoutAnimation);
  itemLayoutAnimationRef.current = itemLayoutAnimation;
  const cellRendererComponentStyleRef = useRef(CellRendererComponentStyle);
  cellRendererComponentStyleRef.current = CellRendererComponentStyle;
  const CellRendererComponent = useMemo(() => createCellRendererComponent(itemLayoutAnimationRef, cellRendererComponentStyleRef), []);
  const animatedFlatList =
  /*#__PURE__*/
  // @ts-expect-error In its current type state, createAnimatedComponent cannot create generic components.
  _jsx(AnimatedFlatList, {
    ref: ref,
    ...restProps,
    CellRendererComponent: CellRendererComponent
  });
  if (skipEnteringExitingAnimations === undefined) {
    return animatedFlatList;
  }
  return /*#__PURE__*/_jsx(LayoutAnimationConfig, {
    skipEntering: true,
    skipExiting: true,
    children: animatedFlatList
  });
};
export const ReanimatedFlatList = FlatListRender;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
//# sourceMappingURL=FlatList.js.map