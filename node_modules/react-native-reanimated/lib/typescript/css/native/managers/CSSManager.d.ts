import type { ViewInfo } from '../../../createAnimatedComponent/commonTypes';
import type { CSSStyle } from '../../types';
import type { ICSSManager } from '../../types/interfaces';
export default class CSSManager implements ICSSManager {
    private readonly cssAnimationsManager;
    private readonly cssTransitionsManager;
    private readonly cssPseudoStylesManager;
    private readonly viewTag;
    private readonly propsBuilder;
    /**
     * True if the previous update had CSS transition props attached. On the next
     * update we still need to build `normalizedStyle` only on Android to revert
     * props applied during the transition to correct current values. (fixes
     * https://github.com/software-mansion/react-native-reanimated/issues/9218).
     */
    private hadTransitionLastUpdate;
    constructor({ shadowNodeWrapper, viewTag, reactViewName }: ViewInfo, componentDisplayName?: string);
    update(style: CSSStyle): void;
    unmountCleanup(): void;
}
//# sourceMappingURL=CSSManager.d.ts.map