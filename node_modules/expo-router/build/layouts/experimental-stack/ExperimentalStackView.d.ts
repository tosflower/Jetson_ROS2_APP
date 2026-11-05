import * as React from 'react';
import type { NavigatorDescriptor } from 'standard-navigation';
import type { ExperimentalStackNavigationOptions, ExperimentalStackViewEmit, ExperimentalStackViewState } from './types';
type Props = {
    state: ExperimentalStackViewState;
    emit: ExperimentalStackViewEmit;
    isPreloaded: (key: string) => boolean;
    isRemovalPrevented: (key: string) => boolean;
    pop: (count: number, sourceRouteKey: string) => void;
    descriptors: Record<string, NavigatorDescriptor<ExperimentalStackNavigationOptions>>;
};
export declare function ExperimentalStackView({ state, emit, pop, descriptors, isPreloaded, isRemovalPrevented, }: Props): React.JSX.Element;
export {};
