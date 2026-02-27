import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().trim().min(2, 'name must be at least 2 characters'),
  email: z.string().email('email must be a valid email address'),
  age: z.number().int().min(18, 'age must be at least 18'),
  nickname: z.string().trim().min(2).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
