import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ZodValidationPipe } from './common/pipes/zod-validation.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { createUserSchema } from './schemas/create-user.schema';

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
  @ApiBody({ type: CreateUserDto })
  createUser(
    @Body(new ZodValidationPipe(createUserSchema)) payload: CreateUserDto,
  ) {
    return this.appService.createUser(payload);
  }
}
