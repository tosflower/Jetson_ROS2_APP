"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ExpoError: null,
    createRequestHandler: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ExpoError () {
        return ExpoError;
    },
    get createRequestHandler () {
        return createRequestHandler;
    }
});
const _ImmutableRequest = require("../ImmutableRequest");
const _matchers = require("../utils/matchers");
const _middleware = require("../utils/middleware");
const _headers = require("../utils/headers");
const LOADER_PREFIX = '/_expo/loaders';
class ExpoError extends Error {
    constructor(message){
        super(message);
        this.name = 'ExpoError';
    }
    static isExpoError(error) {
        return !!error && error instanceof ExpoError;
    }
}
function noopBeforeResponse(responseInit, _route) {
    return responseInit;
}
function createRequestHandler({ getRoutesManifest, getHtml, getApiRoute, getMiddleware, getLoaderData, beforeErrorResponse = noopBeforeResponse, beforeResponse = noopBeforeResponse, beforeHTMLResponse = noopBeforeResponse, beforeAPIResponse = noopBeforeResponse }) {
    let manifest = null;
    return async function handler(request) {
        manifest = await getRoutesManifest();
        return requestHandler(request, manifest);
    };
    async function requestHandler(incomingRequest, manifest) {
        if (!manifest) {
            // NOTE(@EvanBacon): Development error when Expo Router is not setup.
            // NOTE(@kitten): If the manifest is not found, we treat this as
            // an SSG deployment and do nothing
            return createResponse(null, null, 'Not found', {
                status: 404,
                headers: new Headers({
                    'Content-Type': 'text/plain'
                })
            });
        }
        let request = incomingRequest;
        let url = new URL(request.url);
        const globalOverrides = manifest.headers ? {
            headers: manifest.headers
        } : undefined;
        // `pageHeaders` rules apply to HTML and loader responses, matched on the request pathname.
        const pageOverrides = {
            headers: resolveRouteHeaders(url.pathname)
        };
        if (manifest.middleware) {
            const middleware = await getMiddleware(manifest.middleware);
            // Pass the route a loader endpoint resolves to, so matchers can't be bypassed via `/_expo/loaders/...`.
            const effectivePathname = url.pathname.startsWith(LOADER_PREFIX + '/') ? url.pathname.slice(LOADER_PREFIX.length).replace(/\/index$/, '/') : url.pathname;
            if ((0, _middleware.shouldRunMiddleware)(request, middleware, effectivePathname)) {
                const middlewareResponse = await middleware.default(new _ImmutableRequest.ImmutableRequest(request));
                if (middlewareResponse instanceof Response) {
                    return middlewareResponse;
                }
            // If middleware returns undefined/void, continue to route matching
            }
        }
        if (manifest.redirects) {
            for (const route of manifest.redirects){
                if (!route.namedRegex.test(url.pathname)) {
                    continue;
                }
                if (route.methods && !route.methods.includes(request.method)) {
                    continue;
                }
                return respondRedirect(url, request, route);
            }
        }
        if (manifest.rewrites) {
            for (const route of manifest.rewrites){
                if (!route.namedRegex.test(url.pathname)) {
                    continue;
                }
                if (route.methods && !route.methods.includes(request.method)) {
                    continue;
                }
                // Replace URL and Request with rewrite target
                url = new URL((0, _matchers.getRedirectRewriteLocation)(url, request, route), url);
                request = new Request(url, request);
            }
        }
        // First, test static routes and loader data requests
        if (request.method === 'GET' || request.method === 'HEAD') {
            const isLoaderRequest = url.pathname.startsWith(LOADER_PREFIX + '/');
            const matchedPath = isLoaderRequest ? url.pathname.slice(LOADER_PREFIX.length).replace(/\/index$/, '/') : url.pathname;
            for (const route of manifest.htmlRoutes){
                if (!route.namedRegex.test(matchedPath)) {
                    continue;
                }
                // Handle loader data requests for client-side navigation
                if (isLoaderRequest) {
                    if (!route.loader) {
                        continue; // Route matched but has no loader
                    }
                    // Create a request with the actual route path so `parseParams()` works correctly
                    // NOTE(@hassankhan): Relocate the request rewriting logic from here
                    url.pathname = matchedPath;
                    const loaderRequest = new Request(url, request);
                    return createResponseFrom('api', route, await getLoaderData(loaderRequest, route), pageOverrides);
                }
                const html = await getHtml(request, route);
                return respondHTML(html, route, pageOverrides);
            }
        }
        // Next, test API routes
        for (const route of manifest.apiRoutes){
            if (!route.namedRegex.test(url.pathname)) {
                continue;
            }
            const mod = await getApiRoute(route);
            return await respondAPI(mod, request, route, globalOverrides);
        }
        // Finally, test 404 routes
        if (request.method === 'GET' || request.method === 'HEAD') {
            for (const route of manifest.notFoundRoutes){
                if (!route.namedRegex.test(url.pathname)) {
                    continue;
                }
                try {
                    const contents = await getHtml(request, route);
                    return respondNotFoundHTML(contents, route, pageOverrides);
                } catch  {
                    continue;
                }
            }
        }
        // 404
        return createResponse(null, null, 'Not found', {
            status: 404,
            headers: new Headers({
                'Content-Type': 'text/plain'
            })
        }, globalOverrides);
    }
    function createResponse(routeType = null, route, bodyInit, responseInit, overrides) {
        const originalStatus = responseInit.status;
        let callbackRoute;
        if (route && routeType) {
            route.type = routeType;
            callbackRoute = route;
        } else {
            callbackRoute = {
                type: null
            };
        }
        let modifiedResponseInit = responseInit;
        // Headers already set on the response are never replaced (see `PageHeaderInfo` for the
        // full precedence order)
        if (overrides?.headers) {
            (0, _headers.appendHeadersRecord)(modifiedResponseInit.headers, overrides.headers, false);
        }
        // Callback call order matters, general rule is to call more specific callbacks first.
        if (routeType === 'html') {
            modifiedResponseInit = beforeHTMLResponse(modifiedResponseInit, callbackRoute);
        }
        if (routeType === 'api') {
            modifiedResponseInit = beforeAPIResponse(modifiedResponseInit, callbackRoute);
        }
        // Second to last is error response callback
        if (typeof originalStatus === 'number' && (originalStatus === 0 /* Response.error() */  || originalStatus > 399)) {
            modifiedResponseInit = beforeErrorResponse(modifiedResponseInit, callbackRoute);
        }
        // Generic before response callback last
        modifiedResponseInit = beforeResponse(modifiedResponseInit, callbackRoute);
        if (originalStatus === 0) {
            // Response.error() results in status 0, which will cause new Response() to fail.
            // We convert it to 500 only if originally 0, if cbs set the values to 0, we don't protect against it.
            modifiedResponseInit.status = 500;
        }
        return new Response(bodyInit, modifiedResponseInit);
    }
    function createResponseFrom(routeType = null, route, response, overrides) {
        const modifiedResponseInit = {
            headers: new Headers(response.headers),
            status: response.status,
            statusText: response.statusText,
            // NOTE(@kitten): Depending on if workerd types are used this may not be defined
            cf: response.cf,
            webSocket: response.webSocket
        };
        return createResponse(routeType, route, response.body, modifiedResponseInit, overrides);
    }
    async function respondNotFoundHTML(html, route, overrides) {
        if (typeof html === 'string') {
            return createResponse('notFoundHtml', route, html, {
                status: 404,
                headers: new Headers({
                    'Content-Type': 'text/html'
                })
            }, overrides);
        }
        if ((0, _matchers.isResponse)(html)) {
            // Only used for development errors
            return html;
        }
        if (html != null) {
            return createResponse('notFoundHtml', route, html, {
                status: 404,
                headers: new Headers({
                    'Content-Type': 'text/html'
                })
            }, overrides);
        }
        throw new ExpoError(`HTML route file ${route.page}.html could not be loaded`);
    }
    async function respondAPI(mod, request, route, overrides) {
        if (!mod || typeof mod !== 'object') {
            throw new ExpoError(`API route module ${route.page} could not be loaded`);
        }
        if ((0, _matchers.isResponse)(mod)) {
            // Only used for development API route bundling errors
            return mod;
        }
        const handler = mod[request.method];
        if (!handler || typeof handler !== 'function') {
            return createResponse('notAllowedApi', route, 'Method not allowed', {
                status: 405,
                headers: new Headers({
                    'Content-Type': 'text/plain'
                })
            }, overrides);
        }
        const params = (0, _matchers.parseParams)(request, route);
        const response = await handler(request, params);
        if (!(0, _matchers.isResponse)(response)) {
            throw new ExpoError(`API route ${request.method} handler ${route.page} resolved to a non-Response result`);
        }
        return createResponseFrom('api', route, response, overrides);
    }
    function respondHTML(html, route, overrides) {
        if (typeof html === 'string') {
            return createResponse('html', route, html, {
                status: 200,
                headers: new Headers({
                    'Content-Type': 'text/html'
                })
            }, overrides);
        }
        if ((0, _matchers.isResponse)(html)) {
            // Only used for development error responses
            return html;
        }
        if (html != null) {
            return createResponse('html', route, html, {
                status: 200,
                headers: new Headers({
                    'Content-Type': 'text/html'
                })
            }, overrides);
        }
        throw new ExpoError(`HTML route file ${route.page}.html could not be loaded`);
    }
    function respondRedirect(url, request, route) {
        // NOTE(@krystofwoldrich): @expo/server would not redirect when location was empty,
        // it would keep searching for match and eventually return 404. Worker redirects to origin.
        const target = (0, _matchers.getRedirectRewriteLocation)(url, request, route);
        let status;
        if (request.method === 'GET' || request.method === 'HEAD') {
            status = route.permanent ? 301 : 302;
        } else {
            status = route.permanent ? 308 : 307;
        }
        return new Response(null, {
            status,
            headers: {
                Location: target
            }
        });
    }
    function resolveRouteHeaders(pathname) {
        const pageHeaderRules = (manifest?.pageHeaders ?? []).filter((rule)=>rule.namedRegex.test(pathname));
        let mergedHeaders = manifest?.headers ?? {};
        for (const rule of pageHeaderRules){
            mergedHeaders = (0, _headers.mergeHeaderInputs)(mergedHeaders, rule.headers);
        }
        return mergedHeaders;
    }
}

//# sourceMappingURL=abstract.js.map
