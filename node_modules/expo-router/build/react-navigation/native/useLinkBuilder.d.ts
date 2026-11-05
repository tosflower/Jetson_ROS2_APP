import type { PartialState } from '../routers';
/**
 * Helper to build a href for a screen based on the linking options.
 */
export declare function useBuildHref(): (name: string, params?: object) => string;
/**
 * Helper to build a navigation action from a href based on the linking options.
 */
export declare const useBuildAction: () => (href: string) => {
    type: "RESET";
    payload: (Readonly<{
        key: string;
        routeKeySeq: number;
        index: number;
        routeNames: string[];
        history?: unknown[];
        routes: import("..").NavigationRoute<import("..").ParamListBase, string>[];
        type?: string;
        stale: false;
    }> | PartialState<Readonly<{
        key: string;
        routeKeySeq: number;
        index: number;
        routeNames: string[];
        history?: unknown[];
        routes: import("..").NavigationRoute<import("..").ParamListBase, string>[];
        type?: string;
        stale: false;
    }>>) & {
        __internal__routerActionState: true;
    };
} | {
    type: "NAVIGATE";
    payload: {
        pop?: boolean | undefined;
        state?: ((Readonly<{
            key: string;
            routeKeySeq: number;
            index: number;
            routeNames: string[];
            history?: unknown[];
            routes: import("..").NavigationRoute<import("..").ParamListBase, string>[];
            type?: string;
            stale: false;
        }> | PartialState<Readonly<{
            key: string;
            routeKeySeq: number;
            index: number;
            routeNames: string[];
            history?: unknown[];
            routes: import("..").NavigationRoute<import("..").ParamListBase, string>[];
            type?: string;
            stale: false;
        }>>) & {
            __internal__routerActionState: true;
        }) | undefined;
        path?: string | undefined;
        params?: object | undefined;
        name: string;
    };
};
/**
 * Helpers to build href or action based on the linking options.
 *
 * @returns `buildHref` to build an `href` for screen and `buildAction` to build an action from an `href`.
 */
export declare function useLinkBuilder(): {
    buildHref: (name: string, params?: object) => string;
    buildAction: (href: string) => {
        type: "RESET";
        payload: (Readonly<{
            key: string;
            routeKeySeq: number;
            index: number;
            routeNames: string[];
            history?: unknown[];
            routes: import("..").NavigationRoute<import("..").ParamListBase, string>[];
            type?: string;
            stale: false;
        }> | PartialState<Readonly<{
            key: string;
            routeKeySeq: number;
            index: number;
            routeNames: string[];
            history?: unknown[];
            routes: import("..").NavigationRoute<import("..").ParamListBase, string>[];
            type?: string;
            stale: false;
        }>>) & {
            __internal__routerActionState: true;
        };
    } | {
        type: "NAVIGATE";
        payload: {
            pop?: boolean | undefined;
            state?: ((Readonly<{
                key: string;
                routeKeySeq: number;
                index: number;
                routeNames: string[];
                history?: unknown[];
                routes: import("..").NavigationRoute<import("..").ParamListBase, string>[];
                type?: string;
                stale: false;
            }> | PartialState<Readonly<{
                key: string;
                routeKeySeq: number;
                index: number;
                routeNames: string[];
                history?: unknown[];
                routes: import("..").NavigationRoute<import("..").ParamListBase, string>[];
                type?: string;
                stale: false;
            }>>) & {
                __internal__routerActionState: true;
            }) | undefined;
            path?: string | undefined;
            params?: object | undefined;
            name: string;
        };
    };
};
