import { z } from 'zod';
import { createZodDto } from '../common/zod/create-zod-dto';

export const CreateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'name must be at least 2 characters')
    .meta({ example: 'Jane Doe' }),
  email: z
    .email('email must be a valid email address')
    .meta({ example: 'jane@example.com' }),
  age: z
    .number()
    .int()
    .min(18, 'age must be at least 18')
    .meta({ example: 28 }),
  nickname: z.string().trim().min(2).optional().meta({ example: 'jane' }),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
