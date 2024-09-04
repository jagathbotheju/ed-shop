import { useQuery } from "@tanstack/react-query";
import { getProductById, getProducts } from "../actions/product-actions";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });
};

export const useProductById = (productId: string) => {
  return useQuery({
    queryKey: ["product-by-id"],
    queryFn: () => getProductById(productId),
  });
};
