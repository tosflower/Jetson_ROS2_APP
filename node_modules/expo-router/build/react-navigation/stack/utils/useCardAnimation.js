'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useCardAnimation", {
    enumerable: true,
    get: function() {
        return useCardAnimation;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _CardAnimationContext = require("./CardAnimationContext");
function useCardAnimation() {
    const animation = (0, _react().use)(_CardAnimationContext.CardAnimationContext);
    if (animation === undefined) {
        throw new Error("Couldn't find values for card animation. Are you inside a screen in Stack?");
    }
    return animation;
}

//# sourceMappingURL=useCardAnimation.js.map
