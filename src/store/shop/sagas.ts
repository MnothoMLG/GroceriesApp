import { takeLatest, put, call } from "redux-saga/effects";
import {
  fetchProductsError,
  fetchProductsRequest,
  fetchProductsSuccess,
} from "./actions";
import { EToastTypes, IProduct } from "@constants/types";
import { showToast } from "@util";
import productsJson from "@assets/products.json";
import i18n from "@config/translation";

type ProductJsonItem = Omit<IProduct, "id">;

export const mockFetchProducts = () =>
  //mock an api call to fetch products
  new Promise<Array<IProduct>>((resolve) => {
    setTimeout(() => {
      resolve(
        (productsJson as Array<ProductJsonItem>).map((product, index) => ({
          id: index + 1,
          ...product,
        })),
      );
    }, 700);
  });

export function* fetchProducts() {
  try {
    const products: Array<IProduct> = yield call(mockFetchProducts);

    yield put(fetchProductsSuccess({ products }));
  } catch (error) {
    showToast({
      type: EToastTypes.ERROR,
      message: i18n.t("product.loadError"),
    });

    yield put(fetchProductsError({ error: i18n.t("product.loadErrorGeneric") }));
  }
}

export function* watchCharacterSagas() {
  yield takeLatest(fetchProductsRequest.type, fetchProducts);
}
