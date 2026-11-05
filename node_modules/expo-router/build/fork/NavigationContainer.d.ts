import React from 'react';
import type { LinkingOptions, LocaleDirection, NavigationContainerProps, NavigationContainerRef } from '../react-navigation/native';
declare global {
    var REACT_NAVIGATION_DEVTOOLS: WeakMap<NavigationContainerRef<any>, {
        readonly linking: LinkingOptions<any>;
    }>;
}
type Props<ParamList extends object> = Omit<NavigationContainerProps, 'initialState'> & {
    direction?: LocaleDirection;
    linking?: LinkingOptions<ParamList>;
    fallback?: React.ReactNode;
};
export declare const NavigationContainer: <RootParamList extends object = ReactNavigation.RootParamList>(props: Props<RootParamList> & {
    ref?: React.Ref<NavigationContainerRef<RootParamList>>;
}) => React.ReactElement;
export {};
