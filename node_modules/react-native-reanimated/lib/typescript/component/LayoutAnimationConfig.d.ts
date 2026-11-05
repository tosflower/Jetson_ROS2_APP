import type { ReactNode, Ref, RefCallback } from 'react';
import { Component } from 'react';
import type { InstanceWithViewTag } from '../createAnimatedComponent/getViewInfo';
export declare const SkipEnteringContext: import("react").Context<import("react").RefObject<boolean> | null>;
interface LayoutAnimationConfigProps {
    skipEntering?: boolean;
    skipExiting?: boolean;
    children: ReactNode;
}
/**
 * A component that lets you skip entering and exiting animations.
 *
 * @param skipEntering - A boolean indicating whether children's entering
 *   animations should be skipped when `LayoutAnimationConfig` is mounted.
 * @param skipExiting - A boolean indicating whether children's exiting
 *   animations should be skipped when LayoutAnimationConfig is unmounted.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/layout-animation-config/
 */
export declare class LayoutAnimationConfig extends Component<LayoutAnimationConfigProps> {
    _childInstance: InstanceWithViewTag | null;
    _mergedRef?: RefCallback<InstanceWithViewTag>;
    _mergedRefSource?: Ref<InstanceWithViewTag>;
    _setChildInstance: (instance: InstanceWithViewTag | null) => void;
    _getMergedRef(childRef: Ref<InstanceWithViewTag> | undefined): RefCallback<InstanceWithViewTag>;
    getComponentViewTag(): number;
    getMaybeWrappedChildren(): string | number | bigint | boolean | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | import("react").JSX.Element[] | null | undefined;
    getMaybeRefTrackedChild(): ReactNode;
    setShouldAnimateExiting(): void;
    componentWillUnmount(): void;
    render(): ReactNode;
}
export {};
//# sourceMappingURL=LayoutAnimationConfig.d.ts.map