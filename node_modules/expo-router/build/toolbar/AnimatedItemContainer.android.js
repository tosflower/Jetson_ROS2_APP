"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AnimatedItemContainer", {
    enumerable: true,
    get: function() {
        return AnimatedItemContainer;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
const _expoui = require("../optional-libraries/expo-ui");
function AnimatedItemContainer({ visible, children }) {
    const { expoUI: { AnimatedVisibility, EnterTransition, ExitTransition } } = (0, _expoui.requireExpoUI)("Stack.Toolbar on Android requires '@expo/ui'. Install it with `npx expo install @expo/ui` and rebuild your app.");
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(AnimatedVisibility, {
        // As mentioned in the docs, `scaleIn` does not animate layout, so we need to combine it with `expandIn` to get the layout animation as well. The same applies to `scaleOut` and `shrinkOut`.
        // https://developer.android.com/reference/kotlin/androidx/compose/animation/package-summary#scaleOut(androidx.compose.animation.core.FiniteAnimationSpec,kotlin.Float,androidx.compose.ui.graphics.TransformOrigin)
        enterTransition: EnterTransition.scaleIn().plus(EnterTransition.expandIn()),
        exitTransition: ExitTransition.scaleOut().plus(ExitTransition.shrinkOut()),
        visible: visible,
        children: children
    });
}

//# sourceMappingURL=AnimatedItemContainer.android.js.map
