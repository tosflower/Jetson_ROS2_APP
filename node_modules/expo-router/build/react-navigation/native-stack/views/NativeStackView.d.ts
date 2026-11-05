import * as React from 'react';
import type { NativeStackDescriptorMap, NativeStackNavigationConfig, NativeStackViewEmit, NativeStackViewState } from '../types';
type Props = {
    state: NativeStackViewState;
    descriptors: NativeStackDescriptorMap;
    emit: NativeStackViewEmit;
    isPreloaded: (key: string) => boolean;
    isRemovalPrevented: (key: string) => boolean;
    pop: (count: number, sourceRouteKey: string) => void;
} & NativeStackNavigationConfig;
export declare function NativeStackView({ state, descriptors, isPreloaded, isRemovalPrevented: _isRemovalPrevented, }: Props): React.JSX.Element;
export {};
