"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ValidationError: null,
    derefSchema: null,
    validate: null,
    visit: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ValidationError () {
        return ValidationError;
    },
    get derefSchema () {
        return derefSchema;
    },
    get validate () {
        return validate;
    },
    get visit () {
        return visit;
    }
});
const _deref = require("./deref");
const _validate = require("./validate");
const _visit = require("./visit");
const CACHE_SYMBOL = Symbol('@expo/schema-utils');
const flattenValidationResults = (input, output = [])=>{
    output.push({
        message: input.message,
        path: input.path,
        keyword: input.keyword,
        value: input.value
    });
    for (const cause of input.cause ?? []){
        flattenValidationResults(cause, output);
    }
    return output;
};
const toErrorsMessages = (errors)=>errors.map((error)=>{
        return `\n - options${error.path} (${error.keyword}): ${error.message}`;
    });
class ValidationError extends Error {
    schema;
    errors;
    constructor(result, schema){
        const errors = flattenValidationResults(result);
        const title = typeof schema.title === 'string' ? schema.title : 'Value';
        super(`Invalid options object. ${title} options object does not match the defined schema.\n` + toErrorsMessages(errors).map((line)=>` - options${line}`).join('\n'));
        this.name = 'ValidationError';
        this.errors = errors;
        this.schema = schema;
    }
    toErrorsMessage() {
        return toErrorsMessages(this.errors);
    }
}
const derefSchemaCache = (schema)=>{
    let derefed = schema[CACHE_SYMBOL];
    if (!derefed) {
        derefed = {
            schema: (0, _deref.deref)(schema),
            cache: new WeakMap()
        };
        schema[CACHE_SYMBOL] = derefed;
    }
    return derefed;
};
function derefSchema(schema) {
    return derefSchemaCache(schema).schema;
}
function validate(schema, value) {
    const data = derefSchemaCache(schema);
    let result;
    if (typeof value !== 'object' || value == null || (result = data.cache.get(value)) === undefined) {
        result = (0, _validate.validateSchema)(data.schema, value, '');
        if (typeof value === 'object' && value != null) {
            data.cache.set(value, result);
        }
    }
    if (result) {
        throw new ValidationError(result, data.schema);
    }
}
function visit(schema, value, visitor) {
    (0, _visit.visitNode)(derefSchemaCache(schema).schema, value, visitor);
}

//# sourceMappingURL=index.js.map
