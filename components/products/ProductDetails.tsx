"use client";
import { useProductById } from "@/server/backend/queries/productQueries";
import { Loader2 } from "lucide-react";
import _ from "lodash";
import { useVariantsById } from "@/server/backend/queries/variantQueries";
import ProductType from "./ProductType";
import { Separator } from "../ui/separator";
import { formatCurrency } from "@/lib/utils";
import parse from "html-react-parser";
import VariantPicker from "../variants/VariantPicker";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { nanoid } from "nanoid";
import { ProductVariantExt } from "@/server/db/schema/productVariants";
import VariantImageCarousel from "../variants/VariantImageCarousel";
import Reviews from "../reviews/Reviews";

interface Props {
  productId: string;
}

const ProductDetails = ({ productId }: Props) => {
  const { data: product, isPending, isFetching } = useProductById(productId);
  const [variant, setVariant] = useState<ProductVariantExt | null>(null);

  useEffect(() => {
    if (product && product.productVariants) {
      setVariant(product.productVariants[0]);
    }
  }, [product]);

  if (isPending || isFetching) {
    return (
      <div className="flex w-full justify-center text-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (_.isEmpty(product) || !product) {
    return (
      <div className="flex w-full justify-center">
        <h3 className="text-3xl font-semibold text-clip p-10 rounded-md">
          No Product Found!
        </h3>
      </div>
    );
  }

  return (
    <main>
      <section className="flex gap-5 lg:gap-10 flex-col md:flex-row">
        <div className="flex-1">
          <VariantImageCarousel variant={variant} />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <h2 className="text-2xl font-bold">{product.title}</h2>
          <div>
            <motion.div
              key={nanoid()}
              animate={{ y: 0, opacity: 1 }}
              initial={{ y: 6, opacity: 0 }}
              className="text-secondary-foreground font-medium"
            >
              {variant ? (
                <span>{variant.productType}</span>
              ) : (
                <Loader2 className="animate-spin" />
              )}
            </motion.div>
          </div>

          <Separator className="my-2" />
          <p className="text-2xl font-medium py-2">
            {formatCurrency(product.price)}
          </p>
          <p>{parse(product.description)}</p>
          <p className="text-secondary-foreground my-2">Available Colors</p>
          <VariantPicker
            variants={product.productVariants}
            setVariant={setVariant}
            selectedVariant={variant}
          />
        </div>
      </section>

      <Reviews productId={productId} />
    </main>
  );
};
export default ProductDetails;
