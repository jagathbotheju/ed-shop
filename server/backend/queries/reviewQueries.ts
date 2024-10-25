import { useQuery } from "@tanstack/react-query";
import { getReviewsByProductId } from "../actions/reviewActions";

export const useReviewsByProductId = (productId: string) => {
  return useQuery({
    queryKey: ["queries-by-product-id"],
    queryFn: () => getReviewsByProductId(productId),
  });
};
