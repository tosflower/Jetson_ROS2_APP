'use strict';

import { Fragment } from 'react';
import { maybeBuild } from "../animationBuilder.js";
import { logger } from "../common/index.js";
import { LayoutAnimationType } from "../commonTypes.js";
import { SkipEnteringContext } from "../component/LayoutAnimationConfig.js";
import ReanimatedAnimatedComponent from '../css/component/AnimatedComponent';
import { getStaticFeatureFlag } from "../featureFlags/index.js";
import { SharedTransition } from "../layoutReanimation/SharedTransition.js";
import { configureWebLayoutAnimations, getReducedMotionFromConfig, saveSnapshot, startWebLayoutAnimation, tryActivateLayoutTransition } from "../layoutReanimation/web/index.js";
import { addHTMLMutationObserver } from "../layoutReanimation/web/domUtils.js";
import { updateLayoutAnimations } from '../UpdateLayoutAnimations';
import { InlinePropManager } from "./InlinePropManager.js";
import jsPropsUpdater from './JSPropsUpdater';
import { PropsFilter } from "./PropsFilter.js";
import { filterStyles, flattenArray } from "./utils.js";
import { jsx as _jsx } from "react/jsx-runtime";
let id = 0;

// is-tree-shakable-suppress
configureWebLayoutAnimations();
export default class AnimatedComponent extends ReanimatedAnimatedComponent {
  _animatedStyles = [];
  _prevAnimatedStyles = [];
  _animatedProps = [];
  _prevAnimatedProps = [];
  _isFirstRender = true;
  jestAnimatedStyle = {
    value: {}
  };
  jestAnimatedProps = {
    value: {}
  };
  _InlinePropManager = new InlinePropManager();
  _PropsFilter = new PropsFilter();
  static contextType = SkipEnteringContext;
  reanimatedID = id++;
  constructor(ChildComponent, props, displayName, options) {
    super(ChildComponent, props);
    this._options = options;
    this._displayName = displayName;
    this._configureSharedTransition(true);
    const entering = this.props.entering;
    const skipEntering = this.context?.current;
    if (!skipEntering) {
      this._configureLayoutAnimation(LayoutAnimationType.ENTERING, entering);
    }
  }
  componentDidMount() {
    super.componentDidMount();
    this._NativeEventsManager?.attachEvents();
    this._updateAnimatedStylesAndProps();
    this._InlinePropManager.attachInlineProps(this, this._getViewInfo());
    if (this._options?.jsProps?.length) {
      jsPropsUpdater.registerComponent(this, this._options.jsProps);
    }
    this._configureLayoutAnimation(LayoutAnimationType.LAYOUT, this.props.layout);
    this._configureLayoutAnimation(LayoutAnimationType.EXITING, this.props.exiting);
    if (this._componentDOMRef) {
      const element = this._componentDOMRef;
      const dummyClone = element.dummyClone;
      // If the element was cloned (because of the exiting animation), we need to bring it back to the DOM
      while (dummyClone?.firstChild) {
        element.appendChild(dummyClone.firstChild);
      }
      delete element.dummyClone;
      if (this.props.exiting) {
        saveSnapshot(element);
      }
      if (!this.props.entering) {
        this._isFirstRender = false;
        return;
      }
      if (getReducedMotionFromConfig(this.props.entering)) {
        this._isFirstRender = false;
        this.props.entering.callbackV?.(true);
        return;
      }
      const skipEntering = this.context?.current;
      if (!skipEntering) {
        startWebLayoutAnimation(this.props, element, LayoutAnimationType.ENTERING);
      } else if (element.style) {
        element.style.visibility = 'initial';
      }
    }
    this._isFirstRender = false;
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    this._NativeEventsManager?.detachEvents();
    this._detachStyles();
    this._InlinePropManager.detachInlineProps();
    if (this._options?.jsProps?.length) {
      jsPropsUpdater.unregisterComponent(this);
    }
    const exiting = this.props.exiting;
    if (this._componentDOMRef && exiting) {
      if (getReducedMotionFromConfig(exiting)) {
        exiting.callbackV?.(true);
        return;
      }
      addHTMLMutationObserver();
      startWebLayoutAnimation(this.props, this._componentDOMRef, LayoutAnimationType.EXITING);
    }
  }
  _syncStylePropsBackToReact(_props) {
    // noop
  }
  _detachStyles() {
    const viewTag = this.getComponentViewTag();
    if (viewTag !== -1) {
      for (const style of this._animatedStyles) {
        style.viewDescriptors.remove(viewTag);
      }
      for (const animatedProp of this._animatedProps) {
        animatedProp?.viewDescriptors?.remove(viewTag);
      }
    }
  }
  setNativeProps(props) {
    if (this._options?.setNativeProps) {
      this._options.setNativeProps(this._componentRef, props);
    } else {
      this._componentRef?.setNativeProps?.(props);
    }
  }
  _handleAnimatedStylesUpdate(prevStyles, currentStyles, _jestAnimatedStyleOrProps) {
    const {
      viewTag,
      shadowNodeWrapper
    } = this._getViewInfo();
    const newStyles = new Set(currentStyles);
    const isStyleAttached = style => style.viewDescriptors.has(viewTag);

    // remove old styles
    if (prevStyles) {
      // in most of the cases, views have only a single animated style and it remains unchanged
      const hasOneSameStyle = currentStyles.length === 1 && prevStyles.length === 1 && currentStyles[0] === prevStyles[0];
      if (hasOneSameStyle && isStyleAttached(prevStyles[0])) {
        return;
      }

      // otherwise, remove each style that is not present in new styles
      for (const prevStyle of prevStyles) {
        const isPresent = currentStyles.some(style => {
          if (style === prevStyle && isStyleAttached(style)) {
            newStyles.delete(style);
            return true;
          }
          return false;
        });
        if (!isPresent) {
          prevStyle.viewDescriptors.remove(viewTag);
        }
      }
    }
    newStyles.forEach(style => {
      style.viewDescriptors.add({
        tag: viewTag,
        shadowNodeWrapper
      }, style.styleUpdaterContainer);
    });
  }
  _updateAnimatedStylesAndProps() {
    this._handleAnimatedStylesUpdate(this._prevAnimatedStyles, this._animatedStyles, this.jestAnimatedStyle);
    this._handleAnimatedStylesUpdate(this._prevAnimatedProps, this._animatedProps, this.jestAnimatedProps);
  }
  componentDidUpdate(prevProps, _prevState, snapshot) {
    this._configureLayoutAnimation(LayoutAnimationType.LAYOUT, this.props.layout, prevProps.layout);
    this._configureLayoutAnimation(LayoutAnimationType.EXITING, this.props.exiting, prevProps.exiting);
    this._configureSharedTransition();
    this._NativeEventsManager?.updateEvents(prevProps);
    this._updateAnimatedStylesAndProps();
    this._InlinePropManager.attachInlineProps(this, this._getViewInfo());
    if (this.props.exiting && this._componentDOMRef) {
      saveSnapshot(this._componentDOMRef);
    }
    if (snapshot && this.props.layout) {
      if (getReducedMotionFromConfig(this.props.layout)) {
        this.props.layout.callbackV?.(true);
        return;
      }
      tryActivateLayoutTransition(this.props, this._componentDOMRef, snapshot);
    }
  }
  _updateStyles(props) {
    const filteredStyles = filterStyles(flattenArray(props.style ?? []));
    this._prevAnimatedStyles = this._animatedStyles;
    this._animatedStyles = filteredStyles.animatedStyles;
    const filteredAnimatedProps = filterStyles(flattenArray(props.animatedProps ?? []));
    this._prevAnimatedProps = this._animatedProps;
    this._animatedProps = filteredAnimatedProps.animatedStyles;
    if (filteredAnimatedProps.cssStyle) {
      if (__DEV__ && filteredStyles.cssStyle) {
        logger.warn('AnimatedComponent: CSS properties cannot be used in style and animatedProps at the same time. Using properties from the style object.');
        this._cssStyle = filteredStyles.cssStyle;
        return;
      }

      // Add all remaining props to cssStyle object
      // (e.g. SVG components are styled via top level props, not via style object)
      const mergedProps = {
        ...props,
        ...filteredAnimatedProps.cssStyle
      };
      delete mergedProps.style;
      delete mergedProps.animatedProps;
      this._cssStyle = mergedProps;
    } else {
      this._cssStyle = filteredStyles.cssStyle ?? {};
    }
  }
  _configureLayoutAnimation(_type, _currentConfig, _previousConfig) {
    // noop
  }
  _configureSharedTransition(useNativeId) {
    if (!getStaticFeatureFlag('ENABLE_SHARED_ELEMENT_TRANSITIONS')) {
      return;
    }
    if (!this.props.sharedTransitionTag) {
      if (this._sharedTransitionTag) {
        updateLayoutAnimations(useNativeId ? this.reanimatedID : this.getComponentViewTag(), useNativeId ? LayoutAnimationType.SHARED_ELEMENT_TRANSITION_NATIVE_ID : LayoutAnimationType.SHARED_ELEMENT_TRANSITION, undefined, undefined, undefined);
        this._sharedTransitionTag = undefined;
      }
      return;
    }
    this._sharedTransitionTag = this.props.sharedTransitionTag;
    const sharedTransition = this.props.sharedTransitionStyle ?? this._sharedTransition ?? new SharedTransition();
    if (this._sharedTransition !== sharedTransition) {
      updateLayoutAnimations(useNativeId ? this.reanimatedID : this.getComponentViewTag(), useNativeId ? LayoutAnimationType.SHARED_ELEMENT_TRANSITION_NATIVE_ID : LayoutAnimationType.SHARED_ELEMENT_TRANSITION, maybeBuild(sharedTransition), undefined, this.props.sharedTransitionTag);
      this._sharedTransition = sharedTransition;
    }
  }

