import type { Maybe } from '../common';
import type { InternalHostInstance } from '../commonTypes';
import type { HostInstance } from '../platform-specific/types';
import type { IAnimatedComponentInternalBase } from './commonTypes';
export declare function getViewInfo(element: HostInstance): {
    reactViewName?: string;
    viewTag?: number;
};
export type InstanceWithViewTag = Partial<IAnimatedComponentInternalBase> & InternalHostInstance;
export declare function getViewTagFromInstance(instance: Maybe<InstanceWithViewTag>): number | null;
//# sourceMappingURL=getViewInfo.d.ts.map