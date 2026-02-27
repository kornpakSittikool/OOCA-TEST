import { Injectable } from '@nestjs/common';
import type { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  createUser(payload: CreateUserDto) {
    return {
      message: 'User payload is valid',
      data: payload,
    };
  }
}
