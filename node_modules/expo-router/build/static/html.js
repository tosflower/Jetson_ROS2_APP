/**
 * Copyright © 2023 650 Industries.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    InnerRoot: null,
    ScrollViewStyleReset: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get InnerRoot () {
        return InnerRoot;
    },
    get ScrollViewStyleReset () {
        return ScrollViewStyleReset;
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
    const data = /*#__PURE__*/ _interop_require_default(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
const _ServerDataLoaderContext = require("../loaders/ServerDataLoaderContext");
const _native = require("../react-navigation/native");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const ScrollViewStyleReset = ()=>{
    return /*#__PURE__*/ (0, _jsxruntime().jsx)("style", {
        id: "expo-reset",
        dangerouslySetInnerHTML: {
            __html: `#root,body,html{height:100%}body{overflow:hidden}#root{display:flex}`
        }
    });
};
function InnerRoot({ children, loadedData }) {
    // NOTE(@hassankhan): This ref seems to be unnecessary, double-check SSR/SSG code paths and remove
    const ref = /*#__PURE__*/ _react().default.createRef();
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_ServerDataLoaderContext.ServerDataLoaderContext, {
        value: loadedData,
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.ServerContainer, {
            ref: ref,
            children: children
        })
    });
}

//# sourceMappingURL=html.js.map
