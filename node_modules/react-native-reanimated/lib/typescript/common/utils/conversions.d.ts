import type { ConvertValuesToArrays } from '../types';
export declare function convertPropertyToArray<T>(value: T | undefined): T[];
export declare function convertPropertiesToArrays<T extends object>(config: T): ConvertValuesToArrays<T>;
export declare function kebabizeCamelCase<T extends string>(property: T): string;
export declare function camelizeKebabCase<T extends string>(property: T): string;
//# sourceMappingURL=conversions.d.ts.map