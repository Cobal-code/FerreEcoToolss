import { StarRating } from "./StarRating";
import { cn } from "@/lib/utils";

interface ProductRatingSummaryProps {
  averageRating: number;
  totalReviews: number;
  onClick?: () => void;
  className?: string;
}

export const ProductRatingSummary = ({
  averageRating,
  totalReviews,
  onClick,
  className,
}: ProductRatingSummaryProps) => {
  if (totalReviews === 0) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors",
          className
        )}
      >
        <StarRating rating={0} size="sm" />
        <span className="underline-offset-2 hover:underline">
          Sé el primero en opinar
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 text-sm hover:text-primary transition-colors group",
        className
      )}
    >
      <StarRating rating={averageRating} size="sm" />
      <span className="font-semibold text-foreground">{averageRating.toFixed(1)}</span>
      <span className="text-muted-foreground group-hover:underline underline-offset-2">
        ({totalReviews} {totalReviews === 1 ? "reseña" : "reseñas"})
      </span>
    </button>
  );
};
