import type { UnknownRecord } from '../../../common';
import type { ShadowNodeWrapper } from '../../../commonTypes';
import type { CSSTransitionProperties, ICSSTransitionsManager } from '../../types';
export default class CSSTransitionsManager implements ICSSTransitionsManager {
    private readonly viewTag;
    private readonly shadowNodeWrapper;
    private prevProps;
    private propsWithTransitions;
    private hasTransition;
    constructor(shadowNodeWrapper: ShadowNodeWrapper, viewTag: number);
    /**
     * @returns Whether this update detached a running transition (its props were
     *   removed, or normalized to an empty config, e.g. when duration is 0).
     */
    update(transitionProperties: CSSTransitionProperties | null, nextProps?: UnknownRecord): boolean;
    unmountCleanup(): void;
    private detach;
    private processTransitionConfig;
}
//# sourceMappingURL=CSSTransitionsManager.d.ts.map