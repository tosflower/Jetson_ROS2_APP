"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getLocales: null,
    setLocalesAsync: null,
    withLocales: null
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
    }
});
function _path() {
    const data = /*#__PURE__*/ _interop_require_default(require("path"));
    _path = function() {
        return data;
    };
    return data;
}
const _withDangerousMod = require("../plugins/withDangerousMod");
const _XML = require("../utils/XML");
const _locales = require("../utils/locales");
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
// Android looks up resources for these languages under their legacy ISO 639 codes.
// See `adjustLanguageTag` in `android.content.res.ResourcesImpl`.
const LEGACY_LANGUAGE_CODES = {
    he: 'iw',
    id: 'in',
    yi: 'ji'
};
const withLocales = (config)=>{
    return (0, _withDangerousMod.withDangerousMod)(config, [
        'android',
        async (config)=>{
            config.modResults = await setLocalesAsync(config, {
                projectRoot: config.modRequest.projectRoot
            });
            return config;
        }
    ]);
};
function getLocales(config) {
    return config.locales ?? null;
}
function getResourceQualifier(locale) {
    const tag = locale.replace(/^[a-z]+/i, (language)=>LEGACY_LANGUAGE_CODES[language.toLowerCase()] ?? language);
    return `b+${tag.replaceAll('-', '+')}`;
}
async function setLocalesAsync(config, { projectRoot }) {
    const locales = getLocales(config);
    if (!locales) {
        return config;
    }
    const { localesMap } = await (0, _locales.getResolvedLocalesAsync)(projectRoot, locales, 'android');
    for (const [lang, localizationObj] of Object.entries(localesMap)){
        const stringsFilePath = _path().default.join(await _Paths.getResourceFolderAsync(projectRoot), `values-${getResourceQualifier(lang)}`, 'strings.xml');
        await (0, _XML.writeXMLAsync)({
            path: stringsFilePath,
            xml: {
                resources: Object.entries(localizationObj).map(([k, v])=>({
                        string: {
                            $: {
                                name: k
                            },
                            _: `"${v}"`
                        }
                    }))
            }
        });
    }
    return config;
}

//# sourceMappingURL=Locales.js.map
