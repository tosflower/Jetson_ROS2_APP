import * as React from 'react';
import type { NavigationState, PartialState } from '../routers';
export declare const NavigationStateContext: React.Context<{
    isDefault?: true;
    state?: NavigationState | PartialState<NavigationState>;
    addOptionsGetter?: (key: string, getter: () => object | undefined | null) => void;
}>;
