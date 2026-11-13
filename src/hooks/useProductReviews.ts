import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  isLoading: boolean;
}

// Type for the secure RPC stats response
interface ReviewStatsResponse {
  average_rating: number;
  total_reviews: number;
}

const EMPTY = { averageRating: 0, totalReviews: 0 };

const fetchReviewStats = async (productId: number) => {
  // Use secure RPC function - no email exposure possible
  const { data, error } = await supabase.rpc("get_review_stats", { p_product_id: productId });

  if (error) {
    console.error("Error fetching review stats:", error);
    return EMPTY;
  }

  if (data && Array.isArray(data) && data.length > 0) {
    const statsData = data[0] as ReviewStatsResponse;
    return {
      averageRating: Number(statsData.average_rating) || 0,
      totalReviews: Number(statsData.total_reviews) || 0,
    };
  }
  return EMPTY;
};

/**
 * Estadísticas de reseñas de un producto.
 * Usa la caché de React Query: el mismo producto no se consulta dos veces
 * mientras los datos estén frescos, aunque aparezca en varias tarjetas o páginas.
 * `enabled` permite diferir la consulta (p. ej. hasta que la tarjeta sea visible).
 */
export const useProductReviews = (productId: number, enabled = true): ReviewStats => {
  const valid = !!productId && productId > 0;
  const { data, isLoading } = useQuery({
    queryKey: ["review-stats", productId],
    queryFn: () => fetchReviewStats(productId),
    enabled: valid && enabled,
  });

  return {
    averageRating: data?.averageRating ?? 0,
    totalReviews: data?.totalReviews ?? 0,
    isLoading: valid && enabled ? isLoading : false,
  };
};
