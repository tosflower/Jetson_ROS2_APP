"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ZoomTransitionEnabler: null,
    disableZoomTransition: null,
    isZoomTransitionEnabled: null,
    useShouldEnableZoomTransition: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ZoomTransitionEnabler () {
        return ZoomTransitionEnabler;
    },
    get disableZoomTransition () {
        return disableZoomTransition;
    },
    get isZoomTransitionEnabled () {
        return isZoomTransitionEnabled;
    },
    get useShouldEnableZoomTransition () {
        return useShouldEnableZoomTransition;
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
const _descriptorscontext = require("../../fork/native-stack/descriptors-context");
const _navigationParams = require("../../navigationParams");
const _stackPresentation = require("../../utils/stackPresentation");
const _PreviewRouteContext = require("../preview/PreviewRouteContext");
const _native = require("../preview/native");
const _zoomtransitioncontext = require("./zoom-transition-context");
let _isZoomTransitionEnabled = process.env.EXPO_OS === 'ios';
function disableZoomTransition() {
    _isZoomTransitionEnabled = false;
}
function isZoomTransitionEnabled() {
    return _isZoomTransitionEnabled;
}
function ZoomTransitionEnabler({ route }) {
    const shouldEnableZoomTransition = useShouldEnableZoomTransition(route);
    const targetContext = (0, _react().use)(_zoomtransitioncontext.ZoomTransitionTargetContext);
    (0, _react().useLayoutEffect)(()=>{
        if (shouldEnableZoomTransition && targetContext?.addEnabler && targetContext?.removeEnabler) {
            targetContext.addEnabler();
            return ()=>{
                targetContext.removeEnabler();
            };
        }
        return ()=>{};
    }, [
        shouldEnableZoomTransition
    ]);
    if (shouldEnableZoomTransition) {
        const params = route.params;
        const zoomTransitionId = params[_navigationParams.INTERNAL_EXPO_ROUTER_ZOOM_TRANSITION_SOURCE_ID_PARAM_NAME];
        // Read dismissalBoundsRect from context (set by usePreventZoomTransitionDismissal hook)
        const dismissalBoundsRect = targetContext.dismissalBoundsRect;
        // Read gestureEnabled from the screen descriptor so that gestureEnabled: false
        // automatically blocks the native zoom transition dismissal gesture,
        // even when the user hasn't called usePreventZoomTransitionDismissal().
        const descriptorsMap = (0, _react().use)(_descriptorscontext.DescriptorsContext);
        const gestureEnabled = descriptorsMap[route.key]?.options?.gestureEnabled;
        const effectiveDismissalBoundsRect = dismissalBoundsRect ?? (gestureEnabled === false ? {
            maxX: 0,
            maxY: 0
        } : null);
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.LinkZoomTransitionEnabler, {
            zoomTransitionSourceIdentifier: zoomTransitionId,
            dismissalBoundsRect: effectiveDismissalBoundsRect
        });
    }
    return null;
}
function useShouldEnableZoomTransition(route) {
    const isPreview = (0, _PreviewRouteContext.useIsPreview)();
    if (isZoomTransitionEnabled() && !isPreview && route && typeof route === 'object' && 'params' in route && typeof route.params === 'object' && route.params && 'key' in route && typeof route.key === 'string') {
        const params = route.params;
        const internalParams = (0, _navigationParams.getInternalExpoRouterParams)(params);
        const zoomTransitionId = internalParams[_navigationParams.INTERNAL_EXPO_ROUTER_ZOOM_TRANSITION_SOURCE_ID_PARAM_NAME];
        const zoomTransitionScreenId = internalParams[_navigationParams.INTERNAL_EXPO_ROUTER_ZOOM_TRANSITION_SCREEN_ID_PARAM_NAME];
        const hasZoomTransition = !!zoomTransitionId && zoomTransitionScreenId === route.key;
        if (hasZoomTransition && typeof zoomTransitionId === 'string') {
            // Read gestureEnabled from the screen descriptor so that gestureEnabled: false
            // automatically blocks the native zoom transition dismissal gesture,
            // even when the user hasn't called usePreventZoomTransitionDismissal().
            const descriptorsMap = (0, _react().use)(_descriptorscontext.DescriptorsContext);
            const isLinkPreviewNavigation = !!internalParams[_navigationParams.INTERNAL_EXPO_ROUTER_IS_PREVIEW_NAVIGATION_PARAM_NAME];
            const isPresentedAsModal = (0, _stackPresentation.isModalPresentation)(descriptorsMap[route.key]?.options);
            if (isLinkPreviewNavigation && !isPresentedAsModal) {
                console.warn('[expo-router] Zoom transition with link preview is only supported for screens presented modally. Please set the screen presentation to "fullScreenModal" or another modal presentation style.');
            } else {
                return true;
            }
        }
    }
    return false;
}

//# sourceMappingURL=ZoomTransitionEnabler.ios.js.map
