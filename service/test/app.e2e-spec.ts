import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

type ValidationErrorResponse = {
  message: string;
  errors: Array<{
    path: string;
    message: string;
  }>;
};

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/calculate-food-price (POST)', () => {
    return request(app.getHttpServer())
      .post('/calculate-food-price')
      .send({
        isMember: true,
        items: [
          {
            menu: 'RED',
            quantity: 2,
          },
          {
            menu: 'GREEN',
            quantity: 1,
          },
        ],
      })
      .expect(201)
      .expect({
        message: 'Food price calculated successfully',
        data: {
          isMember: true,
          items: [
            {
              menu: 'RED',
              quantity: 2,
              name: 'Red set',
              unitPrice: 50,
              totalPrice: 100,
            },
            {
              menu: 'GREEN',
              quantity: 1,
              name: 'Green set',
              unitPrice: 40,
              totalPrice: 40,
            },
          ],
          subtotal: 126,
        },
      });
  });

  it('/calculate-food-price (POST) applies the Orange discount when more than two Orange sets are ordered', () => {
    return request(app.getHttpServer())
      .post('/calculate-food-price')
      .send({
        isMember: false,
        items: [
          {
            menu: 'ORANGE',
            quantity: 2,
          },
          {
            menu: 'ORANGE',
            quantity: 1,
          },
        ],
      })
      .expect(201)
      .expect({
        message: 'Food price calculated successfully',
        data: {
          isMember: false,
          items: [
            {
              menu: 'ORANGE',
              quantity: 2,
              name: 'Orange set',
              unitPrice: 120,
              totalPrice: 228,
            },
            {
              menu: 'ORANGE',
              quantity: 1,
              name: 'Orange set',
              unitPrice: 120,
              totalPrice: 114,
            },
          ],
          subtotal: 342,
        },
      });
  });

  it('/calculate-food-price (POST) combines the Orange discount with the member discount', () => {
    return request(app.getHttpServer())
      .post('/calculate-food-price')
      .send({
        isMember: true,
        items: [
          {
            menu: 'ORANGE',
            quantity: 2,
          },
          {
            menu: 'ORANGE',
            quantity: 1,
          },
        ],
      })
      .expect(201)
      .expect({
        message: 'Food price calculated successfully',
        data: {
          isMember: true,
          items: [
            {
              menu: 'ORANGE',
              quantity: 2,
              name: 'Orange set',
              unitPrice: 120,
              totalPrice: 228,
            },
            {
              menu: 'ORANGE',
              quantity: 1,
              name: 'Orange set',
              unitPrice: 120,
              totalPrice: 114,
            },
          ],
          subtotal: 307.8,
        },
      });
  });

  it('/calculate-food-price (POST) rejects invalid payload', () => {
    return request(app.getHttpServer())
      .post('/calculate-food-price')
      .send({
        isMember: 'yes',
        items: [],
      })
      .expect(400)
      .expect((response: { body: ValidationErrorResponse }) => {
        expect(response.body.message).toBe('Validation failed');
        expect(response.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: 'isMember',
            }),
            expect.objectContaining({
              path: 'items',
            }),
          ]),
        );
      });
  });
});
