import * as React from 'react';
import { type NavigatorTypeBagBase, type ParamListBase, type StackNavigationState, type TypedNavigator } from '../../native';
import type { NativeStackNavigationEventMap, NativeStackNavigationOptions, NativeStackNavigationProp, NativeStackNavigatorProps } from '../types';
declare function NativeStackNavigator({ id, initialRouteName, children, layout, screenListeners, screenOptions, screenLayout, UNSTABLE_router, ...rest }: NativeStackNavigatorProps): React.JSX.Element;
export declare function createNativeStackNavigator<const ParamList extends ParamListBase, const NavigatorID extends string | undefined = string | undefined, const TypeBag extends NavigatorTypeBagBase = {
    ParamList: ParamList;
    NavigatorID: NavigatorID;
    State: StackNavigationState<ParamList>;
    ScreenOptions: NativeStackNavigationOptions;
    EventMap: NativeStackNavigationEventMap;
    NavigationList: {
        [RouteName in keyof ParamList]: NativeStackNavigationProp<ParamList, RouteName, NavigatorID>;
    };
    Navigator: typeof NativeStackNavigator;
}>(): TypedNavigator<TypeBag>;
export {};
