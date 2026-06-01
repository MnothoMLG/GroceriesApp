import { IProduct } from "@constants/types";
import { createAction } from "@reduxjs/toolkit";

export const GET_PRODUCTS_LOADING_KEY = "@GROCERIES/GET_PRODUCTS";

export const fetchProductsRequest = createAction(
  "@GROCERIES/GET_PRODUCTS_API_REQUEST",
);

export const fetchProductsSuccess = createAction<{
  products: Array<IProduct>;
}>("@GROCERIES/GET_PRODUCTS_API_SUCCESS");

export const fetchProductsError = createAction<{
  error: string;
}>("@GROCERIES/GET_PRODUCTS_API_ERROR");

export const setProducts = createAction<{
  products: Array<IProduct>;
}>("@GROCERIES/SET_PRODUCTS");

export const addProductToCart = createAction<{
  product: IProduct;
  quantity?: number;
}>("@GROCERIES/ADD_PRODUCT_TO_CART");

export const decrementProductInCart = createAction<{
  productId: number;
  quantity?: number;
}>("@GROCERIES/DECREMENT_PRODUCT_IN_CART");

export const removeProductFromCart = createAction<{
  productId: number;
}>("@GROCERIES/REMOVE_PRODUCT_FROM_CART");

export const clearCart = createAction("@GROCERIES/CLEAR_CART");
