"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getResolvedLocalesAsync", {
    enumerable: true,
    get: function() {
        return getResolvedLocalesAsync;
    }
});
function _jsonfile() {
    const data = /*#__PURE__*/ _interop_require_default(require("@expo/json-file"));
    _jsonfile = function() {
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
const _warnings = require("./warnings");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function getResolvedLocalesAsync(projectRoot, input, forPlatform) {
    const locales = {};
    const localizableStringsIOS = {};
    for (const [lang, localeJsonPath] of Object.entries(input)){
        const locale = await getLocales(projectRoot, localeJsonPath, forPlatform, lang);
        if (locale) {
            const { android, ios, ...rest } = {
                android: {},
                ios: {},
                ...locale
            };
            if (forPlatform === 'ios') {
                const { localizableStringsEntry, otherEntries } = extractIosLocalizableStrings({
                    ios,
                    lang
                });
                if (localizableStringsEntry) {
                    localizableStringsIOS[lang] = localizableStringsEntry;
                }
                locales[lang] = {
                    ...rest,
                    ...otherEntries
                };
            } else {
                locales[lang] = {
                    ...rest,
                    ...android
                };
            }
        }
    }
    return {
        localesMap: locales,
        localizableStringsIOS
    };
}
async function getLocales(projectRoot, localeJsonPath, forPlatform, lang) {
    if (typeof localeJsonPath === 'string') {
        try {
            return await _jsonfile().default.readAsync(_path().default.join(projectRoot, localeJsonPath));
        } catch  {
            // Add a warning when a json file cannot be parsed.
            (0, _warnings.addWarningForPlatform)(forPlatform, `locales.${lang}`, `Failed to parse JSON of locale file for language: ${lang}`, 'https://docs.expo.dev/guides/localization/#translating-app-metadata');
            return null;
        }
    }
    // In the off chance that someone defined the locales json in the config, pass it directly to the object.
    // We do this to make the types more elegant.
    return localeJsonPath;
}
function extractIosLocalizableStrings({ ios, lang }) {
    const LOCALIZABLE_STR_ENTRY = 'Localizable.strings';
    if (!(LOCALIZABLE_STR_ENTRY in ios)) {
        return {
            localizableStringsEntry: undefined,
            otherEntries: ios
        };
    }
    const { [LOCALIZABLE_STR_ENTRY]: localizableStringsEntry, ...otherEntries } = ios;
    if (!localizableStringsEntry) {
        return {
            localizableStringsEntry: undefined,
            otherEntries
        };
    }
    if (!isStringsMap(localizableStringsEntry)) {
        (0, _warnings.addWarningForPlatform)('ios', `locales.${lang}.ios['${LOCALIZABLE_STR_ENTRY}']`, 'Expected a JSON object mapping string keys to string values', 'https://docs.expo.dev/guides/localization/#translating-app-metadata');
        return {
            localizableStringsEntry: undefined,
            otherEntries
        };
    }
    return {
        localizableStringsEntry,
        otherEntries
    };
}
function isStringsMap(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return false;
    }
    return Object.values(value).every((item)=>typeof item === 'string');
}

//# sourceMappingURL=locales.js.map
