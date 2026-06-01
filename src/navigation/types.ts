import { RouteProp } from "@react-navigation/native";
import { routes } from "./routes";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { IProduct } from "@constants/types";

export type MainStackParamList = {
  [routes.SHOP_TAB]: undefined;
  [routes.SHOP]: undefined;
  [routes.CART]: undefined;
  [routes.PDP]: {
    product: IProduct;
  };
};
export type GenericMainStackScreenProps<T extends keyof MainStackParamList> =
  NativeStackScreenProps<MainStackParamList, T>["navigation"];

export type GenericMainStackRouteProps<T extends keyof MainStackParamList> =
  RouteProp<MainStackParamList, T>;
