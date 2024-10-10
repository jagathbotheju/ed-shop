import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct, upsertProduct } from "../actions/product-actions";
import { z } from "zod";
import { ProductSchema } from "@/lib/schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      const message = res?.success;
      toast.success(message);
    },
    onError: (res) => {
      const err = res.message;
      toast.error(err);
    },
  });
};

export const useUpsertProduct = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (formData: z.infer<typeof ProductSchema>) =>
      upsertProduct(formData),
    onSuccess: (res) => {
      const message = res?.success;
      toast.success(message, { id: "create-product" });
      router.push("/dashboard/products");
    },
    onError: (res) => {
      const err = res.message;
      toast.error(err);
    },
  });
};
