"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "shouldRunMiddleware", {
    enumerable: true,
    get: function() {
        return shouldRunMiddleware;
    }
});
const _matchers = require("./matchers");
function shouldRunMiddleware(request, middleware, effectivePathname) {
    const matcher = middleware.unstable_settings?.matcher;
    // No matcher means middleware runs on all requests
    if (!matcher) {
        return true;
    }
    // Check HTTP methods, if specified
    if (matcher.methods) {
        const methods = matcher.methods.map((method)=>method.toUpperCase());
        if (methods.length === 0 || !methods.includes(request.method)) {
            return false;
        }
    }
    // Check path patterns, if specified
    if (matcher.patterns) {
        const patterns = Array.isArray(matcher.patterns) ? matcher.patterns : [
            matcher.patterns
        ];
        if (patterns.length === 0) {
            return false;
        }
        const rawPathname = new URL(request.url).pathname;
        if (patterns.some((pattern)=>matchesPattern(rawPathname, pattern))) {
            return true;
        }
        if (effectivePathname && effectivePathname !== rawPathname) {
            return patterns.some((pattern)=>matchesPattern(effectivePathname, pattern));
        }
        return false;
    }
    // If neither methods nor patterns are specified, run middleware on all requests
    return true;
}
/**
 * Tests if a pathname matches a given pattern. The matching order is as follows:
 *
 * - Exact string
 * - Named parameters (supports `[param]` and `[...param]`)
 * - Regular expression
 */ function matchesPattern(pathname, pattern) {
    if (typeof pattern === 'string') {
        if (pattern === pathname) {
            return true;
        }
        if (hasNamedParameters(pattern)) {
            return namedParamToRegex(pattern).test(pathname);
        }
    } else if (pattern != null) {
        // Prevent `g`/`y` flags from carrying `lastIndex` state across requests.
        pattern.lastIndex = 0;
        return pattern.test(pathname);
    }
    return false;
}
/**
 * Check if a pattern contains named parameters like `[postId]` or `[...slug]`
 */ function hasNamedParameters(pattern) {
    return pattern.split('/').some((segment)=>{
        return (0, _matchers.matchDynamicName)(segment) || (0, _matchers.matchDeepDynamicRouteName)(segment);
    });
}
/**
 * Convert a pattern with named parameters to regex
 */ function namedParamToRegex(pattern) {
    const normalizedPattern = pattern.replace(/\/$/, '') || '/';
    const segments = normalizedPattern.split('/');
    const regexSegments = segments.map((segment)=>{
        if (!segment) return '';
        if ((0, _matchers.matchDeepDynamicRouteName)(segment)) {
            return '.+';
        }
        if ((0, _matchers.matchDynamicName)(segment)) {
            return '[^/]+';
        }
        return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    });
    return new RegExp(`^${regexSegments.join('/')}(?:/)?$`);
}

//# sourceMappingURL=middleware.js.map
