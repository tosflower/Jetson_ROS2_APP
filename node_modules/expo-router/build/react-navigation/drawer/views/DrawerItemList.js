'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DrawerItemList", {
    enumerable: true,
    get: function() {
        return DrawerItemList;
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
    const data = /*#__PURE__*/ _interop_require_wildcard(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
const _native = require("../../native");
const _DrawerItem = require("./DrawerItem");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function DrawerItemList({ state, navigation, descriptors }) {
    const { buildHref } = (0, _native.useLinkBuilder)();
    const focusedRoute = state.routes[state.index];
    const focusedDescriptor = descriptors[focusedRoute.key];
    const focusedOptions = focusedDescriptor.options;
    const { drawerActiveTintColor, drawerInactiveTintColor, drawerActiveBackgroundColor, drawerInactiveBackgroundColor } = focusedOptions;
    return state.routes.map((route, i)=>{
        const focused = i === state.index;
        const onPress = ()=>{
            const event = navigation.emit({
                type: 'drawerItemPress',
                target: route.key,
                canPreventDefault: true
            });
            if (!event.defaultPrevented) {
                navigation.dispatch({
                    ...focused ? _native.DrawerActions.closeDrawer() : _native.CommonActions.navigate(route),
                    target: state.key
                });
            }
        };
        const { title, drawerLabel, drawerIcon, drawerLabelStyle, drawerItemStyle, drawerAllowFontScaling } = descriptors[route.key].options;
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(_DrawerItem.DrawerItem, {
            route: route,
            href: buildHref(route.name, route.params),
            label: drawerLabel !== undefined ? drawerLabel : title !== undefined ? title : route.name,
            icon: drawerIcon,
            focused: focused,
            activeTintColor: drawerActiveTintColor,
            inactiveTintColor: drawerInactiveTintColor,
            activeBackgroundColor: drawerActiveBackgroundColor,
            inactiveBackgroundColor: drawerInactiveBackgroundColor,
            allowFontScaling: drawerAllowFontScaling,
            labelStyle: drawerLabelStyle,
            style: drawerItemStyle,
            onPress: onPress
        }, route.key);
    });
}

//# sourceMappingURL=DrawerItemList.js.map
