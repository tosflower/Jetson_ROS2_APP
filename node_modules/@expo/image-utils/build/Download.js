"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    downloadImage: null,
    downloadOrUseCachedImage: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get downloadImage () {
        return downloadImage;
    },
    get downloadOrUseCachedImage () {
        return downloadOrUseCachedImage;
    }
});
function _crypto() {
    const data = require("crypto");
    _crypto = function() {
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
function _jimpcompact() {
    const data = /*#__PURE__*/ _interop_require_default(require("jimp-compact"));
    _jimpcompact = function() {
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
function _stream() {
    const data = /*#__PURE__*/ _interop_require_default(require("stream"));
    _stream = function() {
        return data;
    };
    return data;
}
function _util() {
    const data = /*#__PURE__*/ _interop_require_default(require("util"));
    _util = function() {
        return data;
    };
    return data;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// cache downloaded images into memory
const cacheDownloadedKeys = {};
function stripQueryParams(url) {
    return url.split('?')[0]?.split('#')[0] ?? '';
}
function temporaryDirectory() {
    const directory = _path().default.join(_os().default.tmpdir(), (0, _crypto().randomBytes)(16).toString('hex'));
    _fs().default.mkdirSync(directory, {
        recursive: true
    });
    return directory;
}
async function downloadOrUseCachedImage(url) {
    if (cacheDownloadedKeys[url] != null) {
        return cacheDownloadedKeys[url];
    }
    if (url.startsWith('http')) {
        cacheDownloadedKeys[url] = await downloadImage(url);
    } else {
        cacheDownloadedKeys[url] = url;
    }
    return cacheDownloadedKeys[url];
}
async function downloadImage(url) {
    const outputPath = temporaryDirectory();
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`It was not possible to download image from '${url}'`);
    }
    if (!response.body) {
        throw new Error(`No response received from '${url}'`);
    }
    // Download to local file
    const streamPipeline = _util().default.promisify(_stream().default.pipeline);
    const localPath = _path().default.join(outputPath, _path().default.basename(stripQueryParams(url)));
    // Type casting is required, see: https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/65542
    const readableBody = _stream().default.Readable.fromWeb(response.body);
    await streamPipeline(readableBody, _fs().default.createWriteStream(localPath));
    // If an image URL doesn't have a name, get the mime type and move the file.
    const img = await _jimpcompact().default.read(localPath);
    const mime = img.getMIME().split('/').pop();
    if (!localPath.endsWith(mime)) {
        const newPath = _path().default.join(outputPath, `image.${mime}`);
        const parentPath = _path().default.dirname(newPath);
        if (!_fs().default.existsSync(parentPath)) {
            await _fs().default.promises.mkdir(parentPath, {
                recursive: true
            });
        }
        // NOTE: EXDEV can't happen since we're just renaming the file in the same directory
        await _fs().default.promises.rename(localPath, newPath);
        return newPath;
    }
    return localPath;
}

//# sourceMappingURL=Download.js.map
