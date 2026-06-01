import { getBasketHealthSuggestions, getProductAiDetails } from "@api/index";
import { IProduct } from "@constants";
import { useQuery } from "@tanstack/react-query";

export const useProductAiDetails = (product?: IProduct) => {
  return useQuery({
    queryKey: ["product-ai-details", product?.id, product?.name],
    queryFn: () => getProductAiDetails(product as IProduct),
    enabled: Boolean(product),
    staleTime: 1000 * 60 * 60 * 24,
  });
};

export const useBasketHealthCoach = (basket: IProduct[], enabled = true) => {
  return useQuery({
    queryKey: [
      "basket-health",
      basket
        .map((item) => item.name)
        .sort()
        .join("|"),
    ],
    queryFn: () => getBasketHealthSuggestions(basket),
    enabled: enabled && basket.length > 0,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    retry: 1,
  });
};
