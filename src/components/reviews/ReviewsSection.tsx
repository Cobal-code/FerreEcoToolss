import { useState, forwardRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewsList } from "./ReviewsList";
import { ReviewForm } from "./ReviewForm";
import { StarRating } from "./StarRating";
import { MessageSquare, PenLine } from "lucide-react";
import { useProductReviews } from "@/hooks/useProductReviews";

interface ReviewsSectionProps {
  productId: number;
}

export const ReviewsSection = forwardRef<HTMLDivElement, ReviewsSectionProps>(
  ({ productId }, ref) => {
    const queryClient = useQueryClient();
    // Comparte caché con el resumen de la ficha: una sola consulta por producto
    const { averageRating, totalReviews } = useProductReviews(productId);
    const stats = { average: averageRating, total: totalReviews };
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleReviewSuccess = () => {
      setRefreshTrigger((prev) => prev + 1);
      queryClient.invalidateQueries({ queryKey: ["review-stats", productId] });
    };

    return (
      <div ref={ref} className="scroll-mt-40">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-2xl font-extrabold flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </span>
              Reseñas de Clientes
            </h2>
            {stats.total > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <StarRating rating={stats.average} size="md" />
                <span className="font-bold text-lg tabular-nums">{stats.average.toFixed(1)}</span>
                <span className="text-muted-foreground">
                  ({stats.total} {stats.total === 1 ? "reseña" : "reseñas"})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12 rounded-xl bg-muted p-1">
            <TabsTrigger value="reviews" className="flex items-center gap-2 rounded-lg h-full data-[state=active]:shadow-sm">
              <MessageSquare className="h-4 w-4" />
              Ver Reseñas
            </TabsTrigger>
            <TabsTrigger value="write" className="flex items-center gap-2 rounded-lg h-full data-[state=active]:shadow-sm">
              <PenLine className="h-4 w-4" />
              Escribir Reseña
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="mt-0">
            <ReviewsList productId={productId} refreshTrigger={refreshTrigger} />
          </TabsContent>

          <TabsContent value="write" className="mt-0">
            <div className="max-w-xl mx-auto">
              <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border/70 shadow-soft">
                <h3 className="text-lg font-bold mb-4">Comparte tu experiencia</h3>
                <ReviewForm productId={productId} onSuccess={handleReviewSuccess} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }
);

ReviewsSection.displayName = "ReviewsSection";
