"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get applyStaticHeaders () {
        return applyStaticHeaders;
    },
    get loadStaticManifestAsync () {
        return loadStaticManifestAsync;
    }
});
function _promises() {
    const data = /*#__PURE__*/ _interop_require_default(require("node:fs/promises"));
    _promises = function() {
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function loadStaticManifestAsync(dist) {
    var _json_redirects;
    let json;
    try {
        json = JSON.parse(await _promises().default.readFile(_nodepath().default.join(dist, '_expo/.routes.json'), 'utf8'));
    } catch  {
        return null;
    }
    return {
        ...json,
        redirects: (_json_redirects = json.redirects) == null ? void 0 : _json_redirects.map((rule)=>({
                ...rule,
                namedRegex: new RegExp(rule.namedRegex)
            }))
    };
}
function applyStaticHeaders(res, headers) {
    for (const [name, value] of Object.entries(headers)){
        if (name.toLowerCase() === 'content-type') {
            continue;
        }
        if (Array.isArray(value)) {
            for (const headerValue of value){
                res.appendHeader(name, headerValue);
            }
        } else if (!res.hasHeader(name)) {
            res.setHeader(name, value);
        }
    }
}

//# sourceMappingURL=static.js.map