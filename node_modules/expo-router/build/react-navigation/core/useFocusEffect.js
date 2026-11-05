'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useFocusEffect", {
    enumerable: true,
    get: function() {
        return useFocusEffect;
    }
});
function _react() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
const _useNavigation = require("./useNavigation");
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
function useFocusEffect(effect) {
    const navigation = (0, _useNavigation.useNavigation)();
    // eslint-disable-next-line prefer-rest-params
    if (arguments[1] !== undefined) {
        const message = "You passed a second argument to 'useFocusEffect', but it only accepts one argument. " + "If you want to pass a dependency array, you can use 'React.useCallback':\n\n" + 'useFocusEffect(\n' + '  React.useCallback(() => {\n' + '    // Your code here\n' + '  }, [depA, depB])\n' + ');\n\n' + 'See usage guide: https://docs.expo.dev/versions/latest/sdk/router/#usefocuseffecteffect-do_not_pass_a_second_prop';
        console.error(message);
    }
    _react().useEffect(()=>{
        let isFocused = false;
        let cleanup;
        const callback = ()=>{
            const destroy = effect();
            if (destroy === undefined || typeof destroy === 'function') {
                return destroy;
            }
            if (process.env.NODE_ENV !== 'production') {
                let message = 'An effect function must not return anything besides a function, which is used for clean-up.';
                if (destroy === null) {
                    message += " You returned 'null'. If your effect does not require clean-up, return 'undefined' (or nothing).";
                } else if (typeof destroy.then === 'function') {
                    message += "\n\nIt looks like you wrote 'useFocusEffect(async () => ...)' or returned a Promise. " + 'Instead, write the async function inside your effect ' + 'and call it immediately:\n\n' + 'useFocusEffect(\n' + '  React.useCallback(() => {\n' + '    async function fetchData() {\n' + '      // You can await here\n' + '      const response = await MyAPI.getData(someId);\n' + '      // ...\n' + '    }\n\n' + '    fetchData();\n' + '  }, [someId])\n' + ');\n\n' + 'See usage guide: https://docs.expo.dev/versions/latest/sdk/router/#usefocuseffecteffect-do_not_pass_a_second_prop';
                } else {
                    message += ` You returned '${JSON.stringify(destroy)}'.`;
                }
                console.error(message);
            }
        };
        // We need to run the effect on initial render/dep changes if the screen is focused
        if (navigation.isFocused()) {
            cleanup = callback();
            isFocused = true;
        }
        const unsubscribeFocus = navigation.addListener('focus', ()=>{
            // If callback was already called for focus, avoid calling it again
            // The focus event may also fire on initial render, so we guard against running the effect twice
            if (isFocused) {
                return;
            }
            if (cleanup !== undefined) {
                cleanup();
            }
            cleanup = callback();
            isFocused = true;
        });
        const unsubscribeBlur = navigation.addListener('blur', ()=>{
            if (cleanup !== undefined) {
                cleanup();
            }
            cleanup = undefined;
            isFocused = false;
        });
        return ()=>{
            if (cleanup !== undefined) {
                cleanup();
            }
            unsubscribeFocus();
            unsubscribeBlur();
        };
    }, [
        effect,
        navigation
    ]);
}

//# sourceMappingURL=useFocusEffect.js.map
