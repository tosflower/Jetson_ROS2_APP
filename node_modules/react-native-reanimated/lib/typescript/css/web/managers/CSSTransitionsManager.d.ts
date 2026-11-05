import type { ReanimatedHTMLElement } from '../../../ReanimatedModule/js-reanimated';
import type { CSSTransitionCallbacks, CSSTransitionProperties, ICSSTransitionsManager } from '../../types';
export default class CSSTransitionsManager implements ICSSTransitionsManager {
    private readonly element;
    private isAttached;
    private readonly callbackListeners;
    constructor(element: ReanimatedHTMLElement);
    update(transitionProperties: CSSTransitionProperties | null, callbacks?: CSSTransitionCallbacks | null): void;
    unmountCleanup(): void;
    private detach;
    private setElementTransition;
}
//# sourceMappingURL=CSSTransitionsManager.d.ts.map