'use strict';

// Component naming convention:
//
//  componentDisplayName - The React/JS-facing name (e.g. "Text").
//                         Accessed via Component.componentName in JS.
//  reactViewName        - The name React Native uses to identify the component
//                         (e.g. "RCTText"). This is what we use to identify
//                         the underlying React Native component name (it is the
//                         same as the native component name for most of third-party
//                         components (e.g. SVG) but is often different for built-in
//                         RN components (e.g. "RCTView").
//  nativeComponentName  - The Fabric/C++ component name (e.g. "Paragraph").
//                         Can be obtained on the C++ side by converting
//                         reactViewName via componentNameByReactViewName().
export function getViewInfo(element) {
  return {
    reactViewName: element?.__viewConfig?.uiViewClassName ??
    // ReactFabricHostComponent (e.g. react-native-macos) exposes `_viewConfig`.
    element?._viewConfig?.uiViewClassName ?? element?.__internalInstanceHandle?.type ?? element?.__internalInstanceHandle?.elementType,
    viewTag: element?.__nativeTag
  };
}
export function getViewTagFromInstance(instance) {
  if (!instance) {
    return null;
  }
  if (typeof instance.getComponentViewTag === 'function') {
    const viewTag = instance.getComponentViewTag();
    if (viewTag !== -1) {
      return viewTag;
    }
  }
  const viewTag = getViewInfo(instance).viewTag;
  if (viewTag !== undefined) {
    return viewTag;
  }
  const nativeScrollRef = instance.getNativeScrollRef?.();
  if (nativeScrollRef) {
    return getViewInfo(nativeScrollRef).viewTag ?? null;
  }
  const scrollableNode = instance.getScrollableNode?.();
  if (typeof scrollableNode === 'number') {
    return scrollableNode;
  }
  return scrollableNode ? getViewInfo(scrollableNode).viewTag ?? null : null;
}
//# sourceMappingURL=getViewInfo.js.map