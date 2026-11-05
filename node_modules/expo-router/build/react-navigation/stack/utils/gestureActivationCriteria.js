"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "gestureActivationCriteria", {
    enumerable: true,
    get: function() {
        return gestureActivationCriteria;
    }
});
const _getInvertedMultiplier = require("./getInvertedMultiplier");
/**
 * The distance of touch start from the edge of the screen where the gesture will be recognized
 */ const GESTURE_RESPONSE_DISTANCE_HORIZONTAL = 50;
const GESTURE_RESPONSE_DISTANCE_VERTICAL = 135;
const gestureActivationCriteria = ({ direction, gestureDirection, gestureResponseDistance, layout })=>{
    const enableTrackpadTwoFingerGesture = true;
    const distance = gestureResponseDistance !== undefined ? gestureResponseDistance : gestureDirection === 'vertical' || gestureDirection === 'vertical-inverted' ? GESTURE_RESPONSE_DISTANCE_VERTICAL : GESTURE_RESPONSE_DISTANCE_HORIZONTAL;
    if (gestureDirection === 'vertical') {
        return {
            maxDeltaX: 15,
            minOffsetY: 5,
            hitSlop: {
                bottom: -layout.height + distance
            },
            enableTrackpadTwoFingerGesture
        };
    } else if (gestureDirection === 'vertical-inverted') {
        return {
            maxDeltaX: 15,
            minOffsetY: -5,
            hitSlop: {
                top: -layout.height + distance
            },
            enableTrackpadTwoFingerGesture
        };
    } else {
        const hitSlop = -layout.width + distance;
        const invertedMultiplier = (0, _getInvertedMultiplier.getInvertedMultiplier)(gestureDirection, direction === 'rtl');
        if (invertedMultiplier === 1) {
            return {
                minOffsetX: 5,
                maxDeltaY: 20,
                hitSlop: {
                    right: hitSlop
                },
                enableTrackpadTwoFingerGesture
            };
        } else {
            return {
                minOffsetX: -5,
                maxDeltaY: 20,
                hitSlop: {
                    left: hitSlop
                },
                enableTrackpadTwoFingerGesture
            };
        }
    }
};

//# sourceMappingURL=gestureActivationCriteria.js.map
