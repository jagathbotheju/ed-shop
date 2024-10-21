"use client";
import { ProductExt } from "@/server/db/schema/products";
import { ProductVariantExt } from "@/server/db/schema/productVariants";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

interface Props {
  variants: ProductVariantExt[];
}

const ProductType = ({ variants }: Props) => {
  return (
    <div>
      <motion.div
        key={variants[0].id}
        animate={{ y: 0, opacity: 1 }}
        initial={{ y: 6, opacity: 0 }}
        className="text-secondary-foreground font-medium"
      >
        <p>{variants[0].productType}</p>
      </motion.div>
    </div>
  );
};
export default ProductType;
