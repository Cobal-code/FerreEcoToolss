import { Product } from "@/contexts/CartContext";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { useInView } from "@/hooks/useInView";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useProductReviews } from "@/hooks/useProductReviews";
import { StarRating } from "@/components/reviews/StarRating";
import { getSaleTimeRemaining } from "@/utils/saleEndDate";
import { SmartImage } from "@/components/SmartImage";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  // La consulta de reseñas se hace solo cuando la tarjeta se acerca a la pantalla
  const { ref: cardRef, inView } = useInView<HTMLDivElement>();
  const { averageRating, totalReviews } = useProductReviews(product.id, inView);

  // Use deterministic sale end time based on product ID
  useEffect(() => {
    if (!product.isOnSale) return;

    const calculateTimeLeft = () => {
      const remaining = getSaleTimeRemaining(product.id);
      // Convert days to hours for compact display
      const totalHours = (remaining.days * 24) + remaining.hours;
      return {
        hours: totalHours,
        minutes: remaining.minutes,
        seconds: remaining.seconds,
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [product.isOnSale, product.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price);
  };

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <Card ref={cardRef} className="group h-full flex flex-col relative overflow-hidden hover:shadow-soft-hover hover:-translate-y-1 hover:border-border">
      <CardHeader className="p-3 pb-0 space-y-0">
        <Link to={`/producto/${product.id}`} className="relative block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <div className="aspect-square flex items-center justify-center bg-muted/50 dark:bg-white rounded-xl overflow-hidden">
            {product.image.startsWith('/') || product.image.startsWith('http') ? (
              <SmartImage
                src={product.image}
                alt={product.name}
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 300px"
                className="w-full h-full object-contain p-3 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-105"
              />
            ) : (
              <span className="text-5xl sm:text-6xl">{product.image}</span>
            )}
          </div>
          {product.isOnSale && product.originalPrice && (
            <Badge variant="destructive" className="absolute top-2 right-2 text-[11px] font-bold pointer-events-none hover:bg-destructive">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% DESCUENTO
            </Badge>
          )}
        </Link>
      </CardHeader>
      <CardContent className="px-4 pt-4 pb-3 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-1.5 min-h-[1.25rem]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground truncate">
            {product.category}
          </span>
          {totalReviews > 0 && (
            <div className="flex items-center gap-1 shrink-0">
              <StarRating rating={averageRating} size="sm" />
              <span className="text-xs text-muted-foreground">({totalReviews})</span>
            </div>
          )}
        </div>
        <Link to={`/producto/${product.id}`} className="focus-visible:outline-none focus-visible:underline">
          <h3 className="font-semibold text-[15px] sm:text-base leading-snug min-h-[2.6em] group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1 mb-3">
          {product.description}
        </p>
        <div className="space-y-2.5 mt-auto">
          {/* Compact countdown timer for sale products */}
          {product.isOnSale && (
            <div className="flex items-center gap-1.5 rounded-lg bg-destructive/[0.06] border border-destructive/15 text-destructive px-2.5 py-1.5 text-xs font-semibold">
              <Clock className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="whitespace-nowrap tabular-nums">
                Termina en: {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-x-2 gap-y-0.5 flex-wrap">
            <span className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-foreground tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.isOnSale && product.originalPrice && (
              <span className="text-xs sm:text-sm text-muted-foreground line-through tabular-nums">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Addi promotion for high-value products (>50,000 COP) */}
          {product.price >= 50000 && (
            <div className="flex items-center gap-2 bg-[#00D26A]/[0.07] rounded-lg px-2 py-1.5">
              <svg viewBox="0 0 50 20" className="h-4 w-auto flex-shrink-0">
                <rect width="50" height="20" rx="4" fill="#3BDB89"/>
                <text x="25" y="14" textAnchor="middle" fill="white" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="10">addi</text>
              </svg>
              <span className="text-xs font-medium text-[#00A653]">
                Paga en cuotas con Addi
              </span>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Stock: {product.stock} unidades
          </p>
        </div>
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-1">
        <AddToCartButton
          onAdd={() => addToCart(product)}
          label="Agregar al Carrito"
          soldOut={product.stock === 0}
          className="w-full text-sm"
        />
      </CardFooter>
    </Card>
  );
};
