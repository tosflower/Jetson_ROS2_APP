"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    goBack: null,
    navigate: null,
    preload: null,
    replaceParams: null,
    reset: null,
    setParams: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get goBack () {
        return goBack;
    },
    get navigate () {
        return navigate;
    },
    get preload () {
        return preload;
    },
    get replaceParams () {
        return replaceParams;
    },
    get reset () {
        return reset;
    },
    get setParams () {
        return setParams;
    }
});
function goBack() {
    return {
        type: 'GO_BACK'
    };
}
function navigate(...args) {
    if (typeof args[0] === 'string') {
        const [name, params, options] = args;
        if (typeof options === 'boolean') {
            console.warn(`Passing a boolean as the third argument to 'navigate' is deprecated. Pass '{ merge: true }' instead.`);
        }
        return {
            type: 'NAVIGATE',
            payload: {
                name,
                params,
                merge: typeof options === 'boolean' ? options : options?.merge,
                pop: options?.pop
            }
        };
    } else {
        const payload = args[0] || {};
        if (!('name' in payload)) {
            throw new Error("You need to specify a name when calling navigate with an object as the argument. Pass a route name, for example navigate({ name: 'home' }).");
        }
        return {
            type: 'NAVIGATE',
            payload
        };
    }
}
function reset(state) {
    return {
        type: 'RESET',
        payload: state
    };
}
function setParams(params) {
    return {
        type: 'SET_PARAMS',
        payload: {
            params
        }
    };
}
function replaceParams(params) {
    return {
        type: 'REPLACE_PARAMS',
        payload: {
            params
        }
    };
}
function preload(name, params) {
    return {
        type: 'PRELOAD',
        payload: {
            name,
            params
        }
    };
}

//# sourceMappingURL=CommonActions.js.map
