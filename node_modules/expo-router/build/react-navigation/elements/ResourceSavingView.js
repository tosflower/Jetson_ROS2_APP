"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ResourceSavingView", {
    enumerable: true,
    get: function() {
        return ResourceSavingView;
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
const FAR_FAR_AWAY = 30000; // this should be big enough to move the whole view out of its container
function ResourceSavingView({ visible, children, style, ...rest }) {
    if (_reactnative().Platform.OS === 'web') {
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
            // @ts-expect-error: hidden exists on web, but not in React Native
            hidden: !visible,
            style: [
                {
                    pointerEvents: visible ? 'auto' : 'none',
                    display: visible ? 'flex' : 'none'
                },
                styles.container,
                style
            ],
            ...rest,
            children: children
        });
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
        style: [
            // box-none doesn't seem to work properly on Android
            {
                pointerEvents: visible ? 'auto' : 'none'
            },
            styles.container,
            style
        ],
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
            collapsable: false,
            removeClippedSubviews: // On iOS & macOS, set removeClippedSubviews to true only when not focused
            // This is a workaround for a bug where the clipped view never re-appears
            _reactnative().Platform.OS === 'ios' || _reactnative().Platform.OS === 'macos' ? !visible : true,
            style: [
                {
                    pointerEvents: visible ? 'auto' : 'none'
                },
                visible ? styles.attached : styles.detached
            ],
            children: children
        })
    });
}
const styles = _reactnative().StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden'
    },
    attached: {
        flex: 1
    },
    detached: {
        flex: 1,
        top: FAR_FAR_AWAY
    }
});

//# sourceMappingURL=ResourceSavingView.js.map
