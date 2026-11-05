import { type ReactNode } from 'react';
import type { NativeStackNavigationOptions } from '../../../react-navigation/native-stack';
import type { ToolbarColors, ToolbarPlacement } from './context';
/**
 * On iOS, left/right toolbar items are converted to `unstable_headerLeftItems`/`unstable_headerRightItems`
 * which react-native-screens processes natively.
 */
export declare function processHeaderItemsForPlatform(children: ReactNode, placement: ToolbarPlacement, _colors?: ToolbarColors): NativeStackNavigationOptions | null;
