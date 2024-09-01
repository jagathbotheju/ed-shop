import { useMutation } from "@tanstack/react-query";
import { upsertProduct } from "../actions/product-actions";
import { z } from "zod";
import { ProductSchema } from "@/lib/schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useUpsertProduct = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (formData: z.infer<typeof ProductSchema>) =>
      upsertProduct(formData),
    onSuccess: (res) => {
      const message = res?.success;
      toast.success(message);
      router.push("/dashboard/products");
    },
    onError: (res) => {
      const err = res.message;
      toast.error(err);
    },
  });
};
