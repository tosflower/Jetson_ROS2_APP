"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "writeContentsJsonAsync", {
    enumerable: true,
    get: function() {
        return writeContentsJsonAsync;
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
    const data = require("path");
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
async function writeContentsJsonAsync(directory, { images }) {
    await _fs().default.promises.mkdir(directory, {
        recursive: true
    });
    await _fs().default.promises.writeFile((0, _path().join)(directory, 'Contents.json'), JSON.stringify({
        images,
        info: {
            version: 1,
            // common practice is for the tool that generated the icons to be the "author"
            author: 'expo'
        }
    }, null, 2));
}

//# sourceMappingURL=AssetContents.js.map
