import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Jane Doe',
    minLength: 2,
  })
  name: string;

  @ApiProperty({
    example: 'jane@example.com',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    example: 28,
    minimum: 18,
  })
  age: number;

  @ApiPropertyOptional({
    example: 'jane',
    minLength: 2,
  })
  nickname?: string;
}
