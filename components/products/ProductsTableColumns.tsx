"use client";
import { ProductSchema } from "@/lib/schema";
import { cn, formatCurrency } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { z } from "zod";
import ProductTableActions from "./ProductTableActions";
import { Button } from "../ui/button";
import { ArrowUpDown, PlusCircle } from "lucide-react";
import {
  ProductVariant,
  ProductVariantExt,
  productVariantRelations,
} from "@/server/db/schema/productVariants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import ProductVariants from "./ProductVariants";

type ProductColumn = {
  id: string;
  title: string;
  price: number;
  variants: ProductVariant[];
  image: string;
};

const ProductsTableColumns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "variants",
    header: ({ column }) => {
      return <span className="flex justify-center">Variants</span>;
    },
    cell: ({ row }) => {
      const variants = row.getValue("variants") as ProductVariantExt[];
      const productId = row.getValue("id") as string;
      // console.log("column variants", variants);

      return (
        <div
          className={cn(
            "flex w-full justify-center",
            variants.length > 0 && "justify-between"
          )}
        >
          <div className="flex items-center gap-2">
            {variants.map((variant) => (
              <div key={variant.id}>
                {/* <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild> */}
                <ProductVariants
                  id={variant.id}
                  productId={variant.productId}
                  variant={variant}
                  editMode={true}
                >
                  <div
                    className="w-5 h-5 rounded-full cursor-pointer"
                    key={variant.id}
                    style={{ background: variant.color }}
                  />
                </ProductVariants>
                {/* </TooltipTrigger>
                    <TooltipContent>
                      <p>{variant.productType}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider> */}
              </div>
            ))}
          </div>

          <ProductVariants productId={productId} editMode={false}>
            <PlusCircle className="w-5 h-5 cursor-pointer text-primary" />
          </ProductVariants>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      return <span>{formatCurrency(price)}</span>;
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const cellImage = row.getValue("image") as string;
      const cellTitle = row.getValue("title") as string;
      return (
        <Image
          src={cellImage}
          alt={cellTitle}
          width={50}
          height={50}
          className="rounded-md"
        />
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      const productId = row.getValue("id") as string;
      return <ProductTableActions productId={productId} />;
    },
  },
];
export default ProductsTableColumns;
