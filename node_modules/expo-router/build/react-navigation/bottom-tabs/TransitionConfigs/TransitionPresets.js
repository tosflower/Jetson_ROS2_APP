"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    FadeTransition: null,
    ShiftTransition: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get FadeTransition () {
        return FadeTransition;
    },
    get ShiftTransition () {
        return ShiftTransition;
    }
});
const _SceneStyleInterpolators = require("./SceneStyleInterpolators");
const _TransitionSpecs = require("./TransitionSpecs");
const FadeTransition = {
    transitionSpec: _TransitionSpecs.FadeSpec,
    sceneStyleInterpolator: _SceneStyleInterpolators.forFade
};
const ShiftTransition = {
    transitionSpec: _TransitionSpecs.ShiftSpec,
    sceneStyleInterpolator: _SceneStyleInterpolators.forShift
};

//# sourceMappingURL=TransitionPresets.js.map
