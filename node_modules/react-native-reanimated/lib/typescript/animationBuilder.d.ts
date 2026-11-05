import type { ILayoutAnimationBuilder, LayoutAnimationFunction, StyleProps } from './commonTypes';
import type { NestedArray } from './createAnimatedComponent/commonTypes';
import type { ReanimatedKeyframe } from './layoutReanimation/animationBuilder/Keyframe';
export declare function checkStyleOverwriting(layoutAnimationOrBuilder: ILayoutAnimationBuilder | LayoutAnimationFunction | ReanimatedKeyframe, style: NestedArray<StyleProps>, displayName: string, onWarn: () => void): void;
export declare function maybeBuild(layoutAnimationOrBuilder: ILayoutAnimationBuilder | LayoutAnimationFunction | ReanimatedKeyframe): LayoutAnimationFunction | ReanimatedKeyframe;
//# sourceMappingURL=animationBuilder.d.ts.map