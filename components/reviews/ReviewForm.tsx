"use client";
import { ReviewSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAddReview } from "@/server/backend/mutations/reviewMutations";
import { useState } from "react";

interface Props {
  productId: string;
}

const ReviewForm = ({ productId }: Props) => {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof ReviewSchema>>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
    mode: "all",
  });

  const { mutate, isPending } = useAddReview();

  const onSubmit = (reviewData: z.infer<typeof ReviewSchema>) => {
    console.log("formData", reviewData);
    mutate({ reviewData, productId });
    form.reset();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="w-fit flex self-end">
          <Button className="font-medium w-full" variant="secondary">
            Leave a Comment
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <Input type="hidden" placeholder="Star Rating" {...field} />
                  </FormControl>
                  <div className="flex">
                    {[, 1, 2, 3, 4, 5].map((value) => (
                      <motion.div
                        whileTap={{ scale: 0.8 }}
                        whileHover={{ scale: 1.2 }}
                        className="relative cursor-pointer"
                        key={value}
                      >
                        <Star
                          key={value}
                          onClick={() =>
                            form.setValue("rating", value ?? 0, {
                              shouldValidate: true,
                            })
                          }
                          className={cn(
                            "text-primary bg-transparent transition-all duration-300 ease-in-out",
                            value && form.getValues("rating") >= value
                              ? "fill-primary"
                              : "fill-muted"
                          )}
                        />
                      </motion.div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={isPending || !form.formState.isValid}
              type="submit"
            >
              {isPending ? "Adding Review" : "Add Review"}
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};
export default ReviewForm;
