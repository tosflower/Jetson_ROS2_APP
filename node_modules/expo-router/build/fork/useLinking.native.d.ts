import { type RefObject } from 'react';
import { type LinkingOptions, type NavigationContainerRef, type ParamListBase } from '../react-navigation/native';
type Options = LinkingOptions<ParamListBase>;
export declare function useLinking(ref: RefObject<NavigationContainerRef<ParamListBase>>, { prefixes, filter, config, getInitialURL, subscribe, getStateFromPath, }: Options): {
    getInitialState: () => Readonly<{
        key: string;
        routeKeySeq: number;
        index: number;
        routeNames: string[];
        history?: unknown[];
        routes: import("../react-navigation").NavigationRoute<ParamListBase, string>[];
        type?: string;
        stale: false;
    }> | Promise<Readonly<{
        key: string;
        routeKeySeq: number;
        index: number;
        routeNames: string[];
        history?: unknown[];
        routes: import("../react-navigation").NavigationRoute<ParamListBase, string>[];
        type?: string;
        stale: false;
    }> | undefined> | undefined;
};
export {};
