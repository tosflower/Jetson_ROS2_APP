import * as React from 'react';
import type { NativeStackViewState } from '../types';
export declare function useDismissedRouteError(state: NativeStackViewState, isPreloaded: (key: string) => boolean): {
    setNextDismissedKey: React.Dispatch<React.SetStateAction<string | null>>;
};
