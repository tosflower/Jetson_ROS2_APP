"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    extrapolateGroups: null,
    generateDynamic: null,
    getExactRoutes: null,
    getRoutes: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get extrapolateGroups () {
        return _getRoutesCore.extrapolateGroups;
    },
    get generateDynamic () {
        return _getRoutesCore.generateDynamic;
    },
    get getExactRoutes () {
        return getExactRoutes;
    },
    get getRoutes () {
        return getRoutes;
    }
});
const _getRoutesCore = require("./getRoutesCore");
function getRoutes(contextModule, options = {}) {
    return (0, _getRoutesCore.getRoutes)(contextModule, {
        getSystemRoute ({ route, type, defaults, redirectConfig, rewriteConfig }) {
            if (route === '' && type === 'layout') {
                // Root layout when no layout is defined.
                return {
                    type: 'layout',
                    loadRoute: ()=>({
                            default: require('./views/Navigator').DefaultNavigator
                        }),
                    // Generate a fake file name for the directory
                    contextKey: 'expo-router/build/views/Navigator.js',
                    route: '',
                    generated: true,
                    dynamic: null,
                    children: []
                };
            } else if (route === '_sitemap' && type === 'route') {
                return {
                    loadRoute () {
                        const { Sitemap, getNavOptions } = require('./views/Sitemap');
                        return {
                            default: Sitemap,
                            getNavOptions
                        };
                    },
                    route: '_sitemap',
                    type: 'route',
                    contextKey: 'expo-router/build/views/Sitemap.js',
                    generated: true,
                    internal: true,
                    dynamic: null,
                    children: []
                };
            } else if (route === '+not-found' && type === 'route') {
                return {
                    loadRoute () {
                        return {
                            default: require('./views/Unmatched').Unmatched
                        };
                    },
                    type: 'route',
                    route: '+not-found',
                    contextKey: 'expo-router/build/views/Unmatched.js',
                    generated: true,
                    internal: true,
                    dynamic: [
                        {
                            name: '+not-found',
                            deep: true,
                            notFound: true
                        }
                    ],
                    children: []
                };
            } else if (type === 'redirect' && redirectConfig && defaults) {
                return {
                    ...defaults,
                    loadRoute () {
                        return require('./getRoutesRedirects').getRedirectModule(redirectConfig);
                    }
                };
            } else if (type === 'rewrite' && rewriteConfig && defaults) {
                // Rewrite routes only work in a server context and have no equivalent on native or
                // static exports
                return {
                    ...defaults,
                    loadRoute () {
                        return {
                            default: contextModule(rewriteConfig.destinationContextKey).default
                        };
                    }
                };
            }
            throw new Error(`Unknown system route: ${route} and type: ${type} and redirectConfig: ${redirectConfig} and rewriteConfig: ${rewriteConfig}`);
        },
        ...options
    });
}
function getExactRoutes(contextModule, options = {}) {
    return getRoutes(contextModule, {
        ...options,
        skipGenerated: true
    });
}

//# sourceMappingURL=getRoutes.js.map
