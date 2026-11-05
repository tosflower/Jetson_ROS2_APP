'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "usePreventZoomTransitionDismissal", {
    enumerable: true,
    get: function() {
        return usePreventZoomTransitionDismissal;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _descriptorscontext = require("../../fork/native-stack/descriptors-context");
const _navigationParams = require("../../navigationParams");
const _native = require("../../react-navigation/native");
const _useIsFocused = require("../../useIsFocused");
const _useNavigation = require("../../useNavigation");
const _stackPresentation = require("../../utils/stackPresentation");
const _useSafeLayoutEffect = require("../../views/useSafeLayoutEffect");
const _PreviewRouteContext = require("../preview/PreviewRouteContext");
const _zoomtransitioncontext = require("./zoom-transition-context");
function usePreventZoomTransitionDismissal(options) {
    const context = (0, _react().use)(_zoomtransitioncontext.ZoomTransitionTargetContext);
    const route = (0, _native.useRoute)();
    const navigation = (0, _useNavigation.useNavigation)();
    const isPreview = (0, _PreviewRouteContext.useIsPreview)();
    const isFocused = (0, _useIsFocused.useIsFocused)();
    const isPreloaded = !isPreview && route.isPreloaded === true;
    const descriptorsMap = (0, _react().use)(_descriptorscontext.DescriptorsContext);
    const currentDescriptor = descriptorsMap[route.key];
    const gestureEnabled = currentDescriptor?.options?.gestureEnabled;
    const isModal = (0, _stackPresentation.isModalPresentation)(currentDescriptor?.options);
    (0, _useSafeLayoutEffect.useSafeLayoutEffect)(()=>{
        if (isPreview) return;
        if (isModal) {
            console.warn('[expo-router] usePreventZoomTransitionDismissal has no effect on screens presented modally. Please remove this hook from the screen component or change the screen presentation to a non-modal style.');
            return;
        }
        if (!context.hasEnabler) {
            return;
        }
        const rect = options?.unstable_dismissalBoundsRect;
        // Validate rect if provided
        if (rect) {
            const { minX, maxX, minY, maxY } = rect;
            // Validate that max > min when both are defined
            if (minX !== undefined && maxX !== undefined && minX >= maxX) {
                console.warn('[expo-router] unstable_dismissalBoundsRect: minX must be less than maxX');
                return;
            }
            if (minY !== undefined && maxY !== undefined && minY >= maxY) {
                console.warn('[expo-router] unstable_dismissalBoundsRect: minY must be less than maxY');
                return;
            }
        }
        // Determine the final rect to use for dismissal bounds:
        // 1. If user provided a rect, use it
        // 2. If user disabled gestures entirely (gestureEnabled={false}), block the whole screen
        //    by setting impossible bounds { maxX: 0, maxY: 0 }
        // 3. Otherwise, allow normal dismissal (null rect)
        const computedRect = rect ?? (gestureEnabled === false ? {
            maxX: 0,
            maxY: 0
        } : null);
        context.setDismissalBoundsRect?.(computedRect);
        if (!isPreloaded || isPreloaded && isFocused) {
            // Disable React Navigation's gesture handler when we have custom bounds to prevent conflicts.
            // The native zoom transition's interactiveDismissShouldBegin callback handles dismissal instead.
            // We use the internal option to preserve the user's gestureEnabled setting.
            navigation.setOptions({
                [_navigationParams.INTERNAL_EXPO_ROUTER_GESTURE_ENABLED_OPTION_NAME]: computedRect ? false : undefined
            });
        }
        // Cleanup on unmount
        return ()=>{
            context.setDismissalBoundsRect?.(null);
        };
    }, [
        options?.unstable_dismissalBoundsRect?.minX,
        options?.unstable_dismissalBoundsRect?.maxX,
        options?.unstable_dismissalBoundsRect?.minY,
        options?.unstable_dismissalBoundsRect?.maxY,
        context.setDismissalBoundsRect,
        gestureEnabled,
        navigation,
        isFocused,
        isPreloaded,
        isModal,
        isPreview
    ]);
}

//# sourceMappingURL=usePreventZoomTransitionDismissal.ios.js.map
