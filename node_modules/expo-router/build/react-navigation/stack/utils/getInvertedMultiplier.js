"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getInvertedMultiplier", {
    enumerable: true,
    get: function() {
        return getInvertedMultiplier;
    }
});
function getInvertedMultiplier(gestureDirection, isRTL) {
    switch(gestureDirection){
        case 'vertical':
            return 1;
        case 'vertical-inverted':
            return -1;
        case 'horizontal':
            return isRTL ? -1 : 1;
        case 'horizontal-inverted':
            return isRTL ? 1 : -1;
    }
}

//# sourceMappingURL=getInvertedMultiplier.js.map
