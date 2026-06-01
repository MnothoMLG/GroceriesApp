import {
  BasketHealthResponse,
  IProduct,
  ProductAiDetailsResponse,
} from "@constants/index";
import axios from "axios";

export const client = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getBasketHealthSuggestions = async (basket: IProduct[]) => {
  const { data } = await client.post<BasketHealthResponse>(
    "/healthCoachSuggestions",
    {
      basket,
      preferences: {
        country: "South Africa",
      },
    },
  );

  return data;
};

export const getProductAiDetails = async (
  product: IProduct,
): Promise<ProductAiDetailsResponse> => {
  const { data } = await client.post<ProductAiDetailsResponse>(
    "/productAiDetails",
    {
      product,
    },
  );

  return data;
};
