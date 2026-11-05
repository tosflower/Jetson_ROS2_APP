"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    CurrentRenderContext: null,
    NavigationContainerRefContext: null,
    NavigationContext: null,
    NavigationHelpersContext: null,
    NavigationMetaContext: null,
    NavigationProvider: null,
    NavigationRouteContext: null,
    NavigatorTypeContext: null,
    ThemeContext: null,
    ThemeProvider: null,
    createNavigationContainerRef: null,
    createNavigatorFactory: null,
    findFocusedRoute: null,
    getFocusedRouteNameFromRoute: null,
    getPathFromState: null,
    getStateFromPath: null,
    useFocusEffect: null,
    useIsFocused: null,
    useNavigation: null,
    useNavigationBuilder: null,
    useNavigationContainerRef: null,
    useNavigationState: null,
    usePreventRemove: null,
    useRoute: null,
    useStateForPath: null,
    useTheme: null,
    validatePathConfig: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get CurrentRenderContext () {
        return _CurrentRenderContext.CurrentRenderContext;
    },
    get NavigationContainerRefContext () {
        return _NavigationContainerRefContext.NavigationContainerRefContext;
    },
    get NavigationContext () {
        return _NavigationContext.NavigationContext;
    },
    get NavigationHelpersContext () {
        return _NavigationHelpersContext.NavigationHelpersContext;
    },
    get NavigationMetaContext () {
        return _NavigationMetaContext.NavigationMetaContext;
    },
    get NavigationProvider () {
        return _NavigationProvider.NavigationProvider;
    },
    get NavigationRouteContext () {
        return _NavigationProvider.NavigationRouteContext;
    },
    get NavigatorTypeContext () {
        return _NavigatorTypeContext.NavigatorTypeContext;
    },
    get ThemeContext () {
        return _ThemeContext.ThemeContext;
    },
    get ThemeProvider () {
        return _ThemeProvider.ThemeProvider;
    },
    get createNavigationContainerRef () {
        return _createNavigationContainerRef.createNavigationContainerRef;
    },
    get createNavigatorFactory () {
        return _createNavigatorFactory.createNavigatorFactory;
    },
    get findFocusedRoute () {
        return _findFocusedRoute.findFocusedRoute;
    },
    get getFocusedRouteNameFromRoute () {
        return _getFocusedRouteNameFromRoute.getFocusedRouteNameFromRoute;
    },
    get getPathFromState () {
        return _getPathFromState.getPathFromState;
    },
    get getStateFromPath () {
        return _getStateFromPath.getStateFromPath;
    },
    get useFocusEffect () {
        return _useFocusEffect.useFocusEffect;
    },
    get useIsFocused () {
        return _useIsFocused.useIsFocused;
    },
    get useNavigation () {
        return _useNavigation.useNavigation;
    },
    get useNavigationBuilder () {
        return _useNavigationBuilder.useNavigationBuilder;
    },
    get useNavigationContainerRef () {
        return _useNavigationContainerRef.useNavigationContainerRef;
    },
    get useNavigationState () {
        return _useNavigationState.useNavigationState;
    },
    get usePreventRemove () {
        return _usePreventRemove.usePreventRemove;
    },
    get useRoute () {
        return _useRoute.useRoute;
    },
    get useStateForPath () {
        return _useStateForPath.useStateForPath;
    },
    get useTheme () {
        return _useTheme.useTheme;
    },
    get validatePathConfig () {
        return _validatePathConfig.validatePathConfig;
    }
});
0 && __export(require("./types")) && __export(require("../routers"));
const _createNavigationContainerRef = require("./createNavigationContainerRef");
const _createNavigatorFactory = require("./createNavigatorFactory");
const _CurrentRenderContext = require("./CurrentRenderContext");
const _findFocusedRoute = require("../../fork/findFocusedRoute");
const _getFocusedRouteNameFromRoute = require("./getFocusedRouteNameFromRoute");
const _getPathFromState = require("../../fork/getPathFromState");
const _getStateFromPath = require("../../fork/getStateFromPath");
const _NavigationContainerRefContext = require("./NavigationContainerRefContext");
const _NavigationContext = require("./NavigationContext");
const _NavigationHelpersContext = require("./NavigationHelpersContext");
const _NavigationMetaContext = require("./NavigationMetaContext");
const _NavigatorTypeContext = require("./NavigatorTypeContext");
const _NavigationProvider = require("./NavigationProvider");
const _ThemeContext = require("./theming/ThemeContext");
const _ThemeProvider = require("./theming/ThemeProvider");
const _useTheme = require("./theming/useTheme");
_export_star(require("./types"), exports);
const _useFocusEffect = require("./useFocusEffect");
const _useIsFocused = require("./useIsFocused");
const _useNavigation = require("./useNavigation");
const _useNavigationBuilder = require("./useNavigationBuilder");
const _useNavigationContainerRef = require("./useNavigationContainerRef");
const _useNavigationState = require("./useNavigationState");
const _usePreventRemove = require("./usePreventRemove");
const _useRoute = require("./useRoute");
const _useStateForPath = require("./useStateForPath");
const _validatePathConfig = require("../../fork/validatePathConfig");
_export_star(require("../routers"), exports);
function _export_star(from, to) {
    Object.keys(from).forEach(function(k) {
        if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) {
            Object.defineProperty(to, k, {
                enumerable: true,
                get: function() {
                    return from[k];
                }
            });
        }
    });
    return from;
}

//# sourceMappingURL=index.js.map
