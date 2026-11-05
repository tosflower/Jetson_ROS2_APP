import { type ComponentType } from 'react';
/**
 * A drop-in replacement for `requireNativeComponent`.
 */
export declare function requireNativeViewManager<P extends object>(moduleName: string, viewName?: string): ComponentType<P>;
