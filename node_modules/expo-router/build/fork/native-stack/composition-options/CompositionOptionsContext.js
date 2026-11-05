'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    CompositionContext: null,
    registryReducer: null,
    useCompositionOption: null,
    useCompositionRegistry: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get CompositionContext () {
        return CompositionContext;
    },
    get registryReducer () {
        return registryReducer;
    },
    get useCompositionOption () {
        return useCompositionOption;
    },
    get useCompositionRegistry () {
        return useCompositionRegistry;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _native = require("../../../react-navigation/native");
const _useSafeLayoutEffect = require("../../../views/useSafeLayoutEffect");
const CompositionContext = /*#__PURE__*/ (0, _react().createContext)(null);
function registryReducer(state, action) {
    if (action.type === 'set') {
        const { routeKey, options } = action;
        if (state[routeKey]?.includes(options)) {
            return state;
        }
        return {
            ...state,
            [routeKey]: [
                ...state[routeKey] ?? [],
                options
            ]
        };
    }
    if (action.type === 'unset') {
        const { routeKey, options } = action;
        const existing = state[routeKey];
        const filtered = existing?.filter((o)=>o !== options);
        if (!existing || filtered?.length === existing.length) {
            return state;
        }
        if (!filtered?.length) {
            const { [routeKey]: _, ...newState } = state;
            return newState;
        }
        return {
            ...state,
            [routeKey]: filtered
        };
    }
    return state;
}
function useCompositionRegistry() {
    const [registry, dispatch] = (0, _react().useReducer)(registryReducer, {});
    const set = (0, _react().useCallback)((routeKey, options)=>{
        dispatch({
            type: 'set',
            routeKey,
            options
        });
    }, []);
    const unset = (0, _react().useCallback)((routeKey, options)=>{
        dispatch({
            type: 'unset',
            routeKey,
            options
        });
    }, []);
    const contextValue = (0, _react().useMemo)(()=>({
            set,
            unset
        }), [
        set,
        unset
    ]);
    return {
        registry,
        contextValue
    };
}
function useCompositionOption(options) {
    const context = (0, _react().use)(CompositionContext);
    if (!context) {
        throw new Error('useCompositionOption must be used within a RouterCompositionOptionsProvider. This is likely a bug in Expo Router.');
    }
    const route = (0, _native.useRoute)();
    const { set, unset } = context;
    (0, _useSafeLayoutEffect.useSafeLayoutEffect)(()=>{
        set(route.key, options);
        return ()=>{
            unset(route.key, options);
        };
    }, [
        route.key,
        set,
        unset,
        options
    ]);
}

//# sourceMappingURL=CompositionOptionsContext.js.map
