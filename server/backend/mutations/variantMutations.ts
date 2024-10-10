import { VariantSchema } from "@/lib/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { upsertVariant } from "../actions/variantActions";
import { toast } from "sonner";

export const useUpsertProductVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      variantData,
      id,
      productId,
      editMode = false,
    }: {
      variantData: z.infer<typeof VariantSchema>;
      id?: string;
      productId: string;
      editMode: boolean;
    }) => upsertVariant({ variantData, id, productId, editMode }),
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
