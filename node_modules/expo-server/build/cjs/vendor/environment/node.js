"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createNodeEnv: null,
    createNodeRequestScope: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get createNodeEnv () {
        return createNodeEnv;
    },
    get createNodeRequestScope () {
        return createNodeRequestScope;
    }
});
function _nodefs() {
    const data = /*#__PURE__*/ _interop_require_default(require("node:fs"));
    _nodefs = function() {
        return data;
    };
    return data;
}
function _nodepath() {
    const data = /*#__PURE__*/ _interop_require_default(require("node:path"));
    _nodepath = function() {
        return data;
    };
    return data;
}
const _common = require("./common");
const _ImmutableRequest = require("../../ImmutableRequest");
const _runtime = require("../../runtime");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function createNodeEnv(params) {
    (0, _ImmutableRequest.assertRuntimeFetchAPISupport)();
    async function readText(request) {
        const filePath = _nodepath().default.join(params.build, request);
        if (!_nodefs().default.existsSync(filePath)) {
            return null;
        }
        try {
            return await _nodefs().default.promises.readFile(filePath, 'utf-8');
        } catch  {
            return null;
        }
    }
    async function readJson(request) {
        const json = await readText(request);
        return json != null ? JSON.parse(json) : null;
    }
    async function loadModule(request) {
        const filePath = _nodepath().default.join(params.build, request);
        if (!_nodefs().default.existsSync(filePath)) {
            return null;
        } else if (/\.c?js$/.test(filePath)) {
            return require(filePath);
        } else {
            return await import(filePath);
        }
    }
    return (0, _common.createEnvironment)({
        readText,
        readJson,
        loadModule,
        isDevelopment: params.isDevelopment ?? false
    });
}
const getRequestURLOrigin = (request)=>{
    try {
        // NOTE: We don't trust any headers on incoming requests in "raw" environments
        return new URL(request.url).origin || null;
    } catch  {
        return null;
    }
};
function createNodeRequestScope(scopeDefinition, params) {
    return (0, _runtime.createRequestScope)(scopeDefinition, (request)=>({
            requestHeaders: request.headers,
            origin: getRequestURLOrigin(request),
            environment: params.environment ?? process.env.NODE_ENV
        }));
}

//# sourceMappingURL=node.js.map
