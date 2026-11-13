import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRating } from "./StarRating";
import { toast } from "sonner";
import { Upload, X, Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// Schema WITHOUT email field - security requirement
const reviewSchema = z.object({
  customerName: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  reviewText: z.string().min(10, "La reseña debe tener al menos 10 caracteres").max(1000),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  productId: number;
  onSuccess?: () => void;
}

interface SubmitReviewResponse {
  success: boolean;
  published?: boolean;
  message?: string;
  error?: string;
  reviewId?: string;
}

export const ReviewForm = ({ productId, onSuccess }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ published: boolean } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  });

  // Allowed MIME types for review images (matches server-side storage policy)
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_IMAGES = 5;

  const validateImageFile = (file: File): boolean => {
    // Strict MIME type validation (not just starts with 'image/')
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Solo se permiten imágenes JPG, PNG, GIF o WebP");
      return false;
    }
    
    // Validate file extension matches MIME type
    const extension = file.name.toLowerCase().split('.').pop();
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!extension || !validExtensions.includes(extension)) {
      toast.error("Extensión de archivo no válida");
      return false;
    }
    
    // Size validation
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Las imágenes deben ser menores a 5MB");
      return false;
    }
    
    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(validateImageFile);

    if (images.length + validFiles.length > MAX_IMAGES) {
      toast.error(`Máximo ${MAX_IMAGES} imágenes por reseña`);
      return;
    }

    setImages((prev) => [...prev, ...validFiles]);
    
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload images to Supabase Storage
  const uploadImages = async (reviewId: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const file of images) {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${reviewId}/${crypto.randomUUID()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('review-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });
      
      if (error) {
        console.error('Error uploading image:', error);
        continue;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('review-images')
        .getPublicUrl(data.path);
      
      if (urlData?.publicUrl) {
        uploadedUrls.push(urlData.publicUrl);
      }
    }
    
    return uploadedUrls;
  };

  // Save image URLs to database
  const saveImageUrls = async (reviewId: string, imageUrls: string[]) => {
    for (const imageUrl of imageUrls) {
      const { error } = await supabase
        .from('review_images')
        .insert({
          review_id: reviewId,
          image_url: imageUrl,
        });
      
      if (error) {
        console.error('Error saving image URL:', error);
      }
    }
  };

  const onSubmit = async (data: ReviewFormData) => {
    if (rating === 0) {
      toast.error("Por favor selecciona una calificación");
      return;
    }

    setIsSubmitting(true);

    try {
      // Use edge function for spam detection and auto-approval - NO EMAIL SENT
      const response = await fetch(`${SUPABASE_URL}/functions/v1/submit-review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          customerName: data.customerName.trim(),
          // NO email field - security requirement
          rating,
          reviewText: data.reviewText.trim(),
        }),
      });

      const result: SubmitReviewResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Error al enviar la reseña");
      }

      // Upload images if review was created successfully and we have a reviewId
      if (result.reviewId && images.length > 0) {
        const uploadedUrls = await uploadImages(result.reviewId);
        if (uploadedUrls.length > 0) {
          await saveImageUrls(result.reviewId, uploadedUrls);
        }
      }

      setSubmissionResult({ published: result.published ?? true });
      reset();
      setRating(0);
      setImages([]);
      setImagePreviews([]);
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error instanceof Error ? error.message : "Error al enviar la reseña. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Display rating value for user feedback
  const getRatingText = (rating: number): string => {
    if (rating === 0) return "";
    if (rating <= 1) return "Muy malo";
    if (rating <= 2) return "Malo";
    if (rating <= 3) return "Regular";
    if (rating <= 4) return "Bueno";
    return "Excelente";
  };

  if (submissionResult) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-lg font-bold mb-2">¡Gracias por tu reseña!</h3>
        <p className="text-muted-foreground text-sm">
          Tu reseña ha sido publicada exitosamente.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Rating with 0.5 increments */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Tu calificación *</Label>
        <div className="flex items-center gap-3">
          <StarRating
            rating={rating}
            size="lg"
            interactive
            allowHalf
            onRatingChange={setRating}
          />
          {rating > 0 && (
            <span className="text-sm text-muted-foreground">
              {rating.toFixed(1)} - {getRatingText(rating)}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Haz clic en la parte izquierda de una estrella para media calificación
        </p>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="customerName" className="text-sm font-semibold">
          Tu nombre *
        </Label>
        <Input
          id="customerName"
          placeholder="Ej: Juan Pérez"
          {...register("customerName")}
          className={cn(errors.customerName && "border-destructive")}
        />
        {errors.customerName && (
          <p className="text-xs text-destructive">{errors.customerName.message}</p>
        )}
      </div>

      {/* NO EMAIL FIELD - Removed for security */}

      {/* Review Text */}
      <div className="space-y-2">
        <Label htmlFor="reviewText" className="text-sm font-semibold">
          Tu reseña *
        </Label>
        <Textarea
          id="reviewText"
          placeholder="Cuéntanos tu experiencia con este producto..."
          rows={4}
          {...register("reviewText")}
          className={cn(errors.reviewText && "border-destructive")}
        />
        {errors.reviewText && (
          <p className="text-xs text-destructive">{errors.reviewText.message}</p>
        )}
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">
          Fotos del producto <span className="text-muted-foreground font-normal">(opcional, máx. 5)</span>
        </Label>
        <div className="flex flex-wrap gap-3">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-border shadow-sm">
              <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 shadow-md hover:scale-110 transition-transform"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {images.length < 5 && (
            <label className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground mt-1">Subir</span>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>
        {images.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {images.length} {images.length === 1 ? "imagen seleccionada" : "imágenes seleccionadas"}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Enviando...
          </>
        ) : (
          "Enviar Reseña"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Al enviar tu reseña, aceptas nuestras políticas de uso.
      </p>
    </form>
  );
};
