 import { useState, useEffect, useCallback } from "react";
 import { Dialog, DialogContent } from "@/components/ui/dialog";
 import { Button } from "@/components/ui/button";
 import { ChevronLeft, ChevronRight, X } from "lucide-react";
 import { StarRating } from "./StarRating";
 
 interface ReviewImage {
   id: string;
   image_url: string;
 }
 
 interface ReviewImageGalleryProps {
   images: ReviewImage[];
   initialIndex: number;
   isOpen: boolean;
   onClose: () => void;
   customerName: string;
   rating: number;
   reviewText: string | null;
 }
 
 export const ReviewImageGallery = ({
   images,
   initialIndex,
   isOpen,
   onClose,
   customerName,
   rating,
   reviewText,
 }: ReviewImageGalleryProps) => {
   const [currentIndex, setCurrentIndex] = useState(initialIndex);
   const [touchStart, setTouchStart] = useState<number | null>(null);
   const [touchEnd, setTouchEnd] = useState<number | null>(null);
 
   // Reset index when modal opens with new image
   useEffect(() => {
     if (isOpen) {
       setCurrentIndex(initialIndex);
     }
   }, [isOpen, initialIndex]);
 
   // Preload next image for smooth navigation
   useEffect(() => {
     if (isOpen && currentIndex < images.length - 1) {
       const nextImage = new Image();
       nextImage.src = images[currentIndex + 1].image_url;
     }
   }, [currentIndex, images, isOpen]);
 
   const goToPrevious = useCallback(() => {
     setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
   }, []);
 
   const goToNext = useCallback(() => {
     setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : prev));
   }, [images.length]);
 
   // Keyboard navigation
   useEffect(() => {
     if (!isOpen) return;
 
     const handleKeyDown = (e: KeyboardEvent) => {
       if (e.key === "ArrowLeft") goToPrevious();
       if (e.key === "ArrowRight") goToNext();
       if (e.key === "Escape") onClose();
     };
 
     window.addEventListener("keydown", handleKeyDown);
     return () => window.removeEventListener("keydown", handleKeyDown);
   }, [isOpen, goToPrevious, goToNext, onClose]);
 
   // Swipe detection
   const minSwipeDistance = 50;
 
   const onTouchStart = (e: React.TouchEvent) => {
     setTouchEnd(null);
     setTouchStart(e.targetTouches[0].clientX);
   };
 
   const onTouchMove = (e: React.TouchEvent) => {
     setTouchEnd(e.targetTouches[0].clientX);
   };
 
   const onTouchEnd = () => {
     if (!touchStart || !touchEnd) return;
     const distance = touchStart - touchEnd;
     const isLeftSwipe = distance > minSwipeDistance;
     const isRightSwipe = distance < -minSwipeDistance;
 
     if (isLeftSwipe) goToNext();
     if (isRightSwipe) goToPrevious();
   };
 
   if (!isOpen || images.length === 0) return null;
 
   const currentImage = images[currentIndex];
   const hasMultipleImages = images.length > 1;
 
   return (
     <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
       <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] p-0 bg-background border-border overflow-hidden">
         {/* Close button */}
         <Button
           variant="ghost"
           size="icon"
           className="absolute right-2 top-2 z-50 bg-background/80 backdrop-blur-sm hover:bg-background"
           onClick={onClose}
         >
           <X className="h-4 w-4" />
         </Button>
 
         <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
           {/* Image section */}
           <div
             className="relative flex-1 flex items-center justify-center bg-black/95 min-h-[300px] lg:min-h-[500px]"
             onTouchStart={onTouchStart}
             onTouchMove={onTouchMove}
             onTouchEnd={onTouchEnd}
           >
             {/* Previous button */}
             {hasMultipleImages && currentIndex > 0 && (
               <Button
                 variant="ghost"
                 size="icon"
                 className="absolute left-2 z-10 bg-background/20 hover:bg-background/40 text-white backdrop-blur-sm"
                 onClick={goToPrevious}
               >
                 <ChevronLeft className="h-6 w-6" />
               </Button>
             )}
 
             {/* Main image */}
             <img
               src={currentImage.image_url}
               alt={`Foto de reseña ${currentIndex + 1}`}
               className="max-w-full max-h-[60vh] lg:max-h-[80vh] object-contain select-none"
               draggable={false}
               loading="eager"
             />
 
             {/* Next button */}
             {hasMultipleImages && currentIndex < images.length - 1 && (
               <Button
                 variant="ghost"
                 size="icon"
                 className="absolute right-2 z-10 bg-background/20 hover:bg-background/40 text-white backdrop-blur-sm"
                 onClick={goToNext}
               >
                 <ChevronRight className="h-6 w-6" />
               </Button>
             )}
 
             {/* Position indicator */}
             {hasMultipleImages && (
               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-full text-sm font-medium">
                 {currentIndex + 1} / {images.length}
               </div>
             )}
           </div>
 
           {/* Review details section */}
           <div className="lg:w-80 p-4 lg:p-6 bg-background border-t lg:border-t-0 lg:border-l border-border overflow-y-auto max-h-[30vh] lg:max-h-none">
             {/* Customer info */}
             <div className="flex items-center gap-3 mb-4">
               <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                 <span className="text-primary font-bold text-sm">
                   {customerName.charAt(0).toUpperCase()}
                 </span>
               </div>
               <div className="min-w-0">
                 <p className="font-semibold text-sm truncate">{customerName}</p>
                 <StarRating rating={rating} size="sm" />
               </div>
             </div>
 
             {/* Review text */}
             {reviewText && (
               <div className="mt-4">
                 <p className="text-sm text-foreground leading-relaxed">
                   {reviewText}
                 </p>
               </div>
             )}
 
             {/* Thumbnail navigation for multiple images */}
             {hasMultipleImages && (
               <div className="mt-6 pt-4 border-t border-border">
                 <p className="text-xs text-muted-foreground mb-2">
                   {images.length} fotos en esta reseña
                 </p>
                 <div className="flex gap-2 flex-wrap">
                   {images.map((img, idx) => (
                     <button
                       key={img.id}
                       onClick={() => setCurrentIndex(idx)}
                       className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${
                         idx === currentIndex
                           ? "border-primary ring-2 ring-primary/30"
                           : "border-border hover:border-primary/50"
                       }`}
                     >
                       <img
                         src={img.image_url}
                         alt={`Miniatura ${idx + 1}`}
                         className="w-full h-full object-cover"
                         loading="lazy"
                       />
                     </button>
                   ))}
                 </div>
               </div>
             )}
           </div>
         </div>
       </DialogContent>
     </Dialog>
   );
 };