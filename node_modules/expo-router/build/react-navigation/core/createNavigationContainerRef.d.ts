import type { ParamListBase } from '../routers';
import type { NavigationContainerRefWithCurrent } from './types';
export declare const NOT_INITIALIZED_ERROR = "The 'navigation' object hasn't been initialized yet. This might happen if you don't have a navigator mounted, or if the navigator hasn't finished mounting. In Expo Router, mount a navigator in a route layout before using navigation methods.";
export declare function createNavigationContainerRef<ParamList extends ParamListBase = ReactNavigation.RootParamList>(): NavigationContainerRefWithCurrent<ParamList>;
