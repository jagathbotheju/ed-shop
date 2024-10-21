import { ReviewSchema } from "@/lib/schema";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { addReview } from "../actions/reviewActions";
import { toast } from "sonner";

export const useAddReview = () => {
  return useMutation({
    mutationFn: ({
      reviewData,
      productId,
    }: {
      reviewData: z.infer<typeof ReviewSchema>;
      productId: string;
    }) => addReview({ reviewData, productId }),
    onSuccess: (res) => {
      if (res.success) {
        console.log("success", res);
        const message = res?.success;
        toast.success(message);
      }
      if (res.error) {
        toast.error(res.error);
      }
    },
    onError: (res) => {
      console.log("error", res);
      const err = res.message;
      toast.error(err);
    },
  });
};
