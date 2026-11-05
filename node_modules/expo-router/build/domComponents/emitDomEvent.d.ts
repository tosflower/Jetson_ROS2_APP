import type { LinkToOptions, TransitionOptions } from '../global-state/types';
export declare function emitDomSetParams(params?: Record<string, undefined | string | number | (string | number)[]>): boolean;
export declare function emitDomDismiss(count?: number, options?: TransitionOptions): boolean;
export declare function emitDomGoBack(options?: TransitionOptions): boolean;
export declare function emitDomDismissAll(options?: TransitionOptions): boolean;
export declare function emitDomLinkEvent(href: string, options: LinkToOptions): boolean;
