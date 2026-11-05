import { type NavigationRoute, type ParamListBase } from '../react-navigation/core';
type HrefRoute = Pick<NavigationRoute<ParamListBase, string>, 'name' | 'params'>;
export declare function useBuildHref(): (route: HrefRoute) => string;
export {};
