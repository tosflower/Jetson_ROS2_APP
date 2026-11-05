"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    findDuplicateKeys: null,
    inMemoryContext: null,
    normalizeKey: null,
    normalizeKeys: null,
    requireContext: null,
    requireContextWithOverrides: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get findDuplicateKeys () {
        return findDuplicateKeys;
    },
    get inMemoryContext () {
        return inMemoryContext;
    },
    get normalizeKey () {
        return normalizeKey;
    },
    get normalizeKeys () {
        return normalizeKeys;
    },
    get requireContext () {
        return _requirecontextponyfill.default;
    },
    get requireContextWithOverrides () {
        return requireContextWithOverrides;
    }
});
function _path() {
    const data = /*#__PURE__*/ _interop_require_default(require("path"));
    _path = function() {
        return data;
    };
    return data;
}
const _requirecontextponyfill = /*#__PURE__*/ _interop_require_default(require("./require-context-ponyfill"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const validExtensions = [
    '.js',
    '.jsx',
    '.ts',
    '.tsx'
];
function inMemoryContext(context) {
    return Object.assign(function(id) {
        id = id.replace(/^\.\//, '').replace(/\.\w*$/, '');
        return typeof context[id] === 'function' ? {
            default: context[id]
        } : context[id];
    }, {
        resolve: (key)=>key,
        id: '0',
        keys: ()=>Object.keys(context).map((key)=>{
                const ext = _path().default.extname(key);
                key = key.replace(/^\.\//, '');
                key = key.startsWith('/') ? key : `./${key}`;
                key = validExtensions.includes(ext) ? key : `${key}.js`;
                return key;
            })
    });
}
function normalizeKey(key) {
    const withoutPrefix = key.replace(/^\.\//, '');
    const ext = _path().default.extname(withoutPrefix);
    return validExtensions.includes(ext) ? withoutPrefix.slice(0, -ext.length) : withoutPrefix;
}
function findDuplicateKeys(normalizedKeys) {
    return normalizedKeys.filter((normalizedKey, index)=>normalizedKeys.indexOf(normalizedKey) !== index);
}
function normalizeKeys(keys) {
    const normalizedKeys = keys.map(normalizeKey);
    const duplicateKeys = findDuplicateKeys(normalizedKeys);
    if (duplicateKeys.length > 0) {
        throw new Error(`Multiple routes resolved to the same route: ${duplicateKeys.join(', ')}`);
    }
    return Object.fromEntries(keys.map((key)=>[
            normalizeKey(key),
            key
        ]));
}
function requireContextWithOverrides(dir, overrides) {
    const rawContext = (0, _requirecontextponyfill.default)(_path().default.resolve(process.cwd(), dir));
    // Normalize the require-context keys (`./name.ext`) to the extension-free form
    // used by override keys, so `overrides` can be matched directly.
    const normalizedKeys = normalizeKeys(rawContext.keys());
    const existingContext = Object.assign((id)=>rawContext(normalizedKeys[id] ?? id), {
        keys: ()=>Object.keys(normalizedKeys)
    });
    const uniqueKeys = Array.from(new Set([
        ...Object.keys(overrides),
        ...existingContext.keys()
    ]));
    return Object.assign(function(id) {
        if (id in overrides) {
            const route = overrides[id];
            return typeof route === 'function' ? {
                default: route
            } : route;
        } else {
            return existingContext(id);
        }
    }, {
        keys: ()=>[
                ...uniqueKeys
            ],
        resolve: (key)=>key,
        id: '0'
    });
}

//# sourceMappingURL=context-stubs.js.map
