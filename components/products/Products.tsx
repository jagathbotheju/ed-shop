"use client";

import { useProducts } from "@/server/backend/queries/productQueries";
import { DataTable } from "../DataTable";
import ProductsTableColumns from "./ProductsTableColumns";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const Products = () => {
  const { data: products, isPending } = useProducts();

  if (isPending) {
    return (
      <div className="flex justify-center w-full mt-8 rounded-md">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  if (!products) {
    return (
      <div className="flex justify-center w-full mt-8 rounded-md bg-red-500/20">
        <h1 className="font-semibold text-3xl">No Products Found!</h1>
      </div>
    );
  }

  const productsTableData = products.map((product) => {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      variants: [],
      image: "/images/no-image.jpg",
    };
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Products</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable data={productsTableData} columns={ProductsTableColumns} />
      </CardContent>
    </Card>
  );
};
export default Products;
