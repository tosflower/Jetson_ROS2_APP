"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getMockConfig: null,
    getMockContext: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getMockConfig () {
        return getMockConfig;
    },
    get getMockContext () {
        return getMockContext;
    }
});
function _path() {
    const data = /*#__PURE__*/ _interop_require_default(require("path"));
    _path = function() {
        return data;
    };
    return data;
}
const _getLinkingConfig = require("../getLinkingConfig");
const _getRoutes = require("../getRoutes");
const _contextstubs = require("./context-stubs");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function getMockConfig(context, metaOnly = true) {
    return (0, _getLinkingConfig.getNavigationConfig)((0, _getRoutes.getExactRoutes)(getMockContext(context)), metaOnly, {
        sitemap: true,
        notFound: true
    });
}
function getMockContext(context) {
    if (typeof context === 'string') {
        return (0, _contextstubs.requireContext)(_path().default.resolve(process.cwd(), context));
    } else if (Array.isArray(context)) {
        return (0, _contextstubs.inMemoryContext)(Object.fromEntries(context.map((filename)=>[
                filename,
                {
                    default: ()=>null
                }
            ])));
    } else if (!('appDir' in context)) {
        return (0, _contextstubs.inMemoryContext)(context);
    } else if ('appDir' in context && typeof context.appDir === 'string') {
        return (0, _contextstubs.requireContextWithOverrides)(context.appDir, context.overrides);
    } else {
        throw new Error('Invalid context');
    }
}

//# sourceMappingURL=mock-config.js.map
