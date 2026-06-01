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
    image: string | null;
    category: string | null;
  };
  pdp: {
    title: string;
    shortDescription: string;
    aiSummary: string;
    healthLabel: string;
    benefits: string[];
    servingIdeas: string[];
    storageTip: string;
    tags: string[];
    disclaimer: string;
  };
  aiImages: Array<{
    title: string;
    url: string;
    prompt: string;
  }>;
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
