import type { ShadowNodeWrapper } from '../../../commonTypes';
import type { ExistingCSSAnimationProperties, ICSSAnimationsManager } from '../../types';
export default class CSSAnimationsManager implements ICSSAnimationsManager {
    private readonly shadowNodeWrapper;
    private readonly viewTag;
    private readonly compoundComponentName;
    private attachedAnimations;
    constructor(shadowNodeWrapper: ShadowNodeWrapper, viewTag: number, compoundComponentName: string);
    update(animationProperties: ExistingCSSAnimationProperties | null): void;
    unmountCleanup(): void;
    private detach;
    private registerKeyframesUsage;
    private unregisterKeyframesUsage;
    private processAnimations;
    private buildAnimationsMap;
    private getAnimationUpdates;
}
//# sourceMappingURL=CSSAnimationsManager.d.ts.map