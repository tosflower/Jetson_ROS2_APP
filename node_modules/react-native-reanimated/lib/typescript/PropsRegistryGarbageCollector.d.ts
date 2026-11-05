import type { StyleProps } from './commonTypes';
import type { IAnimatedComponentInternal } from './createAnimatedComponent/commonTypes';
export declare const PropsRegistryGarbageCollector: {
    viewsMap: Map<number, IAnimatedComponentInternal>;
    intervalId: NodeJS.Timeout | null;
    registerView(viewTag: number, component: IAnimatedComponentInternal): void;
    unregisterView(viewTag: number): void;
    syncPropsBackToReact(): void;
    registerInterval(): void;
    unregisterInterval(): void;
};
export declare function unprocessProps(props: StyleProps): void;
//# sourceMappingURL=PropsRegistryGarbageCollector.d.ts.map