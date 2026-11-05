import type { UnknownRecord } from '../common';
import type { StyleProps } from '../commonTypes';
import type { ViewDescriptorsSet } from '../ViewDescriptorsSet';
import type { AnimatedComponentTypeInternal, IInlinePropManager, ViewInfo } from './commonTypes';
export declare function hasInlineStyles(style: StyleProps): boolean;
export declare function getInlineStyle(style: Record<string, unknown>, isFirstRender: boolean): StyleProps | Record<string, unknown>;
export declare class InlinePropManager implements IInlinePropManager {
    _inlinePropsViewDescriptors: ViewDescriptorsSet | null;
    _inlinePropsMapperId: number | null;
    _inlineStyleProps: UnknownRecord;
    _inlineTopLevelProps: UnknownRecord;
    attachInlineProps(animatedComponent: AnimatedComponentTypeInternal, viewInfo: ViewInfo): void;
    detachInlineProps(): void;
}
//# sourceMappingURL=InlinePropManager.d.ts.map