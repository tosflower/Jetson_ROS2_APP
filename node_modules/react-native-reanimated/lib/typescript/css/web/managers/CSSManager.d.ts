import type { UnknownRecord } from '../../../common';
import type { ViewInfo } from '../../../createAnimatedComponent/commonTypes';
import type { CSSStyle } from '../../types';
import type { ICSSManager } from '../../types/interfaces';
export default class CSSManager implements ICSSManager {
    private readonly animationsManager;
    private readonly transitionsManager;
    private readonly pseudoSelectorsManager;
    constructor(viewInfo: ViewInfo, componentDisplayName?: string);
    update(style: CSSStyle, props?: Readonly<UnknownRecord>): void;
    unmountCleanup(): void;
}
//# sourceMappingURL=CSSManager.d.ts.map