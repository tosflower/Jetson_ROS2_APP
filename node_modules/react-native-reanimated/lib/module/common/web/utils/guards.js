'use strict';

import { isRecord } from "../../utils/index.js";
export function hasNameAlias(configValue) {
  return isRecord(configValue) && 'name' in configValue && typeof configValue.name === 'string';
}
export function isRuleBuilder(value) {
  return typeof value === 'object' && value !== null && 'add' in value && 'build' in value;
}
//# sourceMappingURL=guards.js.map