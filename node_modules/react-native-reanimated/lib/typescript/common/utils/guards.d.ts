import type { ConfigPropertyAlias, UnknownRecord } from '../types';
export declare const isDefined: <T>(value: T) => value is NonNullable<T>;
export declare const isAngle: (value: string | number) => value is `${number}deg` | `${number}rad`;
export declare const isNumber: (value: unknown) => value is number;
export declare const isNumberArray: (value: unknown) => value is number[];
export declare const isLength: (value: string) => boolean;
export declare const isPercentage: (value: unknown) => value is `${number}%`;
export declare const isRecord: <T extends UnknownRecord = UnknownRecord>(value: unknown) => value is T;
export declare const isEmptyObject: (value: unknown) => boolean;
export declare const isConfigPropertyAlias: <P extends object>(value: unknown) => value is ConfigPropertyAlias<P>;
export declare const hasValueProcessor: <T extends (params: unknown) => unknown>(configValue: unknown) => configValue is {
    process: T;
};
//# sourceMappingURL=guards.d.ts.map