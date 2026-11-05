"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SplitView", {
    enumerable: true,
    get: function() {
        return SplitView;
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
const _reactnativescreens = require("../optional-libraries/react-native-screens");
const _standardnavigation = require("../standard-navigation");
const _Navigator = require("../views/Navigator");
const _elements = require("./elements");
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
function SplitViewNavigator({ children, activityEnabled, ...splitViewHostProps }) {
    if ((0, _react().use)(_standardnavigation.IsWithinNativeNavigator)) {
        throw new Error('SplitView cannot be used inside another native navigator.');
    }
    if (process.env.EXPO_OS !== 'ios') {
        console.warn('SplitView is only supported on iOS. The SplitView will behave like a Slot navigator on other platforms.');
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(_Navigator.Slot, {
            activityEnabled: activityEnabled
        });
    }
    const allChildrenArray = _react().default.Children.toArray(children);
    const columnChildren = allChildrenArray.filter((child)=>/*#__PURE__*/ (0, _react().isValidElement)(child) && child.type === _elements.SplitViewColumn);
    const inspectorChildren = allChildrenArray.filter((child)=>/*#__PURE__*/ (0, _react().isValidElement)(child) && child.type === _elements.SplitViewInspector);
    const numberOfSidebars = columnChildren.length;
    const numberOfInspectors = inspectorChildren.length;
    if (allChildrenArray.length !== columnChildren.length + inspectorChildren.length) {
        console.warn('Only SplitView.Column and SplitView.Inspector components are allowed as direct children of SplitView.');
    }
    if (numberOfSidebars > 2) {
        throw new Error('There can only be two SplitView.Column in the SplitView.');
    }
    if (numberOfSidebars + numberOfInspectors === 0) {
        console.warn('No SplitView.Column and SplitView.Inspector found in SplitView.');
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(_Navigator.Slot, {
            activityEnabled: activityEnabled
        });
    }
    // Split.Host gives a column index only to direct children whose type is Split.Column.
    const columns = columnChildren.map((child)=>/*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativescreens.Split.Column, {
            children: (0, _elements.getSplitColumnChildren)(child.props.children)
        }, child.key));
    // The key is needed, because number of columns cannot be changed dynamically
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_standardnavigation.IsWithinNativeNavigator, {
        value: true,
        children: /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reactnativescreens.Split.Host, {
            ...splitViewHostProps,
            children: [
                columns,
                /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativescreens.Split.Column, {
                    children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_Navigator.Slot, {
                        activityEnabled: activityEnabled
                    })
                }),
                inspectorChildren
            ]
        }, numberOfSidebars + numberOfInspectors)
    });
}
const SplitView = Object.assign(SplitViewNavigator, {
    Column: _elements.SplitViewColumn,
    Inspector: _elements.SplitViewInspector
});

//# sourceMappingURL=split-view.js.map
