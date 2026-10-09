import type { ConfigPropertyAlias, UnknownRecord, ValueProcessor } from '../types';
type PropsBuilderPropertyConfig<TProps extends UnknownRecord = UnknownRecord, K extends keyof TProps = keyof TProps> = boolean | ConfigPropertyAlias<TProps> | {
    process: ValueProcessor<Required<TProps>[K], unknown>;
};
export type PropsBuilderConfig<P extends UnknownRecord = UnknownRecord> = {
    [K in keyof Required<P>]: PropsBuilderPropertyConfig<P, K>;
};
export declare function createNativePropsBuilder<TProps extends UnknownRecord>(config: PropsBuilderConfig<TProps>): {
    build(props: Partial<UnknownRecord>, options?: {
        target?: import("..").ValueProcessorTarget;
        includeUnprocessed?: boolean;
    }): UnknownRecord;
};
export type NativePropsBuilder = ReturnType<typeof createNativePropsBuilder>;
export declare const stylePropsBuilder: {
    build(props: Partial<UnknownRecord>, options?: {
        target?: import("..").ValueProcessorTarget;
        includeUnprocessed?: boolean;
    }): UnknownRecord;
};
export {};
//# sourceMappingURL=propsBuilder.d.ts.map