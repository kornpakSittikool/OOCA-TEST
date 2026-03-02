import { BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(() => {
    appService = new AppService();
  });

  describe('calculateFoodPrice', () => {
    it('should calculate a Red set and Green set order at full price', () => {
      expect(
        appService.calculateFoodPrice({
          isMember: false,
          items: [
            {
              menu: 'RED',
              quantity: 1,
            },
            {
              menu: 'GREEN',
              quantity: 1,
            },
          ],
        }),
      ).toEqual({
        message: 'Food price calculated successfully',
        data: {
          isMember: false,
          items: [
            {
              menu: 'RED',
              quantity: 1,
              name: 'Red set',
              unitPrice: 50,
              totalPrice: 50,
            },
            {
              menu: 'GREEN',
              quantity: 1,
              name: 'Green set',
              unitPrice: 40,
              totalPrice: 40,
            },
          ],
          subtotal: 90,
        },
      });
    });

    it('should apply a 10% member discount to the bill total', () => {
      expect(
        appService.calculateFoodPrice({
          isMember: true,
          items: [
            {
              menu: 'RED',
              quantity: 1,
            },
            {
              menu: 'GREEN',
              quantity: 1,
            },
          ],
        }),
      ).toEqual({
        message: 'Food price calculated successfully',
        data: {
          isMember: true,
          items: [
            {
              menu: 'RED',
              quantity: 1,
              name: 'Red set',
              unitPrice: 50,
              totalPrice: 50,
            },
            {
              menu: 'GREEN',
              quantity: 1,
              name: 'Green set',
              unitPrice: 40,
              totalPrice: 40,
            },
          ],
          subtotal: 81,
        },
      });
    });

    it('should apply a 5% discount when more than two Orange sets are ordered in a bill', () => {
      expect(
        appService.calculateFoodPrice({
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
        }),
      ).toEqual({
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

    it('should combine the Orange discount with the member discount', () => {
      expect(
        appService.calculateFoodPrice({
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
        }),
      ).toEqual({
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

    it('should not apply the Orange discount when two or fewer sets are ordered', () => {
      expect(
        appService.calculateFoodPrice({
          isMember: false,
          items: [
            {
              menu: 'ORANGE',
              quantity: 2,
            },
          ],
        }),
      ).toEqual({
        message: 'Food price calculated successfully',
        data: {
          isMember: false,
          items: [
            {
              menu: 'ORANGE',
              quantity: 2,
              name: 'Orange set',
              unitPrice: 120,
              totalPrice: 240,
            },
          ],
          subtotal: 240,
        },
      });
    });

    it('should throw when a menu cannot be found', () => {
      expect(() =>
        appService.calculateFoodPrice({
          isMember: false,
          items: [
            {
              menu: 'INVALID' as never,
              quantity: 1,
            },
          ],
        }),
      ).toThrow(BadRequestException);
    });
  });
});
