import {
  canAddProductQuantity,
  filterProducts,
  formatPrice,
  getNextProductCartQuantity,
  getProductCategory,
  getProductListData,
} from "./index";
import { IProduct } from "@constants/types";

const apple: IProduct = {
  id: 1,
  name: "Apples",
  price: 4.5,
};

const bread: IProduct = {
  id: 2,
  name: "Bread",
  price: 18,
};

const milk: IProduct = {
  id: 3,
  name: "Milk",
  price: 12,
};

describe("formatPrice", () => {
  it("formats values with a spaced currency symbol by default", () => {
    expect(formatPrice(12.5, "R")).toBe("R 12.50");
  });

  it("formats compact values without spacing", () => {
    expect(formatPrice(12.5, "R", true)).toBe("R12.50");
  });
});

describe("product utilities", () => {
  it("gets product categories from known grocery names", () => {
    expect(getProductCategory(apple)).toBe("produce");
    expect(getProductCategory(bread)).toBe("bakery");
    expect(getProductCategory(milk)).toBe("dairy");
  });

  it("filters products by category and search", () => {
    expect(
      filterProducts({
        products: [apple, bread, milk],
        category: "produce",
        search: "app",
      }),
    ).toEqual([apple]);
  });

  it("returns placeholder rows while a product list is loading", () => {
    expect(getProductListData([apple], true)).toHaveLength(10);
    expect(getProductListData([apple], false)).toEqual([apple]);
  });

  it("checks whether a product can be added based on available stock", () => {
    const limitedApple = { ...apple, quantity_available: 2 };

    expect(
      canAddProductQuantity({
        product: limitedApple,
        currentQuantity: 1,
      }),
    ).toBe(true);
    expect(
      canAddProductQuantity({
        product: limitedApple,
        currentQuantity: 2,
      }),
    ).toBe(false);
  });

  it("caps the next cart quantity at available stock", () => {
    const limitedApple = { ...apple, quantity_available: 2 };

    expect(
      getNextProductCartQuantity({
        product: limitedApple,
        currentQuantity: 0,
        quantity: 5,
      }),
    ).toBe(2);
  });
});
