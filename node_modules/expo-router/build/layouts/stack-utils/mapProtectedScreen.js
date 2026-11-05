"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "mapProtectedScreen", {
    enumerable: true,
    get: function() {
        return mapProtectedScreen;
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
const _children = require("../../utils/children");
const _Protected = require("../../views/Protected");
const _Screen = require("../../views/Screen");
const _StackHeaderComponent = require("./StackHeaderComponent");
const _StackScreen = require("./StackScreen");
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
function mapProtectedScreen(props) {
    return {
        ...props,
        children: _react().Children.toArray(props.children).map((child, index)=>{
            if ((0, _children.isChildOfType)(child, _StackScreen.StackScreen)) {
                const { children, options: childOptions, ...rest } = child.props;
                const options = typeof childOptions === 'function' ? (...params)=>(0, _StackScreen.appendScreenStackPropsToOptions)(childOptions(...params), {
                        children
                    }) : (0, _StackScreen.appendScreenStackPropsToOptions)(childOptions ?? {}, {
                    children
                });
                return /*#__PURE__*/ (0, _jsxruntime().jsx)(_Screen.Screen, {
                    ...rest,
                    options: options
                }, rest.name);
            } else if ((0, _children.isChildOfType)(child, _Protected.Protected)) {
                return /*#__PURE__*/ (0, _jsxruntime().jsx)(_Protected.Protected, {
                    ...mapProtectedScreen(child.props)
                }, `${index}-${props.guard}`);
            } else if ((0, _children.isChildOfType)(child, _StackHeaderComponent.StackHeaderComponent)) {
                // Ignore Stack.Header, because it can be used to set header options for Stack
                // and we use this function to process children of Stack, as well.
                return null;
            } else {
                if (/*#__PURE__*/ _react().default.isValidElement(child)) {
                    console.warn(`Unknown child element passed to Stack: ${child.type}`);
                } else {
                    console.warn(`Unknown child element passed to Stack: ${child}`);
                }
            }
            return null;
        }).filter(Boolean)
    };
}

//# sourceMappingURL=mapProtectedScreen.js.map
