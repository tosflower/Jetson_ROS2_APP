"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "conditional", {
    enumerable: true,
    get: function() {
        return conditional;
    }
});
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
const { add, multiply } = _reactnative().Animated;
function conditional(condition, main, fallback) {
    // To implement this behavior, we multiply the main node with the condition.
    // So if condition is 0, result will be 0, and if condition is 1, result will be main node.
    // Then we multiply reverse of the condition (0 if condition is 1) with the fallback.
    // So if condition is 0, result will be fallback node, and if condition is 1, result will be 0,
    // This way, one of them will always be 0, and other one will be the value we need.
    // In the end we add them both together, 0 + value we need = value we need
    return add(multiply(condition, main), multiply(condition.interpolate({
        inputRange: [
            0,
            1
        ],
        outputRange: [
            1,
            0
        ]
    }), fallback));
}

//# sourceMappingURL=conditional.js.map
