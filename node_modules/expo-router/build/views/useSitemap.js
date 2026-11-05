"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useSitemap", {
    enumerable: true,
    get: function() {
        return useSitemap;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _Route = require("../Route");
const _routerConfigContext = require("../global-state/routerConfigContext");
const _matchers = require("../matchers");
const routeSegments = (route, parents)=>[
        ...parents,
        ...route.route.split('/')
    ];
const routeHref = (route, parents)=>'/' + routeSegments(route, parents).map((segment)=>{
        // add an extra layer of entropy to the url for deep dynamic routes
        if ((0, _matchers.matchDynamicName)(segment)?.deep) {
            return segment + '/' + Date.now();
        }
        // index must be erased but groups can be preserved.
        return segment === 'index' ? '' : segment;
    }).filter(Boolean).join('/');
const routeFilename = (route)=>{
    const segments = route.contextKey.split('/');
    // join last two segments for layout routes
    if (route.contextKey.match(/_layout\.[jt]sx?$/)) {
        return segments[segments.length - 2] + '/' + segments[segments.length - 1];
    }
    const routeSegmentsCount = route.route.split('/').length;
    // Join the segment count in reverse order
    // This presents files without layout routes as children with all relevant segments.
    return segments.slice(-routeSegmentsCount).join('/');
};
const mapForRoute = (route, parents)=>({
        contextKey: route.contextKey,
        filename: routeFilename(route),
        href: routeHref(route, parents),
        isInternal: route.internal ?? false,
        isGenerated: route.generated ?? false,
        children: [
            ...route.children
        ].sort(_Route.sortRoutes).map((child)=>mapForRoute(child, routeSegments(route, parents)))
    });
function useSitemap() {
    // TODO(@ubax): Extract `routeNode` into a separate context to avoid unrelated rerenders.
    const routeNode = (0, _react().use)(_routerConfigContext.RouterConfigContext)?.routeNode;
    const sitemap = (0, _react().useMemo)(()=>routeNode ? mapForRoute(routeNode, []) : null, [
        routeNode
    ]);
    return sitemap;
}

//# sourceMappingURL=useSitemap.js.map
