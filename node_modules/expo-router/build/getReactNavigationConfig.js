"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getReactNavigationConfig: null,
    getReactNavigationScreensConfig: null,
    parseRouteSegments: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getReactNavigationConfig () {
        return getReactNavigationConfig;
    },
    get getReactNavigationScreensConfig () {
        return getReactNavigationScreensConfig;
    },
    get parseRouteSegments () {
        return parseRouteSegments;
    }
});
const _matchers = require("./matchers");
// `[page]` -> `:page`
// `page` -> `page`
function convertDynamicRouteToReactNavigation(segment) {
    // NOTE(EvanBacon): To support shared routes we preserve group segments.
    if (segment === 'index') {
        return '';
    }
    if (segment === '+not-found') {
        return '*not-found';
    }
    const dynamicName = (0, _matchers.matchDynamicName)(segment);
    if (dynamicName && !dynamicName.deep) {
        return `:${dynamicName.name}`;
    } else if (dynamicName?.deep) {
        return '*' + dynamicName.name;
    } else {
        return segment;
    }
}
function parseRouteSegments(segments) {
    return(// NOTE(EvanBacon): When there are nested routes without layouts
    // the node.route will be something like `app/home/index`
    // this needs to be split to ensure each segment is parsed correctly.
    segments.split('/')// Convert each segment to a React Navigation format.
    .map(convertDynamicRouteToReactNavigation)// Remove any empty paths from groups or index routes.
    .filter(Boolean)// Join to return as a path.
    .join('/'));
}
function convertRouteNodeToScreen(node, metaOnly) {
    const path = parseRouteSegments(node.route);
    if (!node.children.length) {
        if (!metaOnly) {
            return {
                path,
                screens: {},
                _route: node
            };
        }
        return path;
    }
    const screens = getReactNavigationScreensConfig(node.children, metaOnly);
    const screen = {
        path,
        screens
    };
    if (!metaOnly) {
        screen._route = node;
    }
    return screen;
}
function getReactNavigationScreensConfig(nodes, metaOnly) {
    return Object.fromEntries(nodes.map((node)=>[
            node.route,
            convertRouteNodeToScreen(node, metaOnly)
        ]));
}
function getReactNavigationConfig(routeTree, metaOnly) {
    return {
        initialRouteName: undefined,
        screens: routeTree ? getReactNavigationScreensConfig(routeTree.children, metaOnly) : {}
    };
}

//# sourceMappingURL=getReactNavigationConfig.js.map
