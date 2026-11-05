'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useEventEmitter", {
    enumerable: true,
    get: function() {
        return useEventEmitter;
    }
});
function _react() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
const _useLatestCallback = /*#__PURE__*/ _interop_require_default(require("../../utils/useLatestCallback"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
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
function useEventEmitter(listen) {
    const latestListen = (0, _useLatestCallback.default)((e)=>listen?.(e));
    const listeners = _react().useRef(Object.create(null));
    const create = _react().useCallback((target)=>{
        const removeListener = (type, callback)=>{
            const callbacks = listeners.current[type] ? listeners.current[type][target] : undefined;
            if (!callbacks) {
                return;
            }
            callbacks.delete(callback);
        };
        const addListener = (type, callback)=>{
            listeners.current[type] = listeners.current[type] || {};
            listeners.current[type][target] = listeners.current[type][target] || new Set();
            listeners.current[type][target].add(callback);
            let removed = false;
            return ()=>{
                // Prevent removing other listeners when unsubscribing same listener multiple times
                if (!removed) {
                    removed = true;
                    removeListener(type, callback);
                }
            };
        };
        return {
            addListener,
            removeListener
        };
    }, []);
    const emit = _react().useCallback(({ type, data, target, canPreventDefault, preventDefault })=>{
        const items = listeners.current[type] || {};
        // Copy the current list of callbacks in case they are mutated during execution
        const callbacks = target !== undefined ? [
            ...items[target] ?? []
        ] : [
            ...new Set(Object.keys(items).flatMap((target)=>[
                    ...items[target]
                ]))
        ];
        const event = {
            get type () {
                return type;
            }
        };
        if (target !== undefined) {
            Object.defineProperty(event, 'target', {
                enumerable: true,
                get () {
                    return target;
                }
            });
        }
        if (data !== undefined) {
            Object.defineProperty(event, 'data', {
                enumerable: true,
                get () {
                    return data;
                }
            });
        }
        if (canPreventDefault) {
            let defaultPrevented = false;
            Object.defineProperties(event, {
                defaultPrevented: {
                    enumerable: true,
                    get () {
                        return defaultPrevented;
                    }
                },
                preventDefault: {
                    enumerable: true,
                    value () {
                        defaultPrevented = true;
                    }
                }
            });
        } else if (preventDefault) {
            Object.defineProperties(event, {
                defaultPrevented: {
                    enumerable: true,
                    value: false
                },
                preventDefault: {
                    enumerable: true,
                    value: preventDefault
                }
            });
        }
        latestListen(event);
        callbacks?.forEach((cb)=>cb(event));
        return event;
    }, [
        latestListen
    ]);
    return _react().useMemo(()=>({
            create,
            emit
        }), [
        create,
        emit
    ]);
}

//# sourceMappingURL=useEventEmitter.js.map
