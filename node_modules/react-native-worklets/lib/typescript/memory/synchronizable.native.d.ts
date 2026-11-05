import type { FixedSynchronizable, Synchronizable, SynchronizableConfig } from './types';
export declare function createSynchronizable<TValue extends number | boolean>(initialValue: TValue, config: SynchronizableConfig & {
    fixedType: true;
}): FixedSynchronizable<TValue extends boolean ? boolean : number>;
export declare function createSynchronizable<TValue extends number | boolean>(initialValue: TValue, config: SynchronizableConfig): Synchronizable<TValue> | FixedSynchronizable<TValue>;
export declare function createSynchronizable<TValue = unknown>(initialValue: TValue, config?: SynchronizableConfig): Synchronizable<TValue>;
//# sourceMappingURL=synchronizable.native.d.ts.map