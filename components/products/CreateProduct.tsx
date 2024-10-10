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
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/server/db/schema/products";
import { useProductById } from "@/server/backend/queries/productQueries";
import VariantTags from "./VariantTags";
import ProductImagesUpload from "./ProductImagesUpload";
import { toast } from "sonner";
import VariantImages from "./VariantImages";

interface Props {
  productId?: string;
}

const CreateProduct = ({ productId }: Props) => {
  const router = useRouter();
  const { data: product } = useProductById(productId ?? "");
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
    mode: "all",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (productId && product) {
      form.setValue("title", product.title);
      form.setValue("description", product.description);
      form.setValue("price", product.price);
    }
  }, [product, form, productId]);

  const { mutate, error, isSuccess } = useUpsertProduct();

  const onSubmit = (formData: z.infer<typeof ProductSchema>) => {
    console.log(formData);
    toast.loading("Creating product...", { id: "create-product" });
    startTransition(() => {
      mutate({
        id: product && product.id ? product.id : "",
        ...formData,
      });
    });

    console.log("CreateProduct resetting form");
    form.reset();
  };

  return (
    <div className="flex flex-col w-full gap-5 mb-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {/* general */}
          <Card>
            <CardHeader>
              <CardTitle>{productId ? "Update" : "Create"} Product</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full md:w-[60%] flex flex-col gap-4">
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
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-3">
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

            <Button variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default CreateProduct;
