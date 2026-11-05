export declare class FetchError extends Error {
    constructor(message: string, { cause, stack }?: {
        cause?: unknown;
        stack?: string;
    });
    static createFromError(error: Error): FetchError;
}
