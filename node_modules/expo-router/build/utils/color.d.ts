import type { ColorValue } from 'react-native';
export declare function isDark(value: ColorValue): boolean | undefined;
export declare function isLight(value: ColorValue): boolean | undefined;
export declare function alpha(value: ColorValue): number | undefined;
export declare function alpha(value: ColorValue, opacity: number): string | undefined;
export declare function darken(value: ColorValue, ratio: number): string | undefined;
