import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ApiZodBody } from './common/zod/api-zod-body.decorator';
import { ZodValidationPipe } from './common/zod/zod-validation.pipe';
import { CalculateFoodPriceDto } from './contracts/calculate-food-price.contract';
import type { CalculateFoodPriceInput } from './contracts/calculate-food-price.contract';

@Controller()
@ApiTags('Example')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('menus')
  getMenus() {
    return this.appService.getMenus();
  }

  @Post('calculate-food-price')
  @ApiZodBody(CalculateFoodPriceDto)
  calculateFoodPrice(
    @Body(new ZodValidationPipe(CalculateFoodPriceDto.schema))
    payload: CalculateFoodPriceInput,
  ) {
    return this.appService.calculateFoodPrice(payload);
  }
}
