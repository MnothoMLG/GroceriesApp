import {
  Apple,
  Beef,
  Milk,
  PackageSearch,
  ShoppingBasket,
  Wheat,
} from "lucide-react-native";
import { CategoryOption, ProductCategory } from "./types";

export * from "./types";
export const CHECKOUT_MINIMUM = 5;
export const FREE_DELIVERY_THRESHOLD = 10;
export const DELIVERY_FEE = 2;

export const SEARCH_DEBOUNCE_MS = 550;
export const PRODUCT_PLACEHOLDER_COUNT = 10;

export const PRODUCT_CATEGORIES: ReadonlyArray<ProductCategory> = [
  "all",
  "produce",
  "bakery",
  "protein",
  "dairy",
  "pantry",
];

export const PRODUCT_CATEGORY_BY_NAME: Record<string, ProductCategory> = {
  apples: "produce",
  bananas: "produce",
  carrots: "produce",
  spinach: "produce",
  tomatoes: "produce",
  onions: "produce",
  potatoes: "produce",
  bread: "bakery",
  "chicken breast": "protein",
  "ground beef": "protein",
  "salmon fillet": "protein",
  milk: "dairy",
  eggs: "dairy",
  cheese: "dairy",
  butter: "dairy",
  yogurt: "dairy",
  rice: "pantry",
  pasta: "pantry",
  "olive oil": "pantry",
  cereal: "pantry",
};

export const CATEGORY_OPTIONS: Array<CategoryOption> = [
  {
    key: "all",
    labelKey: "shop.categories.all",
    Icon: ShoppingBasket,
  },
  {
    key: "produce",
    labelKey: "shop.categories.produce",
    Icon: Apple,
  },
  {
    key: "bakery",
    labelKey: "shop.categories.bakery",
    Icon: Wheat,
  },
  {
    key: "protein",
    labelKey: "shop.categories.protein",
    Icon: Beef,
  },
  {
    key: "dairy",
    labelKey: "shop.categories.dairy",
    Icon: Milk,
  },
  {
    key: "pantry",
    labelKey: "shop.categories.pantry",
    Icon: PackageSearch,
  },
];
