import type { NativePropsBuilder } from '../../../common';
import type { ShadowNodeWrapper } from '../../../commonTypes';
import type { CSSTransitionProperties, ICSSPseudoStylesManager } from '../../types';
import type { PseudoStylesBySelector } from '../../utils';
export default class CSSPseudoStylesManager implements ICSSPseudoStylesManager {
    private readonly viewTag;
    private readonly shadowNodeWrapper;
    private readonly propsBuilder;
    private prevPseudoStylesBySelector;
    private prevTransitionProperties;
    private isRegistered;
    constructor(shadowNodeWrapper: ShadowNodeWrapper, viewTag: number, propsBuilder: NativePropsBuilder);
    update(pseudoStylesBySelector: PseudoStylesBySelector | null, transitionProperties: CSSTransitionProperties | null): void;
    unmountCleanup(): void;
    private detach;
    private buildPseudoStyleEntry;
}
//# sourceMappingURL=CSSPseudoStylesManager.d.ts.map