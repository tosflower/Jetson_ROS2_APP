"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    compositeImagesAsync: null,
    generateFaviconAsync: null,
    generateImageAsync: null,
    generateImageBackgroundAsync: null,
    getMimeType: null,
    getPngInfo: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get compositeImagesAsync () {
        return compositeImagesAsync;
    },
    get generateFaviconAsync () {
        return generateFaviconAsync;
    },
    get generateImageAsync () {
        return generateImageAsync;
    },
    get generateImageBackgroundAsync () {
        return generateImageBackgroundAsync;
    },
    get getMimeType () {
        return getMimeType;
    },
    get getPngInfo () {
        return getPngInfo;
    }
});
function _chalk() {
    const data = /*#__PURE__*/ _interop_require_default(require("chalk"));
    _chalk = function() {
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
function _parsepng() {
    const data = /*#__PURE__*/ _interop_require_default(require("parse-png"));
    _parsepng = function() {
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
const _Cache = /*#__PURE__*/ _interop_require_wildcard(require("./Cache"));
const _Download = /*#__PURE__*/ _interop_require_wildcard(require("./Download"));
const _Ico = /*#__PURE__*/ _interop_require_wildcard(require("./Ico"));
const _env = require("./env");
const _jimp = /*#__PURE__*/ _interop_require_wildcard(require("./jimp"));
const _sharp = /*#__PURE__*/ _interop_require_wildcard(require("./sharp"));
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
let hasWarned = false;
async function resizeImagesAsync(buffer, sizes) {
    const sharp = await getSharpAsync();
    if (!sharp) {
        return _jimp.resizeBufferAsync(buffer, sizes);
    }
    return _sharp.resizeBufferAsync(buffer, sizes);
}
async function resizeAsync(imageOptions) {
    const sharp = await getSharpAsync();
    const { width, height, backgroundColor, resizeMode } = imageOptions;
    if (!sharp) {
        const inputOptions = {
            input: imageOptions.src,
            quality: 100
        };
        const jimp = await _jimp.resize(inputOptions, {
            width,
            height,
            fit: resizeMode,
            background: backgroundColor
        });
        if (imageOptions.removeTransparency) {
            jimp.colorType(2);
        }
        if (imageOptions.borderRadius) {
            // TODO: support setting border radius with Jimp. Currently only support making the image a circle
            await _jimp.circleAsync(jimp);
        }
        // Convert to png buffer
        return jimp.getBufferAsync('image/png');
    }
    try {
        let sharpBuffer = sharp(imageOptions.src).keepIccProfile().ensureAlpha().resize(width, height, {
            fit: resizeMode,
            background: 'transparent'
        });
        // Skip an extra step if the background is explicitly transparent.
        if (backgroundColor && backgroundColor !== 'transparent') {
            // Add the background color to the image
            sharpBuffer = sharpBuffer.composite([
                {
                    // create a background color
                    input: {
                        create: {
                            width,
                            height,
                            // allow alpha colors
                            channels: imageOptions.removeTransparency ? 3 : 4,
                            background: backgroundColor
                        }
                    },
                    // dest-over makes the first image (input) appear on top of the created image (background color)
                    blend: 'dest-over'
                }
            ]);
        } else if (imageOptions.removeTransparency) {
            sharpBuffer.flatten();
        }
        if (imageOptions.borderRadius) {
            const mask = Buffer.from(`<svg><rect x="0" y="0" width="${width}" height="${height}"
        rx="${imageOptions.borderRadius}" ry="${imageOptions.borderRadius}"
        fill="${backgroundColor && backgroundColor !== 'transparent' ? backgroundColor : 'none'}" /></svg>`);
            sharpBuffer.composite([
                {
                    input: mask,
                    blend: 'dest-in'
                }
            ]);
        }
        return await sharpBuffer.png().toBuffer();
    } catch (error) {
        throw new Error(`It was not possible to generate splash screen '${imageOptions.src}'. ${error.message}`);
    }
}
async function getSharpAsync() {
    if (await _sharp.isAvailableAsync()) {
        return await _sharp.findSharpInstanceAsync();
    }
    return null;
}
function getDimensionsId(imageOptions) {
    return imageOptions.width === imageOptions.height ? `${imageOptions.width}` : `${imageOptions.width}x${imageOptions.height}`;
}
async function maybeWarnAboutInstallingSharpAsync() {
    if (_env.env.EXPO_IMAGE_UTILS_NO_SHARP) {
        return;
    }
    if (_env.env.EXPO_IMAGE_UTILS_DEBUG && !hasWarned && !await _sharp.isAvailableAsync()) {
        hasWarned = true;
        console.warn(_chalk().default.yellow(`Using node to generate images. This is much slower than using native packages.\n\u203A Optionally you can stop the process and try again after successfully running \`npm install -g sharp-cli\`.\n`));
    }
}
const types = {
    png: 'image/png',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    jpe: 'image/jpeg',
    webp: 'image/webp',
    gif: 'image/gif'
};
const inverseMimeTypes = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
    'image/gif': 'gif'
};
function getMimeType(srcPath) {
    if (typeof srcPath !== 'string') return null;
    try {
        // If the path is a URL, use the pathname
        const url = new URL(srcPath);
        srcPath = url.pathname;
    } catch  {}
    const ext = _path().default.extname(srcPath).replace(/^\./, '').toLowerCase();
    return types[ext] ?? null;
}
async function ensureImageOptionsAsync(imageOptions) {
    const icon = {
        ...imageOptions,
        src: await _Download.downloadOrUseCachedImage(imageOptions.src)
    };
    // Default to contain
    if (!icon.resizeMode) {
        icon.resizeMode = 'contain';
    }
    const mimeType = getMimeType(icon.src);
    if (!mimeType) {
        throw new Error(`Invalid mimeType for image with source: ${icon.src}`);
    }
    if (!icon.name) {
        icon.name = `icon_${getDimensionsId(imageOptions)}.${inverseMimeTypes[mimeType]}`;
    }
    return icon;
}
async function generateImageBackgroundAsync(imageOptions) {
    const { width, height, backgroundColor, borderRadius } = imageOptions;
    const sharp = await getSharpAsync();
    if (!sharp) {
        const jimp = await _jimp.createSquareAsync({
            size: width,
            color: backgroundColor
        });
        if (borderRadius) {
            const image = await _jimp.getJimpImageAsync(jimp);
            // TODO: support setting border radius with Jimp. Currently only support making the image a circle
            return await _jimp.circleAsync(image);
        }
        return jimp;
    }
    const sharpBuffer = sharp({
        create: {
            width,
            height,
            channels: 4,
            // TODO(cedric): this background color has to be defined for Sharp, but it's optionally typed here
            // When we rework `@expo/image-utils`, this needs to be taken into account.
            background: backgroundColor
        }
    });
    if (imageOptions.borderRadius) {
        const mask = Buffer.from(`<svg><rect x="0" y="0" width="${width}" height="${height}"
      rx="${borderRadius}" ry="${borderRadius}"
      fill="${backgroundColor && backgroundColor !== 'transparent' ? backgroundColor : 'none'}" /></svg>`);
        sharpBuffer.composite([
            {
                input: mask,
                blend: 'dest-in'
            }
        ]);
    }
    return await sharpBuffer.png().toBuffer();
}
async function generateImageAsync(options, imageOptions) {
    const icon = await ensureImageOptionsAsync(imageOptions);
    if (!options.cacheType) {
        await maybeWarnAboutInstallingSharpAsync();
        return {
            name: icon.name,
            source: await resizeAsync(icon)
        };
    }
    const cacheKey = await _Cache.createCacheKeyWithDirectoryAsync(options.projectRoot, options.cacheType, icon);
    const name = icon.name;
    let source = await _Cache.getImageFromCacheAsync(name, cacheKey);
    if (!source) {
        await maybeWarnAboutInstallingSharpAsync();
        source = await resizeAsync(icon);
        await _Cache.cacheImageAsync(name, source, cacheKey);
    }
    return {
        name,
        source
    };
}
async function generateFaviconAsync(pngImageBuffer, sizes = [
    16,
    32,
    48
]) {
    const buffers = await resizeImagesAsync(pngImageBuffer, sizes);
    return await _Ico.generateAsync(buffers);
}
async function compositeImagesAsync({ foreground, background, x = 0, y = 0 }) {
    const sharp = await getSharpAsync();
    if (!sharp) {
        const image = (await _jimp.getJimpImageAsync(background)).composite(await _jimp.getJimpImageAsync(foreground), x, y);
        return await image.getBufferAsync(image.getMIME());
    }
    return await sharp(background).keepIccProfile().composite([
        {
            input: foreground,
            left: x,
            top: y
        }
    ]).toBuffer();
}
async function getPngInfo(src) {
    return await (0, _parsepng().default)(_fs().default.readFileSync(src));
}

//# sourceMappingURL=Image.js.map
