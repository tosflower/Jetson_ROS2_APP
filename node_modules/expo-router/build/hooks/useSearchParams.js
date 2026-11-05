'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useSearchParams", {
    enumerable: true,
    get: function() {
        return useSearchParams;
    }
});
function _react() {
    const data = /*#__PURE__*/ _interop_require_default(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
const _useGlobalSearchParams = require("./useGlobalSearchParams");
const _useLocalSearchParams = require("./useLocalSearchParams");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function useSearchParams({ global = false } = {}) {
    const [initialGlobal] = _react().default.useState(global);
    if (process.env.NODE_ENV !== 'production') {
        if (global !== initialGlobal) {
            console.warn(`Detected change in 'global' option of useSearchParams. This value cannot change between renders`);
        }
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const params = global ? (0, _useGlobalSearchParams.useGlobalSearchParams)() : (0, _useLocalSearchParams.useLocalSearchParams)();
    const entries = Object.entries(params).flatMap(([key, value])=>{
        if (value === undefined) {
            return [];
        }
        return Array.isArray(value) ? value.map((v)=>[
                key,
                v
            ]) : [
            [
                key,
                value
            ]
        ];
    });
    return new ReadOnlyURLSearchParams(entries);
}
class ReadOnlyURLSearchParams extends URLSearchParams {
    set() {
        throw new Error('The URLSearchParams object return from useSearchParams is read-only');
    }
    append() {
        throw new Error('The URLSearchParams object return from useSearchParams is read-only');
    }
    delete() {
        throw new Error('The URLSearchParams object return from useSearchParams is read-only');
    }
}

//# sourceMappingURL=useSearchParams.js.map
