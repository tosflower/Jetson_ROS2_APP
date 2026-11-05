"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    FadeSpec: null,
    ShiftSpec: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get FadeSpec () {
        return FadeSpec;
    },
    get ShiftSpec () {
        return ShiftSpec;
    }
});
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
const FadeSpec = {
    animation: 'timing',
    config: {
        duration: 150,
        // Resolve lazily so this module evaluates in React Server Components.
        // Reading `easing` still needs the client on native — `Easing` throws on the server there.
        get easing () {
            return _reactnative().Easing.in(_reactnative().Easing.linear);
        }
    }
};
const ShiftSpec = {
    animation: 'timing',
    config: {
        duration: 150,
        // Resolve lazily so this module evaluates in React Server Components.
        // Reading `easing` still needs the client on native — `Easing` throws on the server there.
        get easing () {
            return _reactnative().Easing.inOut(_reactnative().Easing.ease);
        }
    }
};

//# sourceMappingURL=TransitionSpecs.js.map
