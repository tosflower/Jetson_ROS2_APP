import type { NavigationAction, NavigationState } from '../react-navigation/native';
import type { RouterRegistry } from './routerRegistry';
import type { LinkToOptions } from './types';
interface NavigateToHrefIntent {
    type: 'NAVIGATE_TO_HREF';
    payload: {
        options: LinkToOptions;
        href: string;
        originalHref?: string;
    };
}
type RoutingIntentOptions = {
    inTransition?: boolean;
};
export type RoutingIntent = (NavigateToHrefIntent | {
    type: 'COMPUTED_ACTION';
    payload: {
        compute: (state: NavigationState, registry: RouterRegistry) => NavigationAction | undefined;
        originKey?: string;
    };
} | {
    type: 'ACTION';
    payload: {
        action: NavigationAction;
        originKey?: string;
    };
} | {
    type: 'BROWSER_HISTORY_CHANGED';
    payload: {
        id: string | null;
        path: string;
    };
}) & RoutingIntentOptions;
export type QueuedRoutingIntent = RoutingIntent & {
    actionId: number;
};
/** Marks `expo-router:action-enqueued` and returns the id of the new action. */
export declare function markActionEnqueuedAndReturnId(): number;
export {};
