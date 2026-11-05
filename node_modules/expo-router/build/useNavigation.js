'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useNavigation", {
    enumerable: true,
    get: function() {
        return useNavigation;
    }
});
const _utils = require("./global-state/utils");
const _href = require("./link/href");
const _native = require("./react-navigation/native");
function useNavigation(parent) {
    const rnNavigation = (0, _native.useNavigation)();
    let navigation = rnNavigation;
    let state = (0, _native.useStateForPath)();
    if (parent === undefined) {
        // If no parent is provided, return the current navigation object
        return navigation;
    }
    // Check for the top-level navigator - we cannot fetch anything higher!
    const currentId = navigation.getId();
    if (currentId === '' || currentId === `/expo-router/build/views/Navigator`) {
        return navigation;
    }
    if (typeof parent === 'object') {
        parent = (0, _href.resolveHref)(parent);
    }
    if (parent === '/') {
        // This is the root navigator
        return navigation.getParent(`/expo-router/build/views/Navigator`) ?? navigation.getParent(``);
    } else if (parent?.startsWith('../')) {
        const names = [];
        while(state){
            const route = state.routes[0];
            state = route.state;
            // Don't include the last router, as thats the current route
            if (state) {
                names.push(route.name);
            }
        }
        // Removing the trailing slash to make splitting easier
        const originalParent = parent;
        if (parent.endsWith('/')) {
            parent = parent.slice(0, -1);
        }
        const segments = parent.split('/');
        if (!segments.every((segment)=>segment === '..')) {
            throw new Error(`Invalid parent path "${originalParent}". Only "../" segments are allowed when using relative paths.`);
        }
        const levels = segments.length;
        const index = names.length - 1 - levels;
        if (index < 0) {
            throw new Error(`Invalid parent path "${originalParent}". Cannot go up ${levels} levels from the current route.`);
        }
        parent = names[index];
        // Expo Router navigators use the context key as the name which has a leading `/`
        // The exception to this are the root stack routes, and the root navigator which uses ''
        if (parent && !(0, _utils.getRootStackRouteNames)().includes(parent)) {
            parent = `/${parent}`;
        }
    }
    navigation = navigation.getParent(parent);
    if (process.env.NODE_ENV !== 'production') {
        if (!navigation) {
            navigation = rnNavigation;
            const ids = [];
            while(navigation){
                if (navigation.getId()) ids.push(navigation.getId());
                navigation = navigation.getParent();
            }
            throw new Error(`Could not find parent navigation with route "${parent}". Available routes are: '${ids.join("', '")}'`);
        }
    }
    return navigation;
}

//# sourceMappingURL=useNavigation.js.map
