import { useQuery } from "@tanstack/react-query";
import { getVariants } from "../actions/variantActions";

export const useVariants = () => {
  return useQuery({
    queryKey: ["variants"],
    queryFn: () => getVariants(),
  });
};
