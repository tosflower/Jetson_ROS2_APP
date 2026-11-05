import * as React from 'react';
import type { RouteNode } from '../../Route';
import { type InitialState, type ParamListBase } from '../routers';
import type { NavigationContainerProps, NavigationContainerRef } from './types';
type InternalNavigationContainerProps = Omit<NavigationContainerProps, 'initialState'> & {
    initialState: InitialState;
    ref?: React.Ref<NavigationContainerRef<ParamListBase>>;
    UNSTABLE_routeNode?: RouteNode;
};
/**
 * Container component which holds the navigation state.
 * This should be rendered at the root wrapping the whole app.
 *
 * @param props.initialState Initial state object for the navigation tree.
 * @param props.theme Theme object for the UI elements.
 * @param props.children Child elements to render the content.
 * @param props.ref Ref object which refers to the navigation object containing helper methods.
 */
export declare function BaseNavigationContainer(props: InternalNavigationContainerProps): React.JSX.Element;
export {};
