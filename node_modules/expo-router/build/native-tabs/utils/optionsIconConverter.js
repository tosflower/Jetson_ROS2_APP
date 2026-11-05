/**
 * TypeScript / non-native fallback. The real per-platform implementations live
 * in `optionsIconConverter.ios.ts` and `optionsIconConverter.android.ts`, which
 * Metro resolves at runtime via platform extensions.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    appendIconOptions: null,
    convertOptionsIconToScreensPropsIcon: null,
    resolveIconRenderingMode: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get appendIconOptions () {
        return appendIconOptions;
    },
    get convertOptionsIconToScreensPropsIcon () {
        return convertOptionsIconToScreensPropsIcon;
    },
    get resolveIconRenderingMode () {
        return resolveIconRenderingMode;
    }
});
const _optionsIconConvertershared = require("./optionsIconConverter.shared");
function appendIconOptions(options, props) {
    if ('src' in props && props.src) {
        (0, _optionsIconConvertershared.applyIconSrcOptions)(options, props);
    }
    (0, _optionsIconConvertershared.applySelectedColor)(options, props.selectedColor);
}
function convertOptionsIconToScreensPropsIcon(_icon, _renderingMode) {
    return undefined;
}
function resolveIconRenderingMode(_icon, _iconColor) {
    return undefined;
}

//# sourceMappingURL=optionsIconConverter.js.map
