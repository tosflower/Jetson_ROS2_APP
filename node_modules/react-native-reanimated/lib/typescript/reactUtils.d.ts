import type { Ref, RefCallback } from 'react';
import type { Maybe } from './common';
export declare function assignRef<T>(ref: Maybe<Ref<T>>, instance: T | null): (() => void) | undefined;
export declare function mergeRefs<T>(...refs: Maybe<Ref<T>>[]): RefCallback<T>;
export declare function isReactRendering(): boolean;
export declare function isFirstReactRender(): any;
//# sourceMappingURL=reactUtils.d.ts.map