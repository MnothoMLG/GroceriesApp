import { FC } from "react";
import { SvgProps } from "react-native-svg";

export interface ICallBacks {
  onSuccess?: (msg: string) => void;
  onFailure?: (reason: string) => void;
}

export interface IGenericResponse {
  message: string;
}

export enum EToastTypes {
  ERROR = "error",
  SUCCESS = "success",
}

export enum EButtonVariants {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  TERTIARY = "tertiary",
  LINK = "link",
}

export interface ToastConfig {
  type: EToastTypes;
  message: string;
  title?: string;
  description?: string;
  topOffset?: number;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface IProduct {
  id: number;
  name: string;
  price: number;
  quantity_available?: number;
  rating?: number;
  originalPrice?: number;
  image?: string;
  category?: string;
  description?: string;
  unit?: string;
}

export interface ProductAiDetailsResponse {
  product: {
    name: string;
    price: number | null;
    quantity_available: number | null;
    image: string | null;
    category: string | null;
  };
  pdp: {
    description: string;
    badges: string[];
    nutritionHighlights: string[];
    servingSuggestions: string[];
    storageTip: string;
  };
}

export interface BasketHealthResponse {
  score: number;
  status: "poor" | "fair" | "good" | "excellent";
  title: string;
  summary: string;
  highlights: string[];
  recommendations: string[];
  actions: {
    label: string;
    type: string;
  }[];
  swaps: {
    currentItem: string;
    suggestedItem: string;
    reason: string;
    impact: "low" | "medium" | "high";
    category: string;
  }[];
}

export type ProductCategory =
  | "all"
  | "produce"
  | "bakery"
  | "protein"
  | "dairy"
  | "pantry";

export interface CategoryOption {
  key: ProductCategory;
  labelKey: string;
  Icon: FC<SvgProps>;
}
