"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ANDROID_RES_PATH: null,
    configureAdaptiveIconAsync: null,
    createAdaptiveIconXmlString: null,
    dpiValues: null,
    getAdaptiveIcon: null,
    getIcon: null,
    setIconAsync: null,
    setRoundIconManifest: null,
    withAndroidIcons: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ANDROID_RES_PATH () {
        return ANDROID_RES_PATH;
    },
    get configureAdaptiveIconAsync () {
        return configureAdaptiveIconAsync;
    },
    get createAdaptiveIconXmlString () {
        return createAdaptiveIconXmlString;
    },
    get dpiValues () {
        return dpiValues;
    },
    get getAdaptiveIcon () {
        return getAdaptiveIcon;
    },
    get getIcon () {
        return getIcon;
    },
    get setIconAsync () {
        return setIconAsync;
    },
    get setRoundIconManifest () {
        return setRoundIconManifest;
    },
    get withAndroidIcons () {
        return withAndroidIcons;
    }
});
function _configplugins() {
    const data = require("@expo/config-plugins");
    _configplugins = function() {
        return data;
    };
    return data;
}
function _imageutils() {
    const data = require("@expo/image-utils");
    _imageutils = function() {
        return data;
    };
    return data;
}
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
const _withAndroidManifestIcons = require("./withAndroidManifestIcons");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const { Colors } = _configplugins().AndroidConfig;
const dpiValues = {
    mdpi: {
        folderName: 'mipmap-mdpi',
        scale: 1
    },
    hdpi: {
        folderName: 'mipmap-hdpi',
        scale: 1.5
    },
    xhdpi: {
        folderName: 'mipmap-xhdpi',
        scale: 2
    },
    xxhdpi: {
        folderName: 'mipmap-xxhdpi',
        scale: 3
    },
    xxxhdpi: {
        folderName: 'mipmap-xxxhdpi',
        scale: 4
    }
};
const LEGACY_BASELINE_PIXEL_SIZE = 48;
const ADAPTIVE_BASELINE_PIXEL_SIZE = 108;
const ANDROID_RES_PATH = 'android/app/src/main/res/';
const MIPMAP_ANYDPI_V26 = 'mipmap-anydpi-v26';
const ICON_BACKGROUND = 'iconBackground';
const IC_LAUNCHER_WEBP = 'ic_launcher.webp';
const IC_LAUNCHER_ROUND_WEBP = 'ic_launcher_round.webp';
const IC_LAUNCHER_BACKGROUND_WEBP = 'ic_launcher_background.webp';
const IC_LAUNCHER_FOREGROUND_WEBP = 'ic_launcher_foreground.webp';
const IC_LAUNCHER_MONOCHROME_WEBP = 'ic_launcher_monochrome.webp';
const IC_LAUNCHER_XML = 'ic_launcher.xml';
const IC_LAUNCHER_ROUND_XML = 'ic_launcher_round.xml';
const withAndroidIcons = (config)=>{
    const { foregroundImage, backgroundColor, backgroundImage, monochromeImage } = getAdaptiveIcon(config);
    const icon = getIcon(config);
    const hasIcon = icon ?? foregroundImage;
    if (!hasIcon) {
        return config;
    }
    config = (0, _withAndroidManifestIcons.withAndroidManifestIcons)(config);
    // Apply colors.xml changes
    config = withAndroidAdaptiveIconColors(config, backgroundColor);
    return (0, _configplugins().withDangerousMod)(config, [
        'android',
        async (config)=>{
            await setIconAsync(config.modRequest.projectRoot, {
                icon,
                foregroundImage,
                backgroundColor,
                backgroundImage,
                monochromeImage,
                isAdaptive: !!config.android?.adaptiveIcon
            });
            return config;
        }
    ]);
};
function setRoundIconManifest(config, manifest) {
    const isAdaptive = !!config.android?.adaptiveIcon;
    const application = _configplugins().AndroidConfig.Manifest.getMainApplicationOrThrow(manifest);
    if (isAdaptive) {
        application.$['android:roundIcon'] = '@mipmap/ic_launcher_round';
    } else {
        delete application.$['android:roundIcon'];
    }
    return manifest;
}
const withAndroidAdaptiveIconColors = (config, backgroundColor)=>{
    return (0, _configplugins().withAndroidColors)(config, (config)=>{
        config.modResults = setBackgroundColor(backgroundColor ?? '#ffffff', config.modResults);
        return config;
    });
};
function getIcon(config) {
    return config.android?.icon || config.icon || null;
}
function getAdaptiveIcon(config) {
    return {
        foregroundImage: config.android?.adaptiveIcon?.foregroundImage ?? null,
        backgroundColor: config.android?.adaptiveIcon?.backgroundColor ?? null,
        backgroundImage: config.android?.adaptiveIcon?.backgroundImage ?? null,
        monochromeImage: config.android?.adaptiveIcon?.monochromeImage ?? null
    };
}
async function setIconAsync(projectRoot, { icon, foregroundImage, backgroundColor, backgroundImage, monochromeImage, isAdaptive }) {
    const legacyIcon = icon ?? foregroundImage;
    const adaptiveForegroundImage = foregroundImage ?? legacyIcon;
    if (!legacyIcon || !adaptiveForegroundImage) {
        return null;
    }
    const legacyBackgroundImage = icon ? null : backgroundImage;
    const legacyBackgroundColor = icon ? null : backgroundColor;
    await configureLegacyIconAsync(projectRoot, legacyIcon, legacyBackgroundImage, legacyBackgroundColor);
    if (isAdaptive) {
        await generateRoundIconAsync(projectRoot, legacyIcon, legacyBackgroundImage, legacyBackgroundColor);
    } else {
        await deleteIconNamedAsync(projectRoot, IC_LAUNCHER_ROUND_WEBP);
    }
    await configureAdaptiveIconAsync(projectRoot, adaptiveForegroundImage, backgroundImage, monochromeImage, isAdaptive);
    return true;
}
/**
 * Configures legacy icon files to be used on Android 7 and earlier. If only adaptive icon
 * configuration was provided, we create a pseudo-adaptive icon by layering the provided files (or
 * background color if no backgroundImage is provided. If no backgroundImage and no backgroundColor
 * are provided, the background is set to transparent.)
 */ async function configureLegacyIconAsync(projectRoot, icon, backgroundImage, backgroundColor) {
    return generateMultiLayerImageAsync(projectRoot, {
        icon,
        backgroundImage,
        backgroundColor,
        outputImageFileName: IC_LAUNCHER_WEBP,
        imageCacheFolder: 'android-standard-square',
        backgroundImageCacheFolder: 'android-standard-square-background'
    });
}
async function generateRoundIconAsync(projectRoot, icon, backgroundImage, backgroundColor) {
    return generateMultiLayerImageAsync(projectRoot, {
        icon,
        borderRadiusRatio: 0.5,
        outputImageFileName: IC_LAUNCHER_ROUND_WEBP,
        backgroundImage,
        backgroundColor,
        imageCacheFolder: 'android-standard-circle',
        backgroundImageCacheFolder: 'android-standard-round-background',
        isAdaptive: false
    });
}
async function configureAdaptiveIconAsync(projectRoot, foregroundImage, backgroundImage, monochromeImage, isAdaptive) {
    if (monochromeImage) {
        await generateMonochromeImageAsync(projectRoot, {
            icon: monochromeImage,
            imageCacheFolder: 'android-adaptive-monochrome',
            outputImageFileName: IC_LAUNCHER_MONOCHROME_WEBP
        });
    }
    await generateMultiLayerImageAsync(projectRoot, {
        backgroundColor: 'transparent',
        backgroundImage,
        backgroundImageCacheFolder: 'android-adaptive-background',
        outputImageFileName: IC_LAUNCHER_FOREGROUND_WEBP,
        icon: foregroundImage,
        imageCacheFolder: 'android-adaptive-foreground',
        backgroundImageFileName: IC_LAUNCHER_BACKGROUND_WEBP,
        isAdaptive: true
    });
    // create ic_launcher.xml and ic_launcher_round.xml
    const icLauncherXmlString = createAdaptiveIconXmlString(backgroundImage, monochromeImage);
    await createAdaptiveIconXmlFiles(projectRoot, icLauncherXmlString, // If the user only defined icon and not android.adaptiveIcon, then skip enabling the layering system
    // this will scale the image down and present it uncropped.
    isAdaptive);
}
function setBackgroundColor(backgroundColor, colors) {
    return Colors.assignColorValue(colors, {
        value: backgroundColor,
        name: ICON_BACKGROUND
    });
}
const createAdaptiveIconXmlString = (backgroundImage, monochromeImage)=>{
    const background = backgroundImage ? `@mipmap/ic_launcher_background` : `@color/iconBackground`;
    const iconElements = [
        `<background android:drawable="${background}"/>`,
        '<foreground android:drawable="@mipmap/ic_launcher_foreground"/>'
    ];
    if (monochromeImage) {
        iconElements.push('<monochrome android:drawable="@mipmap/ic_launcher_monochrome"/>');
    }
    return `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    ${iconElements.join('\n    ')}
</adaptive-icon>`;
};
async function createAdaptiveIconXmlFiles(projectRoot, icLauncherXmlString, add) {
    const anyDpiV26Directory = _path().default.resolve(projectRoot, ANDROID_RES_PATH, MIPMAP_ANYDPI_V26);
    await _fs().default.promises.mkdir(anyDpiV26Directory, {
        recursive: true
    });
    const launcherPath = _path().default.resolve(anyDpiV26Directory, IC_LAUNCHER_XML);
    const launcherRoundPath = _path().default.resolve(anyDpiV26Directory, IC_LAUNCHER_ROUND_XML);
    if (add) {
        await Promise.all([
            _fs().default.promises.writeFile(launcherPath, icLauncherXmlString, 'utf8'),
            _fs().default.promises.writeFile(launcherRoundPath, icLauncherXmlString, 'utf8')
        ]);
    } else {
        // Remove the xml if the icon switches from adaptive to standard.
        await Promise.all([
            launcherPath,
            launcherRoundPath
        ].map(async (path)=>{
            return _fs().default.promises.rm(path, {
                force: true
            });
        }));
    }
}
async function generateMultiLayerImageAsync(projectRoot, { icon, backgroundColor, backgroundImage, imageCacheFolder, backgroundImageCacheFolder, borderRadiusRatio, outputImageFileName, backgroundImageFileName, isAdaptive }) {
    await iterateDpiValues(projectRoot, async ({ dpiFolder, scale })=>{
        let iconLayer = await generateIconAsync(projectRoot, {
            cacheType: imageCacheFolder,
            src: icon,
            scale,
            // backgroundImage overrides backgroundColor
            backgroundColor: backgroundImage ? 'transparent' : backgroundColor ?? 'transparent',
            borderRadiusRatio,
            isAdaptive
        });
        if (backgroundImage) {
            const backgroundLayer = await generateIconAsync(projectRoot, {
                cacheType: backgroundImageCacheFolder,
                src: backgroundImage,
                scale,
                backgroundColor: 'transparent',
                borderRadiusRatio,
                isAdaptive
            });
            if (backgroundImageFileName) {
                await _fs().default.promises.writeFile(_path().default.resolve(dpiFolder, backgroundImageFileName), backgroundLayer);
            } else {
                iconLayer = await (0, _imageutils().compositeImagesAsync)({
                    foreground: iconLayer,
                    background: backgroundLayer
                });
            }
        } else if (backgroundImageFileName) {
            // Remove any instances of ic_launcher_background.png that are there from previous icons
            await deleteIconNamedAsync(projectRoot, backgroundImageFileName);
        }
        await _fs().default.promises.mkdir(dpiFolder, {
            recursive: true
        });
        await _fs().default.promises.writeFile(_path().default.resolve(dpiFolder, outputImageFileName), iconLayer);
    });
}
async function generateMonochromeImageAsync(projectRoot, { icon, imageCacheFolder, outputImageFileName }) {
    await iterateDpiValues(projectRoot, async ({ dpiFolder, scale })=>{
        const monochromeIcon = await generateIconAsync(projectRoot, {
            cacheType: imageCacheFolder,
            src: icon,
            scale,
            backgroundColor: 'transparent',
            isAdaptive: true
        });
        await _fs().default.promises.mkdir(dpiFolder, {
            recursive: true
        });
        await _fs().default.promises.writeFile(_path().default.resolve(dpiFolder, outputImageFileName), monochromeIcon);
    });
}
function iterateDpiValues(projectRoot, callback) {
    return Promise.all(Object.values(dpiValues).map((value)=>callback({
            dpiFolder: _path().default.resolve(projectRoot, ANDROID_RES_PATH, value.folderName),
            ...value
        })));
}
async function deleteIconNamedAsync(projectRoot, name) {
    return iterateDpiValues(projectRoot, ({ dpiFolder })=>{
        return _fs().default.promises.rm(_path().default.resolve(dpiFolder, name), {
            force: true
        });
    });
}
async function generateIconAsync(projectRoot, { cacheType, src, scale, backgroundColor, borderRadiusRatio, isAdaptive }) {
    const iconSizePx = (isAdaptive ? ADAPTIVE_BASELINE_PIXEL_SIZE : LEGACY_BASELINE_PIXEL_SIZE) * scale;
    return (await (0, _imageutils().generateImageAsync)({
        projectRoot,
        cacheType
    }, {
        src,
        width: iconSizePx,
        height: iconSizePx,
        resizeMode: 'cover',
        backgroundColor,
        borderRadius: borderRadiusRatio ? iconSizePx * borderRadiusRatio : undefined
    })).source;
}

//# sourceMappingURL=withAndroidIcons.js.map
