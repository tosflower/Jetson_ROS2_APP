import type { ReanimatedHTMLElement } from '../../../ReanimatedModule/js-reanimated';
import type { PseudoStylesBySelector } from '../../utils';
export default class CSSPseudoSelectorsManager {
    private readonly element;
    private readonly svgElementTag;
    private viewId;
    private prevPseudoStylesBySelector;
    constructor(element: ReanimatedHTMLElement, svgElementTag?: string);
    update(pseudoStylesBySelector: PseudoStylesBySelector | null): void;
    unmountCleanup(): void;
    private ensureViewId;
    private syncActiveMarker;
    private detach;
}
//# sourceMappingURL=CSSPseudoSelectorsManager.d.ts.map