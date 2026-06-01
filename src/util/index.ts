import Toast from "react-native-toast-message";
import { ToastConfig } from "@constants/types";
export * from "./products";

export const showToast = ({ type, message, title, topOffset }: ToastConfig) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
    visibilityTime: 3000,
    position: topOffset ? "top" : "bottom",
    bottomOffset: 100,
    topOffset: topOffset ?? 80,
  });
};

export const formatPrice = (
  amount: number = 0,
  currencySymbol = "",
  compact = false,
) => {
  const separator = currencySymbol && !compact ? " " : "";

  return `${currencySymbol}${separator}${amount.toFixed(2)}`;
};
