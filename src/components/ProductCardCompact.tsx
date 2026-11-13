import { Product } from "@/contexts/CartContext";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Package, AlertTriangle } from "lucide-react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getSaleTimeRemaining } from "@/utils/saleEndDate";
import { SmartImage } from "@/components/SmartImage";

interface ProductCardCompactProps {
  product: Product;
}

// Generate short attractive tagline based on product category and name
const getShortTagline = (product: Product): string => {
  const taglines: Record<string, string[]> = {
    "Herramientas Eléctricas": [
      "Potencia profesional",
      "Rendimiento superior",
      "Máxima eficiencia",
      "Calidad garantizada",
    ],
    "Herramientas Manuales": [
      "Precisión y durabilidad",
      "Herramienta esencial",
      "Calidad artesanal",
      "Diseño ergonómico",
    ],
    "Sujeción": [
      "Agarre seguro",
      "Fijación confiable",
      "Resistencia máxima",
      "Solución profesional",
    ],
    "Medición": [
      "Precisión exacta",
      "Medidas confiables",
      "Calidad profesional",
      "Resultados precisos",
    ],
    "Seguridad": [
      "Protección total",
      "Seguridad garantizada",
      "Máxima protección",
      "Cumple normativas",
    ],
  };

  const categoryTaglines = taglines[product.category] || ["Calidad premium"];
  const index = product.id % categoryTaglines.length;
  return categoryTaglines[index];
};

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = ({ timeLeft }: { timeLeft: TimeLeft }) => {
  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-background rounded-md px-1.5 py-0.5 min-w-[26px] border border-destructive/15 text-center">
        <span className="text-xs font-bold text-foreground tabular-nums">
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="text-[9px] text-muted-foreground mt-0.5 uppercase tracking-wide">
        {label}
      </span>
    </div>
  );

  return (
    <div className="rounded-lg bg-destructive/[0.06] border border-destructive/15 px-2.5 py-2">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Flame className="h-3.5 w-3.5 text-destructive" />
        <span className="text-[10px] sm:text-[11px] font-bold text-destructive uppercase tracking-wider">
          Oferta termina en
        </span>
      </div>
      <div className="flex items-start justify-center gap-1">
        <TimeBlock value={timeLeft.days} label="días" />
        <span className="text-destructive/60 font-bold text-xs pt-0.5">:</span>
        <TimeBlock value={timeLeft.hours} label="hrs" />
        <span className="text-destructive/60 font-bold text-xs pt-0.5">:</span>
        <TimeBlock value={timeLeft.minutes} label="min" />
        <span className="text-destructive/60 font-bold text-xs pt-0.5">:</span>
        <TimeBlock value={timeLeft.seconds} label="seg" />
      </div>
    </div>
  );
};

export const ProductCardCompact = ({ product }: ProductCardCompactProps) => {
  const { addToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Use deterministic sale end time based on product ID
  useEffect(() => {
    if (!product.isOnSale) return;

    const calculateTimeLeft = (): TimeLeft => {
      const remaining = getSaleTimeRemaining(product.id);
      return {
        days: remaining.days,
        hours: remaining.hours,
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

  return (
    <Card className="group h-full flex flex-col relative overflow-hidden hover:shadow-soft-hover hover:-translate-y-1 hover:border-border">
      {/* Sale badge on corner */}
      {product.isOnSale && product.originalPrice && (
        <div className="absolute top-5 right-5 z-10 pointer-events-none">
          <Badge className="bg-destructive text-destructive-foreground font-bold text-xs px-2.5 py-1 hover:bg-destructive">
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </Badge>
        </div>
      )}

      <CardHeader className="p-3 pb-0 space-y-0">
        <Link to={`/producto/${product.id}`} className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <div className="aspect-square flex items-center justify-center bg-muted/50 dark:bg-white rounded-xl overflow-hidden">
            {product.image.startsWith('/') || product.image.startsWith('http') ? (
              <SmartImage
                src={product.image}
                alt={product.name}
                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 30vw, 300px"
                className="w-full h-full object-contain p-3 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-105"
              />
            ) : (
              <span className="text-5xl">{product.image}</span>
            )}
          </div>
        </Link>
      </CardHeader>
      <CardContent className="px-4 pt-4 pb-3 flex-1 flex flex-col">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
          {product.category}
        </span>
        <Link to={`/producto/${product.id}`} className="focus-visible:outline-none focus-visible:underline">
          <h3 className="font-semibold text-[15px] leading-snug min-h-[2.6em] group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Short attractive tagline instead of long description */}
        <p className="text-xs text-muted-foreground mt-1 mb-3">
          {getShortTagline(product)}
        </p>

        <div className="space-y-2.5 mt-auto">
          {product.isOnSale && (
            <CountdownTimer timeLeft={timeLeft} />
          )}

          {/* Price section */}
          <div>
            {product.isOnSale && product.originalPrice && (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-0.5">
                <span className="text-xs text-muted-foreground line-through tabular-nums">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-[11px] font-semibold rounded-full px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Ahorras {formatPrice(product.originalPrice - product.price)}
                </span>
              </div>
            )}
            <span className="font-display text-xl font-extrabold tracking-tight text-foreground tabular-nums block">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Stock indicator */}
          <div className="flex items-center gap-1.5">
            {product.stock === 0 ? (
              <div className="flex items-center gap-1 text-destructive">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Agotado</span>
              </div>
            ) : product.stock <= 5 ? (
              <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                <Package className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">¡Quedan {product.stock} unidades!</span>
              </div>
            ) : product.stock <= 15 ? (
              <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Package className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Stock limitado</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <Package className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">En stock</span>
              </div>
            )}
          </div>

          {/* Addi payment option - Only show for products over 50,000 CLP */}
          {product.price >= 50000 && (
            <div className="bg-[#00D54B]/[0.07] rounded-lg px-2 py-1.5 flex items-center gap-2">
              <div className="bg-white rounded px-1.5 py-0.5 shadow-sm">
                <span className="text-[#00D54B] font-bold text-xs tracking-tight">addi</span>
              </div>
              <span className="text-[11px] sm:text-xs text-muted-foreground">
                Paga en <strong className="text-foreground">cuotas sin tarjeta</strong>
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-1">
        <AddToCartButton
          onAdd={() => addToCart(product)}
          label="Agregar al carrito"
          soldOut={product.stock === 0}
          className="w-full text-sm font-semibold"
        />
      </CardFooter>
    </Card>
  );
};
