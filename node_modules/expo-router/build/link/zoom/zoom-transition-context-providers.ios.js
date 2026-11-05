'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ZoomTransitionSourceContextProvider: null,
    ZoomTransitionTargetContextProvider: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ZoomTransitionSourceContextProvider () {
        return ZoomTransitionSourceContextProvider;
    },
    get ZoomTransitionTargetContextProvider () {
        return ZoomTransitionTargetContextProvider;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _navigationParams = require("../../navigationParams");
const _url = require("../../utils/url");
const _PreviewRouteContext = require("../preview/PreviewRouteContext");
const _ZoomTransitionEnabler = require("./ZoomTransitionEnabler");
const _zoomtransitioncontext = require("./zoom-transition-context");
function ZoomTransitionSourceContextProvider({ children, linkProps }) {
    const { href, asChild } = linkProps;
    const isExternalHref = typeof href === 'string' ? (0, _url.shouldLinkExternally)(href) : (0, _url.shouldLinkExternally)(href.pathname);
    const numberOfSources = (0, _react().useRef)(0);
    const [hasZoomSource, setHasZoomSource] = (0, _react().useState)(false);
    const zoomTransitionId = (0, _react().useId)();
    const addSource = (0, _react().useCallback)(()=>{
        if (!(0, _ZoomTransitionEnabler.isZoomTransitionEnabled)()) {
            throw new Error('[expo-router] Zoom transitions are not enabled.');
        }
        if (numberOfSources.current >= 1) {
            throw new Error('[expo-router] Only one Link.ZoomTransitionSource can be used within a single Link component.');
        }
        if (!asChild) {
            throw new Error('[expo-router] Link must be used with `asChild` prop to enable zoom transitions.');
        }
        if (isExternalHref) {
            throw new Error('[expo-router] Zoom transitions can only be used with internal links.');
        }
        numberOfSources.current += 1;
        setHasZoomSource(true);
    }, [
        asChild,
        isExternalHref
    ]);
    const removeSource = (0, _react().useCallback)(()=>{
        numberOfSources.current -= 1;
        if (numberOfSources.current <= 0) {
            setHasZoomSource(false);
        }
    }, []);
    const value = (0, _react().useMemo)(()=>({
            identifier: zoomTransitionId,
            hasZoomSource,
            addSource,
            removeSource
        }), [
        zoomTransitionId,
        hasZoomSource,
        addSource,
        removeSource
    ]);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_zoomtransitioncontext.ZoomTransitionSourceContext, {
        value: value,
        children: children
    });
}
function ZoomTransitionTargetContextProvider({ route, children }) {
    const [dismissalBoundsRect, setDismissalBoundsRect] = (0, _react().useState)(null);
    // TODO(@ubax): Move this logic to within NativeStackView
    // https://linear.app/expo/issue/ENG-19580/remove-hasenabler-logic-from-zoomtransitiontargetcontext
    // This is a temporary solution to detect if zoom transition was enabled for the screen
    // In theory we could do all the checks here and only mount the enabler when all conditions are met
    // However this would require using use(DescriptorsContext) here,
    // which would cause unnecessary re-renders of the entire screen whenever descriptors change
    const [numberOfEnablers, setNumberOfEnablers] = (0, _react().useState)(0);
    const addEnabler = (0, _react().useCallback)(()=>setNumberOfEnablers((prev)=>prev + 1), []);
    const removeEnabler = (0, _react().useCallback)(()=>setNumberOfEnablers((prev)=>prev - 1), []);
    const hasEnabler = numberOfEnablers > 0;
    const isPreview = (0, _PreviewRouteContext.useIsPreview)();
    if ((0, _ZoomTransitionEnabler.isZoomTransitionEnabled)() && !isPreview && route && typeof route === 'object' && 'params' in route && typeof route.params === 'object' && 'key' in route && typeof route.key === 'string') {
        const params = route.params ?? {};
        const internalParams = (0, _navigationParams.getInternalExpoRouterParams)(params);
        const zoomTransitionId = internalParams[_navigationParams.INTERNAL_EXPO_ROUTER_ZOOM_TRANSITION_SOURCE_ID_PARAM_NAME];
        const zoomTransitionScreenId = internalParams[_navigationParams.INTERNAL_EXPO_ROUTER_ZOOM_TRANSITION_SCREEN_ID_PARAM_NAME];
        const hasZoomTransition = !!zoomTransitionId && zoomTransitionScreenId === route.key;
        if (hasZoomTransition && typeof zoomTransitionId === 'string') {
            return /*#__PURE__*/ (0, _jsxruntime().jsx)(_zoomtransitioncontext.ZoomTransitionTargetContext, {
                value: {
                    identifier: zoomTransitionId,
                    dismissalBoundsRect,
                    setDismissalBoundsRect,
                    addEnabler,
                    removeEnabler,
                    hasEnabler
                },
                children: children
            });
        }
    }
    return children;
}

//# sourceMappingURL=zoom-transition-context-providers.ios.js.map
