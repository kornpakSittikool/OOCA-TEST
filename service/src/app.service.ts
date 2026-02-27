import { Injectable } from '@nestjs/common';
import type { CreateUserInput } from './contracts/create-user.contract';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  createUser(payload: CreateUserInput) {
    return {
      message: 'User payload is valid',
      data: payload,
    };
  }
}
