export declare enum ReanimatedLogLevel {
    warn = 1,
    error = 2
}
export type LogData = {
    level: ReanimatedLogLevel;
    message: string;
};
export type LogFunction = (data: LogData) => void;
export type LoggerConfig = {
    level?: ReanimatedLogLevel;
    strict?: boolean;
};
export type LoggerConfigInternal = {
    logFunction: LogFunction;
    onLog?: LogFunction;
} & Required<LoggerConfig>;
/**
 * Current logger config getter.
 *
 * @returns The current logger configuration object.
 */
export declare function getLoggerConfig(): LoggerConfigInternal;
/**
 * Updates logger configuration.
 *
 * @param currentConfig - The current logger configuration object.
 * @param options - The new logger configuration to apply.
 *
 *   - Level: The minimum log level to display.
 *   - Strict: Whether to log warnings and errors that are not strict. Defaults to
 *     false.
 *
 * @param onLog - An optional callback invoked for every log that passes the
 *   `level` and `strict` filters, in addition to the default console output.
 *   Omitting it clears a previously registered callback.
 */
export declare function updateLoggerConfig(currentConfig: LoggerConfigInternal, options?: Partial<LoggerConfig>, onLog?: LogFunction): void;
type LogOptions = {
    strict?: boolean;
};
export declare const logger: {
    warn(message: string, options?: LogOptions): void;
    warnOnce(message: string, level: number): void;
    error(message: string, options?: LogOptions): void;
};
export {};
//# sourceMappingURL=logger.d.ts.map