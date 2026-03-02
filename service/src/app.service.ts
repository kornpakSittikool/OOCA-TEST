import { BadRequestException, Injectable } from '@nestjs/common';
import type { CalculateFoodPriceInput } from './contracts/calculate-food-price.contract';
import { listMenu } from './common/mocks/list-menus';

@Injectable()
export class AppService {
  private readonly menuMap = new Map(
    listMenu.map((menu) => [menu.id, menu] as const),
  );
  private readonly orangeDiscountMenu: CalculateFoodPriceInput['items'][number]['menu'] =
    'ORANGE';

  getHello(): string {
    return 'Hello World!';
  }

  getMenus() {
    return {
      message: 'This is the menus data',
      data: listMenu,
    };
  }

  calculateFoodPrice(payload: CalculateFoodPriceInput) {
    const orangeQuantity = this.getMenuQuantity(
      payload.items,
      this.orangeDiscountMenu,
    );
    const items = this.buildPricedItems(payload.items, orangeQuantity);
    const baseSubtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const subtotal = this.applyMemberDiscount(baseSubtotal, payload.isMember);

    return {
      message: 'Food price calculated successfully',
      data: {
        isMember: payload.isMember,
        items,
        subtotal,
      },
    };
  }

  private buildPricedItems(
    items: CalculateFoodPriceInput['items'],
    orangeQuantity: number,
  ) {
    return items.map((item) => {
      const menu = this.menuMap.get(item.menu);

      if (!menu) {
        throw new BadRequestException(`Menu ${item.menu} not found`);
      }

      const lineTotal = menu.price * item.quantity;

      return {
        ...item,
        name: menu.name,
        unitPrice: menu.price,
        totalPrice: this.applyOrangeDiscount(
          item.menu,
          orangeQuantity,
          lineTotal,
        ),
      };
    });
  }

  private getMenuQuantity(
    items: CalculateFoodPriceInput['items'],
    menuId: CalculateFoodPriceInput['items'][number]['menu'],
  ) {
    return items.reduce((sum, item) => {
      if (item.menu !== menuId) {
        return sum;
      }

      return sum + item.quantity;
    }, 0);
  }

  private applyOrangeDiscount(
    menuId: CalculateFoodPriceInput['items'][number]['menu'],
    orangeQuantity: number,
    totalPrice: number,
  ) {
    const isEligibleMenu = menuId === this.orangeDiscountMenu;
    const hasEnoughOrangeSets = orangeQuantity > 2;

    if (!isEligibleMenu || !hasEnoughOrangeSets) {
      return totalPrice;
    }

    return totalPrice - totalPrice * 0.05;
  }

  private applyMemberDiscount(subtotal: number, isMember: boolean) {
    if (!isMember) {
      return subtotal;
    }

    return subtotal - subtotal * 0.1;
  }
}
