import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StarRating } from "./StarRating";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Image as ImageIcon, Images } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
 import { ReviewImageGallery } from "./ReviewImageGallery";

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  images: { id: string; image_url: string }[];
}

// Type for the secure RPC response (no email field exists)
interface ReviewRPCResponse {
  id: string;
  product_id: number;
  customer_name: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  updated_at: string;
}

interface ReviewsListProps {
  productId: number;
  refreshTrigger?: number;
}

type SortOption = "smart" | "recent" | "highest" | "lowest";

export const ReviewsList = ({ productId, refreshTrigger }: ReviewsListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("smart");

  useEffect(() => {
    const fetchReviews = async () => {
      if (!productId || productId <= 0) {
        setReviews([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Use secure RPC function - NEVER exposes email
        // Limited to 100 results for anti-scraping
        const { data: reviewsData, error } = await supabase
          .rpc("get_public_reviews", { p_product_id: productId });

        if (error) {
          console.error("Error fetching reviews:", error);
          setReviews([]);
          setIsLoading(false);
          return;
        }

        // Safely handle the RPC response
        const safeReviewsData: ReviewRPCResponse[] = Array.isArray(reviewsData)
          ? reviewsData.filter(
              (r): r is ReviewRPCResponse =>
                r !== null &&
                typeof r === "object" &&
                typeof r.id === "string" &&
                typeof r.customer_name === "string"
            )
          : [];

        // Fetch images for each review
        const reviewsWithImages: Review[] = await Promise.all(
          safeReviewsData.map(async (review) => {
            const { data: imagesData } = await supabase
              .from("review_images")
              .select("id, image_url")
              .eq("review_id", review.id);

            return {
              id: review.id,
              customer_name: review.customer_name,
              rating: review.rating,
              review_text: review.review_text,
              created_at: review.created_at,
              images: Array.isArray(imagesData) ? imagesData : [],
            };
          })
        );

        setReviews(reviewsWithImages);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [productId, refreshTrigger]);

  // Smart sorting: images first, then by rating, then by date
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case "smart":
        // First prioritize reviews with images
        const aHasImages = a.images.length > 0;
        const bHasImages = b.images.length > 0;
        if (aHasImages && !bHasImages) return -1;
        if (!aHasImages && bHasImages) return 1;
        
        // Then by rating (highest first)
        if (b.rating !== a.rating) return b.rating - a.rating;
        
        // Finally by date (most recent first)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      case "recent":
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  // Count reviews with images
  const reviewsWithImagesCount = reviews.filter(r => r.images.length > 0).length;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border border-border rounded-lg space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground">Sin reseñas aún</h3>
        <p className="text-sm text-muted-foreground/80">
          Sé el primero en compartir tu opinión sobre este producto.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with count and sort */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">
            {reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"}
          </span>
          {reviewsWithImagesCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              <Images className="h-3 w-3" />
              {reviewsWithImagesCount} con fotos
            </span>
          )}
        </div>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="smart">Más relevantes</SelectItem>
            <SelectItem value="recent">Más recientes</SelectItem>
            <SelectItem value="highest">Mejor calificación</SelectItem>
            <SelectItem value="lowest">Menor calificación</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

// Extracted ReviewCard component for cleaner code
const ReviewCard = ({ review }: { review: Review }) => {
   const [galleryOpen, setGalleryOpen] = useState(false);
   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
 
   const openGallery = (index: number) => {
     setSelectedImageIndex(index);
     setGalleryOpen(true);
   };

  return (
    <div className="p-4 border border-border rounded-lg space-y-3 bg-background">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">
              {review.customer_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-semibold text-sm">{review.customer_name}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(review.created_at), "d 'de' MMMM, yyyy", { locale: es })}
            </p>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>

      {/* Review text */}
      {review.review_text && (
        <p className="text-sm text-foreground leading-relaxed">
          {review.review_text}
        </p>
      )}

      {/* Images - Thumbnail Gallery */}
      {review.images.length > 0 && (
        <div className="flex gap-2 flex-wrap pt-2">
           {review.images.map((image, index) => (
             <button
               key={image.id}
               className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-all group shadow-sm hover:shadow-md"
               onClick={() => openGallery(index)}
             >
               <img
                 src={image.image_url}
                 alt="Foto de reseña"
                 className="w-full h-full object-cover transition-transform group-hover:scale-105"
                 loading="lazy"
               />
               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                 <ImageIcon className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
               </div>
               {/* Multiple images indicator */}
               {review.images.length > 1 && index === 0 && (
                 <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                   +{review.images.length - 1}
                 </div>
               )}
             </button>
          ))}
           
           {/* Image Gallery Modal */}
           <ReviewImageGallery
             images={review.images}
             initialIndex={selectedImageIndex}
             isOpen={galleryOpen}
             onClose={() => setGalleryOpen(false)}
             customerName={review.customer_name}
             rating={review.rating}
             reviewText={review.review_text}
           />
        </div>
      )}
    </div>
  );
};
