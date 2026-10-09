import type { UnknownRecord, ValueProcessor } from '../types';
import { ValueProcessorTarget } from '../types';
type CreatePropsBuilderParams<TPropsConfig> = {
    config: TPropsConfig;
    processConfigValue: (configValue: TPropsConfig[keyof TPropsConfig], propertyKey: keyof TPropsConfig) => ValueProcessor | TPropsConfig[keyof TPropsConfig] | undefined;
};
type PropsBuilderResult<TProps> = {
    build(props: Partial<TProps>, options?: {
        target?: ValueProcessorTarget;
        includeUnprocessed?: boolean;
    }): UnknownRecord;
};
export default function createPropsBuilder<TProps extends UnknownRecord, TPropsConfig extends UnknownRecord>({ processConfigValue, config, }: CreatePropsBuilderParams<TPropsConfig>): PropsBuilderResult<TProps>;
export {};
//# sourceMappingURL=createPropsBuilder.d.ts.map