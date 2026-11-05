import React from 'react';
import type { Href } from '../types';
import type { LinkProps } from './useLinkHooks';
interface LinkWithPreviewProps extends LinkProps {
    hrefForPreviewNavigation: Href;
}
export declare function LinkWithPreview({ children, ...rest }: LinkWithPreviewProps): React.JSX.Element;
export {};
