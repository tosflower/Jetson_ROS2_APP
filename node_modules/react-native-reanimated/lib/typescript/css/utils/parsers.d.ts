import { splitByComma, splitByWhitespace } from '../../common';
import type { SingleCSSTransitionConfig, TimeUnit } from '../types';
export { splitByComma, splitByWhitespace };
export declare const offsetOf: (selector: number | string) => number | null;
type ParsedShorthandSingleTransitionConfig = Omit<SingleCSSTransitionConfig, 'transitionProperty' | 'transitionTimingFunction'> & {
    transitionProperty?: string;
    transitionTimingFunction?: string;
};
export declare function parseSingleTransitionShorthand(value: string): ParsedShorthandSingleTransitionConfig;
export declare function normalizeTimeUnit(timeUnit: TimeUnit): number | null;
//# sourceMappingURL=parsers.d.ts.map