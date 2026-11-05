import type { ShadowNodeWrapper } from '../../../commonTypes';
import type { ExistingCSSAnimationProperties, ICSSAnimationsManager } from '../../types';
export default class CSSAnimationsManager implements ICSSAnimationsManager {
    private readonly shadowNodeWrapper;
    private readonly viewTag;
    private readonly compoundComponentName;
    private attachedAnimations;
    private appliedEventMask;
    constructor(shadowNodeWrapper: ShadowNodeWrapper, viewTag: number, compoundComponentName: string);
    hasAttachedAnimations(): boolean;
    update(animationProperties: ExistingCSSAnimationProperties | null, eventMask?: number): void;
    unmountCleanup(): void;
    private apply;
    private detach;
    private registerKeyframesUsage;
    private unregisterKeyframesUsage;
    private processAnimations;
    private buildAnimationsMap;
    private getAnimationUpdates;
}
//# sourceMappingURL=CSSAnimationsManager.d.ts.map