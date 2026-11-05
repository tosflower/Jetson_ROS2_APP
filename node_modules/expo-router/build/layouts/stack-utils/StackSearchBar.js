"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    StackSearchBar: null,
    appendStackSearchBarPropsToOptions: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get StackSearchBar () {
        return StackSearchBar;
    },
    get appendStackSearchBarPropsToOptions () {
        return appendStackSearchBarPropsToOptions;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _compositionoptions = require("../../fork/native-stack/composition-options");
function StackSearchBar({ ref, autoCapitalize, autoFocus, barTintColor, tintColor, cancelButtonText, disableBackButtonOverride, hideNavigationBar, hideWhenScrolling, inputType, obscureBackground, onBlur, onCancelButtonPress, onChangeText, onClose, onFocus, onOpen, onSearchButtonPress, placeholder, placement, allowToolbarIntegration, textColor, hintTextColor, headerIconColor, shouldShowHintSearchIcon }) {
    const options = (0, _react().useMemo)(()=>appendStackSearchBarPropsToOptions({}, // satisfies ensures every prop is listed here
        {
            ref,
            autoCapitalize,
            autoFocus,
            barTintColor,
            tintColor,
            cancelButtonText,
            disableBackButtonOverride,
            hideNavigationBar,
            hideWhenScrolling,
            inputType,
            obscureBackground,
            onBlur,
            onCancelButtonPress,
            onChangeText,
            onClose,
            onFocus,
            onOpen,
            onSearchButtonPress,
            placeholder,
            placement,
            allowToolbarIntegration,
            textColor,
            hintTextColor,
            headerIconColor,
            shouldShowHintSearchIcon
        }), [
        ref,
        autoCapitalize,
        autoFocus,
        barTintColor,
        tintColor,
        cancelButtonText,
        disableBackButtonOverride,
        hideNavigationBar,
        hideWhenScrolling,
        inputType,
        obscureBackground,
        onBlur,
        onCancelButtonPress,
        onChangeText,
        onClose,
        onFocus,
        onOpen,
        onSearchButtonPress,
        placeholder,
        placement,
        allowToolbarIntegration,
        textColor,
        hintTextColor,
        headerIconColor,
        shouldShowHintSearchIcon
    ]);
    (0, _compositionoptions.useCompositionOption)(options);
    return null;
}
function appendStackSearchBarPropsToOptions(options, props) {
    return {
        ...options,
        headerShown: true,
        headerSearchBarOptions: {
            ...props
        }
    };
}

//# sourceMappingURL=StackSearchBar.js.map
