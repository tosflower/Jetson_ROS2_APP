import type { UnknownRecord } from '../../types';
import type { RuleBuilderConfig, RuleBuildHandler } from './types';
export declare function createWebRuleBuilder<TProps extends UnknownRecord, TResult = Record<string, string>>(config: RuleBuilderConfig<TProps>, buildHandler: RuleBuildHandler<TProps, TResult>): {
    add(property: keyof TProps, value: TProps[keyof TProps]): void;
    build(): TResult;
};
//# sourceMappingURL=ruleBuilder.d.ts.map