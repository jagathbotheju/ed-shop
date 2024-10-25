import { Review } from "@/server/db/schema/reviews";
import { Card, CardDescription, CardTitle } from "../ui/card";
import SkeletonWrapper from "../SkeletonWrapper";
import { getReviewAverage } from "@/lib/utils";
import Stars from "./Stars";
import { useMemo } from "react";
import { Progress } from "../ui/progress";

interface Props {
  reviews: Review[];
  isLoading: boolean;
}

const ReviewChart = ({ reviews, isLoading }: Props) => {
  const totalRating = getReviewAverage(
    reviews?.map((review) => review.rating) ?? [0]
  );

  const getRatingsByStars = useMemo(() => {
    const ratingValues = Array.from({ length: 5 }, () => 0);
    const totalReviews = reviews?.length;
    reviews?.forEach((review) => {
      const startIndex = review.rating - 1;
      if (startIndex >= 0 && startIndex < 5) {
        ratingValues[startIndex]++;
      }
    });

    return ratingValues.map((rating) => (rating / totalReviews) * 100);
  }, [reviews]);

  return (
    <div>
      <SkeletonWrapper isLoading={isLoading}>
        <Card className="flex flex-col p-8 rounded-md gap-6">
          <div className="flex flex-col gap-2 justify-center">
            <CardTitle>Product Rating:</CardTitle>
            <Stars rating={totalRating} totalReviews={reviews?.length} />
            <CardDescription>{totalRating.toFixed(1)} stars</CardDescription>
          </div>

          {getRatingsByStars.map((rating, index) => (
            <div
              key={index}
              className="flex gap-2 justify-between items-center"
            >
              <p className="text-xs font-medium whitespace-nowrap">
                {index + 1} <span>stars</span>
              </p>
              <Progress value={rating} />
            </div>
          ))}
        </Card>
      </SkeletonWrapper>
    </div>
  );
};
export default ReviewChart;
