import { all } from "redux-saga/effects";
import { watchCharacterSagas } from "./shop/sagas";
export default function* sagas() {
  yield all([watchCharacterSagas()]);
}
