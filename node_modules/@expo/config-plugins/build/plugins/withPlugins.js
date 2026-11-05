"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "withPlugins", {
    enumerable: true,
    get: function() {
        return withPlugins;
    }
});
function _assert() {
    const data = /*#__PURE__*/ _interop_require_default(require("assert"));
    _assert = function() {
        return data;
    };
    return data;
}
const _withStaticPlugin = require("./withStaticPlugin");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const withPlugins = (config, plugins)=>{
    (0, _assert().default)(Array.isArray(plugins), 'withPlugins expected a valid array of plugins or plugin module paths');
    return plugins.reduce((prev, plugin)=>(0, _withStaticPlugin.withStaticPlugin)(prev, {
            plugin
        }), config);
};

//# sourceMappingURL=withPlugins.js.map
