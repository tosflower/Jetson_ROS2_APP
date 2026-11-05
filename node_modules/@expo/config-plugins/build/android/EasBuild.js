"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    configureEasBuildAsync: null,
    getEasBuildGradlePath: null,
    isEasBuildGradleConfiguredAsync: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get configureEasBuildAsync () {
        return configureEasBuildAsync;
    },
    get getEasBuildGradlePath () {
        return getEasBuildGradlePath;
    },
    get isEasBuildGradleConfiguredAsync () {
        return isEasBuildGradleConfiguredAsync;
    }
});
function _fs() {
    const data = /*#__PURE__*/ _interop_require_default(require("fs"));
    _fs = function() {
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
const _EasBuildGradleScript = /*#__PURE__*/ _interop_require_default(require("./EasBuildGradleScript"));
const _Paths = /*#__PURE__*/ _interop_require_wildcard(require("./Paths"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
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
const APPLY_EAS_GRADLE = 'apply from: "./eas-build.gradle"';
function hasApplyLine(content, applyLine) {
    return content.replace(/\r\n/g, '\n').split('\n')// Check for both single and double quotes
    .some((line)=>line === applyLine || line === applyLine.replace(/"/g, "'"));
}
function getEasBuildGradlePath(projectRoot) {
    return _path().default.join(projectRoot, 'android', 'app', 'eas-build.gradle');
}
async function configureEasBuildAsync(projectRoot) {
    const buildGradlePath = _Paths.getAppBuildGradleFilePath(projectRoot);
    const easGradlePath = getEasBuildGradlePath(projectRoot);
    await _fs().default.promises.writeFile(easGradlePath, _EasBuildGradleScript.default);
    const buildGradleContent = await _fs().default.promises.readFile(_path().default.join(buildGradlePath), 'utf8');
    const hasEasGradleApply = hasApplyLine(buildGradleContent, APPLY_EAS_GRADLE);
    if (!hasEasGradleApply) {
        await _fs().default.promises.writeFile(buildGradlePath, `${buildGradleContent.trim()}\n${APPLY_EAS_GRADLE}\n`);
    }
}
async function isEasBuildGradleConfiguredAsync(projectRoot) {
    const buildGradlePath = _Paths.getAppBuildGradleFilePath(projectRoot);
    const easGradlePath = getEasBuildGradlePath(projectRoot);
    const hasEasGradleFile = await _fs().default.existsSync(easGradlePath);
    const buildGradleContent = await _fs().default.promises.readFile(_path().default.join(buildGradlePath), 'utf8');
    const hasEasGradleApply = hasApplyLine(buildGradleContent, APPLY_EAS_GRADLE);
    return hasEasGradleApply && hasEasGradleFile;
}

//# sourceMappingURL=EasBuild.js.map
