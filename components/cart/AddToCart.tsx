"use client";

import { useCartStore } from "@/lib/stores/cartStore";
import { useState } from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { ProductVariantExt } from "@/server/db/schema/productVariants";
import { ProductExt } from "@/server/db/schema/products";

interface Props {
  variant: ProductVariantExt;
  product: ProductExt;
}

const AddToCart = ({ variant, product }: Props) => {
  const { addToCart, cart, totalQuantity, removeFromCart } = useCartStore();

  const variantQuantity = cart
    .map((item) => {
      if (item.variant.variantId === variant.id) {
        return item.variant.quantity;
      }
    })
    .filter((item) => item && item > 0);

  console.log("variant quantity", variantQuantity);

  return (
    <div className="flex items-center justify-stretch gap-2 mt-4">
      {/* minus from cart */}
      <Button
        onClick={() => {
          if (variantQuantity[0] && variantQuantity[0] <= 0) return;
          removeFromCart({
            id: product.id,
            name: `${product.title}+ ${variant.productType}`,
            price: product.price,
            image: variant.variantImages[0].url,
            variant: {
              quantity: 1,
              variantId: variant.id,
            },
          });
        }}
        variant="outline"
        className="text-primary"
      >
        <Minus size={18} strokeWidth={3} />
      </Button>

      {/* add to cart */}
      <Button
        onClick={() => {
          toast.success(
            `${product.title}, ${variant.productType} added to your Cart`
          );
          addToCart({
            id: product.id,
            variant: { variantId: variant.id, quantity: 1 },
            name: `${product.title}+ ${variant.productType}`,
            price: product.price,
            image: variant.variantImages[0].url,
          });
        }}
        className="flex-1"
      >
        Add to Cart {variantQuantity[0] && `( ${variantQuantity[0]} ) items`}
      </Button>

      {/* increase cart */}
      <Button
        onClick={() => {
          addToCart({
            id: product.id,
            variant: { variantId: variant.id, quantity: 1 },
            name: `${product.title}+ ${variant.productType}`,
            price: product.price,
            image: variant.variantImages[0].url,
          });
        }}
        variant="outline"
        className="text-primary"
      >
        <Plus size={18} strokeWidth={3} />
      </Button>
    </div>
  );
};
export default AddToCart;
