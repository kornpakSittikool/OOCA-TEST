import type { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { z } from 'zod';

export interface ZodDtoStatic<TSchema extends z.ZodTypeAny> {
  new (): z.infer<TSchema>;
  readonly schema: TSchema;
  readonly openApiSchema: SchemaObject;
}

export function createZodDto<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
): ZodDtoStatic<TSchema> {
  abstract class ZodDto {
    static readonly schema = schema;

    static readonly openApiSchema = z.toJSONSchema(schema, {
      target: 'openapi-3.0',
      io: 'input',
    }) as unknown as SchemaObject;
  }

  return ZodDto as ZodDtoStatic<TSchema>;
}
