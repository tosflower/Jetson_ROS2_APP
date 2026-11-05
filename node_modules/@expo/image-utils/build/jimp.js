"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    circleAsync: null,
    convertFormat: null,
    createSquareAsync: null,
    getJimpImageAsync: null,
    isFolderAsync: null,
    jimpAsync: null,
    resize: null,
    resizeBufferAsync: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get circleAsync () {
        return circleAsync;
    },
    get convertFormat () {
        return convertFormat;
    },
    get createSquareAsync () {
        return createSquareAsync;
    },
    get getJimpImageAsync () {
        return getJimpImageAsync;
    },
    get isFolderAsync () {
        return isFolderAsync;
    },
    get jimpAsync () {
        return jimpAsync;
    },
    get resize () {
        return resize;
    },
    get resizeBufferAsync () {
        return resizeBufferAsync;
    }
});
function _fs() {
    const data = /*#__PURE__*/ _interop_require_default(require("fs"));
    _fs = function() {
        return data;
    };
    return data;
}
function _jimpcompact() {
    const data = /*#__PURE__*/ _interop_require_default(require("jimp-compact"));
    _jimpcompact = function() {
        return data;
    };
    return data;
}
function _path() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("path"));
    _path = function() {
        return data;
    };
    return data;
}
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
async function resizeBufferAsync(buffer, sizes) {
    return Promise.all(sizes.map(async (size)=>{
        // Parse the buffer each time to prevent mutable copies.
        // Parse the buffer each time to prevent mutable copies.
        const jimpImage = await _jimpcompact().default.read(buffer);
        const mime = jimpImage.getMIME();
        return jimpImage.resize(size, size).getBufferAsync(mime);
    }));
}
function convertFormat(format) {
    if (typeof format === 'undefined') return format;
    const input = format?.toLowerCase();
    switch(input){
        case 'png':
        case 'webp':
        case 'jpeg':
            return `image/${input}`;
        case 'jpg':
            return `image/jpeg`;
    }
    return undefined;
}
async function jimpAsync(options, commands = []) {
    if (commands.length) {
        const command = commands.shift();
        if (command) {
            let input;
            if (command.operation === 'resize') {
                input = await resize(options, command);
            } else if (command.operation === 'flatten') {
                input = await flatten(options, command);
            } else {
                throw new Error(`The operation: '${command.operation}' is not supported with Jimp`);
            }
            // @ts-ignore
            return jimpAsync({
                ...options,
                input
            }, commands);
        }
    }
    const image = await getJimpImageAsync(options.input);
    const mime = typeof options.format === 'string' ? options.format : image.getMIME();
    const imgBuffer = await image.getBufferAsync(mime);
    if (typeof options.output === 'string') {
        if (await isFolderAsync(options.output)) {
            await _fs().default.promises.writeFile(_path().join(options.output, _path().basename(options.originalInput)), imgBuffer);
        } else {
            await _fs().default.promises.writeFile(options.output, imgBuffer);
        }
    }
    return imgBuffer;
}
async function isFolderAsync(path) {
    try {
        return (await _fs().default.promises.stat(path)).isDirectory();
    } catch  {
        return false;
    }
}
function circleAsync(jimp) {
    const diameter = Math.min(jimp.bitmap.width, jimp.bitmap.height);
    const center = {
        x: jimp.bitmap.width / 2,
        y: jimp.bitmap.height / 2
    };
    return new Promise((resolve)=>{
        jimp.resize(diameter, diameter).crop((jimp.bitmap.width - diameter) / 2, (jimp.bitmap.height - diameter) / 2, diameter, diameter).scanQuiet(0, 0, diameter, diameter, (x, y, idx)=>{
            const radius = diameter / 2;
            const curR = Math.sqrt(Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2));
            if (radius - curR <= 0.0) {
                jimp.bitmap.data[idx + 3] = 0;
            } else if (radius - curR < 1.0) {
                jimp.bitmap.data[idx + 3] = 255 * (radius - curR);
            }
        });
        resolve(jimp);
    });
}
async function createSquareAsync({ size, color = '#FFFFFF', mime = _jimpcompact().default.MIME_PNG }) {
    const image = await new (_jimpcompact()).default(size, size, color);
    // Convert Jimp image to a Buffer
    return await image.getBufferAsync(mime);
}
async function getJimpImageAsync(input) {
    // @ts-ignore: Jimp types are broken
    if (typeof input === 'string' || input instanceof Buffer) return await _jimpcompact().default.read(input);
    return input;
}
async function resize({ input, quality = 100 }, { background, position, fit, width, height }) {
    let initialImage = await getJimpImageAsync(input);
    if (width && !height) {
        height = _jimpcompact().default.AUTO;
    } else if (!width && height) {
        width = _jimpcompact().default.AUTO;
    } else if (!width && !height) {
        width = initialImage.bitmap.width;
        height = initialImage.bitmap.height;
    }
    const jimpPosition = convertPosition(position);
    const jimpQuality = typeof quality !== 'number' ? 100 : quality;
    if (fit === 'cover') {
        initialImage = initialImage.cover(width, height, jimpPosition);
    } else if (fit === 'contain') {
        initialImage = initialImage.contain(width, height, jimpPosition);
    } else {
        throw new Error(`Unsupported fit: ${fit}. Supported values are 'cover' or 'contain' when using Jimp`);
    }
    if (background) {
        initialImage = initialImage.composite(new (_jimpcompact()).default(width, height, background), 0, 0, {
            mode: _jimpcompact().default.BLEND_DESTINATION_OVER,
            opacitySource: 1,
            opacityDest: 1
        });
    }
    return await initialImage.quality(jimpQuality);
}
async function flatten({ input, quality = 100 }, { background }) {
    const initialImage = await getJimpImageAsync(input);
    const jimpQuality = typeof quality !== 'number' ? 100 : quality;
    return initialImage.quality(jimpQuality).background(_jimpcompact().default.cssColorToHex(background));
}
/**
 * Convert sharp position to Jimp position.
 *
 * @param position
 */ function convertPosition(position) {
    if (!position) return convertPosition('center');
    switch(position){
        case 'center':
        case 'centre':
            return _jimpcompact().default.VERTICAL_ALIGN_MIDDLE | _jimpcompact().default.HORIZONTAL_ALIGN_CENTER;
        case 'north':
        case 'top':
            return _jimpcompact().default.VERTICAL_ALIGN_TOP | _jimpcompact().default.HORIZONTAL_ALIGN_CENTER;
        case 'east':
        case 'right':
            return _jimpcompact().default.VERTICAL_ALIGN_MIDDLE | _jimpcompact().default.HORIZONTAL_ALIGN_RIGHT;
        case 'south':
        case 'bottom':
            return _jimpcompact().default.VERTICAL_ALIGN_BOTTOM | _jimpcompact().default.HORIZONTAL_ALIGN_CENTER;
        case 'west':
        case 'left':
            return _jimpcompact().default.VERTICAL_ALIGN_MIDDLE | _jimpcompact().default.HORIZONTAL_ALIGN_LEFT;
        case 'northeast':
        case 'right top':
            return _jimpcompact().default.VERTICAL_ALIGN_TOP | _jimpcompact().default.HORIZONTAL_ALIGN_RIGHT;
        case 'southeast':
        case 'right bottom':
            return _jimpcompact().default.VERTICAL_ALIGN_BOTTOM | _jimpcompact().default.HORIZONTAL_ALIGN_RIGHT;
        case 'southwest':
        case 'left bottom':
            return _jimpcompact().default.VERTICAL_ALIGN_BOTTOM | _jimpcompact().default.HORIZONTAL_ALIGN_LEFT;
        case 'northwest':
        case 'left top':
            return _jimpcompact().default.VERTICAL_ALIGN_TOP | _jimpcompact().default.HORIZONTAL_ALIGN_LEFT;
        case 'entropy':
        case 'attention':
            throw new Error(`Position: '${position}' is not supported`);
        default:
            throw new Error(`Unknown position: '${position}'`);
    }
}

//# sourceMappingURL=jimp.js.map
