import type { UnknownRecord } from '../..';
import type { RuleBuilder } from '../style/types';
export declare function hasNameAlias(configValue: unknown): configValue is {
    name: string;
    [key: string]: unknown;
};
export declare function isRuleBuilder<P extends UnknownRecord>(value: unknown): value is RuleBuilder<P>;
//# sourceMappingURL=guards.d.ts.map