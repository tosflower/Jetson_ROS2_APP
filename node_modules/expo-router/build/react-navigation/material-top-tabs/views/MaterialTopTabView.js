"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MaterialTopTabView", {
    enumerable: true,
    get: function() {
        return MaterialTopTabView;
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
function _reactnativesafeareacontext() {
    const data = require("react-native-safe-area-context");
    _reactnativesafeareacontext = function() {
        return data;
    };
    return data;
}
const _native = require("../../native");
const _TabAnimationContext = require("../utils/TabAnimationContext");
const _MaterialTopTabBar = require("./MaterialTopTabBar");
// Use dynamic import to avoid having direct dependency on react-native-tab-view.
// import { TabView } from 'react-native-tab-view';
let TabView;
try {
    const tabViewModule = require('react-native-tab-view');
    TabView = tabViewModule.TabView;
} catch (e) {
    throw new Error("Install the 'react-native-tab-view' package and its peer dependencies to use the Expo Router's TopTabs.");
}
const renderTabBarDefault = (props)=>/*#__PURE__*/ (0, _jsxruntime().jsx)(_MaterialTopTabBar.MaterialTopTabBar, {
        ...props
    });
function MaterialTopTabView({ tabBar = renderTabBarDefault, state, descriptors, emitter, navigateToTab, navigateToTabSync, safeAreaInsets, ...rest }) {
    const { colors } = (0, _native.useTheme)();
    const { direction } = (0, _native.useLocale)();
    const insets = (0, _react().useContext)(_reactnativesafeareacontext().SafeAreaInsetsContext);
    const renderTabBar = ({ /* eslint-disable @typescript-eslint/no-unused-vars */ navigationState, options, /* eslint-enable @typescript-eslint/no-unused-vars */ ...rest })=>{
        const tabBarProps = {
            ...rest,
            state,
            descriptors,
            emitter,
            navigateToTab,
            insets: {
                top: safeAreaInsets?.top ?? insets?.top ?? 0,
                right: safeAreaInsets?.right ?? insets?.right ?? 0,
                bottom: safeAreaInsets?.bottom ?? insets?.bottom ?? 0,
                left: safeAreaInsets?.left ?? insets?.left ?? 0
            }
        };
        return tabBar(tabBarProps);
    };
    const focusedOptions = descriptors[state.routes[state.index].key].options;
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(TabView, {
        ...rest,
        onIndexChange: (index)=>navigateToTabSync(state.routes[index].key),
        renderScene: ({ route, position })=>/*#__PURE__*/ (0, _jsxruntime().jsx)(_TabAnimationContext.TabAnimationContext.Provider, {
                value: {
                    position
                },
                children: descriptors[route.key].render()
            }),
        navigationState: state,
        renderTabBar: renderTabBar,
        renderLazyPlaceholder: ({ route })=>descriptors[route.key].options.lazyPlaceholder?.() ?? null,
        lazy: ({ route })=>descriptors[route.key].route.key === undefined,
        lazyPreloadDistance: focusedOptions.lazyPreloadDistance,
        swipeEnabled: focusedOptions.swipeEnabled,
        animationEnabled: focusedOptions.animationEnabled,
        onSwipeStart: ()=>emitter.emit({
                type: 'swipeStart'
            }),
        onSwipeEnd: ()=>emitter.emit({
                type: 'swipeEnd'
            }),
        direction: direction,
        options: Object.fromEntries(state.routes.map((route)=>{
            const options = descriptors[route.key]?.options;
            return [
                route.key,
                {
                    sceneStyle: [
                        {
                            backgroundColor: colors.background
                        },
                        options?.sceneStyle
                    ]
                }
            ];
        }))
    });
}

//# sourceMappingURL=MaterialTopTabView.js.map
