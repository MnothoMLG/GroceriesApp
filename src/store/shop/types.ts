import { ICartItem, IProduct } from "@constants/types";

export interface GroceriesState {
  products: Array<IProduct>;
  cart: Array<ICartItem>;
}

export interface IAction<T> {
  type: string;
  payload: T;
}
