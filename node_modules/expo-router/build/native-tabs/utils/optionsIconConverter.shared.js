"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    applyIconSrcOptions: null,
    applySelectedColor: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get applyIconSrcOptions () {
        return applyIconSrcOptions;
    },
    get applySelectedColor () {
        return applySelectedColor;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _icon = require("./icon");
function applyIconSrcOptions(options, props) {
    const icon = convertIconSrcToIconOption(props);
    options.icon = icon?.icon;
    options.selectedIcon = icon?.selectedIcon;
}
function applySelectedColor(options, selectedColor) {
    if (selectedColor) {
        options.selectedIconColor = selectedColor;
    }
}
function convertIconSrcToIconOption(icon) {
    if (icon && icon.src) {
        const { defaultIcon, selected } = typeof icon.src === 'object' && 'selected' in icon.src ? {
            defaultIcon: icon.src.default,
            selected: icon.src.selected
        } : {
            defaultIcon: icon.src
        };
        const options = {};
        options.icon = convertSrcOrComponentToSrc(defaultIcon, {
            renderingMode: icon.renderingMode
        });
        options.selectedIcon = convertSrcOrComponentToSrc(selected, {
            renderingMode: icon.renderingMode
        });
        return options;
    }
    return undefined;
}
function convertSrcOrComponentToSrc(src, options) {
    if (src) {
        if ((0, _react().isValidElement)(src)) {
            return (0, _icon.convertComponentSrcToImageSource)(src, options.renderingMode);
        } else {
            return {
                src,
                renderingMode: options.renderingMode
            };
        }
    }
    return undefined;
}

//# sourceMappingURL=optionsIconConverter.shared.js.map
