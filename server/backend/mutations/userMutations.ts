import { useMutation } from "@tanstack/react-query";
import { updateUserProfile } from "../actions/userActions";
import { UserProfileSchema } from "@/lib/schema";
import { z } from "zod";
import { toast } from "sonner";

export const useUpdateUserProfile = () => {
  return useMutation({
    mutationFn: ({
      values,
      userId,
    }: {
      values: z.infer<typeof UserProfileSchema>;
      userId: string;
    }) => updateUserProfile({ values, userId }),
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
  });
};
