import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ZodValidationPipe } from './common/pipes/zod-validation.pipe';
import { ApiZodBody } from './common/swagger/api-zod-body.decorator';
import { CreateUserDto } from './contracts/create-user.contract';
import type { CreateUserInput } from './contracts/create-user.contract';

@Controller()
@ApiTags('Example')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('users')
  @ApiOperation({ summary: 'Example endpoint using Zod validation' })
  @ApiZodBody(CreateUserDto)
  createUser(
    @Body(new ZodValidationPipe(CreateUserDto.schema)) payload: CreateUserInput,
  ) {
    return this.appService.createUser(payload);
  }
}
