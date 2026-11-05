"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getDistanceForDirection", {
    enumerable: true,
    get: function() {
        return getDistanceForDirection;
    }
});
const _getInvertedMultiplier = require("./getInvertedMultiplier");
function getDistanceForDirection(layout, gestureDirection, isRTL) {
    const multiplier = (0, _getInvertedMultiplier.getInvertedMultiplier)(gestureDirection, isRTL);
    switch(gestureDirection){
        case 'vertical':
        case 'vertical-inverted':
            return layout.height * multiplier;
        case 'horizontal':
        case 'horizontal-inverted':
            return layout.width * multiplier;
    }
}

//# sourceMappingURL=getDistanceForDirection.js.map
