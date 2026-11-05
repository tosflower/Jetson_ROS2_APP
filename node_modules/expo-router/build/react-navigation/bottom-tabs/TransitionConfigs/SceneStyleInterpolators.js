"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    forFade: null,
    forShift: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get forFade () {
        return forFade;
    },
    get forShift () {
        return forShift;
    }
});
function forFade({ current }) {
    return {
        sceneStyle: {
            opacity: current.progress.interpolate({
                inputRange: [
                    -1,
                    0,
                    1
                ],
                outputRange: [
                    0,
                    1,
                    0
                ]
            })
        }
    };
}
function forShift({ current }) {
    return {
        sceneStyle: {
            opacity: current.progress.interpolate({
                inputRange: [
                    -1,
                    0,
                    1
                ],
                outputRange: [
                    0,
                    1,
                    0
                ]
            }),
            transform: [
                {
                    translateX: current.progress.interpolate({
                        inputRange: [
                            -1,
                            0,
                            1
                        ],
                        outputRange: [
                            -50,
                            0,
                            50
                        ]
                    })
                }
            ]
        }
    };
}

//# sourceMappingURL=SceneStyleInterpolators.js.map
