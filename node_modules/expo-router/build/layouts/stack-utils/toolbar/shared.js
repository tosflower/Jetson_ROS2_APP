"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    areAllChildrenPrimitiveValues: null,
    convertChildrenToString: null,
    convertStackHeaderSharedPropsToRNSharedHeaderItem: null,
    extractIconRenderingMode: null,
    extractXcassetName: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get areAllChildrenPrimitiveValues () {
        return areAllChildrenPrimitiveValues;
    },
    get convertChildrenToString () {
        return convertChildrenToString;
    },
    get convertStackHeaderSharedPropsToRNSharedHeaderItem () {
        return convertStackHeaderSharedPropsToRNSharedHeaderItem;
    },
    get extractIconRenderingMode () {
        return extractIconRenderingMode;
    },
    get extractXcassetName () {
        return extractXcassetName;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _children = require("../../../utils/children");
const _font = require("../../../utils/font");
const _toolbarprimitives = require("./toolbar-primitives");
function extractXcassetName(props) {
    const iconComponentProps = (0, _children.getFirstChildOfType)(props.children, _toolbarprimitives.StackToolbarIcon)?.props;
    if (iconComponentProps && 'xcasset' in iconComponentProps) {
        return iconComponentProps.xcasset;
    }
    return undefined;
}
function extractIconRenderingMode(props) {
    const iconComponentProps = (0, _children.getFirstChildOfType)(props.children, _toolbarprimitives.StackToolbarIcon)?.props;
    if (iconComponentProps && 'renderingMode' in iconComponentProps) {
        return iconComponentProps.renderingMode;
    }
    return undefined;
}
const PRIMITIVE_TYPES = [
    'string',
    'number'
];
function areAllChildrenPrimitiveValues(children) {
    const childrenArray = _react().Children.toArray(children);
    return childrenArray.filter((child)=>PRIMITIVE_TYPES.includes(typeof child)).length === childrenArray.length;
}
function convertChildrenToString(children) {
    return _react().Children.toArray(children).filter((child)=>PRIMITIVE_TYPES.includes(typeof child)).join('');
}
function convertStackHeaderSharedPropsToRNSharedHeaderItem(props, isBottomPlacement = false) {
    const { children, style, separateBackground, icon, ...rest } = props;
    const stringChildren = convertChildrenToString(children);
    const label = (0, _children.getFirstChildOfType)(children, _toolbarprimitives.StackToolbarLabel);
    const iconPropConvertedToIcon = props.icon ? typeof props.icon === 'string' ? {
        sf: props.icon
    } : {
        src: props.icon
    } : undefined;
    const iconComponentProps = (0, _children.getFirstChildOfType)(children, _toolbarprimitives.StackToolbarIcon)?.props ?? iconPropConvertedToIcon;
    const badgeComponent = (0, _children.getFirstChildOfType)(children, _toolbarprimitives.StackToolbarBadge);
    const rnsIcon = (()=>{
        if (!iconComponentProps) {
            return undefined;
        }
        // Bottom placement xcasset uses native xcasset type
        if ('xcasset' in iconComponentProps && isBottomPlacement) {
            return {
                type: 'xcasset',
                name: iconComponentProps.xcasset
            };
        }
        // Unified image path for src and xcasset (non-bottom)
        if ('src' in iconComponentProps || 'xcasset' in iconComponentProps) {
            const source = 'src' in iconComponentProps ? iconComponentProps.src : {
                uri: iconComponentProps.xcasset
            };
            const explicitRenderingMode = 'renderingMode' in iconComponentProps ? iconComponentProps.renderingMode : undefined;
            const effectiveRenderingMode = explicitRenderingMode ?? props.iconRenderingMode ?? (props.tintColor ? 'template' : 'original');
            return {
                type: 'image',
                source,
                tinted: effectiveRenderingMode === 'template'
            };
        }
        return {
            type: 'sfSymbol',
            name: iconComponentProps.sf
        };
    })();
    const item = {
        ...rest,
        label: label?.props.children ?? stringChildren,
        sharesBackground: !separateBackground
    };
    if (style) {
        const convertedStyle = (0, _font.convertTextStyleToRNTextStyle)(style) ?? {};
        item.labelStyle = convertedStyle;
    }
    if (badgeComponent) {
        item.badge = {
            value: badgeComponent.props.children ?? ''
        };
        const badgeStyle = (0, _font.convertTextStyleToRNTextStyle)(badgeComponent.props.style);
        if (badgeStyle) {
            item.badge.style = badgeStyle;
        }
    }
    if (rnsIcon) {
        item.icon = rnsIcon;
    }
    return item;
}

//# sourceMappingURL=shared.js.map
