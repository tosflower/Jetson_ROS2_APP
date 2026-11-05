"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    applyNameSettingsGradle: null,
    getName: null,
    sanitizeNameForGradle: null,
    withName: null,
    withNameSettingsGradle: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get applyNameSettingsGradle () {
        return applyNameSettingsGradle;
    },
    get getName () {
        return getName;
    },
    get sanitizeNameForGradle () {
        return sanitizeNameForGradle;
    },
    get withName () {
        return withName;
    },
    get withNameSettingsGradle () {
        return withNameSettingsGradle;
    }
});
const _androidplugins = require("../plugins/android-plugins");
const _warnings = require("../utils/warnings");
const _Resources = require("./Resources");
const _Strings = require("./Strings");
function sanitizeNameForGradle(name) {
    // Remove escape characters which are valid in XML names but not in gradle.
    name = name.replace(/[\n\r\t]/g, '');
    // Gradle disallows these:
    // The project name 'My-Special 😃 Co/ol_Project' must not contain any of the following characters: [/, \, :, <, >, ", ?, *, |]. Set the 'rootProject.name' or adjust the 'include' statement (see https://docs.gradle.org/6.2/dsl/org.gradle.api.initialization.Settings.html#org.gradle.api.initialization.Settings:include(java.lang.String[]) for more details).
    return name.replace(/(\/|\\|:|<|>|"|\?|\*|\|)/g, '');
}
const withName = (0, _androidplugins.createStringsXmlPlugin)(applyNameFromConfig, 'withName');
const withNameSettingsGradle = (config)=>{
    return (0, _androidplugins.withSettingsGradle)(config, (config)=>{
        if (config.modResults.language === 'groovy') {
            config.modResults.contents = applyNameSettingsGradle(config, config.modResults.contents);
        } else {
            (0, _warnings.addWarningAndroid)('name', `Cannot automatically configure settings.gradle if it's not groovy`);
        }
        return config;
    });
};
function getName(config) {
    return typeof config.name === 'string' ? config.name : null;
}
function applyNameFromConfig(config, stringsJSON) {
    const name = getName(config);
    if (name) {
        return (0, _Strings.setStringItem)([
            (0, _Resources.buildResourceItem)({
                name: 'app_name',
                value: name
            })
        ], stringsJSON);
    }
    return (0, _Strings.removeStringItem)('app_name', stringsJSON);
}
function applyNameSettingsGradle(config, settingsGradle) {
    const name = sanitizeNameForGradle(getName(config) ?? '');
    // Select rootProject.name = '***' and replace the contents between the quotes.
    return settingsGradle.replace(/rootProject.name\s?=\s?(["'])(?:(?=(\\?))\2.)*?\1/g, `rootProject.name = '${name.replace(/'/g, "\\'")}'`);
}

//# sourceMappingURL=Name.js.map
