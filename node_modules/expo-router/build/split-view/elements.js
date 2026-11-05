"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    SplitViewColumn: null,
    SplitViewInspector: null,
    getSplitColumnChildren: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get SplitViewColumn () {
        return SplitViewColumn;
    },
    get SplitViewInspector () {
        return SplitViewInspector;
    },
    get getSplitColumnChildren () {
        return getSplitColumnChildren;
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
const _reactnativescreens = require("../optional-libraries/react-native-screens");
function SplitViewColumn(props) {
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativescreens.Split.Column, {
        children: getSplitColumnChildren(props.children)
    });
}
function isSplitColumnNativeChild(child) {
    return /*#__PURE__*/ (0, _react().isValidElement)(child) && (child.type === _reactnativescreens.Split.Stack || child.type === _reactnativescreens.Split.HeaderConfig);
}
function getSplitColumnChildren(children) {
    const childrenArray = _react().Children.toArray(children);
    const nativeChildren = childrenArray.filter(isSplitColumnNativeChild);
    const otherChildren = childrenArray.filter((child)=>!isSplitColumnNativeChild(child));
    if (otherChildren.length === 0) {
        return nativeChildren;
    }
    return [
        ...nativeChildren,
        /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativesafeareacontext().SafeAreaProvider, {
            children: otherChildren
        }, "safe-area-provider")
    ];
}
function SplitViewInspector(props) {
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativescreens.Split.Inspector, {
        children: props.children
    });
}

//# sourceMappingURL=elements.js.map
