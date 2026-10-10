import type { CSSTransitionProperties, CSSTransitionProperty } from '../../../types';
import type { NormalizedCSSTransitionConfig } from '../../types';
export declare const ERROR_MESSAGES: {
    invalidTransitionProperty: (transitionProperty: CSSTransitionProperty | undefined | string[]) => string;
};
export declare function normalizeCSSTransitionProperties(config: CSSTransitionProperties): NormalizedCSSTransitionConfig | null;
//# sourceMappingURL=config.d.ts.map