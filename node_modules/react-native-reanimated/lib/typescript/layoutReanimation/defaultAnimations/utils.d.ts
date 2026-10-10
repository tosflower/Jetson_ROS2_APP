import type { AnimationFunction, LayoutAnimationAndConfig } from '../../commonTypes';
import type { TransformArray, TransformsConfig } from './types';
export declare function resolveTransformSlot<const TTransforms extends TransformArray, TEntry extends TTransforms[number]>(entry: TEntry, index: number, values: Partial<TransformsConfig<TTransforms>> | undefined): {
    key: keyof TEntry;
    value: TEntry[keyof TEntry];
};
export declare function resolveTransformValue<const TTransforms extends TransformArray, TEntry extends TTransforms[number]>(entry: TEntry, index: number, values: Partial<TransformsConfig<TTransforms>> | undefined): TEntry[keyof TEntry];
export declare function pickTransformValues<const TTransforms extends TransformArray>(defaults: TTransforms, values: Partial<TransformsConfig<TTransforms>> | undefined): TTransforms;
export declare function animateTransformToValues<const TTransforms extends TransformArray>(defaults: TTransforms, values: Partial<TransformsConfig<TTransforms>> | undefined, [animation, config]: LayoutAnimationAndConfig, delayFunction: AnimationFunction, delay: number): TTransforms;
//# sourceMappingURL=utils.d.ts.map