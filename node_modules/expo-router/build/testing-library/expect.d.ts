export interface RouterMatchers<R> {
    toHavePathname(pathname: string): R;
    toHavePathnameWithParams(pathname: string): R;
    toHaveSegments(segments: string[]): R;
    toHaveSearchParams(params: Record<string, string | string[]>): R;
    toHaveRouterState(state: Record<string, unknown> | undefined): R;
}
declare global {
    namespace jest {
        interface Matchers<R> extends RouterMatchers<R> {
        }
    }
}
declare module 'expect' {
    interface Matchers<R extends void | Promise<void>> extends RouterMatchers<R> {
    }
}
