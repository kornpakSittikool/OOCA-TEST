import { z } from 'zod';
import { createZodDto } from '../common/zod/create-zod-dto';

export const foodOrderItemSchema = z.object({
  menu: z.enum(['RED', 'GREEN', 'BLUE', 'YELLOW', 'PINK', 'PURPLE', 'ORANGE']),
  quantity: z.number().int().positive().default(1),
});

export const calculateFoodPriceSchema = z.object({
  isMember: z.boolean().meta({ example: true }),
  items: z.array(foodOrderItemSchema).min(1),
});

export class CalculateFoodPriceDto extends createZodDto(
  calculateFoodPriceSchema,
) {}

export type CalculateFoodPriceInput = z.infer<typeof calculateFoodPriceSchema>;
