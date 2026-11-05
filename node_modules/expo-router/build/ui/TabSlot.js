"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    TabSlot: null,
    defaultTabsSlotRender: null,
    isTabSlot: null,
    useTabSlot: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get TabSlot () {
        return TabSlot;
    },
    get defaultTabsSlotRender () {
        return defaultTabsSlotRender;
    },
    get isTabSlot () {
        return isTabSlot;
    },
    get useTabSlot () {
        return useTabSlot;
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
function _reactnativescreens() {
    const data = require("react-native-screens");
    _reactnativescreens = function() {
        return data;
    };
    return data;
}
const _Navigator = require("../views/Navigator");
const _TabContext = require("./TabContext");
function useTabSlot({ detachInactiveScreens = [
    'android',
    'ios',
    'web'
].includes(_reactnative().Platform.OS), style, renderFn = defaultTabsSlotRender } = {}) {
    const { state, descriptors } = (0, _Navigator.useNavigatorContext)();
    const focusedRouteKey = state.routes[state.index]?.key;
    const [loaded, setLoaded] = (0, _react().useState)(focusedRouteKey ? {
        [focusedRouteKey]: true
    } : {});
    if (focusedRouteKey && !loaded[focusedRouteKey]) {
        setLoaded({
            ...loaded,
            [focusedRouteKey]: true
        });
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativescreens().ScreenContainer, {
        enabled: detachInactiveScreens,
        hasTwoStates: true,
        style: [
            styles.screenContainer,
            style
        ],
        children: state.routes.map((route, index)=>{
            const descriptor = descriptors[route.key];
            return /*#__PURE__*/ (0, _jsxruntime().jsx)(_TabContext.TabContext.Provider, {
                value: descriptor.options,
                children: renderFn(descriptor, {
                    index,
                    isFocused: state.index === index,
                    loaded: loaded[route.key],
                    detachInactiveScreens
                })
            }, descriptor.route.key);
        })
    });
}
function TabSlot(props) {
    return useTabSlot(props);
}
function defaultTabsSlotRender(descriptor, { isFocused, loaded, detachInactiveScreens }) {
    const { lazy = true, unmountOnBlur } = descriptor.options;
    if (unmountOnBlur && !isFocused) {
        return null;
    }
    if (lazy && !loaded && !isFocused) {
        // Don't render a lazy screen if we've never navigated to it
        return null;
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativescreens().Screen, {
        enabled: detachInactiveScreens,
        activityState: isFocused ? 2 : 0,
        freezeOnBlur: false,
        style: [
            styles.screen,
            isFocused ? styles.focused : styles.unfocused
        ],
        children: descriptor.render()
    }, descriptor.route.key);
}
function isTabSlot(child) {
    return child.type === TabSlot;
}
const styles = _reactnative().StyleSheet.create({
    screen: {
        flex: 1,
        position: 'relative',
        height: '100%'
    },
    screenContainer: {
        flexShrink: 0,
        flexGrow: 1
    },
    focused: {
        zIndex: 1,
        display: 'flex',
        flexShrink: 0,
        flexGrow: 1
    },
    unfocused: {
        zIndex: -1,
        display: 'none',
        flexShrink: 1,
        flexGrow: 0
    }
});

//# sourceMappingURL=TabSlot.js.map
