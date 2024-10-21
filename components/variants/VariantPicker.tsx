"use client";
import { cn } from "@/lib/utils";
import { ProductVariantExt } from "@/server/db/schema/productVariants";
import { Loader2 } from "lucide-react";

interface Props {
  variants: ProductVariantExt[];
  setVariant: (variant: ProductVariantExt) => void;
  selectedVariant: ProductVariantExt | null;
}

const VariantPicker = ({ variants, setVariant, selectedVariant }: Props) => {
  // console.log("variants", variants);

  if (!variants) return <Loader2 className="animate-spin w-8 h-8" />;

  return (
    <div className="flex gap-2">
      {variants.map((variant) => (
        <div
          onClick={() => setVariant(variant)}
          style={{ background: variant.color }}
          key={variant.id}
          className={cn(
            "w-8 h-8 rounded-full cursor-pointer transition-all duration-300 ease-in-out",
            selectedVariant && selectedVariant.id === variant.id
              ? "opacity-100"
              : "opacity-40"
          )}
        ></div>
      ))}
    </div>
  );
};
export default VariantPicker;
