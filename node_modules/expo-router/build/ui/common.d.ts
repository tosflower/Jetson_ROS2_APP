import { type RouteNode } from '../Route';
import type { UrlObject } from '../global-state/getRouteInfoFromState';
import type { RouterRegistry } from '../global-state/routerRegistry';
import type { LinkingOptions, NavigationAction, NavigationState, ParamListBase, PartialState } from '../react-navigation/native';
import type { Href } from '../types';
import { Slot } from './Slot';
import type { ExpoTabActionType } from './TabRouter';
export declare const ViewSlot: Slot<import("react-native").ViewProps, import("react").Component<import("react-native").ViewProps, {}, any>>;
export type ScreenTrigger = {
    type: 'internal';
    href: Href;
    name: string;
    activityEnabled?: boolean;
} | {
    type: 'external';
    name: string;
    href: string;
};
type JumpToNavigationAction = Extract<ExpoTabActionType, {
    type: 'JUMP_TO';
}>;
type TriggerConfig = {
    type: 'internal';
    name: string;
    href: string;
    routeNode: RouteNode;
    layoutRouteNode: RouteNode;
    contextKey: string;
    action: JumpToNavigationAction;
    targetState?: PartialState<NavigationState>;
    deep: boolean;
    activityEnabled?: boolean;
} | {
    type: 'external';
    name: string;
    href: string;
};
export type TriggerMap = Record<string, TriggerConfig>;
export declare function getTabRoute(state: NavigationState, name: string): {
    route: import("../react-navigation").NavigationRoute<ParamListBase, string> | undefined;
    isSwitching: boolean;
};
export declare function buildTabAction(config: Extract<TriggerConfig, {
    type: 'internal';
}>, state: NavigationState, registry: RouterRegistry, resetOnFocus?: boolean): NavigationAction;
export declare function useTriggersToScreens(triggers: ScreenTrigger[], layoutRouteNode: RouteNode, linking: LinkingOptions<ParamListBase>, parentTriggerMap: TriggerMap, routeInfo: UrlObject, contextKey: string): {
    children: import("react").ReactNode[];
    triggerMap: TriggerMap;
};
export {};
