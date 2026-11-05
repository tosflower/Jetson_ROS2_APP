"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ScreenContent: null,
    TabsScreen: null,
    useOnTabSelectedHandler: null,
    useOnTabSelectionPreventedHandler: null,
    useSelectedScreenKey: null,
    useSharedScreenProps: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ScreenContent () {
        return ScreenContent;
    },
    get TabsScreen () {
        return TabsScreen;
    },
    get useOnTabSelectedHandler () {
        return useOnTabSelectedHandler;
    },
    get useOnTabSelectionPreventedHandler () {
        return useOnTabSelectionPreventedHandler;
    },
    get useSelectedScreenKey () {
        return useSelectedScreenKey;
    },
    get useSharedScreenProps () {
        return useSharedScreenProps;
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
const _native = require("../react-navigation/native");
const _icon = require("./utils/icon");
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
const TabsScreen = _reactnativescreens().Tabs.Screen;
function useSelectedScreenKey({ focusedIndex, provenance, tabs }) {
    const stableState = (0, _react().useMemo)(()=>({
            focusedIndex,
            provenance
        }), [
        focusedIndex,
        provenance
    ]);
    const { focusedIndex: deferredFocusedIndex, provenance: deferredProvenance } = (0, _react().useDeferredValue)(stableState);
    // We need to check if the deferred index is not out of bounds
    // This can happen when the focused index is the last tab, and user removes that tab
    // In that case the deferred index will still point to the last tab, but after re-render
    // it will be out of bounds
    const inBoundsDeferredFocusedIndex = deferredFocusedIndex < tabs.length ? deferredFocusedIndex : focusedIndex;
    return {
        selectedScreenKey: tabs[inBoundsDeferredFocusedIndex].name,
        provenance: deferredProvenance
    };
}
function useOnTabSelectedHandler(onTabChange) {
    return (0, _react().useCallback)(({ nativeEvent: { selectedScreenKey, provenance, actionOrigin } })=>{
        // Treat anything other than a JS-driven echo as a native action so the
        // navigator emits `tabPress` and dispatches `JUMP_TO`.
        const isNativeAction = actionOrigin !== 'programmatic-js';
        onTabChange({
            selectedKey: selectedScreenKey,
            provenance,
            isNativeAction
        });
    }, [
        onTabChange
    ]);
}
function useOnTabSelectionPreventedHandler(onTabChange) {
    return (0, _react().useCallback)(({ nativeEvent: { preventedScreenKey, provenance } })=>{
        // Forward the disabled tab the user tapped (`preventedScreenKey`), not the
        // still-active `selectedScreenKey`. `isNativeAction` is required by the payload
        // and is always `true` here, since programmatic JS navigation bypasses
        // `preventNativeSelection` and therefore never reaches this callback.
        onTabChange({
            selectedKey: preventedScreenKey,
            provenance,
            isNativeAction: true,
            isPrevented: true
        });
    }, [
        onTabChange
    ]);
}
function useSharedScreenProps(props) {
    const { options, isFocused, name } = props;
    const title = options.title ?? name;
    const { ios: nativeIosOverrides, android: nativeAndroidOverrides, ...nativeRestOverrides } = options.nativeProps ?? {};
    // We need to await the icon, as VectorIcon will load asynchronously
    const icon = (0, _icon.useAwaitedScreensIcon)(options.icon);
    const selectedIcon = (0, _icon.useAwaitedScreensIcon)(options.selectedIcon);
    return {
        options,
        // TODO(@ubax): https://linear.app/expo/issue/ENG-20736/remove-pointerevents-from-nativetabsview
        pointerEvents: isFocused ? 'box-none' : 'none',
        title,
        nativeIosOverrides,
        nativeAndroidOverrides,
        nativeRestOverrides,
        screenKey: name,
        icon,
        selectedIcon
    };
}
function ScreenContent({ options, contentRenderer }) {
    const { colors } = (0, _native.useTheme)();
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
        // https://github.com/software-mansion/react-native-screens/issues/2662#issuecomment-2757735088
        collapsable: false,
        style: [
            {
                backgroundColor: colors.background
            },
            options.contentStyle,
            {
                flex: 1,
                position: 'relative',
                overflow: 'hidden'
            }
        ],
        children: contentRenderer()
    });
}

//# sourceMappingURL=NativeTabsView.shared.js.map
