import type { StaticFeatureFlagsSchema } from './staticFeatureFlags';
type DynamicFlagsType = {
    EXAMPLE_DYNAMIC_FLAG: boolean;
    init(): void;
    setFlag(name: DynamicFlagName, value: boolean): void;
    getFlag(name: DynamicFlagName): boolean;
};
type DynamicFlagName = keyof Omit<Omit<DynamicFlagsType, 'setFlag' | 'getFlag'>, 'init'>;
/** @knipIgnore */
export declare const DynamicFlags: DynamicFlagsType;
export declare function setDynamicFeatureFlag(name: DynamicFlagName, value: boolean): void;
export declare function getDynamicFeatureFlag(name: DynamicFlagName): boolean;
export declare function getStaticFeatureFlag(name: keyof StaticFeatureFlagsSchema): boolean;
export {};
//# sourceMappingURL=index.d.ts.map