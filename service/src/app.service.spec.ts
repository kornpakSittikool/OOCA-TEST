import { BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(() => {
    appService = new AppService();
  });

  describe('calculateFoodPrice', () => {
    it('should calculate Red 1 set and Green 1 set to be totalPrice 50 and 40, subtotal 90', () => {
      const result = appService.calculateFoodPrice({
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
      });
      const [redItem, greenItem] = result.data.items;

      expect(result.message).toBe('Food price calculated successfully');
      expect(result.data.isMember).toBe(false);
      expect(result.data.items).toHaveLength(2);

      expect(redItem.menu).toBe('RED');
      expect(redItem.quantity).toBe(1);
      expect(redItem.name).toBe('Red set');
      expect(redItem.unitPrice).toBe(50);
      expect(redItem.totalPrice).toBe(50);

      expect(greenItem.menu).toBe('GREEN');
      expect(greenItem.quantity).toBe(1);
      expect(greenItem.name).toBe('Green set');
      expect(greenItem.unitPrice).toBe(40);
      expect(greenItem.totalPrice).toBe(40);

      expect(result.data.subtotal).toBe(90);
    });

    it('should calculate Red 1 set and Green 1 set for a member to be subtotal 81', () => {
      const result = appService.calculateFoodPrice({
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
      });
      const [redItem, greenItem] = result.data.items;

      expect(result.message).toBe('Food price calculated successfully');
      expect(result.data.isMember).toBe(true);
      expect(result.data.items).toHaveLength(2);

      expect(redItem.unitPrice).toBe(50);
      expect(redItem.totalPrice).toBe(50);

      expect(greenItem.unitPrice).toBe(40);
      expect(greenItem.totalPrice).toBe(40);

      expect(result.data.subtotal).toBe(81);
    });

    it('should calculate Orange 3 sets to be totalPrice 228 and 114, subtotal 342 after 5% discount', () => {
      const result = appService.calculateFoodPrice({
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
      });
      const [firstOrangeItem, secondOrangeItem] = result.data.items;

      expect(result.message).toBe('Food price calculated successfully');
      expect(result.data.isMember).toBe(false);
      expect(result.data.items).toHaveLength(2);

      expect(firstOrangeItem.menu).toBe('ORANGE');
      expect(firstOrangeItem.quantity).toBe(2);
      expect(firstOrangeItem.unitPrice).toBe(120);
      expect(firstOrangeItem.totalPrice).toBe(228);

      expect(secondOrangeItem.menu).toBe('ORANGE');
      expect(secondOrangeItem.quantity).toBe(1);
      expect(secondOrangeItem.unitPrice).toBe(120);
      expect(secondOrangeItem.totalPrice).toBe(114);

      expect(result.data.subtotal).toBe(342);
    });

    it('should calculate Orange 3 sets for a member to be subtotal 307.8 after 5% and 10% discounts', () => {
      const result = appService.calculateFoodPrice({
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
      });
      const [firstOrangeItem, secondOrangeItem] = result.data.items;

      expect(result.message).toBe('Food price calculated successfully');
      expect(result.data.isMember).toBe(true);
      expect(result.data.items).toHaveLength(2);

      expect(firstOrangeItem.totalPrice).toBe(228);
      expect(secondOrangeItem.totalPrice).toBe(114);
      expect(result.data.subtotal).toBe(307.8);
    });

    it('should calculate Orange 2 sets to stay at totalPrice 240 and subtotal 240 without discount', () => {
      const result = appService.calculateFoodPrice({
        isMember: false,
        items: [
          {
            menu: 'ORANGE',
            quantity: 2,
          },
        ],
      });
      const [orangeItem] = result.data.items;

      expect(result.message).toBe('Food price calculated successfully');
      expect(result.data.isMember).toBe(false);
      expect(result.data.items).toHaveLength(1);

      expect(orangeItem.menu).toBe('ORANGE');
      expect(orangeItem.quantity).toBe(2);
      expect(orangeItem.unitPrice).toBe(120);
      expect(orangeItem.totalPrice).toBe(240);

      expect(result.data.subtotal).toBe(240);
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
