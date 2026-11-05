'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ServerContainer", {
    enumerable: true,
    get: function() {
        return ServerContainer;
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
const _core = require("../core");
const _ServerContext = require("./ServerContext");
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
function ServerContainer({ ref, children, location }) {
    _react().useEffect(()=>{
        console.error("'ServerContainer' should only be used on the server with 'react-dom/server' for SSR.");
    }, []);
    const current = {};
    if (ref) {
        const value = {
            getCurrentOptions () {
                return current.options;
            }
        };
        // We write to the `ref` during render instead of `React.useImperativeHandle`
        // This is because `useImperativeHandle` will update the ref after 'commit',
        // and there's no 'commit' phase during SSR.
        // Mutating ref during render is unsafe in concurrent mode, but we don't care about it for SSR.
        if (typeof ref === 'function') {
            ref(value);
        } else {
            ref.current = value;
        }
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_ServerContext.ServerContext.Provider, {
        value: {
            location
        },
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_core.CurrentRenderContext.Provider, {
            value: current,
            children: children
        })
    });
}

//# sourceMappingURL=ServerContainer.js.map
