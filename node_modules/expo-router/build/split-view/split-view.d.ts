import React, { type ReactNode } from 'react';
import { type SplitHostProps } from '../optional-libraries/react-native-screens';
import { SplitViewColumn, SplitViewInspector } from './elements';
/**
 * For full list of supported props, see [`SplitHostProps`](http://github.com/software-mansion/react-native-screens/blob/main/src/components/gamma/split/SplitHost.types.ts#L117)
 */
export interface SplitViewProps extends Omit<SplitHostProps, 'children'> {
    children?: ReactNode;
    /**
     * Enables React Activity for screens rendered by the detail slot.
     * @default false
     */
    activityEnabled?: boolean;
}
declare function SplitViewNavigator({ children, activityEnabled, ...splitViewHostProps }: SplitViewProps): React.JSX.Element;
export declare const SplitView: typeof SplitViewNavigator & {
    Column: typeof SplitViewColumn;
    Inspector: typeof SplitViewInspector;
};
export {};
