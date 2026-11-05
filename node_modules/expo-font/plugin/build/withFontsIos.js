"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "withFontsIos", {
    enumerable: true,
    get: function() {
        return withFontsIos;
    }
});
function _configplugins() {
    const data = require("expo/config-plugins");
    _configplugins = function() {
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
const _utils = require("./utils");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const withFontsIos = (config, fonts)=>{
    config = addFontsToTarget(config, fonts);
    config = addFontsToPlist(config, fonts);
    return config;
};
function addFontsToTarget(config, fonts) {
    return (0, _configplugins().withXcodeProject)(config, async (config)=>{
        const resolvedFonts = await (0, _utils.resolveFontPaths)(fonts, config.modRequest.projectRoot);
        const project = config.modResults;
        const platformProjectRoot = config.modRequest.platformProjectRoot;
        _configplugins().IOSConfig.XcodeUtils.ensureGroupRecursively(project, 'Resources');
        addResourceFile(project, platformProjectRoot, resolvedFonts);
        return config;
    });
}
function addFontsToPlist(config, fonts) {
    return (0, _configplugins().withInfoPlist)(config, async (config)=>{
        const resolvedFonts = await (0, _utils.resolveFontPaths)(fonts, config.modRequest.projectRoot);
        const existingFonts = getUIAppFonts(config.modResults);
        const fontList = resolvedFonts.map((font)=>_path().default.basename(font)) ?? [];
        const allFonts = [
            ...existingFonts,
            ...fontList
        ];
        config.modResults.UIAppFonts = Array.from(new Set(allFonts));
        return config;
    });
}
function addResourceFile(project, platformRoot, f) {
    for (const font of f){
        const fontPath = _path().default.relative(platformRoot, font);
        _configplugins().IOSConfig.XcodeUtils.addResourceFileToGroup({
            filepath: fontPath,
            groupName: 'Resources',
            project,
            isBuildFile: true,
            verbose: true
        });
    }
}
function getUIAppFonts(infoPlist) {
    const fonts = infoPlist['UIAppFonts'];
    if (fonts != null && Array.isArray(fonts) && fonts.every((font)=>typeof font === 'string')) {
        return fonts;
    }
    return [];
}

//# sourceMappingURL=withFontsIos.js.map
