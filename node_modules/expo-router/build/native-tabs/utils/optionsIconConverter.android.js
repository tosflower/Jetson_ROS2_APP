"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    appendIconOptions: null,
    convertOptionsIconToScreensPropsIcon: null
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
    }
});
const _materialIconConverter = require("./materialIconConverter");
const _optionsIconConvertershared = require("./optionsIconConverter.shared");
function appendIconOptions(options, props) {
    if ('drawable' in props && props.drawable) {
        if ('md' in props) {
            console.warn('Both `md` and `drawable` props are provided to NativeTabs.Trigger.Icon. `drawable` will take precedence on Android platform.');
        }
        if (typeof props.drawable === 'string') {
            options.icon = {
                drawable: props.drawable
            };
            options.selectedIcon = undefined;
        } else {
            options.icon = props.drawable.default ? {
                drawable: props.drawable.default
            } : undefined;
            options.selectedIcon = props.drawable.selected ? {
                drawable: props.drawable.selected
            } : undefined;
        }
    } else if ('md' in props && props.md) {
        if (process.env.NODE_ENV !== 'production') {
            if ('drawable' in props) {
                console.warn('Both `md` and `drawable` props are provided to NativeTabs.Trigger.Icon. `drawable` will take precedence on Android platform.');
            }
        }
        if (typeof props.md === 'string') {
            options.icon = (0, _materialIconConverter.convertMaterialIconNameToImageSource)(props.md);
            options.selectedIcon = undefined;
        } else {
            options.icon = props.md.default ? (0, _materialIconConverter.convertMaterialIconNameToImageSource)(props.md.default) : undefined;
            options.selectedIcon = props.md.selected ? (0, _materialIconConverter.convertMaterialIconNameToImageSource)(props.md.selected) : undefined;
        }
    } else if ('src' in props && props.src) {
        (0, _optionsIconConvertershared.applyIconSrcOptions)(options, props);
    }
    (0, _optionsIconConvertershared.applySelectedColor)(options, props.selectedColor);
}
function convertOptionsIconToScreensPropsIcon(icon) {
    if (icon && 'drawable' in icon && icon.drawable) {
        return {
            platform: 'android',
            icon: {
                type: 'drawableResource',
                name: icon.drawable
            }
        };
    }
    if (icon && 'src' in icon && icon.src) {
        return {
            platform: 'android',
            icon: {
                type: 'imageSource',
                imageSource: icon.src
            }
        };
    }
    return undefined;
}

//# sourceMappingURL=optionsIconConverter.android.js.map
