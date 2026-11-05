import { type ConfigPlugin } from 'expo/config-plugins';
/**
 * Controls whether async routes are enabled. `'development'` and `'production'` enable them
 * for that environment only. Production async routes are web-only.
 */
export type AsyncRouteOption = 'development' | 'production' | boolean;
/**
 * HTTP methods a redirect or rewrite rule can match.
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';
/**
 * A static redirect from one route to another.
 */
export type RedirectConfig = {
    /**
     * The previous file path that this route should redirect from.
     */
    source: string;
    /**
     * The target file path that this route should redirect to.
     */
    destination: string;
    /**
     * Whether the redirect is permanent (301 or 308) instead of temporary (302 or 307).
     * @default false
     */
    permanent?: boolean;
    /**
     * HTTP methods that should be redirected. Omit to redirect all methods.
     */
    methods?: HttpMethod[];
};
/**
 * A static rewrite from one route to another.
 */
export type RewriteConfig = {
    /**
     * The previous file path that should be rewritten.
     */
    source: string;
    /**
     * The target file path that this route should rewrite to.
     */
    destination: string;
    /**
     * HTTP methods that should be rewritten. Omit to rewrite all methods.
     */
    methods?: HttpMethod[];
};
/**
 * Response headers applied to routes matching a path.
 */
export type PageHeadersConfig = {
    /**
     * The path to match for the headers to apply.
     */
    source: string;
    /**
     * Response headers to apply for matching paths.
     */
    headers: Record<string, string | string[]>;
};
/**
 * Options accepted by the `expo-router` config plugin.
 */
export type Props = {
    /**
     * Production origin URL where assets in the public folder are hosted. The fetch function is
     * polyfilled to support relative requests from this origin in production. The development
     * origin is inferred using the Expo CLI development server.
     */
    origin?: string | boolean;
    /**
     * A more specific origin URL used in the `expo-router/head` module for iOS handoff.
     * @default origin
     */
    headOrigin?: string;
    /**
     * Changes the routes directory from `app` to another value. Avoid using this property.
     * @default 'app'
     */
    root?: string;
    /**
     * Enable or disable platform-specific routes.
     * @default true
     */
    platformRoutes?: boolean;
    /**
     * Enable or disable the automatically generated sitemap route at `/_sitemap`.
     * @default true
     */
    sitemap?: boolean;
    /**
     * Enable async routes. Stable and enabled by default on web in SDK 58 and later. Experimental
     * and disabled by default on native.
     */
    asyncRoutes?: AsyncRouteOption | {
        android?: AsyncRouteOption;
        ios?: AsyncRouteOption;
        web?: AsyncRouteOption;
        default?: AsyncRouteOption;
    };
    /**
     * Enable or disable partial route type generation.
     * @default true
     */
    partialRouteTypes?: boolean;
    /**
     * Static redirects.
     */
    redirects?: RedirectConfig[];
    /**
     * Static rewrites.
     */
    rewrites?: RewriteConfig[];
    /**
     * A list of headers that are set on every route response from the server.
     */
    headers?: Record<string, string | string[]>;
    /**
     * A list of headers that are set on a specific path's response from the server.
     */
    pageHeaders?: PageHeadersConfig[];
    /**
     * Enable API routes with static or server output. Defaults to `true` for server output and
     * `false` for static output.
     */
    apiRoutes?: boolean;
    /**
     * Enable experimental server middleware support. Middleware no longer requires an opt-in as of
     * SDK 58. This option has no effect.
     * @deprecated
     */
    unstable_useServerMiddleware?: boolean;
    /**
     * Data loaders no longer require an opt-in as of SDK 58. This option has no effect.
     * @deprecated
     */
    unstable_useServerDataLoaders?: boolean;
    /**
     * Server rendering no longer requires an opt-in as of SDK 58. This option has no effect.
     * @deprecated
     */
    unstable_useServerRendering?: boolean;
    /**
     * Disable synchronous layout updates for native screens.
     */
    disableSynchronousScreensUpdates?: boolean;
    /**
     * Rerender the app on color scheme changes. When enabled, the app tree will rerender when the
     * system theme changes (light/dark mode).
     * @default true
     */
    adaptiveColors?: boolean;
};
declare const withRouter: ConfigPlugin<Props | void>;
export default withRouter;
