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

type CalculateFoodPriceResponse = {
  message: string;
  data: {
    isMember: boolean;
    items: Array<{
      menu: string;
      quantity: number;
      name: string;
      unitPrice: number;
      totalPrice: number;
    }>;
    subtotal: number;
  };
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

  it('/calculate-food-price (POST) should return subtotal 126 for member Red 2 sets and Green 1 set', () => {
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
      .expect((response: { body: CalculateFoodPriceResponse }) => {
        const [redItem, greenItem] = response.body.data.items;

        expect(response.body.message).toBe('Food price calculated successfully');
        expect(response.body.data.isMember).toBe(true);
        expect(response.body.data.items).toHaveLength(2);

        expect(redItem.menu).toBe('RED');
        expect(redItem.quantity).toBe(2);
        expect(redItem.unitPrice).toBe(50);
        expect(redItem.totalPrice).toBe(100);

        expect(greenItem.menu).toBe('GREEN');
        expect(greenItem.quantity).toBe(1);
        expect(greenItem.unitPrice).toBe(40);
        expect(greenItem.totalPrice).toBe(40);

        expect(response.body.data.subtotal).toBe(126);
      });
  });

  it('/calculate-food-price (POST) should return totalPrice 228 and 114, subtotal 342 for Orange 3 sets', () => {
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
      .expect((response: { body: CalculateFoodPriceResponse }) => {
        const [firstOrangeItem, secondOrangeItem] = response.body.data.items;

        expect(response.body.message).toBe('Food price calculated successfully');
        expect(response.body.data.isMember).toBe(false);
        expect(response.body.data.items).toHaveLength(2);

        expect(firstOrangeItem.menu).toBe('ORANGE');
        expect(firstOrangeItem.quantity).toBe(2);
        expect(firstOrangeItem.unitPrice).toBe(120);
        expect(firstOrangeItem.totalPrice).toBe(228);

        expect(secondOrangeItem.menu).toBe('ORANGE');
        expect(secondOrangeItem.quantity).toBe(1);
        expect(secondOrangeItem.unitPrice).toBe(120);
        expect(secondOrangeItem.totalPrice).toBe(114);

        expect(response.body.data.subtotal).toBe(342);
      });
  });

  it('/calculate-food-price (POST) should return subtotal 307.8 for a member ordering Orange 3 sets', () => {
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
      .expect((response: { body: CalculateFoodPriceResponse }) => {
        const [firstOrangeItem, secondOrangeItem] = response.body.data.items;

        expect(response.body.message).toBe('Food price calculated successfully');
        expect(response.body.data.isMember).toBe(true);
        expect(response.body.data.items).toHaveLength(2);

        expect(firstOrangeItem.totalPrice).toBe(228);
        expect(secondOrangeItem.totalPrice).toBe(114);
        expect(response.body.data.subtotal).toBe(307.8);
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
        const paths = response.body.errors.map((error) => error.path);

        expect(response.body.message).toBe('Validation failed');
        expect(paths.includes('isMember')).toBe(true);
        expect(paths.includes('items')).toBe(true);
      });
  });
});
