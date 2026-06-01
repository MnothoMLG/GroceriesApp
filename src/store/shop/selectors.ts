import { AppState } from "../root.reducer";

export const getAllProducts = (app: AppState) => app.cartReducer.products;

export const getCartItems = (app: AppState) => app.cartReducer.cart;

export const getCartItemCount = (app: AppState) =>
  app.cartReducer.cart.reduce((count, item) => count + item.quantity, 0);

export const getCartTotal = (app: AppState) =>
  app.cartReducer.cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

export const getCartProductById = (productId: number) => (app: AppState) =>
  app.cartReducer.cart.find((item) => item.product.id === productId);
