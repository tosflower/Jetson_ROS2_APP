import type { ComponentType } from 'react';
import type { LinkingConfigOptions } from '../getLinkingConfig';
import type { RequireContext } from '../types';
import type { RouterConfig } from './routerConfigContext';
export declare function useRouterConfig(context: RequireContext, linkingConfigOptions: LinkingConfigOptions, serverUrl?: string): {
    routerConfig: RouterConfig;
    rootComponent: ComponentType<any>;
};
