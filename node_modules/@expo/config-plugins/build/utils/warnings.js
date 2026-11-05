"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    addWarningAndroid: null,
    addWarningForPlatform: null,
    addWarningIOS: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get addWarningAndroid () {
        return addWarningAndroid;
    },
    get addWarningForPlatform () {
        return addWarningForPlatform;
    },
    get addWarningIOS () {
        return addWarningIOS;
    }
});
function _chalk() {
    const data = /*#__PURE__*/ _interop_require_default(require("chalk"));
    _chalk = function() {
        return data;
    };
    return data;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function addWarningAndroid(property, text, link) {
    console.warn(formatWarning('android', property, text, link));
}
function addWarningIOS(property, text, link) {
    console.warn(formatWarning('ios', property, text, link));
}
function addWarningForPlatform(platform, property, text, link) {
    console.warn(formatWarning(platform, property, text, link));
}
function formatWarning(platform, property, warning, link) {
    return _chalk().default.yellow`${'» ' + _chalk().default.bold(platform)}: ${property}: ${warning}${link ? _chalk().default.gray(' ' + link) : ''}`;
}

//# sourceMappingURL=warnings.js.map
