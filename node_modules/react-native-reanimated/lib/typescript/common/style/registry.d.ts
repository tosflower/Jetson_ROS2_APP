import type { UnknownRecord } from '../types';
import { type NativePropsBuilder, type PropsBuilderConfig } from './propsBuilder';
export declare function isSupportedStyleProp(prop: string): boolean;
export declare function getCompoundComponentName(reactViewName: string, componentDisplayName: string): string;
export declare function getPropsBuilder(compoundComponentName: string): NativePropsBuilder;
export declare function registerComponentPropsBuilder<P extends UnknownRecord>(componentName: string | RegExp | ((name: string) => boolean), config: PropsBuilderConfig<P>, options?: {
    separatelyInterpolatedNestedProperties?: readonly string[];
}): void;
export declare function getSeparatelyInterpolatedNestedProperties(compoundComponentName: string): ReadonlySet<string>;
//# sourceMappingURL=registry.d.ts.map