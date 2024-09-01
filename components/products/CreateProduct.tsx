"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { ProductSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Textarea } from "../ui/textarea";
import { DollarSign, Loader2 } from "lucide-react";
import Tiptap from "../Tiptap";
import { useUpsertProduct } from "@/server/backend/mutations/productMutations";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

const CreateProduct = ({ productId }: { productId?: string }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
    mode: "all",
  });

  const { mutate, error, isSuccess } = useUpsertProduct();

  const onSubmit = (formData: z.infer<typeof ProductSchema>) => {
    console.log(formData);
    startTransition(() => {
      mutate(formData);
    });
    form.reset();
  };

  return (
    <Card className="mt-8 w-full md:w-[60%]">
      <CardHeader>
        <CardTitle>Create Product</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    {/* <Textarea {...field} /> */}
                    <Tiptap value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign
                        size={32}
                        className="p-2 bg-muted rounded-md absolute left-0 top-0 h-full"
                      />
                      <Input
                        disabled={isPending}
                        className="pl-10 "
                        type="number"
                        {...field}
                        step={0.1}
                        min={0}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={isPending || !form.formState.isValid}
              type="submit"
            >
              {isPending && <Loader2 className="animate-spin mr-2" />}
              {productId
                ? isPending
                  ? "Updating..."
                  : "Update Product"
                : isPending
                ? "Creating..."
                : "Create Product"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
export default CreateProduct;
