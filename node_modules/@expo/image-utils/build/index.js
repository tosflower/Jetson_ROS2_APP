"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    Cache: null,
    compositeImagesAsync: null,
    createSquareAsync: null,
    findSharpInstanceAsync: null,
    generateFaviconAsync: null,
    generateImageAsync: null,
    generateImageBackgroundAsync: null,
    getPngInfo: null,
    imageAsync: null,
    isAvailableAsync: null,
    jimpAsync: null,
    sharpAsync: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get Cache () {
        return _Cache;
    },
    get compositeImagesAsync () {
        return _Image.compositeImagesAsync;
    },
    get createSquareAsync () {
        return _jimp.createSquareAsync;
    },
    get findSharpInstanceAsync () {
        return _sharp.findSharpInstanceAsync;
    },
    get generateFaviconAsync () {
        return _Image.generateFaviconAsync;
    },
    get generateImageAsync () {
        return _Image.generateImageAsync;
    },
    get generateImageBackgroundAsync () {
        return _Image.generateImageBackgroundAsync;
    },
    get getPngInfo () {
        return _Image.getPngInfo;
    },
    get imageAsync () {
        return imageAsync;
    },
    get isAvailableAsync () {
        return _sharp.isAvailableAsync;
    },
    get jimpAsync () {
        return _jimp.jimpAsync;
    },
    get sharpAsync () {
        return _sharp.sharpAsync;
    }
});
const _Cache = /*#__PURE__*/ _interop_require_wildcard(require("./Cache"));
const _Image = require("./Image");
const _jimp = require("./jimp");
const _sharp = require("./sharp");
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
async function imageAsync(options, commands = []) {
    if (await (0, _sharp.isAvailableAsync)()) {
        return (0, _sharp.sharpAsync)(options, commands);
    }
    return (0, _jimp.jimpAsync)({
        ...options,
        format: (0, _jimp.convertFormat)(options.format),
        originalInput: options.input
    }, commands);
}

//# sourceMappingURL=index.js.map
