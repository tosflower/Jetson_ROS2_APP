'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HeaderContainer", {
    enumerable: true,
    get: function() {
        return HeaderContainer;
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
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
const _elements = require("../../../elements");
const _native = require("../../../native");
const _HeaderStyleInterpolators = require("../../TransitionConfigs/HeaderStyleInterpolators");
const _Header = require("./Header");
function HeaderContainer({ mode, scenes, layout, getPreviousScene, getFocusedRoute, onContentHeightChange, style }) {
    const focusedRoute = getFocusedRoute();
    const parentHeaderBack = (0, _react().use)(_elements.HeaderBackContext);
    const { buildHref } = (0, _native.useLinkBuilder)();
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
        style: [
            styles.boxNone,
            style
        ],
        children: scenes.slice(-2).map((scene, i, self)=>{
            if (mode === 'screen' && i !== self.length - 1 || !scene) {
                return null;
            }
            const { header, headerMode, headerShown = true, headerTransparent, headerStyleInterpolator } = scene.descriptor.options;
            if (headerMode !== mode || !headerShown) {
                return null;
            }
            const isFocused = focusedRoute.key === scene.route.key;
            const previousScene = getPreviousScene({
                route: scene.route
            });
            let headerBack = parentHeaderBack;
            if (previousScene) {
                const { options } = previousScene.descriptor;
                const { route } = previousScene;
                headerBack = previousScene ? {
                    title: (0, _elements.getHeaderTitle)(options, route.name),
                    href: buildHref(route.name, route.params)
                } : parentHeaderBack;
            }
            // If the screen is next to a headerless screen, we need to make the header appear static
            // This makes the header look like it's moving with the screen
            const previousDescriptor = self[i - 1]?.descriptor;
            const nextDescriptor = self[i + 1]?.descriptor;
            const { headerShown: previousHeaderShown = true, headerMode: previousHeaderMode } = previousDescriptor?.options || {};
            // If any of the next screens don't have a header or header is part of the screen
            // Then we need to move this header offscreen so that it doesn't cover it
            const nextHeaderlessScene = self.slice(i + 1).find((scene)=>{
                const { headerShown: currentHeaderShown = true, headerMode: currentHeaderMode } = scene?.descriptor.options || {};
                return currentHeaderShown === false || currentHeaderMode === 'screen';
            });
            const { gestureDirection: nextHeaderlessGestureDirection } = nextHeaderlessScene?.descriptor.options || {};
            const isHeaderStatic = (previousHeaderShown === false || previousHeaderMode === 'screen') && // We still need to animate when coming back from next scene
            // A hacky way to check this is if the next scene exists
            !nextDescriptor || nextHeaderlessScene;
            const props = {
                layout,
                back: headerBack,
                progress: scene.progress,
                options: scene.descriptor.options,
                route: scene.route,
                // Expo Router adds route-scoped navigation to standard descriptors.
                navigation: scene.descriptor.navigation,
                styleInterpolator: mode === 'float' ? isHeaderStatic ? nextHeaderlessGestureDirection === 'vertical' || nextHeaderlessGestureDirection === 'vertical-inverted' ? _HeaderStyleInterpolators.forSlideUp : nextHeaderlessGestureDirection === 'horizontal-inverted' ? _HeaderStyleInterpolators.forSlideRight : _HeaderStyleInterpolators.forSlideLeft : headerStyleInterpolator : _HeaderStyleInterpolators.forNoAnimation
            };
            return /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.NavigationProvider, {
                route: scene.route,
                navigation: scene.descriptor.navigation,
                children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
                    onLayout: onContentHeightChange ? (e)=>{
                        const { height } = e.nativeEvent.layout;
                        onContentHeightChange({
                            route: scene.route,
                            height
                        });
                    } : undefined,
                    "aria-hidden": !isFocused,
                    style: [
                        {
                            pointerEvents: isFocused ? 'box-none' : 'none'
                        },
                        // Otherwise accessibility tools don't seem to be able to find it
                        mode === 'float' && !isFocused || headerTransparent ? styles.header : null
                    ],
                    children: header !== undefined ? header(props) : /*#__PURE__*/ (0, _jsxruntime().jsx)(_Header.Header, {
                        ...props
                    })
                })
            }, scene.route.key);
        })
    });
}
const styles = _reactnative().StyleSheet.create({
    boxNone: {
        pointerEvents: 'box-none'
    },
    header: {
        position: 'absolute',
        top: 0,
        start: 0,
        end: 0
    }
});

//# sourceMappingURL=HeaderContainer.js.map
