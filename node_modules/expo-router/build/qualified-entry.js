// The entry component (one that uses context modules) cannot be in the same file as the
// entry side-effects, otherwise they'll be updated when files are added/removed from the
// app directory. This will cause a lot of unfortunate errors regarding HMR and Fast Refresh.
// This is because Fast Refresh is sending the entire file containing an updated component.
// This has to be the string "expo-router/_ctx" as we resolve the exact string to
// a different file in a custom resolver for bundle splitting in Node.js.
//
// @ts-ignore: Will not self-resolve without package.json:exports
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "App", {
    enumerable: true,
    get: function() {
        return App;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
function _ctx() {
    const data = require("expo-router/_ctx");
    _ctx = function() {
        return data;
    };
    return data;
}
require("react");
const _ExpoRoot = require("./ExpoRoot");
const _head = require("./head");
require("./fast-refresh");
function App() {
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_head.Head.Provider, {
        children: /*#__PURE__*/ (0, _jsxruntime().jsx)(_ExpoRoot.ExpoRoot, {
            context: _ctx().ctx
        })
    });
}

//# sourceMappingURL=qualified-entry.js.map
