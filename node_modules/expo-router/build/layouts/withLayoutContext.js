"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    useFilterScreenChildren: null,
    withLayoutContext: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get useFilterScreenChildren () {
        return useFilterScreenChildren;
    },
    get withLayoutContext () {
        return withLayoutContext;
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
const _Route = require("../Route");
const _NativeTabTrigger = require("../native-tabs/NativeTabTrigger");
const _useScreens = require("../useScreens");
const _Protected = require("../views/Protected");
const _Screen = require("../views/Screen");
const _GuardContext = require("./GuardContext");
function useFilterScreenChildren(children, { isCustomNavigator, contextKey } = {}) {
    return (0, _react().useMemo)(()=>{
        const customChildren = [];
        const screens = [];
        const guardedRedirects = new Map();
        function flattenChild(child, exclude = false, redirectTo) {
            if ((0, _Screen.isScreen)(child, contextKey)) {
                screens.push(child.props);
                if (exclude) {
                    guardedRedirects.set(child.props.name, redirectTo);
                }
                return;
            }
            if ((0, _NativeTabTrigger.isNativeTabTrigger)(child, contextKey)) {
                const options = (0, _NativeTabTrigger.convertTabPropsToOptions)(child.props);
                screens.push({
                    ...child.props,
                    options: exclude ? {
                        ...options,
                        hidden: true
                    } : options
                });
                if (exclude) {
                    guardedRedirects.set(child.props.name, redirectTo);
                }
                return;
            }
            if ((0, _Protected.isProtectedReactElement)(child)) {
                const guardFails = !child.props.guard;
                const excludeChildren = exclude || guardFails;
                const childRedirectTo = guardFails ? child.props.redirectTo : redirectTo;
                _react().Children.forEach(child.props.children, (protectedChild)=>{
                    flattenChild(protectedChild, excludeChildren, childRedirectTo);
                });
                return;
            }
            if (isCustomNavigator) {
                customChildren.push(child);
                return null;
            }
            console.warn(`Layout children must be of type Screen, all other children are ignored. To use custom children, create a custom <Layout />. Update Layout Route at: "app${contextKey}/_layout"`);
            return null;
        }
        _react().Children.forEach(children, (child)=>flattenChild(child));
        // Add an assertion for development
        if (process.env.NODE_ENV !== 'production') {
            // Assert if names are not unique
            const screenNames = screens?.map((screen)=>screen && typeof screen === 'object' && 'name' in screen && screen.name) ?? [];
            const allNames = screenNames.map((name)=>typeof name === 'string' ? (0, _GuardContext.normalizeRouteName)(name) : name);
            if (new Set(allNames).size !== allNames.length) {
                throw new Error('Screen names must be unique: ' + allNames);
            }
        }
        return {
            screens,
            children: customChildren,
            guardedRedirects
        };
    }, [
        children
    ]);
}
function withLayoutContext(Nav, processScreens) {
    return Object.assign(/*#__PURE__*/ (0, _react().forwardRef)(({ children: userDefinedChildren, ...props }, ref)=>{
        const contextKey = (0, _Route.useContextKey)();
        const node = (0, _Route.useRouteNode)();
        const { screens, guardedRedirects } = useFilterScreenChildren(userDefinedChildren, {
            contextKey
        });
        const screenNames = processScreens && process.env.NODE_ENV !== 'production' ? new Set(screens.map(({ name })=>name)) : undefined;
        const processed = processScreens ? processScreens(screens ?? []) : screens;
        if (screenNames && processed) {
            const processedNames = processed.map(({ name })=>name);
            if (processedNames.length !== screenNames.size || new Set(processedNames).size !== screenNames.size || !processedNames.every((name)=>screenNames.has(name))) {
                throw new Error('`processScreens` must not add, remove, rename, or duplicate screens. ' + `Received: ${JSON.stringify(processedNames)}. ` + `Expected: ${JSON.stringify([
                    ...screenNames
                ])}.`);
            }
        }
        const sorted = (0, _useScreens.useSortedScreens)(processed ?? [], guardedRedirects);
        // Prevent throwing an error when there are no screens.
        if (!sorted.length) {
            return null;
        }
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(_GuardContext.GuardContextProvider, {
            node: node,
            guardedRedirects: guardedRedirects,
            children: /*#__PURE__*/ (0, _jsxruntime().jsx)(Nav, {
                ...props,
                id: contextKey,
                ref: ref,
                children: sorted
            })
        });
    }), {
        Screen: _Screen.Screen,
        Protected: _Protected.Protected
    });
}

//# sourceMappingURL=withLayoutContext.js.map
