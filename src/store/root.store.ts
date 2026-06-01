import createSagaMiddleware from "redux-saga";
import { configureStore, type Reducer } from "@reduxjs/toolkit";
import { createTransform, persistStore, persistReducer } from "redux-persist";
import type { PersistConfig } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { reducers } from "./root.reducer";
import sagas from "./root.saga";

type RootState = ReturnType<typeof reducers>;

const cartTransform = createTransform(
  (state: any, key) => {
    if (key === "cartReducer") {
      return {
        cart: state.cart ?? [],
      };
    }
    return state;
  },
  (state: any) => state,
);

const config: PersistConfig<RootState> = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["cartReducer"],
  debug: true,
  transforms: [cartTransform],
};

const sagaMiddleware = createSagaMiddleware();
const persistedReducers = persistReducer<RootState>(
  config,
  reducers as Reducer<RootState>,
);

const store = configureStore({
  reducer: persistedReducers,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: false, // Disable thunk if you're only using sagas
    }).concat(sagaMiddleware), // Add saga middleware,
});

const persistor = persistStore(store);
sagaMiddleware.run(sagas);

// persistor.purge();

export { persistor, store };
