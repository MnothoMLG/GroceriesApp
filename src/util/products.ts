import {
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_BY_NAME,
  PRODUCT_PLACEHOLDER_COUNT,
} from "@constants/index";
import { IProduct, ProductCategory } from "@constants/types";

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
