import { combineReducers } from "@reduxjs/toolkit";
import { loadingReducer } from "./loading/reducer";
import { cartReducer } from "./shop/reducer";

export const reducers = combineReducers({
  loadingReducer,
  cartReducer,
});

export type AppState = ReturnType<typeof reducers>;
