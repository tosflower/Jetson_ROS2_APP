import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import type { ConfigPropertyAlias, ValueProcessor } from '../types';
/**
 * Intersection of every React Native style type with deprecated props stripped.
 * Used internally by the props builder configs to enforce that the configs
 * cover every valid style key. Not part of the public API.
 */
export type AllStyleProps = Omit<ViewStyle & TextStyle & ImageStyle, 'transformMatrix' | 'rotation' | 'scaleX' | 'scaleY' | 'translateX' | 'translateY'>;
type PropertyValueConfigBase<P extends object> = boolean | ConfigPropertyAlias<P>;
type PropsBuilderPropertyConfig<P extends object, K extends keyof P = keyof P> = PropertyValueConfigBase<P> | {
    process: ValueProcessor<Required<P>[K], any>;
};
export type PropsBuilderConfig<P extends object> = {
    [K in keyof Required<P>]: PropsBuilderPropertyConfig<P, K>;
};
export {};
//# sourceMappingURL=types.d.ts.map