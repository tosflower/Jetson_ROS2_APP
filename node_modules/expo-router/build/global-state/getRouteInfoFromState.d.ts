import type { NavigationState, PartialState } from '../react-navigation/native';
import type { UnknownOutputParams } from '../types';
import type { FocusedRouteState } from './types';
export type UrlObject = {
    unstable_globalHref: string;
    pathname: string;
    readonly params: UnknownOutputParams;
    searchParams: URLSearchParams;
    segments: string[];
    pathnameWithParams: string;
    isIndex: boolean;
};
export declare const defaultRouteInfo: UrlObject;
export declare function areUrlObjectsEqual(a: UrlObject, b: UrlObject): boolean;
/**
 * A better typed version of `FocusedRouteState` that is easier to parse
 */
export type StrictState = (FocusedRouteState | NavigationState | PartialState<NavigationState>) & {
    routes: {
        key?: string;
        name: string;
        params?: object;
        path?: string;
        state?: StrictState;
    }[];
};
export declare function getRouteInfoFromState(state?: StrictState): UrlObject;
/** Collects focused route names without decoding params or serializing a URL. */
export declare function getRouteSegmentsFromState(state?: StrictState): string[];
