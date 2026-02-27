import { BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(() => {
    appService = new AppService();
  });

  describe('calculateFoodPrice', () => {
    it('should return subtotal without discounts for a regular order', () => {
      expect(
        appService.calculateFoodPrice({
          isMember: false,
          items: [
            {
              menu: 'RED',
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
          ],
          subtotal: 50,
        },
      });
    });

    it('should apply member discount to subtotal', () => {
      expect(
        appService.calculateFoodPrice({
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
        }),
      ).toEqual({
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

    it('should apply bundle discount for eligible menus ordered in pairs', () => {
      expect(
        appService.calculateFoodPrice({
          isMember: false,
          items: [
            {
              menu: 'GREEN',
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
              menu: 'GREEN',
              quantity: 2,
              name: 'Green set',
              unitPrice: 40,
              totalPrice: 76,
            },
          ],
          subtotal: 76,
        },
      });
    });

    it('should combine bundle discount and member discount', () => {
      expect(
        appService.calculateFoodPrice({
          isMember: true,
          items: [
            {
              menu: 'GREEN',
              quantity: 2,
            },
          ],
        }),
      ).toEqual({
        message: 'Food price calculated successfully',
        data: {
          isMember: true,
          items: [
            {
              menu: 'GREEN',
              quantity: 2,
              name: 'Green set',
              unitPrice: 40,
              totalPrice: 76,
            },
          ],
          subtotal: 68.4,
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
