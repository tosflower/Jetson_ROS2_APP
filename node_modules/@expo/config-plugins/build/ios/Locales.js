"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getLocales: null,
    setLocalesAsync: null,
    withLocales: null,
    writeStringsFile: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getLocales () {
        return getLocales;
    },
    get setLocalesAsync () {
        return setLocalesAsync;
    },
    get withLocales () {
        return withLocales;
    },
    get writeStringsFile () {
        return writeStringsFile;
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
const _iosplugins = require("../plugins/ios-plugins");
const _locales = require("../utils/locales");
const _Xcodeproj = require("./utils/Xcodeproj");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const withLocales = (config)=>{
    return (0, _iosplugins.withXcodeProject)(config, async (config)=>{
        config.modResults = await setLocalesAsync(config, {
            projectRoot: config.modRequest.projectRoot,
            project: config.modResults
        });
        return config;
    });
};
function escapeStringsLiteral(value) {
    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}
async function writeStringsFile({ localesMap, supportingDirectory, fileName, projectName, project }) {
    for (const [lang, localizationObj] of Object.entries(localesMap)){
        if (Object.entries(localizationObj).length === 0) continue;
        const dir = _path().default.join(supportingDirectory, `${lang}.lproj`);
        await _fs().default.promises.mkdir(dir, {
            recursive: true
        });
        const strings = _path().default.join(dir, fileName);
        const buffer = [];
        for (const [plistKey, localVersion] of Object.entries(localizationObj)){
            buffer.push(`"${escapeStringsLiteral(plistKey)}" = "${escapeStringsLiteral(String(localVersion))}";`);
        }
        // Write the file to the file system.
        await _fs().default.promises.writeFile(strings, buffer.join('\n'));
        const groupName = `${projectName}/Supporting/${lang}.lproj`;
        // deep find the correct folder
        const group = (0, _Xcodeproj.ensureGroupRecursively)(project, groupName);
        // Ensure the file doesn't already exist
        if (!group?.children.some(({ comment })=>comment === fileName)) {
            // Only write the file if it doesn't already exist.
            project = (0, _Xcodeproj.addResourceFileToGroup)({
                filepath: _path().default.relative(supportingDirectory, strings),
                groupName,
                project,
                isBuildFile: true,
                verbose: true
            });
        }
    }
    return project;
}
function getLocales(config) {
    return config.locales ?? null;
}
async function setLocalesAsync(config, { projectRoot, project }) {
    const locales = getLocales(config);
    if (!locales) {
        return project;
    }
    // possibly validate CFBundleAllowMixedLocalizations is enabled
    const { localesMap, localizableStringsIOS: localizableStrings } = await (0, _locales.getResolvedLocalesAsync)(projectRoot, locales, 'ios');
    const projectName = (0, _Xcodeproj.getProjectName)(projectRoot);
    const supportingDirectory = _path().default.join(projectRoot, 'ios', projectName, 'Supporting');
    // TODO: Should we delete all before running? Revisit after we land on a lock file.
    project = await writeStringsFile({
        localesMap,
        supportingDirectory,
        fileName: 'InfoPlist.strings',
        projectName,
        project
    });
    if (localizableStrings && Object.keys(localizableStrings).length) {
        project = await writeStringsFile({
            localesMap: localizableStrings,
            supportingDirectory,
            fileName: 'Localizable.strings',
            projectName,
            project
        });
    }
    return project;
}

//# sourceMappingURL=Locales.js.map
