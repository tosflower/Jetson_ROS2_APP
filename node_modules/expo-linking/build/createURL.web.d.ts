import type { CreateURLOptions, ParsedURL } from './Linking.types';
export declare function createURL(path: string, { queryParams }?: CreateURLOptions): string;
export declare function parse(url: string): ParsedURL;
