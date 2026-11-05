"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "convertMaterialIconNameToImageSource", {
    enumerable: true,
    get: function() {
        return convertMaterialIconNameToImageSource;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
const _exposymbols = require("../../optional-libraries/expo-symbols");
const _elements = require("../common/elements");
const _icon = require("./icon");
function convertMaterialIconNameToImageSource(name) {
    const { unstable_getMaterialSymbolSourceAsync } = (0, _exposymbols.requireExpoSymbols)("NativeTabs.Trigger.Icon `md` icons on Android require 'expo-symbols'. Install it with `npx expo install expo-symbols` or use the `src` or `drawable` prop.");
    return (0, _icon.convertComponentSrcToImageSource)(/*#__PURE__*/ (0, _jsxruntime().jsx)(_elements.NativeTabsTriggerPromiseIcon, {
        loader: ()=>unstable_getMaterialSymbolSourceAsync(name, 24, 'white')
    }));
}

//# sourceMappingURL=materialIconConverter.android.js.map
