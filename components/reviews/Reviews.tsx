"use client";
import { useReviewsByProductId } from "@/server/backend/queries/reviewQueries";
import ReviewForm from "./ReviewForm";
import { motion } from "framer-motion";
import SkeletonWrapper from "../SkeletonWrapper";
import { Card } from "../ui/card";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistance, subDays } from "date-fns";
import Stars from "./Stars";
import { getReviewAverage } from "@/lib/utils";
import ReviewChart from "./ReviewChart";
import { Loader2 } from "lucide-react";

interface Props {
  productId: string;
}

const Reviews = ({ productId }: Props) => {
  const { data: productReviews, isLoading } = useReviewsByProductId(productId);

  if (!productReviews) return <Loader2 />;

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-4">Product Reviews</h2>

      <div className="flex flex-col md:flex-row gap-5 w-full">
        <motion.div className="flex flex-1 flex-col">
          {productReviews ? (
            <>
              {productReviews.map((review) => (
                <Card key={review.id} className="flex flex-col">
                  <div className="p-5 flex gap-2 items-center">
                    <Avatar>
                      <AvatarImage
                        src={review.user.image ?? ""}
                        alt={review.user.name ?? "guest"}
                      />
                      <AvatarFallback>
                        <span className="text-amber-400 font-semibold">
                          {review.user.name?.slice(0, 2).toUpperCase()}
                        </span>
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="text-sm font-bold">{review.user.name}</p>
                      <Stars
                        rating={review.rating}
                        totalReviews={productReviews.length}
                      />
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground font-bold">
                          {formatDistance(
                            subDays(review.createdAt, 0),
                            new Date()
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-5">
                    <p className="text-lg font-medium">{review.comment}</p>
                  </div>
                  <ReviewForm productId={productId} />
                </Card>
              ))}
            </>
          ) : (
            <div>No Reviews Found</div>
          )}
        </motion.div>
        <div className="flex flex-col flex-1">
          <ReviewChart reviews={productReviews} isLoading={isLoading} />
        </div>
      </div>
    </section>
  );
};
export default Reviews;
