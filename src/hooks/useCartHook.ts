import { getBasketHealthSuggestions, getProductAiDetails } from "@api/index";
import { IProduct } from "@constants";
import { useQuery } from "@tanstack/react-query";

export const useProductAiDetails = (product?: IProduct) => {
  return useQuery({
    queryKey: ["product-ai-details", product?.name],
    queryFn: () => {
      if (!product?.name) {
        throw new Error("Product name is required");
      }

      return getProductAiDetails(product);
    },
    enabled: !!product?.name,
    staleTime: 1000 * 60 * 60 * 24,
    retry: 1,
  });
};

export const useBasketHealthCoach = (basket: IProduct[], enabled = true) => {
  return useQuery({
    queryKey: [
      "basket-health",
      JSON.stringify(
        basket
          .map((item) => ({
            name: item.name,
          }))
          .sort((a, b) => a.name.localeCompare(b.name)),
      ),
    ],
    queryFn: () => getBasketHealthSuggestions(basket),
    enabled: enabled && basket.length > 0,
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });
};
