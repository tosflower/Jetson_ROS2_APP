import { type ColorValue, type ViewStyle } from 'react-native';
type ShadowConfig = {
    offset: {
        width: number;
        height: number;
    };
    radius: number;
    opacity: number;
    color?: ColorValue;
};
export declare function getShadowStyle({ offset, radius, opacity, color, }: ShadowConfig): ViewStyle;
export {};
