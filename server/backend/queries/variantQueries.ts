import { useQuery } from "@tanstack/react-query";
import { getVariants, getVariantsById } from "../actions/variantActions";

export const useVariants = () => {
  return useQuery({
    queryKey: ["variants"],
    queryFn: () => getVariants(),
  });
};

export const useVariantsById = (variantId: string) => {
  return useQuery({
    queryKey: ["variants-by-id"],
    queryFn: () => getVariantsById(variantId),
  });
};
