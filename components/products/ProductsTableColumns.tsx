"use client";
import { ProductSchema } from "@/lib/schema";
import { formatCurrency } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { z } from "zod";
import ProductTableActions from "./ProductTableActions";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";

type ProductColumn = {
  id: string;
  title: string;
  price: number;
  variants: string[];
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
    header: "Variants",
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
