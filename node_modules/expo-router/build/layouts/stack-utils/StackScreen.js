'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    StackScreen: null,
    appendScreenStackPropsToOptions: null,
    validateStackPresentation: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get StackScreen () {
        return StackScreen;
    },
    get appendScreenStackPropsToOptions () {
        return appendScreenStackPropsToOptions;
    },
    get validateStackPresentation () {
        return validateStackPresentation;
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
const _children = require("../../utils/children");
const _Screen = require("../../views/Screen");
const _StackHeaderComponent = require("./StackHeaderComponent");
const _StackTitle = require("./StackTitle");
const _screen = require("./screen");
const _toolbar = require("./toolbar");
const StackScreen = Object.assign(function StackScreen({ children, options, ...rest }) {
    // This component will only render when used inside a page.
    if (process.env.NODE_ENV !== 'production' && typeof options === 'function') {
        console.warn('Stack.Screen: Function-form options are not supported inside page components. Pass an options object directly.');
    }
    const ownOptions = (0, _react().useMemo)(()=>validateStackPresentation(typeof options === 'function' ? {} : options ?? {}), [
        options
    ]);
    return /*#__PURE__*/ (0, _jsxruntime().jsxs)(_jsxruntime().Fragment, {
        children: [
            /*#__PURE__*/ (0, _jsxruntime().jsx)(_Screen.Screen, {
                ...rest,
                options: ownOptions
            }),
            children
        ]
    });
}, {
    /**
     * @deprecated Use `Stack.Title` instead.
     */ Title: _StackTitle.StackTitle,
    BackButton: _screen.StackScreenBackButton
});
const VALID_PRESENTATIONS = [
    'card',
    'modal',
    'transparentModal',
    'containedModal',
    'containedTransparentModal',
    'fullScreenModal',
    'formSheet',
    'pageSheet'
];
function validateStackPresentation(options) {
    if (typeof options === 'function') {
        return (...args)=>{
            const resolved = options(...args);
            validateStackPresentation(resolved);
            return resolved;
        };
    }
    const presentation = options.presentation;
    if (presentation && !VALID_PRESENTATIONS.includes(presentation)) {
        throw new Error(`Invalid presentation value "${presentation}" passed to Stack.Screen. Valid values are: ${VALID_PRESENTATIONS.map((v)=>`"${v}"`).join(', ')}.`);
    }
    return options;
}
function appendScreenStackPropsToOptions(options, props) {
    let updatedOptions = {
        ...options,
        ...props.options
    };
    validateStackPresentation(updatedOptions);
    function appendChildOptions(child, opts) {
        if ((0, _children.isChildOfType)(child, _StackHeaderComponent.StackHeaderComponent)) {
            return (0, _StackHeaderComponent.appendStackHeaderPropsToOptions)(opts, child.props);
        }
        if ((0, _children.isChildOfType)(child, _StackTitle.StackTitle)) {
            return (0, _StackTitle.appendStackTitlePropsToOptions)(opts, child.props);
        }
        if ((0, _children.isChildOfType)(child, _screen.StackScreenBackButton)) {
            return (0, _screen.appendStackScreenBackButtonPropsToOptions)(opts, child.props);
        }
        if ((0, _children.isChildOfType)(child, _toolbar.StackToolbar)) {
            const placement = child.props.placement ?? 'bottom';
            if (placement === 'bottom') {
                throw new Error(`Stack.Toolbar with placement="bottom" cannot be used inside Stack.Screen.`);
            }
            return (0, _toolbar.appendStackToolbarPropsToOptions)(opts, child.props);
        }
        const typeName = typeof child.type === 'function' ? child.type.name || 'Unknown' : String(child.type);
        console.warn(`Unknown child element passed to Stack.Screen: ${typeName}`);
        return opts;
    }
    _react().Children.forEach(props.children, (child)=>{
        if (/*#__PURE__*/ (0, _react().isValidElement)(child)) {
            updatedOptions = appendChildOptions(child, updatedOptions);
        }
    });
    return updatedOptions;
}

//# sourceMappingURL=StackScreen.js.map
