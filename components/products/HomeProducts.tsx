"use client";
import { useProducts } from "@/server/backend/queries/productQueries";
import { Loader2 } from "lucide-react";
import _ from "lodash";
import Link from "next/link";
import { useVariants } from "@/server/backend/queries/variantQueries";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";

const HomeProducts = () => {
  const { data: products, isPending, isFetching } = useProducts();
  // const { data: variants, isPending, isFetching } = useVariants();

  if (isPending || isFetching) {
    return (
      <div className="flex w-full justify-center text-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (_.isEmpty(products) || !products) {
    return (
      <div className="flex w-full justify-center">
        <h3 className="text-3xl font-semibold text-clip p-10 rounded-md">
          No Products Found!
        </h3>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 justify-center">
      {products.map((product) => (
        <Link href={`/products/${product.id}`} key={product.id}>
          <Card className="hover:shadow-lg hover:scale-105 transition-all duration-300">
            <CardContent className="flex flex-col h-[300px] relative p-1">
              <div className="">
                <Image
                  src={product.productVariants[0].variantImages[0].url}
                  height={100}
                  width={220}
                  alt={product.title}
                  loading="lazy"
                  className="rounded-md"
                />
              </div>

              <div className="flex justify-between mt-4 p-2 absolute bottom-1 left-1 right-1">
                <div className="font-medium">
                  <h2>{product.title}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {product.productVariants[0].productType}
                  </p>
                </div>
                <p className="text-sm p-1">{formatCurrency(product.price)}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
export default HomeProducts;
