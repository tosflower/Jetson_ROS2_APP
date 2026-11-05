"use strict";
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
    if ('sf' in props && props.sf) {
        if (typeof props.sf === 'string') {
            options.icon = props.sf ? {
                sf: props.sf
            } : undefined;
            options.selectedIcon = undefined;
        } else if (props.sf) {
            options.icon = props.sf.default ? {
                sf: props.sf.default
            } : undefined;
            options.selectedIcon = props.sf.selected ? {
                sf: props.sf.selected
            } : undefined;
        }
    } else if ('xcasset' in props && props.xcasset) {
        if (process.env.NODE_ENV !== 'production' && 'renderingMode' in props && props.renderingMode !== undefined) {
            console.warn('`renderingMode` has no effect on `xcasset` icons — tinting is controlled by the ' + 'asset\'s "Render As" setting in the asset catalog instead. Remove `renderingMode`, ' + 'or use `src` if you need to control tinting from JavaScript.');
        }
        if (typeof props.xcasset === 'string') {
            options.icon = {
                xcasset: props.xcasset
            };
            options.selectedIcon = undefined;
        } else {
            options.icon = props.xcasset.default ? {
                xcasset: props.xcasset.default
            } : undefined;
            options.selectedIcon = props.xcasset.selected ? {
                xcasset: props.xcasset.selected
            } : undefined;
        }
    } else if ('src' in props && props.src) {
        (0, _optionsIconConvertershared.applyIconSrcOptions)(options, props);
    }
    (0, _optionsIconConvertershared.applySelectedColor)(options, props.selectedColor);
}
function resolveIconRenderingMode(icon, iconColor) {
    if (!getIconImageSource(icon)) {
        return undefined;
    }
    const renderingMode = icon && 'renderingMode' in icon ? icon.renderingMode : undefined;
    return renderingMode ?? (iconColor !== undefined ? 'template' : 'original');
}
function convertOptionsIconToScreensPropsIcon(icon, renderingMode) {
    if (icon && 'sf' in icon && icon.sf) {
        return {
            platform: 'ios',
            icon: {
                type: 'sfSymbol',
                name: icon.sf
            }
        };
    }
    // Asset catalog icons have to be resolved natively with `[UIImage imageNamed:]`.
    // Passing the name to the image loader as a `{ uri }` source happens to work for
    // image sets, but symbol sets can never be produced that way. Tinting is then
    // controlled by the asset's "Render As" setting in the asset catalog, not `renderingMode`.
    if (icon && 'xcasset' in icon && icon.xcasset) {
        return {
            platform: 'ios',
            icon: {
                type: 'xcasset',
                name: icon.xcasset
            }
        };
    }
    const imageSource = getIconImageSource(icon);
    if (!imageSource) {
        return undefined;
    }
    const effectiveRenderingMode = renderingMode ?? resolveIconRenderingMode(icon);
    if (effectiveRenderingMode === 'original') {
        return {
            platform: 'ios',
            icon: {
                type: 'imageSource',
                imageSource
            }
        };
    }
    return {
        platform: 'ios',
        icon: {
            type: 'templateSource',
            templateSource: imageSource
        }
    };
}
// Mirrors the precedence in `convertOptionsIconToScreensPropsIcon` — SF Symbols and asset
// catalog icons aren't resolved through `renderingMode`, so both resolve to `undefined` here.
function getIconImageSource(icon) {
    if (!icon || 'sf' in icon && icon.sf || 'xcasset' in icon && icon.xcasset) {
        return undefined;
    }
    if ('src' in icon && icon.src) {
        return icon.src;
    }
    return undefined;
}

//# sourceMappingURL=optionsIconConverter.ios.js.map
