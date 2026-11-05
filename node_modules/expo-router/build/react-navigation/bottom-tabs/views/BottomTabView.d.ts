import * as React from 'react';
import type { BottomTabDescriptorMap, BottomTabEmitter, BottomTabNavigationConfig, BottomTabViewState } from '../types';
type Props = BottomTabNavigationConfig & {
    state: BottomTabViewState;
    descriptors: BottomTabDescriptorMap;
    emitter: BottomTabEmitter;
    navigateToTab: (routeKey: string) => void;
    popNestedStackToTop: (routeKey: string) => void;
};
export declare function BottomTabView(props: Props): React.JSX.Element;
export {};
