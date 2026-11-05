import { type CommonNavigationAction } from './types';
/**
 * Base router that handles the common actions (`SET_PARAMS`, `REPLACE_PARAMS`, `RESET`) and
 * filters undeclared routes. Every built-in router extends it.
 */
export declare const BaseRouter: (options: import("./types").DefaultRouterOptions) => import("./extendRouter").ExtendedRouter<Readonly<{
    key: string;
    routeKeySeq: number;
    index: number;
    routeNames: string[];
    history?: unknown[];
    routes: import("./types").NavigationRoute<import("./types").ParamListBase, string>[];
    type?: string;
    stale: false;
}>, CommonNavigationAction>;
