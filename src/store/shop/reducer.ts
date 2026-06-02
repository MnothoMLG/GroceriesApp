import { createReducer } from "@reduxjs/toolkit";
import {
  addProductToCart,
  clearCart,
  decrementProductInCart,
  fetchProductsError,
  fetchProductsSuccess,
  removeProductFromCart,
  setProducts,
} from "./actions";
import { GroceriesState } from "./types";
import { ICartItem } from "@constants/types";
import { getNextProductCartQuantity } from "@util/products";

const INITIAL_STATE: GroceriesState = {
  products: [],
  cart: [],
};

const normaliseQuantity = (quantity = 1) =>
  Number.isFinite(quantity) && quantity > 0 ? quantity : 1;

export const cartReducer = createReducer(INITIAL_STATE, (builder) => {
  builder
    .addCase(setProducts, (state, action) => {
      return { ...state, products: action.payload.products };
    })
    .addCase(fetchProductsSuccess, (state, action) => {
      return { ...state, products: action.payload.products };
    })
    .addCase(fetchProductsError, (state) => {
      return { ...state, products: [] };
    })
    .addCase(addProductToCart, (state, action) => {
      const { product } = action.payload;
      const quantity = normaliseQuantity(action.payload.quantity);
      const existingCartItem = state.cart.find(
        (item) => item.product.id === product.id,
      );
      const currentQuantity = existingCartItem?.quantity ?? 0;
      const nextQuantity = getNextProductCartQuantity({
        product,
        currentQuantity,
        quantity,
      });

      if (nextQuantity <= currentQuantity) {
        return state;
      }

      if (existingCartItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: nextQuantity }
              : item,
          ),
        };
      }

      return {
        ...state,
        cart: [...state.cart, { product, quantity: nextQuantity }],
      };
    })
    .addCase(decrementProductInCart, (state, action) => {
      const { productId } = action.payload;
      const quantity = normaliseQuantity(action.payload.quantity);
      const cart = state.cart.reduce<Array<ICartItem>>((items, item) => {
        if (item.product.id !== productId) {
          return [...items, item];
        }

        const nextQuantity = item.quantity - quantity;

        if (nextQuantity <= 0) {
          return items;
        }

        return [...items, { ...item, quantity: nextQuantity }];
      }, []);

      return { ...state, cart };
    })
    .addCase(removeProductFromCart, (state, action) => {
      return {
        ...state,
        cart: state.cart.filter(
          (item) => item.product.id !== action.payload.productId,
        ),
      };
    })
    .addCase(clearCart, (state) => {
      return { ...state, cart: [] };
    });
});
