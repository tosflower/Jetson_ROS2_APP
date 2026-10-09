import type { UnknownRecord } from '../../types';
import type { PropsBuilderConfig } from './types';
type WebPropsBuilderConfig<P extends UnknownRecord = UnknownRecord> = PropsBuilderConfig<P>;
type WebPropsBuilderOptions = {
    important?: boolean;
    includeUnprocessed?: boolean;
};
export type WebPropsBuilder<P extends UnknownRecord = UnknownRecord> = {
    build(props: Partial<P>, options?: WebPropsBuilderOptions): string | null;
};
export declare function createWebPropsBuilder<TProps extends UnknownRecord>(config: WebPropsBuilderConfig<TProps>): WebPropsBuilder<TProps>;
export declare const webPropsBuilder: WebPropsBuilder<import("../../style/types").AllStyleProps>;
export {};
//# sourceMappingURL=propsBuilder.d.ts.map