import {
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_BY_NAME,
  PRODUCT_PLACEHOLDER_COUNT,
} from "@constants/index";
import { ICartItem, IProduct, ProductCategory } from "@constants/types";

const normaliseCartQuantity = (quantity = 1) =>
  Number.isFinite(quantity) && quantity > 0 ? quantity : 1;

export const isProductCategory = (
  category?: string,
): category is ProductCategory => {
  return PRODUCT_CATEGORIES.includes(category as ProductCategory);
};

export const getProductCategory = (product: IProduct): ProductCategory => {
  const category = product.category?.toLowerCase();

  if (isProductCategory(category)) {
    return category;
  }

  return PRODUCT_CATEGORY_BY_NAME[product.name.toLowerCase()] ?? "pantry";
};

export const filterProducts = ({
  products = [],
  search,
  category,
}: {
  products: Array<IProduct>;
  search: string;
  category: ProductCategory;
}) => {
  const normalisedSearch = search.trim().toLowerCase();

  return products.filter((product) => {
    const matchesCategory =
      category === "all" || getProductCategory(product) === category;
    const matchesSearch =
      !normalisedSearch ||
      product.name.toLowerCase().includes(normalisedSearch);

    return matchesCategory && matchesSearch;
  });
};

export const getProductListData = (
  products: Array<IProduct>,
  loading: boolean,
): Array<IProduct | undefined> => {
  return loading
    ? Array.from({ length: PRODUCT_PLACEHOLDER_COUNT }, () => undefined)
    : products;
};

export const getProductAvailableQuantity = (product?: IProduct) => {
  const availableQuantity = product?.quantity_available;

  if (
    typeof availableQuantity !== "number" ||
    !Number.isFinite(availableQuantity)
  ) {
    return undefined;
  }

  return Math.max(availableQuantity, 0);
};

export const getCartQuantityForProduct = (
  cartItems: Array<ICartItem>,
  productId: number,
) => {
  return (
    cartItems.find((item) => item.product.id === productId)?.quantity ?? 0
  );
};

export const canAddProductQuantity = ({
  product,
  currentQuantity,
  quantity = 1,
}: {
  product: IProduct;
  currentQuantity: number;
  quantity?: number;
}) => {
  const availableQuantity = getProductAvailableQuantity(product);

  if (availableQuantity === undefined) {
    return true;
  }

  return currentQuantity + normaliseCartQuantity(quantity) <= availableQuantity;
};

export const getNextProductCartQuantity = ({
  product,
  currentQuantity,
  quantity = 1,
}: {
  product: IProduct;
  currentQuantity: number;
  quantity?: number;
}) => {
  const requestedQuantity = currentQuantity + normaliseCartQuantity(quantity);
  const availableQuantity = getProductAvailableQuantity(product);

  if (availableQuantity === undefined) {
    return requestedQuantity;
  }

  if (currentQuantity >= availableQuantity) {
    return currentQuantity;
  }

  return Math.min(requestedQuantity, availableQuantity);
};
