type ErrorHandlerCallback = (error: any, isFatal?: boolean) => void;
export declare function createErrorHandler(originalHandler: ErrorHandlerCallback): ErrorHandlerCallback;
/**
 * @hidden
 * @deprecated Will be removed in the future.
 */
export declare function disableErrorHandling(): void;
export {};
