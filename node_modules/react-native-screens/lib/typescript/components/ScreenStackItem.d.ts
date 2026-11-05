import * as React from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { ScreenProps, ScreenStackHeaderConfigProps } from '../types';
import { type ScreenInstance } from './Screen';
import { SafeAreaViewProps } from './safe-area/SafeAreaView.types';
type Props = Omit<ScreenProps, 'enabled' | 'isNativeStack' | 'hasLargeHeader'> & {
    screenId: string;
    headerConfig?: ScreenStackHeaderConfigProps | undefined;
    contentStyle?: StyleProp<ViewStyle> | undefined;
    /**
     * Per-edge override of the safe area insets applied to the screen's content.
     *
     * On iOS 26+ the screen is laid out under the navigation bar and its content
     * is wrapped in a `SafeAreaView`. By default, the top edge is applied for
     * non-transparent header. Edges explicitly set to `true` or `false` override
     * the default.
     *
     * When `ScrollView` with `contentInsetAdjustmentBehavior="automatic"` is used
     * as Screen's content, setting `top: false` might mitigate some problems like
     * "jumping" behavior with non-transparent header and large title.
     *
     * Limitation: with `top: false`, a `formSheet` using `fitToContents` with a
     * visible header is sized to the content alone, without room for the header,
     * which overlaps the top of the content.
     *
     * Has no effect below iOS 26 and on other platforms.
     *
     * Please note that this prop is marked as unstable and might be subject of
     * breaking changes, including removal.
     *
     * @platform ios
     */
    unstable_safeAreaEdges?: SafeAreaViewProps['edges'] | undefined;
};
declare const _default: React.ForwardRefExoticComponent<Omit<Props, "ref"> & React.RefAttributes<ScreenInstance>>;
export default _default;
//# sourceMappingURL=ScreenStackItem.d.ts.map