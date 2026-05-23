import Ajv, { ErrorObject, ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

export function compileSchema<T>(schema: object): ValidateFunction<T> {
  return ajv.compile<T>(schema);
}

export function validateSchema<T>(
  schema: object,
  data: unknown
): { valid: boolean; errors: ErrorObject[] | null | undefined } {
  const validate = compileSchema<T>(schema);
  const valid = validate(data);
  return { valid: !!valid, errors: validate.errors };
}

export function assertValidSchema(schema: object, data: unknown): void {
  const { valid, errors } = validateSchema(schema, data);
  if (!valid) {
    const messages = (errors ?? []).map((e) => `${e.instancePath} ${e.message}`).join('; ');
    throw new Error(`Schema validation failed: ${messages}`);
  }
}
