"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createWorkerdEnv: null,
    createWorkerdRequestScope: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get createWorkerdEnv () {
        return createWorkerdEnv;
    },
    get createWorkerdRequestScope () {
        return createWorkerdRequestScope;
    }
});
const _common = require("./common");
const _runtime = require("../../runtime");
const createCachedImport = ()=>{
    const importCache = new Map();
    return async function importCached(request) {
        let result = importCache.get(request);
        if (!result) {
            try {
                result = {
                    type: 'success',
                    value: await import(request)
                };
            } catch (error) {
                result = {
                    type: 'error',
                    value: error
                };
            }
            importCache.set(request, result);
        }
        if (result.type === 'success') {
            return result.value;
        } else {
            throw result.value;
        }
    };
};
function createWorkerdEnv(params) {
    const build = params.build || '.';
    const importCached = createCachedImport();
    async function readText(request) {
        try {
            const mod = await importCached(`${build}/${request}`);
            return mod.default;
        } catch  {
            return null;
        }
    }
    async function readJson(request) {
        try {
            const mod = await importCached(`${build}/${request}`);
            if (typeof mod.default === 'string' && mod.default[0] === '{') {
                return JSON.parse(mod.default);
            } else {
                return mod.default;
            }
        } catch  {
            return null;
        }
    }
    async function loadModule(request) {
        const target = `${build}/${request}`;
        return (await import(target)).default;
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
function createWorkerdRequestScope(scopeDefinition, params) {
    const makeRequestAPISetup = (request, _env, ctx)=>({
            requestHeaders: request.headers,
            origin: getRequestURLOrigin(request),
            environment: params.environment ?? null,
            waitUntil: ctx.waitUntil?.bind(ctx)
        });
    return (0, _runtime.createRequestScope)(scopeDefinition, makeRequestAPISetup);
}

//# sourceMappingURL=workerd.js.map
