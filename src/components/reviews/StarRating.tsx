import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  allowHalf?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export const StarRating = ({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  allowHalf = true,
  onRatingChange,
  className,
}: StarRatingProps) => {
  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-5 w-5",
    lg: "h-7 w-7",
  };

  const handleClick = (index: number, isHalf: boolean) => {
    if (interactive && onRatingChange) {
      // If allowHalf and clicked on left half, set to X.5
      // If clicked on right half or !allowHalf, set to X+1
      const newRating = isHalf && allowHalf ? index + 0.5 : index + 1;
      onRatingChange(newRating);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    if (!interactive || !allowHalf) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isLeftHalf = x < rect.width / 2;
    
    e.currentTarget.setAttribute('data-half', isLeftHalf ? 'true' : 'false');
  };

  const handleClickEvent = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    if (!interactive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isLeftHalf = x < rect.width / 2;
    
    handleClick(index, isLeftHalf && allowHalf);
  };

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const isFull = rating >= starValue;
        const isHalf = !isFull && rating >= starValue - 0.5 && rating < starValue;
        const isEmpty = rating < starValue - 0.5;

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={(e) => handleClickEvent(e, index)}
            onMouseMove={(e) => handleMouseMove(e, index)}
            className={cn(
              "relative transition-transform",
              interactive && "cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded",
              !interactive && "cursor-default"
            )}
            aria-label={interactive ? `Calificar ${index + 1} estrellas` : undefined}
          >
            {/* Empty star background */}
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors",
                "fill-transparent text-muted-foreground/40"
              )}
            />
            
            {/* Full star overlay */}
            {isFull && (
              <Star
                className={cn(
                  sizeClasses[size],
                  "absolute inset-0 fill-amber-400 text-amber-400 transition-colors"
                )}
              />
            )}
            
            {/* Half star overlay - more precise rendering */}
            {isHalf && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                <Star
                  className={cn(
                    sizeClasses[size],
                    "fill-amber-400 text-amber-400"
                  )}
                />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
