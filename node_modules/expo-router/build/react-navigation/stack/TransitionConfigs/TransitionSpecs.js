"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    BottomSheetSlideInSpec: null,
    BottomSheetSlideOutSpec: null,
    FadeInFromBottomAndroidSpec: null,
    FadeInFromRightAndroidSpec: null,
    FadeOutToBottomAndroidSpec: null,
    FadeOutToLeftAndroidSpec: null,
    RevealFromBottomAndroidSpec: null,
    ScaleFromCenterAndroidSpec: null,
    TransitionIOSSpec: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get BottomSheetSlideInSpec () {
        return BottomSheetSlideInSpec;
    },
    get BottomSheetSlideOutSpec () {
        return BottomSheetSlideOutSpec;
    },
    get FadeInFromBottomAndroidSpec () {
        return FadeInFromBottomAndroidSpec;
    },
    get FadeInFromRightAndroidSpec () {
        return FadeInFromRightAndroidSpec;
    },
    get FadeOutToBottomAndroidSpec () {
        return FadeOutToBottomAndroidSpec;
    },
    get FadeOutToLeftAndroidSpec () {
        return FadeOutToLeftAndroidSpec;
    },
    get RevealFromBottomAndroidSpec () {
        return RevealFromBottomAndroidSpec;
    },
    get ScaleFromCenterAndroidSpec () {
        return ScaleFromCenterAndroidSpec;
    },
    get TransitionIOSSpec () {
        return TransitionIOSSpec;
    }
});
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
const TransitionIOSSpec = {
    animation: 'spring',
    config: {
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 10,
        restSpeedThreshold: 10
    }
};
const FadeInFromBottomAndroidSpec = {
    animation: 'timing',
    config: {
        duration: 350,
        easing: _reactnative().Easing.out(_reactnative().Easing.poly(5))
    }
};
const FadeOutToBottomAndroidSpec = {
    animation: 'timing',
    config: {
        duration: 150,
        easing: _reactnative().Easing.in(_reactnative().Easing.linear)
    }
};
const RevealFromBottomAndroidSpec = {
    animation: 'timing',
    config: {
        duration: 425,
        // This is super rough approximation of the path used for the curve by android
        // See http://aosp.opersys.com/xref/android-9.0.0_r47/xref/frameworks/base/core/res/res/interpolator/fast_out_extra_slow_in.xml
        easing: _reactnative().Easing.bezier(0.20833, 0.82, 0.25, 1)
    }
};
const ScaleFromCenterAndroidSpec = {
    animation: 'timing',
    config: {
        duration: 400,
        // This is super rough approximation of the path used for the curve by android
        // See http://aosp.opersys.com/xref/android-10.0.0_r2/xref/frameworks/base/core/res/res/interpolator/fast_out_extra_slow_in.xml
        easing: _reactnative().Easing.bezier(0.20833, 0.82, 0.25, 1)
    }
};
const FadeInFromRightAndroidSpec = {
    animation: 'timing',
    config: {
        duration: 450,
        // This is super rough approximation of the path used for the curve by android
        // See https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-14.0.0_r51/core/res/res/interpolator/fast_out_extra_slow_in.xml
        easing: _reactnative().Easing.bezier(0.20833, 0.82, 0.25, 1)
    }
};
const FadeOutToLeftAndroidSpec = {
    animation: 'timing',
    config: {
        duration: 450,
        // This is super rough approximation of the path used for the curve by android
        // See https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-14.0.0_r51/core/res/res/interpolator/fast_out_extra_slow_in.xml
        easing: _reactnative().Easing.bezier(0.20833, 0.82, 0.25, 1)
    }
};
const BottomSheetSlideInSpec = {
    animation: 'timing',
    config: {
        duration: 250,
        // See https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/view/animation/AccelerateDecelerateInterpolator.java
        easing: (t)=>Math.cos((t + 1) * Math.PI) / 2.0 + 0.5
    }
};
const BottomSheetSlideOutSpec = {
    animation: 'timing',
    config: {
        duration: 200,
        // See https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/view/animation/AccelerateInterpolator.java
        easing: (t)=>t === 1.0 ? 1 : Math.pow(t, 2)
    }
};

//# sourceMappingURL=TransitionSpecs.js.map
