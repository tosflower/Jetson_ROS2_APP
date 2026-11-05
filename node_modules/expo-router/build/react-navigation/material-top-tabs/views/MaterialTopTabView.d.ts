import type { MaterialTopTabDescriptorMap, MaterialTopTabEmitter, MaterialTopTabNavigationConfig, MaterialTopTabViewState } from '../types';
type Props = MaterialTopTabNavigationConfig & {
    state: MaterialTopTabViewState;
    descriptors: MaterialTopTabDescriptorMap;
    emitter: MaterialTopTabEmitter;
    navigateToTab: (routeKey: string) => void;
    navigateToTabSync: (routeKey: string) => void;
};
export declare function MaterialTopTabView({ tabBar, state, descriptors, emitter, navigateToTab, navigateToTabSync, safeAreaInsets, ...rest }: Props): import("react").JSX.Element;
export {};
