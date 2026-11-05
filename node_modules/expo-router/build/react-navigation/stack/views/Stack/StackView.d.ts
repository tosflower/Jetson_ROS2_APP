import * as React from 'react';
import { type LocaleDirection, type Route } from '../../../native';
import type { StackNavigationConfig, StackViewDescriptorMap, StackViewEmit, StackViewState } from '../../types';
type Props = StackNavigationConfig & {
    direction: LocaleDirection;
    state: StackViewState;
    emit: StackViewEmit;
    isPreloaded: (key: string) => boolean;
    pop: (count: number, sourceRouteKey: string) => void;
    restoreRoute: (route: Route<string>) => boolean;
    descriptors: StackViewDescriptorMap;
};
type State = {
    routes: Route<string>[];
    previousState: StackViewState | undefined;
    previousDescriptors: StackViewDescriptorMap;
    openingRouteKeys: string[];
    closingRouteKeys: string[];
    replacingRouteKeys: string[];
    descriptors: StackViewDescriptorMap;
};
export declare class StackView extends React.Component<Props, State> {
    static getDerivedStateFromProps(props: Readonly<Props>, state: Readonly<State>): {
        routes: Route<string>[];
        previousState: StackViewState;
        descriptors: StackViewDescriptorMap;
        previousDescriptors: StackViewDescriptorMap;
        openingRouteKeys?: undefined;
        closingRouteKeys?: undefined;
        replacingRouteKeys?: undefined;
    } | {
        routes: import("../../..").NavigationRoute<import("../../..").ParamListBase, string>[];
        previousState: StackViewState;
        previousDescriptors: StackViewDescriptorMap;
        openingRouteKeys: string[];
        closingRouteKeys: string[];
        replacingRouteKeys: string[];
        descriptors: StackViewDescriptorMap;
    };
    state: State;
    private getPreviousRoute;
    private renderHeader;
    private handleOpenRoute;
    private handleCloseRoute;
    private handleTransitionStart;
    private handleTransitionEnd;
    private handleGestureStart;
    private handleGestureEnd;
    private handleGestureCancel;
    render(): React.JSX.Element;
}
export {};
