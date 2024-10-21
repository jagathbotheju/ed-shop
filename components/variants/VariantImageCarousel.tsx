"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { ProductVariantExt } from "@/server/db/schema/productVariants";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  variant: ProductVariantExt | null;
}

const VariantImageCarousel = ({ variant }: Props) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });

    api.on("slidesInView", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (!variant) return <Loader2 className="animate-spin" />;

  return (
    <div className="mx-auto w-full">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {variant.variantImages?.map((image, index) => (
            <CarouselItem key={index}>
              {image.url ? (
                <Image
                  priority
                  className="rounded-md"
                  width={1280}
                  height={720}
                  src={image.url}
                  alt={image.name}
                />
              ) : null}
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="flex overflow-clip py-2 gap-2">
          {variant.variantImages?.map((image, index) => (
            <div key={index}>
              {image.url ? (
                <Image
                  onClick={() => api?.scrollTo(index)}
                  priority
                  className={cn(
                    index === current ? "opacity-100" : "opacity-75",
                    "rounded-md transition-all duration-300 ease-in-out cursor-pointer hover:opacity-75"
                  )}
                  width={72}
                  height={48}
                  src={image.url}
                  alt={image.name}
                />
              ) : null}
            </div>
          ))}
        </div>
      </Carousel>
    </div>
  );
};
export default VariantImageCarousel;
