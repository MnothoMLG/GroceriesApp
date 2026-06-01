import {
  addProductToCart,
  clearCart,
  decrementProductInCart,
  removeProductFromCart,
  setProducts,
} from "./actions";
import { cartReducer } from "./reducer";
import { IProduct } from "@constants/types";

const apple: IProduct = {
  id: 1,
  name: "Apple",
  price: 4.5,
  category: "Fruit",
  unit: "each",
};

const bread: IProduct = {
  id: 2,
  name: "Bread",
  price: 18,
  category: "Bakery",
  unit: "loaf",
};

describe("cartReducer grocery cart state", () => {
  it("stores grocery products", () => {
    const state = cartReducer(
      undefined,
      setProducts({ products: [apple, bread] }),
    );

    expect(state.products).toEqual([apple, bread]);
  });

  it("adds products to cart and increments existing quantities", () => {
    let state = cartReducer(undefined, addProductToCart({ product: apple }));

    state = cartReducer(
      state,
      addProductToCart({ product: apple, quantity: 2 }),
    );

    expect(state.cart).toEqual([{ product: apple, quantity: 3 }]);
  });

  it("decrements product quantities and removes products at zero", () => {
    let state = cartReducer(
      undefined,
      addProductToCart({ product: apple, quantity: 3 }),
    );

    state = cartReducer(
      state,
      decrementProductInCart({ productId: apple.id, quantity: 2 }),
    );

    expect(state.cart).toEqual([{ product: apple, quantity: 1 }]);

    state = cartReducer(state, decrementProductInCart({ productId: apple.id }));

    expect(state.cart).toEqual([]);
  });

  it("removes a product from cart and clears the cart", () => {
    let state = cartReducer(undefined, addProductToCart({ product: apple }));
    state = cartReducer(state, addProductToCart({ product: bread }));

    state = cartReducer(state, removeProductFromCart({ productId: apple.id }));

    expect(state.cart).toEqual([{ product: bread, quantity: 1 }]);

    state = cartReducer(state, clearCart());

    expect(state.cart).toEqual([]);
  });
});
