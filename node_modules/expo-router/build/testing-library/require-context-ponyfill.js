// @ts-ignore: types node
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return requireContext;
    }
});
function _nodefs() {
    const data = /*#__PURE__*/ _interop_require_default(require("node:fs"));
    _nodefs = function() {
        return data;
    };
    return data;
}
function _nodepath() {
    const data = /*#__PURE__*/ _interop_require_default(require("node:path"));
    _nodepath = function() {
        return data;
    };
    return data;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function requireContext(base = '.', scanSubDirectories = true, regularExpression = /\.[tj]sx?$/, files = {}) {
    const baseTarget = _nodepath().default.resolve(base);
    function readDirectory(directory = '') {
        const target = _nodepath().default.resolve(baseTarget, directory);
        const entries = _nodefs().default.readdirSync(target, {
            withFileTypes: true
        });
        for (const entry of entries){
            const relativePath = directory ? _nodepath().default.join(directory, entry.name) : entry.name;
            if (entry.isDirectory()) {
                if (entry.name === 'node_modules') {
                    continue;
                } else if (scanSubDirectories) {
                    readDirectory(relativePath);
                }
            } else if (entry.isFile()) {
                const posixPath = `./${relativePath.split(_nodepath().default.sep).join('/')}`;
                if (regularExpression.test(posixPath)) {
                    files[posixPath] = true;
                }
            }
        }
    }
    if (_nodefs().default.existsSync(baseTarget)) {
        readDirectory();
    }
    const context = Object.assign(function Module(file) {
        return require(_nodepath().default.join(base, file));
    }, {
        keys: ()=>Object.keys(files),
        resolve: (key)=>key,
        id: '0',
        __add (file) {
            files[file] = true;
        },
        __delete (file) {
            delete files[file];
        }
    });
    return context;
}

//# sourceMappingURL=require-context-ponyfill.js.map
