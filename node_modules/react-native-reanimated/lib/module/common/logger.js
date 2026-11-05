/* eslint-disable reanimated/use-logger */
'use strict';

const PREFIX = '[Reanimated]';
const DOCS_URL = 'https://docs.swmansion.com/react-native-reanimated/docs/debugging/logger-configuration';
const DOCS_REFERENCE = `If you don't want to see this message, you can disable the \`strict\` mode. Refer to:\n${DOCS_URL} for more details.`;
const loggedMessages = new Set();
export let ReanimatedLogLevel = /*#__PURE__*/function (ReanimatedLogLevel) {
  ReanimatedLogLevel[ReanimatedLogLevel["warn"] = 1] = "warn";
  ReanimatedLogLevel[ReanimatedLogLevel["error"] = 2] = "error";
  return ReanimatedLogLevel;
}({});
function logToConsole(data) {
  'worklet';

  switch (data.level) {
    case ReanimatedLogLevel.warn:
      console.warn(data.message);
      break;
    case ReanimatedLogLevel.error:
      console.error(data.message);
      break;
  }
}
const DEFAULT_LOGGER_CONFIG = {
  logFunction: logToConsole,
  level: ReanimatedLogLevel.warn,
  strict: true
};

/**
 * Current logger config getter.
 *
 * @returns The current logger configuration object.
 */
export function getLoggerConfig() {
  'worklet';

  if (!global.__reanimatedLoggerConfig) {
    global.__reanimatedLoggerConfig = DEFAULT_LOGGER_CONFIG;
  }
  return global.__reanimatedLoggerConfig;
}

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
export function updateLoggerConfig(currentConfig, options, onLog) {
  'worklet';

  global.__reanimatedLoggerConfig = {
    ...currentConfig,
    // Don't reuse previous level, strict and onLog values from the current config
    level: options?.level ?? DEFAULT_LOGGER_CONFIG.level,
    strict: options?.strict ?? DEFAULT_LOGGER_CONFIG.strict,
    onLog
  };
}
function handleLog(level, message, options) {
  'worklet';

  const config = getLoggerConfig();
  if (
  // Don't log if the log is marked as strict-only and the config doesn't
  // enable strict logging
  options.strict && !config.strict ||
  // Don't log if the log level is below the minimum configured level
  level < config.level) {
    return;
  }
  if (options.strict) {
    message += `\n\n${DOCS_REFERENCE}`;
  }
  const data = {
    level,
    message: `${PREFIX} ${message}`
  };
  config.logFunction(data);
  config.onLog?.(data);
}
export const logger = {
  warn(message, options = {}) {
    'worklet';

    handleLog(ReanimatedLogLevel.warn, message, options);
  },
  warnOnce(message, level) {
    'worklet';

    if (getLoggerConfig().level > ReanimatedLogLevel.warn) {
      return;
    }
    const frames = new Error().stack?.split('\n').map(line => line.trim()).filter(line => line.startsWith('at ') || line.includes('@'));
    const frame = Number.isInteger(level) && level >= 0 ? frames?.[level + 1] : undefined;
    const key = JSON.stringify([message, frame ?? null]);
    if (loggedMessages.has(key)) {
      return;
    }
    loggedMessages.add(key);
    handleLog(ReanimatedLogLevel.warn, message, {});
  },
  error(message, options = {}) {
    'worklet';

    handleLog(ReanimatedLogLevel.error, message, options);
  }
};
//# sourceMappingURL=logger.js.map