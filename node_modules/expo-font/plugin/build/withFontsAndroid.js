"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    assertAndroidCanLoadFonts: null,
    assertNoConflictingDefinitions: null,
    assertValidAxes: null,
    assertValidWeights: null,
    generateFontManagerCalls: null,
    getXmlSpecs: null,
    groupByFamily: null,
    planFontCopies: null,
    warnAboutUnknownAxisTags: null,
    warnAboutUnslantedItalics: null,
    withFontsAndroid: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get assertAndroidCanLoadFonts () {
        return assertAndroidCanLoadFonts;
    },
    get assertNoConflictingDefinitions () {
        return assertNoConflictingDefinitions;
    },
    get assertValidAxes () {
        return assertValidAxes;
    },
    get assertValidWeights () {
        return assertValidWeights;
    },
    get generateFontManagerCalls () {
        return generateFontManagerCalls;
    },
    get getXmlSpecs () {
        return getXmlSpecs;
    },
    get groupByFamily () {
        return groupByFamily;
    },
    get planFontCopies () {
        return planFontCopies;
    },
    get warnAboutUnknownAxisTags () {
        return warnAboutUnknownAxisTags;
    },
    get warnAboutUnslantedItalics () {
        return warnAboutUnslantedItalics;
    },
    get withFontsAndroid () {
        return withFontsAndroid;
    }
});
function _configplugins() {
    const data = require("expo/config-plugins");
    _configplugins = function() {
        return data;
    };
    return data;
}
function _promises() {
    const data = /*#__PURE__*/ _interop_require_default(require("fs/promises"));
    _promises = function() {
        return data;
    };
    return data;
}
function _os() {
    const data = /*#__PURE__*/ _interop_require_default(require("os"));
    _os = function() {
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
const assetsFontsFir = 'app/src/main/assets/fonts';
const resourcesFontsDir = 'app/src/main/res/font';
// The formats Android's font loader reads. `resolveFontPaths` deliberately keeps `.woff` and `.woff2` for iOS.
const extensionsAndroidCanLoad = [
    '.ttf',
    '.otf'
];
const withFontsAndroid = (config, fonts)=>{
    const assetFontPaths = fonts.filter((it)=>typeof it === 'string');
    config = copyFontsToDir(config, assetFontPaths, assetsFontsFir);
    const xmlFonts = fonts.filter((it)=>typeof it === 'object');
    config = addXmlFonts(config, xmlFonts);
    return config;
};
function groupByFamily(array) {
    return array.reduce((result, item)=>{
        const keyValue = item['fontFamily'];
        result[keyValue] ||= [];
        result[keyValue].push(...item.fontDefinitions.map((it, index)=>resolveFontFile(item, it, index)));
        return result;
    }, {});
}
function resolveFontFile(family, definition, index) {
    const resolvedPath = definition.path ?? family.path;
    if (!resolvedPath) {
        throw new Error(`Font family ${JSON.stringify(family.fontFamily)} declares no "path" at index ${index}. ` + `Add "path" to the font definition, or next to the family.`);
    }
    return {
        ...definition,
        path: resolvedPath
    };
}
function assertAndroidCanLoadFonts(fontsByFamily) {
    for (const [fontFamily, definitions] of Object.entries(fontsByFamily)){
        for (const definition of definitions){
            if (extensionsAndroidCanLoad.includes(_path().default.extname(definition.path).toLowerCase())) {
                continue;
            }
            throw new Error(`Font family ${JSON.stringify(fontFamily)} declares ${definition.path}, which Android cannot load. ` + `Android reads TrueType (.ttf) and OpenType (.otf) files only. To convert a web font such as WOFF or WOFF2, use a utility such as fontTools: https://fonttools.readthedocs.io/`);
        }
    }
}
const MIN_FONT_WEIGHT = 1;
const MAX_FONT_WEIGHT = 1000;
function assertValidWeights(fontsByFamily) {
    for (const [fontFamily, definitions] of Object.entries(fontsByFamily)){
        for (const definition of definitions){
            const { weight } = definition;
            if (weight === undefined || weight === null) {
                throw new Error(`Font family ${JSON.stringify(fontFamily)} declares no weight for ${definition.path}. ` + `A weight is a whole number from ${MIN_FONT_WEIGHT} to ${MAX_FONT_WEIGHT}, such as 400 for regular or 700 for bold.`);
            }
            if (typeof weight === 'number' && Number.isInteger(weight) && weight >= MIN_FONT_WEIGHT && weight <= MAX_FONT_WEIGHT) {
                continue;
            }
            throw new Error(`Font family ${JSON.stringify(fontFamily)} declares weight ${JSON.stringify(weight)} for ${definition.path}. A weight is a whole number from ${MIN_FONT_WEIGHT} to ${MAX_FONT_WEIGHT}.`);
        }
    }
}
function assertNoConflictingDefinitions(fontsByFamily) {
    for (const [fontFamily, definitions] of Object.entries(fontsByFamily)){
        const pathByWeightAndStyle = new Map();
        for (const definition of definitions){
            const style = definition.style || 'normal';
            const key = `${definition.weight}/${style}`;
            const alreadyDeclaredBy = pathByWeightAndStyle.get(key);
            if (alreadyDeclaredBy) {
                throw new Error(`Font family ${JSON.stringify(fontFamily)} declares two fonts for weight ${definition.weight} and style ${JSON.stringify(style)}: ${alreadyDeclaredBy} and ${definition.path}. ` + `Android matches a family on weight and style alone, so the app would crash on startup while registering it. ` + `Give each definition a weight or style of its own — "axes" cannot tell them apart.`);
            }
            pathByWeightAndStyle.set(key, definition.path);
        }
    }
}
// https://learn.microsoft.com/en-us/typography/opentype/spec/dvaraxisreg
const AXIS_TAG_LENGTH = 4;
const AXIS_TAG_PATTERN = /^[A-Za-z][A-Za-z0-9]* *$/;
// Case splits the namespace: registered axes are lowercase, a font's own axes are uppercase, and a
// tag in any other case names nothing. So `SLNT` is a font's own axis, not a misspelt `slnt`.
const registeredAxisTags = [
    'ital',
    'opsz',
    'slnt',
    'wdth',
    'wght'
];
const FOUNDRY_AXIS_TAG_PATTERN = /^[A-Z][A-Z0-9]* *$/;
function isFoundryAxisTag(tag) {
    return FOUNDRY_AXIS_TAG_PATTERN.test(tag);
}
/** Throws when a definition holds `axes` that cannot be read one axis at a time. */ function collectDeclaredAxes(fontsByFamily) {
    return Object.entries(fontsByFamily).flatMap(([fontFamily, definitions])=>definitions.flatMap((definition)=>{
            const axes = definition.axes ?? {};
            if (typeof axes !== 'object' || Array.isArray(axes)) {
                throw new Error(`Font family ${JSON.stringify(fontFamily)} declares "axes" for ${definition.path} as ${JSON.stringify(axes)}, which is not an object. ` + `"axes" holds one entry per axis, such as { "slnt": -10 }.`);
            }
            return Object.entries(axes).map(([tag, value])=>({
                    tag,
                    value,
                    declares: `Font family ${JSON.stringify(fontFamily)} declares axis ${JSON.stringify(tag)} for ${definition.path}`
                }));
        }));
}
function assertValidAxes(fontsByFamily) {
    for (const { tag, value, declares } of collectDeclaredAxes(fontsByFamily)){
        // On Android 15, `'wght' 900, 'sl t' -10` rendered at weight 900 with no slant: the bad
        // entry is dropped, the rest still applies.
        const consequence = `Android may drop a setting it cannot parse.`;
        const lowercaseTag = tag.toLowerCase();
        // An `app.config.ts` conditional writes `undefined` for the axis it leaves out.
        if (value === undefined) {
            continue;
        }
        if (tag.length !== AXIS_TAG_LENGTH) {
            throw new Error(`${declares}, which is not four characters. An axis tag is exactly four, such as "slnt". ` + `List the axes a font declares with a utility such as fontTools: https://fonttools.readthedocs.io/`);
        }
        if (!AXIS_TAG_PATTERN.test(tag)) {
            throw new Error(`${declares}, which holds characters no axis tag uses. A tag begins with a letter, then letters, digits, or the trailing spaces that pad a shorter tag. ${consequence}`);
        }
        if (registeredAxisTags.includes(lowercaseTag) && lowercaseTag !== tag && !isFoundryAxisTag(tag)) {
            throw new Error(`${declares}, which names no axis: tags are case sensitive. Write it as ${JSON.stringify(lowercaseTag)}. ${consequence}`);
        }
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            throw new Error(`${declares}, which is set to ${JSON.stringify(value)} — not a finite number. ` + `An axis takes a number in the range the font declares, such as -10 for "slnt".`);
        }
    }
}
function warnAboutUnknownAxisTags(fontsByFamily) {
    for (const { tag, value, declares } of collectDeclaredAxes(fontsByFamily)){
        if (value === undefined) {
            continue;
        }
        const lowercaseTag = tag.toLowerCase();
        // A font may declare `SLNT`, so this stays legal — but it is far more often `slnt` in the
        // wrong case, and Android then applies nothing.
        if (isFoundryAxisTag(tag) && registeredAxisTags.includes(lowercaseTag)) {
            _configplugins().WarningAggregator.addWarningAndroid('expo-font', `${declares}, which is an axis the font declares for itself, not the registered ${JSON.stringify(lowercaseTag)}. ` + `Write it as ${JSON.stringify(lowercaseTag)} instead if you meant the registered axis.`);
        } else if (!registeredAxisTags.includes(tag) && !isFoundryAxisTag(tag)) {
            _configplugins().WarningAggregator.addWarningAndroid('expo-font', `${declares}, which names no axis: registered axes are lowercase, such as "slnt", and a font's own are uppercase, such as "GRAD". ` + `Write it in the case the font uses, or Android applies nothing for it.`);
        }
    }
}
// Either axis draws a slant: `slnt` by an angle, `ital` by the upright-to-italic switch.
const slantAxisTags = [
    'ital',
    'slnt'
];
function hasSlantAxis(definition) {
    return Object.entries(definition.axes ?? {}).some(([tag, value])=>value !== undefined && slantAxisTags.includes(tag.toLowerCase()));
}
function warnAboutUnslantedItalics(fontsByFamily) {
    for (const [fontFamily, definitions] of Object.entries(fontsByFamily)){
        const uprightPaths = new Set(definitions.filter((it)=>(it.style || 'normal') === 'normal').map((it)=>it.path));
        for (const definition of definitions){
            // A font definition that has a file of its own may hold a static italic, which needs no axis.
            const rendersUpright = definition.style === 'italic' && uprightPaths.has(definition.path) && !hasSlantAxis(definition);
            if (rendersUpright) {
                _configplugins().WarningAggregator.addWarningAndroid('expo-font', `Font family ${JSON.stringify(fontFamily)} reads ${definition.path} for style "italic", and the same file also backs an upright face. ` + `"style" by itself does not slant the glyphs, so the text will render upright. ` + `Add a slant to "axes" for that definition, such as { "slnt": -10 }, or point it at an italic font file using "path".`);
            }
        }
    }
}
function formatVariationSettings(definition) {
    const { wght, ...rest } = definition.axes ?? {};
    const axes = {
        wght: wght ?? definition.weight,
        ...rest
    };
    return Object.entries(axes).filter(([, value])=>value !== undefined).map(([tag, value])=>`'${tag}' ${value}`).join(', ');
}
function addXmlFonts(config, xmlFontObjects) {
    const fontsByFamily = groupByFamily(xmlFontObjects);
    assertAndroidCanLoadFonts(fontsByFamily);
    assertValidWeights(fontsByFamily);
    assertNoConflictingDefinitions(fontsByFamily);
    assertValidAxes(fontsByFamily);
    warnAboutUnknownAxisTags(fontsByFamily);
    warnAboutUnslantedItalics(fontsByFamily);
    const fontPaths = Object.values(fontsByFamily).flatMap((definitions)=>definitions.map((it)=>it.path));
    config = copyFontsToDir(config, fontPaths, resourcesFontsDir, (filenameWithExt)=>{
        const filename = (0, _utils.toValidAndroidResourceName)(filenameWithExt);
        const ext = _path().default.extname(filenameWithExt);
        return `${filename}${ext}`;
    });
    config = addFontXmlToMainApplication(config, fontsByFamily);
    return (0, _configplugins().withDangerousMod)(config, [
        'android',
        async (config)=>{
            const fontsDir = _path().default.join(config.modRequest.platformProjectRoot, 'app/src/main/res/font');
            const xmlSpecs = getXmlSpecs(fontsDir, fontsByFamily);
            await Promise.all(xmlSpecs.map(_configplugins().XML.writeXMLAsync));
            return config;
        }
    ]);
}
const resourceNameConflictAvoidancePrefix = 'xml_';
function getXmlSpecs(fontsDir, xmlFontObjects) {
    return Object.entries(xmlFontObjects).map(([fontFamily, fontDefinitions])=>{
        const filePath = _path().default.join(fontsDir, `${resourceNameConflictAvoidancePrefix + (0, _utils.toValidAndroidResourceName)(fontFamily)}.xml`);
        // each font family has one xml resource file with potentially multiple font definitions
        // the font files (e.g. ttf) at `path` are copied to res/font
        // with their name changed to be a valid resource and referenced in the xml file
        return {
            path: filePath,
            xml: {
                'font-family': {
                    // using `app` namespace for better compat:
                    // https://developer.android.com/develop/ui/views/text-and-emoji/fonts-in-xml#using-support-lib
                    $: {
                        'xmlns:app': 'http://schemas.android.com/apk/res-auto'
                    },
                    font: fontDefinitions.map((definition)=>{
                        return {
                            $: {
                                'app:font': `@font/${(0, _utils.toValidAndroidResourceName)(definition.path)}`,
                                'app:fontStyle': definition.style || 'normal',
                                'app:fontWeight': String(definition.weight),
                                // Instances a variable font at the declared weight and axes, so that one file can
                                // back several definitions. Static fonts declare no axes and ignore this.
                                'app:fontVariationSettings': formatVariationSettings(definition)
                            }
                        };
                    })
                }
            }
        };
    });
}
function addFontXmlToMainApplication(config, xmlFontObjects) {
    return (0, _configplugins().withMainApplication)(config, (config)=>{
        const { modResults, modResults: { language } } = config;
        modResults.contents = _configplugins().AndroidConfig.CodeMod.addImports(modResults.contents, [
            'com.facebook.react.common.assets.ReactFontManager'
        ], language === 'java');
        const fontManagerCalls = generateFontManagerCalls(xmlFontObjects, language).join(_os().default.EOL);
        const withInit = _configplugins().CodeGenerator.mergeContents({
            src: modResults.contents,
            comment: '    //',
            tag: 'xml-fonts-init',
            offset: 1,
            anchor: /super\.onCreate\(\)/,
            newSrc: fontManagerCalls
        });
        return {
            ...config,
            modResults: {
                ...modResults,
                contents: withInit.contents
            }
        };
    });
}
function generateFontManagerCalls(xmlFontObjects, language) {
    const lineEnding = language === 'java' ? ';' : '';
    const indent = '    ';
    return Object.keys(xmlFontObjects).map((family)=>`${indent}ReactFontManager.getInstance().addCustomFont(this, ${JSON.stringify(family)}, R.font.${resourceNameConflictAvoidancePrefix + (0, _utils.toValidAndroidResourceName)(family)})${lineEnding}`);
}
function planFontCopies(resolvedFonts, fontsDir, filenameProcessor) {
    const targets = resolvedFonts.map((asset)=>({
            asset,
            destination: _path().default.join(fontsDir, filenameProcessor(_path().default.basename(asset)))
        })).filter(({ destination })=>extensionsAndroidCanLoad.some((it)=>destination.endsWith(it)));
    const sourceByDestination = new Map();
    for (const { asset, destination } of targets){
        const claimed = sourceByDestination.get(destination);
        if (claimed && claimed !== asset) {
            throw new Error(`Font files ${claimed} and ${asset} both become ${_path().default.basename(destination)} in the native project, so only one of them can be embedded. Rename one of them so their file names differ.`);
        }
        sourceByDestination.set(destination, asset);
    }
    return sourceByDestination;
}
function copyFontsToDir(config, paths, inAppDestination, filenameProcessor = (filenameWithExt)=>filenameWithExt) {
    return (0, _configplugins().withDangerousMod)(config, [
        'android',
        async (config)=>{
            const fontsDir = _path().default.join(config.modRequest.platformProjectRoot, inAppDestination);
            await _promises().default.mkdir(fontsDir, {
                recursive: true
            });
            const resolvedFonts = await (0, _utils.resolveFontPaths)(paths, config.modRequest.projectRoot);
            const copies = planFontCopies(resolvedFonts, fontsDir, filenameProcessor);
            await Promise.all(Array.from(copies, ([destination, asset])=>_promises().default.copyFile(asset, destination)));
            return config;
        }
    ]);
}

//# sourceMappingURL=withFontsAndroid.js.map