  // This is a component lifecycle method from React, therefore we are not calling it directly.
  // It is called before the component gets rerendered. This way we can access components' position before it changed
  // and later on, in componentDidUpdate, calculate translation for layout transition.
  getSnapshotBeforeUpdate() {
    if (this.props.layout && this._componentDOMRef?.getBoundingClientRect) {
      return this._componentDOMRef.getBoundingClientRect();
    }

    // `getSnapshotBeforeUpdate` has to return value which is not `undefined`.
    return null;
  }
  render() {
    const filteredProps = this._PropsFilter.filterNonAnimatedProps(this);

    // Layout animations on web are set inside `componentDidMount` method, which is called after first render.
    // Because of that we can encounter a situation in which component is visible for a short amount of time, and later on animation triggers.
    // I've tested that on various browsers and devices and it did not happen to me. To be sure that it won't happen to someone else,
    // I've decided to hide component at first render. Its visibility is reset in `componentDidMount`.
    if (this._isFirstRender && filteredProps.entering && !getReducedMotionFromConfig(filteredProps.entering)) {
      filteredProps.style = Array.isArray(filteredProps.style) ? filteredProps.style.concat([{
        visibility: 'hidden'
      }]) : {
        ...(filteredProps.style ?? {}),
        visibility: 'hidden' // Hide component until `componentDidMount` triggers
      };
    }

    // TODO: Remove need for this \/\/\/\/.
    // RNSVG expects Gradient elem to have stops passed as children. When we want to animate them,
    // we provide them using `gradient` prop.
    // Hack below gets rid of RNSVG warnings about not having children.
    if (this.ChildComponent.displayName === 'RadialGradient' || this.ChildComponent.displayName === 'LinearGradient') {
      if (filteredProps.children === undefined) {
        filteredProps.children = /*#__PURE__*/_jsx(Fragment, {});
      }
    }
    const {
      forwardedRef: _forwardedRef,
      ...childProps
    } = filteredProps;
    return super.render(childProps);
  }
}
//# sourceMappingURL=AnimatedComponent.js.map