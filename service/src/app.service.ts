import { BadRequestException, Injectable } from '@nestjs/common';
import type { CalculateFoodPriceInput } from './contracts/calculate-food-price.contract';
import { listMenu } from './common/mocks/list-menus';

@Injectable()
export class AppService {
  private readonly menuMap = new Map(
    listMenu.map((menu) => [menu.id, menu] as const),
  );
  private readonly bundleDiscountMenus = new Set<
    CalculateFoodPriceInput['items'][number]['menu']
  >(['ORANGE', 'PINK', 'GREEN']);

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
    const items = this.buildPricedItems(payload.items);
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

  private buildPricedItems(items: CalculateFoodPriceInput['items']) {
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
        totalPrice: this.applyBundleDiscount(
          item.menu,
          item.quantity,
          lineTotal,
        ),
      };
    });
  }

  private applyBundleDiscount(
    menuId: CalculateFoodPriceInput['items'][number]['menu'],
    quantity: number,
    totalPrice: number,
  ) {
    const isEligibleMenu = this.bundleDiscountMenus.has(menuId);
    const isEvenBundle = quantity >= 2 && quantity % 2 === 0;

    if (!isEligibleMenu || !isEvenBundle) {
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
