import { ApiBody } from '@nestjs/swagger';
import type { z } from 'zod';
import type { ZodDtoStatic } from './create-zod-dto';

export function ApiZodBody<TSchema extends z.ZodTypeAny>(
  dtoClass: ZodDtoStatic<TSchema>,
): MethodDecorator {
  return ApiBody({ schema: dtoClass.openApiSchema });
}
