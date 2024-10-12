"use client";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useForm } from "react-hook-form";
import { VariantSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import VariantTags from "./VariantTags";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import VariantImages from "./VariantImages";
import { ProductVariantExt } from "@/server/db/schema/productVariants";
import {
  useDeleteVariant,
  useUpsertProductVariant,
} from "@/server/backend/mutations/variantMutations";
import _ from "lodash";
import { deleteFiles } from "@/server/backend/actions/uploadActions";
import VariantDeleteDialog from "./VariantDeleteDialog";

interface Props {
  editMode: boolean;
  children: React.ReactNode;
  variant?: ProductVariantExt;
  productId: string;
  id?: string;
}

const ProductVariants = ({
  children,
  variant,
  productId,
  id,
  editMode = false,
}: Props) => {
  const { mutate: deleteVariantMutate } = useDeleteVariant();
  const { mutate } = useUpsertProductVariant();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof VariantSchema>>({
    resolver: zodResolver(VariantSchema),
    defaultValues: {
      type: "",
      color: "#000",
      tags: [],
      images: [],
    },
    mode: "all",
  });

  useEffect(() => {
    if (variant && editMode) {
      form.setValue("type", variant.productType);
      form.setValue("color", variant.color);
      form.setValue(
        "tags",
        variant.variantTags.map((item) => item.tag)
      );
      form.setValue(
        "images",
        variant.variantImages.map((img) => ({
          name: img.name,
          size: img.size,
          url: img.url,
          key: img.key,
        }))
      );
    }
  }, [editMode, form, variant]);

  const onSubmit = (variantData: z.infer<typeof VariantSchema>) => {
    mutate({
      id,
      variantData,
      productId,
      editMode,
    });
    setOpen(false);
  };

  const deleteVariant = () => {
    if (variant && variant.id) {
      deleteVariantMutate(variant.id);
      variant.variantImages.forEach((image) => {
        deleteFiles(image.key);
      });
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="lg:max-w-screen-lg overflow-y-auto max-h-[800px] rounded-md"
        aria-describedby=""
      >
        <DialogHeader>
          <DialogTitle>
            {editMode ? "Edit" : "Create"} product Variant
          </DialogTitle>
          <DialogDescription>
            Manage product variants here. You can add Tags, Images and more...
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className=" flex flex-col w-full space-y-4">
              {/* type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* color */}
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Variant Color</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="color"
                        className="p-0 cursor-pointer rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* tags */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <VariantTags
                        {...field}
                        tags={field.value}
                        onChange={(values) => {
                          field.onChange(values);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* images */}
            <VariantImages />

            <div className="mt-8 flex gap-2">
              <Button type="submit" disabled={!form.formState.isValid}>
                {editMode ? "Update" : "Create"}
              </Button>

              <VariantDeleteDialog deleteVariant={deleteVariant}>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={!form.formState.isValid}
                >
                  Delete
                </Button>
              </VariantDeleteDialog>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  form.reset();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default ProductVariants;
