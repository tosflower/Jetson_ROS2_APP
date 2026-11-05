import type { Href } from '../types';
export type SitemapType = {
    contextKey: string;
    filename: string;
    href: string | Href;
    isInternal: boolean;
    isGenerated: boolean;
    children: SitemapType[];
};
export declare function useSitemap(): SitemapType | null;
