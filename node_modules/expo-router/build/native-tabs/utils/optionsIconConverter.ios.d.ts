import type { ColorValue } from 'react-native';
import type { NativeTabsTriggerIconProps } from '../common/elements';
import type { IconRenderingMode, NativeTabOptions } from '../types';
import type { AwaitedIcon } from './icon';
import { type ScreensPropsIcon } from './optionsIconConverter.shared';
export declare function appendIconOptions(options: NativeTabOptions, props: NativeTabsTriggerIconProps): void;
export declare function resolveIconRenderingMode(icon: AwaitedIcon | undefined, iconColor?: ColorValue): IconRenderingMode | undefined;
export declare function convertOptionsIconToScreensPropsIcon(icon: AwaitedIcon | undefined, renderingMode?: IconRenderingMode): Extract<ScreensPropsIcon, {
    platform: 'ios';
}> | undefined;
