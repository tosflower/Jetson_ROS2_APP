import { JSONSchema } from './JSONSchema';
import { BaseValidationError, ValidationError as ValidationResult } from './validate';
import { SchemaVisitor } from './visit';
export type { JSONSchema } from './JSONSchema';
export type { SchemaVisitor } from './visit';
export declare class ValidationError<T> extends Error {
    schema: JSONSchema<T>;
    errors: BaseValidationError[];
    constructor(result: ValidationResult, schema: JSONSchema<T>);
    toErrorsMessage(): string[];
}
export declare function derefSchema<T>(schema: JSONSchema<T>): JSONSchema<T>;
export declare function validate<T>(schema: JSONSchema<T>, value: unknown): asserts value is T;
export declare function visit<T>(schema: JSONSchema<T>, value: unknown, visitor: SchemaVisitor): void;
