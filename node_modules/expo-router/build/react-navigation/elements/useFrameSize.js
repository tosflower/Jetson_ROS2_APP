'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    FrameSizeProvider: null,
    useFrameSize: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get FrameSizeProvider () {
        return FrameSizeProvider;
    },
    get useFrameSize () {
        return useFrameSize;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
function _react() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
const _useLatestCallback = /*#__PURE__*/ _interop_require_default(require("../../utils/useLatestCallback"));
const _useSyncExternalStoreWithSelector = require("../../utils/useSyncExternalStoreWithSelector");
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
const FrameContext = /*#__PURE__*/ _react().createContext(undefined);
function useFrameSize(selector, throttle) {
    const context = (0, _react().use)(FrameContext);
    if (context == null) {
        throw new Error('useFrameSize must be used within a FrameSizeProvider');
    }
    const value = (0, _useSyncExternalStoreWithSelector.useSyncExternalStoreWithSelector)(throttle ? context.subscribeThrottled : context.subscribe, context.getCurrent, context.getCurrent, selector);
    return value;
}
function FrameSizeProvider({ initialFrame, render }) {
    const frameRef = _react().useRef({
        width: initialFrame.width,
        height: initialFrame.height
    });
    const listeners = _react().useRef(new Set());
    const getCurrent = (0, _useLatestCallback.default)(()=>frameRef.current);
    const subscribe = (0, _useLatestCallback.default)((listener)=>{
        listeners.current.add(listener);
        return ()=>{
            listeners.current.delete(listener);
        };
    });
    const subscribeThrottled = (0, _useLatestCallback.default)((listener)=>{
        const delay = 100; // Throttle delay in milliseconds
        let timer;
        let updated = false;
        let waiting = false;
        const throttledListener = ()=>{
            clearTimeout(timer);
            updated = true;
            if (waiting) {
                // Schedule a timer to call the listener at the end
                timer = setTimeout(()=>{
                    if (updated) {
                        updated = false;
                        listener();
                    }
                }, delay);
            } else {
                waiting = true;
                setTimeout(function() {
                    waiting = false;
                }, delay);
                // Call the listener immediately at start
                updated = false;
                listener();
            }
        };
        const unsubscribe = subscribe(throttledListener);
        return ()=>{
            unsubscribe();
            clearTimeout(timer);
        };
    });
    const context = _react().useMemo(()=>({
            getCurrent,
            subscribe,
            subscribeThrottled
        }), [
        subscribe,
        subscribeThrottled,
        getCurrent
    ]);
    const onChange = (0, _useLatestCallback.default)((frame)=>{
        if (frameRef.current.height === frame.height && frameRef.current.width === frame.width) {
            return;
        }
        frameRef.current = {
            width: frame.width,
            height: frame.height
        };
        listeners.current.forEach((listener)=>listener());
    });
    const viewRef = _react().useRef(null);
    _react().useEffect(()=>{
        if (_reactnative().Platform.OS === 'web') {
            // We use ResizeObserver on web
            return;
        }
        viewRef.current?.measure((_x, _y, width, height)=>{
            onChange({
                width,
                height
            });
        });
    }, [
        onChange
    ]);
    const onLayout = (event)=>{
        const { width, height } = event.nativeEvent.layout;
        onChange({
            width,
            height
        });
    };
    return /*#__PURE__*/ (0, _jsxruntime().jsxs)(FrameContext.Provider, {
        value: context,
        children: [
            _reactnative().Platform.OS === 'web' ? /*#__PURE__*/ (0, _jsxruntime().jsx)(FrameSizeListenerWeb, {
                onChange: onChange
            }) : null,
            render({
                ref: viewRef,
                onLayout
            })
        ]
    });
}
// FIXME: On the Web, `onLayout` doesn't fire on resize
// So we workaround this by using ResizeObserver
function FrameSizeListenerWeb({ onChange }) {
    const elementRef = _react().useRef(null);
    _react().useEffect(()=>{
        if (elementRef.current == null) {
            return;
        }
        if (typeof elementRef.current.getBoundingClientRect !== 'function') {
            return;
        }
        const rect = elementRef.current.getBoundingClientRect();
        onChange({
            width: rect.width,
            height: rect.height
        });
        const observer = new ResizeObserver((entries)=>{
            const entry = entries[0];
            if (entry) {
                const { width, height } = entry.contentRect;
                onChange({
                    width,
                    height
                });
            }
        });
        observer.observe(elementRef.current);
        return ()=>{
            observer.disconnect();
        };
    }, [
        onChange
    ]);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)("div", {
        ref: elementRef,
        style: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            pointerEvents: 'none',
            visibility: 'hidden'
        }
    });
}

//# sourceMappingURL=useFrameSize.js.map
