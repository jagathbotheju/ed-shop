import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface Props {
  rating: number;
  totalReviews?: number;
  size?: number;
}

const Stars = ({ rating, totalReviews, size }: Props) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star, index) => (
        <Star
          key={index}
          size={size}
          className={cn(
            "text-primary bg-transparent transition-all duration-300 ease-in-out",
            rating >= star ? "fill-primary" : "fill-transparent"
          )}
        />
      ))}
      {totalReviews && (
        <span className="text-secondary-foreground font-bold text-sm ml-2">
          {totalReviews},{" "}
          {totalReviews && totalReviews > 1 ? "reviews" : "review"}
        </span>
      )}
    </div>
  );
};
export default Stars;
