import type { FunctionComponent, ReactElement, ReactNode } from 'react';
import type { Href } from '../types';
export type ProtectedProps = {
    guard: boolean;
    /** Where to redirect when `guard` is false. Defaults to the containing navigator's anchor. */
    redirectTo?: Href;
    children?: ReactNode;
};
export declare const Protected: FunctionComponent<ProtectedProps>;
export declare function isProtectedReactElement(child: ReactNode): child is ReactElement<ProtectedProps>;
