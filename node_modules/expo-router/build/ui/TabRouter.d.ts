import { type CommonNavigationAction, type ParamListBase, type TabActionType as RNTabActionType, type TabNavigationState, type TabRouterOptions as RNTabRouterOptions } from '../react-navigation/native';
import { type RouteState } from '../react-navigation/routers/attachRouteState';
import { type TriggerMap } from './common';
export type ExpoTabRouterOptions = RNTabRouterOptions & {
    triggerMap: TriggerMap;
};
export type ExpoTabActionType = RNTabActionType | CommonNavigationAction | {
    type: 'JUMP_TO';
    source?: string;
    target?: string;
    payload: {
        name: string;
        resetOnFocus?: boolean;
        params?: object;
        state?: RouteState;
    };
};
export declare const ExpoTabRouter: (options: ExpoTabRouterOptions) => import("..").ExtendedRouter<TabNavigationState<ParamListBase>, ExpoTabActionType>;
