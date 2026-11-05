import type { NavigationState } from '../react-navigation/native';
export declare function findStateByKey(root: NavigationState, key: string): NavigationState | undefined;
export declare function resetNavigatorState(state: NavigationState, routerType: string | undefined): NavigationState;
