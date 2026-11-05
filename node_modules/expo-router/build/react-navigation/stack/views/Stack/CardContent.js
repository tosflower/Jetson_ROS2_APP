'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CardContent", {
    enumerable: true,
    get: function() {
        return CardContent;
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
function CardContent({ enabled, layout, style, ...rest }) {
    const [fill, setFill] = _react().useState(false);
    _react().useEffect(()=>{
        if (typeof document === 'undefined' || !document.body) {
            // Only run when DOM is available
            return;
        }
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;
        // Workaround for mobile Chrome, necessary when a navigation happens
        // when the address bar has already collapsed, which resulted in an
        // empty space at the bottom of the page (matching the height of the
        // address bar). To fix this, it's necessary to update the height of
        // the DOM with the current height of the window.
        // See https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
        const isFullHeight = height === layout.height;
        const id = '__react-navigation-stack-mobile-chrome-viewport-fix';
        let unsubscribe;
        if (isFullHeight && navigator.maxTouchPoints > 0) {
            const style = document.getElementById(id) ?? document.createElement('style');
            style.id = id;
            const updateStyle = ()=>{
                const vh = window.innerHeight * 0.01;
                style.textContent = [
                    `:root { --vh: ${vh}px; }`,
                    `body { height: calc(var(--vh, 1vh) * 100); }`
                ].join('\n');
            };
            updateStyle();
            if (!document.head.contains(style)) {
                document.head.appendChild(style);
            }
            window.addEventListener('resize', updateStyle);
            unsubscribe = ()=>{
                window.removeEventListener('resize', updateStyle);
            };
        } else {
            // Remove the workaround if the stack does not occupy the whole
            // height of the page
            document.getElementById(id)?.remove();
        }
        setFill(width === layout.width && height === layout.height);
        return unsubscribe;
    }, [
        layout.height,
        layout.width
    ]);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnative().View, {
        ...rest,
        style: [
            styles.boxNone,
            enabled && fill ? styles.page : styles.card,
            style
        ]
    });
}
const styles = _reactnative().StyleSheet.create({
    page: {
        minHeight: '100%'
    },
    card: {
        flex: 1,
        overflow: 'hidden'
    },
    boxNone: {
        pointerEvents: 'box-none'
    }
});

//# sourceMappingURL=CardContent.js.map
