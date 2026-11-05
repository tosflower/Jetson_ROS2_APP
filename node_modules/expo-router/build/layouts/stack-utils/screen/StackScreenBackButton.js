"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    StackScreenBackButton: null,
    appendStackScreenBackButtonPropsToOptions: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get StackScreenBackButton () {
        return StackScreenBackButton;
    },
    get appendStackScreenBackButtonPropsToOptions () {
        return appendStackScreenBackButtonPropsToOptions;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _compositionoptions = require("../../../fork/native-stack/composition-options");
function StackScreenBackButton({ children, style, withMenu, displayMode, hidden, src }) {
    const options = (0, _react().useMemo)(()=>appendStackScreenBackButtonPropsToOptions({}, // satisfies ensures every prop is listed here
        {
            children,
            style,
            withMenu,
            displayMode,
            hidden,
            src
        }), [
        children,
        style,
        withMenu,
        displayMode,
        hidden,
        src
    ]);
    (0, _compositionoptions.useCompositionOption)(options);
    return null;
}
function appendStackScreenBackButtonPropsToOptions(options, props) {
    return {
        ...options,
        headerBackTitle: props.children,
        headerBackTitleStyle: props.style,
        headerBackImageSource: props.src,
        headerBackButtonDisplayMode: props.displayMode,
        headerBackButtonMenuEnabled: props.withMenu,
        headerBackVisible: !props.hidden
    };
}

//# sourceMappingURL=StackScreenBackButton.js.map
