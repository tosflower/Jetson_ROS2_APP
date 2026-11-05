'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    StackToolbarMenu: null,
    StackToolbarMenuAction: null,
    convertStackToolbarMenuActionPropsToRNHeaderItem: null,
    convertStackToolbarMenuPropsToRNHeaderItem: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get StackToolbarMenu () {
        return StackToolbarMenu;
    },
    get StackToolbarMenuAction () {
        return StackToolbarMenuAction;
    },
    get convertStackToolbarMenuActionPropsToRNHeaderItem () {
        return convertStackToolbarMenuActionPropsToRNHeaderItem;
    },
    get convertStackToolbarMenuPropsToRNHeaderItem () {
        return convertStackToolbarMenuPropsToRNHeaderItem;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _children = require("../../../../utils/children");
const _context = require("../context");
const _shared = require("../shared");
const _toolbarprimitives = require("../toolbar-primitives");
const _native = require("./native");
/**
 * Computes the label and menu title from children and title prop.
 *
 * - If only `title` prop is provided, it is used for both the label (button text) and menu title
 * - If only `.Label` child is provided, it is used for the label and the menu title is an empty string
 * - If both `.Label` child and `title` prop are provided. `.Label` is used for the label, and `title` is used for the menu title
 */ function computeMenuLabelAndTitle(children, title) {
    const labelChild = (0, _children.getFirstChildOfType)(children, _toolbarprimitives.StackToolbarLabel);
    const labelFromChild = labelChild?.props.children;
    return {
        label: labelFromChild ?? title ?? '',
        menuTitle: title ?? ''
    };
}
const StackToolbarMenu = (props)=>{
    const placement = (0, _context.useToolbarPlacement)();
    if (process.env.EXPO_OS === 'ios' && placement !== 'bottom' || placement == null) {
        // On ios, for placement other than bottom, this component will not render, and should be
        // converted to RN header item using convertStackToolbarMenuPropsToRNHeaderItem.
        // So if we reach here, it means we're not inside a toolbar or something else is wrong.
        throw new Error('Stack.Toolbar.Menu must be used inside a Stack.Toolbar');
    }
    const validChildren = (0, _react().useMemo)(()=>(0, _children.filterAllowedChildrenElements)(props.children, ALLOWED_CHILDREN), [
        props.children
    ]);
    // Use shared conversion that doesn't bail on hidden, so source is always computed
    // and NativeToolbarMenu always renders — letting AnimatedItemContainer handle visibility.
    const sharedProps = (0, _shared.convertStackHeaderSharedPropsToRNSharedHeaderItem)(props, true);
    const { label: computedLabel, menuTitle: computedMenuTitle } = computeMenuLabelAndTitle(props.children, props.title);
    const icon = sharedProps?.icon?.type === 'sfSymbol' ? sharedProps.icon.name : undefined;
    const source = sharedProps?.icon?.type === 'image' ? sharedProps.icon.source : undefined;
    const xcassetName = (0, _shared.extractXcassetName)(props);
    const imageRenderingMode = (0, _shared.extractIconRenderingMode)(props) ?? props.iconRenderingMode;
    if (process.env.NODE_ENV !== 'production') {
        const allChildren = _react().Children.toArray(props.children);
        if (allChildren.length !== validChildren.length) {
            throw new Error(`Stack.Toolbar.Menu only accepts Stack.Toolbar.Menu, Stack.Toolbar.MenuAction, Stack.Toolbar.Label, Stack.Toolbar.Icon, and Stack.Toolbar.Badge as its children.`);
        }
    }
    if (process.env.NODE_ENV !== 'production' && placement === 'bottom') {
        const hasBadge = (0, _children.getFirstChildOfType)(props.children, _toolbarprimitives.StackToolbarBadge);
        if (hasBadge) {
            console.warn('Stack.Toolbar.Badge is not supported in bottom toolbar (iOS limitation). The badge will be ignored.');
        }
    }
    // TODO(@ubax): Handle image loading using useImage in a follow-up PR.
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.NativeToolbarMenu, {
        ...props,
        icon: icon,
        source: source,
        xcassetName: xcassetName,
        image: props.image,
        imageRenderingMode: imageRenderingMode,
        label: computedLabel,
        title: computedMenuTitle,
        badge: sharedProps?.badge,
        children: validChildren
    });
};
function convertStackToolbarMenuPropsToRNHeaderItem(props, isBottomPlacement = false) {
    if (props.hidden) {
        return undefined;
    }
    const { title, ...rest } = props;
    const actions = _react().Children.toArray(props.children).filter((child)=>(0, _children.isChildOfType)(child, StackToolbarMenuAction) || (0, _children.isChildOfType)(child, StackToolbarMenu));
    const { label: computedLabel, menuTitle: computedMenuTitle } = computeMenuLabelAndTitle(props.children, title);
    const sharedProps = (0, _shared.convertStackHeaderSharedPropsToRNSharedHeaderItem)(rest, isBottomPlacement);
    const item = {
        ...sharedProps,
        label: computedLabel,
        type: 'menu',
        menu: {
            multiselectable: true,
            items: actions.map((action)=>{
                if ((0, _children.isChildOfType)(action, StackToolbarMenu)) {
                    return convertStackToolbarSubmenuMenuPropsToRNHeaderItem(action.props);
                }
                return convertStackToolbarMenuActionPropsToRNHeaderItem(action.props);
            }).filter((i)=>!!i)
        }
    };
    if (computedMenuTitle) {
        item.menu.title = computedMenuTitle;
    }
    return item;
}
function convertStackToolbarSubmenuMenuPropsToRNHeaderItem(props) {
    if (props.hidden) {
        return undefined;
    }
    const sharedProps = (0, _shared.convertStackHeaderSharedPropsToRNSharedHeaderItem)(props);
    const actions = _react().Children.toArray(props.children).filter((child)=>(0, _children.isChildOfType)(child, StackToolbarMenuAction) || (0, _children.isChildOfType)(child, StackToolbarMenu));
    const item = {
        type: 'submenu',
        items: actions.map((action)=>{
            if ((0, _children.isChildOfType)(action, StackToolbarMenu)) {
                return convertStackToolbarSubmenuMenuPropsToRNHeaderItem(action.props);
            }
            return convertStackToolbarMenuActionPropsToRNHeaderItem(action.props);
        }).filter((i)=>!!i),
        label: sharedProps.label || props.title || '',
        multiselectable: true
    };
    if (props.inline !== undefined) {
        item.inline = props.inline;
    }
    if (props.palette !== undefined) {
        item.layout = props.palette ? 'palette' : 'default';
    }
    if (props.destructive !== undefined) {
        item.destructive = props.destructive;
    }
    // TODO: Add elementSize to react-native-screens
    if (sharedProps.icon) {
        item.icon = sharedProps.icon;
    }
    return item;
}
const StackToolbarMenuAction = (props)=>{
    const placement = (0, _context.useToolbarPlacement)();
    if (process.env.EXPO_OS === 'ios' && placement !== 'bottom') {
        throw new Error('Stack.Toolbar.MenuAction must be used inside a Stack.Toolbar.Menu');
    }
    // TODO(@ubax): Handle image loading using useImage in a follow-up PR.
    const icon = typeof props.icon === 'string' ? props.icon : undefined;
    const source = typeof props.icon !== 'string' ? props.icon : undefined;
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_native.NativeToolbarMenuAction, {
        ...props,
        icon: icon,
        source: source,
        image: props.image,
        imageRenderingMode: props.iconRenderingMode
    });
};
function convertStackToolbarMenuActionPropsToRNHeaderItem(props) {
    const { children, isOn, unstable_keepPresented, icon, ...rest } = props;
    const sharedProps = (0, _shared.convertStackHeaderSharedPropsToRNSharedHeaderItem)(props);
    const item = {
        ...rest,
        description: props.subtitle,
        type: 'action',
        label: sharedProps.label,
        state: isOn ? 'on' : 'off',
        onPress: props.onPress ?? (()=>{})
    };
    if (unstable_keepPresented !== undefined) {
        item.keepsMenuPresented = unstable_keepPresented;
    }
    if (sharedProps.icon) {
        item.icon = sharedProps.icon;
    }
    return item;
}
const ALLOWED_CHILDREN = [
    StackToolbarMenu,
    StackToolbarMenuAction,
    _native.NativeToolbarMenu,
    _native.NativeToolbarMenuAction,
    _toolbarprimitives.StackToolbarLabel,
    _toolbarprimitives.StackToolbarIcon,
    _toolbarprimitives.StackToolbarBadge
];

//# sourceMappingURL=index.js.map
