import type { RouteNode } from '../Route';
import type { ExpoLinkingOptions } from '../getLinkingConfig';
import type { NavigationAction } from '../react-navigation/native';
import type { NavigationState } from '../react-navigation/routers';
import type { SingularOptions } from '../useScreens';
import type { RouterRegistry } from './routerRegistry';
import type { LinkToOptions, StoreRedirects } from './types';
export type NavigationResolution = {
    status: 'action';
    action: NavigationAction;
} | {
    status: 'invalid';
    href: string;
};
export type NavigateActionConfig = {
    registry: RouterRegistry;
    routeNode?: RouteNode | null;
    linking?: Pick<ExpoLinkingOptions, 'config' | 'getStateFromPath'>;
    redirects?: StoreRedirects[];
};
export declare function getNavigateAction(baseHref: string, options: LinkToOptions, config: NavigateActionConfig, type: string | undefined, withAnchor: boolean | undefined, singular: SingularOptions | undefined, previewKey: string | undefined, navigationState: NavigationState): NavigationResolution;
