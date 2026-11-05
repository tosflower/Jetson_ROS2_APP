"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    NOT_INITIALIZED_ERROR: null,
    createNavigationContainerRef: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get NOT_INITIALIZED_ERROR () {
        return NOT_INITIALIZED_ERROR;
    },
    get createNavigationContainerRef () {
        return createNavigationContainerRef;
    }
});
const _routers = require("../routers");
const NOT_INITIALIZED_ERROR = "The 'navigation' object hasn't been initialized yet. This might happen if you don't have a navigator mounted, or if the navigator hasn't finished mounting. In Expo Router, mount a navigator in a route layout before using navigation methods.";
function createNavigationContainerRef() {
    const methods = [
        ...Object.keys(_routers.CommonActions),
        'addListener',
        'removeListener',
        'dispatch',
        'dispatchSync',
        'isFocused',
        'canGoBack',
        'getRootState',
        'getState',
        'getParent',
        'getCurrentRoute',
        'getCurrentOptions'
    ];
    const listeners = {};
    const removeListener = (event, callback)=>{
        if (listeners[event]) {
            listeners[event] = listeners[event].filter((cb)=>cb !== callback);
        }
    };
    let current = null;
    const ref = {
        get current () {
            return current;
        },
        set current (value){
            current = value;
            if (value != null) {
                Object.entries(listeners).forEach(([event, callbacks])=>{
                    callbacks.forEach((callback)=>{
                        value.addListener(event, callback);
                    });
                });
            }
        },
        isReady: ()=>{
            if (current == null) {
                return false;
            }
            return current.isReady();
        },
        ...methods.reduce((acc, name)=>{
            acc[name] = (...args)=>{
                if (current == null) {
                    switch(name){
                        case 'addListener':
                            {
                                const [event, callback] = args;
                                listeners[event] = listeners[event] || [];
                                listeners[event].push(callback);
                                return ()=>removeListener(event, callback);
                            }
                        case 'removeListener':
                            {
                                const [event, callback] = args;
                                removeListener(event, callback);
                                break;
                            }
                        default:
                            console.error(NOT_INITIALIZED_ERROR);
                    }
                } else {
                    // @ts-expect-error: this is ok
                    return current[name](...args);
                }
            };
            return acc;
        }, {})
    };
    return ref;
}

//# sourceMappingURL=createNavigationContainerRef.js.map
