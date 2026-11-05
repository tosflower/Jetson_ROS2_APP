"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    resolveFontPaths: null,
    toValidAndroidResourceName: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get resolveFontPaths () {
        return resolveFontPaths;
    },
    get toValidAndroidResourceName () {
        return toValidAndroidResourceName;
    }
});
function _promises() {
    const data = /*#__PURE__*/ _interop_require_default(require("fs/promises"));
    _promises = function() {
        return data;
    };
    return data;
}
function _nodemodule() {
    const data = /*#__PURE__*/ _interop_require_default(require("node:module"));
    _nodemodule = function() {
        return data;
    };
    return data;
}
function _path() {
    const data = /*#__PURE__*/ _interop_require_default(require("path"));
    _path = function() {
        return data;
    };
    return data;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function isErrorWithCode(error, code) {
    return typeof error === 'object' && error !== null && 'code' in error && error.code === code;
}
function resolveFontPath(p, projectRoot) {
    return _nodemodule().default.createRequire(_path().default.join(projectRoot, 'package.json')).resolve(p);
}
function toValidAndroidResourceName(value) {
    const valueWithoutFileExtension = _path().default.parse(value).name;
    const withUnderscores = valueWithoutFileExtension.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/([A-Z])([A-Z][a-z])/g, '$1_$2');
    return withUnderscores.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');
}
async function resolveFontPaths(fonts, projectRoot) {
    const promises = fonts.map(async (p)=>{
        let resolvedPath = _path().default.resolve(projectRoot, p);
        let stat;
        try {
            stat = await _promises().default.stat(resolvedPath);
        } catch (error) {
            if (!isErrorWithCode(error, 'ENOENT')) {
                throw error;
            }
            resolvedPath = resolveFontPath(p, projectRoot);
            stat = await _promises().default.stat(resolvedPath);
        }
        if (stat.isDirectory()) {
            const dir = await _promises().default.readdir(resolvedPath);
            return dir.map((file)=>_path().default.join(resolvedPath, file));
        }
        return [
            resolvedPath
        ];
    });
    return (await Promise.all(promises)).flat().filter((p)=>p.endsWith('.ttf') || p.endsWith('.otf') || p.endsWith('.woff') || p.endsWith('.woff2'));
}

//# sourceMappingURL=utils.js.map
