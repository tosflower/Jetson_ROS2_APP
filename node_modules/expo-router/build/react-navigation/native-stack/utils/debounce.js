"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "debounce", {
    enumerable: true,
    get: function() {
        return debounce;
    }
});
function debounce(func, duration) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(()=>{
            func.apply(this, args);
        }, duration);
    };
}

//# sourceMappingURL=debounce.js.map
