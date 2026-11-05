"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    BottomSheetAndroid: null,
    DefaultTransition: null,
    FadeFromBottomAndroid: null,
    FadeFromRightAndroid: null,
    ModalFadeTransition: null,
    ModalPresentationIOS: null,
    ModalSlideFromBottomIOS: null,
    ModalTransition: null,
    RevealFromBottomAndroid: null,
    ScaleFromCenterAndroid: null,
    SlideFromLeftIOS: null,
    SlideFromRightIOS: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get BottomSheetAndroid () {
        return BottomSheetAndroid;
    },
    get DefaultTransition () {
        return DefaultTransition;
    },
    get FadeFromBottomAndroid () {
        return FadeFromBottomAndroid;
    },
    get FadeFromRightAndroid () {
        return FadeFromRightAndroid;
    },
    get ModalFadeTransition () {
        return ModalFadeTransition;
    },
    get ModalPresentationIOS () {
        return ModalPresentationIOS;
    },
    get ModalSlideFromBottomIOS () {
        return ModalSlideFromBottomIOS;
    },
    get ModalTransition () {
        return ModalTransition;
    },
    get RevealFromBottomAndroid () {
        return RevealFromBottomAndroid;
    },
    get ScaleFromCenterAndroid () {
        return ScaleFromCenterAndroid;
    },
    get SlideFromLeftIOS () {
        return SlideFromLeftIOS;
    },
    get SlideFromRightIOS () {
        return SlideFromRightIOS;
    }
});
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
const _CardStyleInterpolators = require("./CardStyleInterpolators");
const _HeaderStyleInterpolators = require("./HeaderStyleInterpolators");
const _TransitionSpecs = require("./TransitionSpecs");
const ANDROID_VERSION_PIE = 28;
const ANDROID_VERSION_10 = 29;
const ANDROID_VERSION_14 = 34;
const SlideFromRightIOS = {
    gestureDirection: 'horizontal',
    transitionSpec: {
        open: _TransitionSpecs.TransitionIOSSpec,
        close: _TransitionSpecs.TransitionIOSSpec
    },
    cardStyleInterpolator: _CardStyleInterpolators.forHorizontalIOS,
    headerStyleInterpolator: _HeaderStyleInterpolators.forFade
};
const ModalSlideFromBottomIOS = {
    gestureDirection: 'vertical',
    transitionSpec: {
        open: _TransitionSpecs.TransitionIOSSpec,
        close: _TransitionSpecs.TransitionIOSSpec
    },
    cardStyleInterpolator: _CardStyleInterpolators.forVerticalIOS,
    headerStyleInterpolator: _HeaderStyleInterpolators.forFade
};
const ModalPresentationIOS = {
    gestureDirection: 'vertical',
    transitionSpec: {
        open: _TransitionSpecs.TransitionIOSSpec,
        close: _TransitionSpecs.TransitionIOSSpec
    },
    cardStyleInterpolator: _CardStyleInterpolators.forModalPresentationIOS,
    headerStyleInterpolator: _HeaderStyleInterpolators.forFade
};
const FadeFromBottomAndroid = {
    gestureDirection: 'vertical',
    transitionSpec: {
        open: _TransitionSpecs.FadeInFromBottomAndroidSpec,
        close: _TransitionSpecs.FadeOutToBottomAndroidSpec
    },
    cardStyleInterpolator: _CardStyleInterpolators.forFadeFromBottomAndroid,
    headerStyleInterpolator: _HeaderStyleInterpolators.forFade
};
const RevealFromBottomAndroid = {
    gestureDirection: 'vertical',
    transitionSpec: {
        open: _TransitionSpecs.RevealFromBottomAndroidSpec,
        close: _TransitionSpecs.RevealFromBottomAndroidSpec
    },
    cardStyleInterpolator: _CardStyleInterpolators.forRevealFromBottomAndroid,
    headerStyleInterpolator: _HeaderStyleInterpolators.forFade
};
const ScaleFromCenterAndroid = {
    gestureDirection: 'horizontal',
    transitionSpec: {
        open: _TransitionSpecs.ScaleFromCenterAndroidSpec,
        close: _TransitionSpecs.ScaleFromCenterAndroidSpec
    },
    cardStyleInterpolator: _CardStyleInterpolators.forScaleFromCenterAndroid,
    headerStyleInterpolator: _HeaderStyleInterpolators.forFade
};
const FadeFromRightAndroid = {
    gestureDirection: 'horizontal',
    transitionSpec: {
        open: _TransitionSpecs.FadeInFromBottomAndroidSpec,
        close: _TransitionSpecs.FadeOutToBottomAndroidSpec
    },
    cardStyleInterpolator: _CardStyleInterpolators.forFadeFromRightAndroid,
    headerStyleInterpolator: _HeaderStyleInterpolators.forFade
};
const BottomSheetAndroid = {
    gestureDirection: 'vertical',
    transitionSpec: {
        open: _TransitionSpecs.BottomSheetSlideInSpec,
        close: _TransitionSpecs.BottomSheetSlideOutSpec
    },
    cardStyleInterpolator: _CardStyleInterpolators.forBottomSheetAndroid,
    headerStyleInterpolator: _HeaderStyleInterpolators.forFade
};
const ModalFadeTransition = {
    gestureDirection: 'vertical',
    transitionSpec: {
        open: _TransitionSpecs.BottomSheetSlideInSpec,
        close: _TransitionSpecs.BottomSheetSlideOutSpec
    },
    cardStyleInterpolator: _CardStyleInterpolators.forFadeFromCenter,
    headerStyleInterpolator: _HeaderStyleInterpolators.forFade
};
const DefaultTransition = _reactnative().Platform.select({
    ios: SlideFromRightIOS,
    android: Number(_reactnative().Platform.Version) >= ANDROID_VERSION_14 ? FadeFromRightAndroid : Number(_reactnative().Platform.Version) >= ANDROID_VERSION_10 ? ScaleFromCenterAndroid : Number(_reactnative().Platform.Version) >= ANDROID_VERSION_PIE ? RevealFromBottomAndroid : FadeFromBottomAndroid,
    default: ScaleFromCenterAndroid
});
const ModalTransition = _reactnative().Platform.select({
    ios: ModalPresentationIOS,
    default: BottomSheetAndroid
});
const SlideFromLeftIOS = {
    ...SlideFromRightIOS,
    cardStyleInterpolator: _CardStyleInterpolators.forHorizontalIOSInverted
};

//# sourceMappingURL=TransitionPresets.js.map
