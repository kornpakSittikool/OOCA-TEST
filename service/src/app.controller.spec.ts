import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('createUser', () => {
    it('should return the validated payload', () => {
      expect(
        appController.createUser({
          name: 'Jane Doe',
          email: 'jane@example.com',
          age: 28,
          nickname: 'jane',
        }),
      ).toEqual({
        message: 'User payload is valid',
        data: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          age: 28,
          nickname: 'jane',
        },
      });
    });
  });
});
