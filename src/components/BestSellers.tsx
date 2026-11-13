import { ProductCardCompact } from "@/components/ProductCardCompact";
import { products } from "@/data/products";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

// Simulate best sellers based on lowest stock (high demand = low stock)
const getBestSellers = () => {
  return [...products]
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 8);
};

export const BestSellers = () => {
  const bestSellers = getBestSellers();

  return (
    <section className="pt-14 pb-14 md:pt-20 md:pb-20">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between gap-6 mb-8 md:mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-secondary text-secondary" />
                ))}
              </div>
            </div>
            <h2 className="font-display text-[1.75rem] leading-tight sm:text-3xl md:text-4xl font-extrabold mb-2">
              Productos Más Vendidos
            </h2>
            <p className="text-muted-foreground">
              Los favoritos de nuestros clientes
            </p>
          </div>
          <Button variant="outline" asChild className="hidden md:flex border border-border bg-background text-foreground hover:bg-muted hover:text-foreground hover:border-border hover:shadow-none">
            <Link to="/tienda?filter=bestsellers">
              Ver Todos los Más Vendidos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="px-0 sm:px-12">
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 py-2">
              {bestSellers.map((product, index) => (
                <CarouselItem
                  key={product.id}
                  className="pl-4 basis-[82%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <div className="relative h-full">
                    <div className="absolute top-3 left-3 z-10 bg-foreground/90 backdrop-blur-sm text-background text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 pointer-events-none">
                      <TrendingUp className="h-3 w-3" />
                      #{index + 1} Vendido
                    </div>
                    <ProductCardCompact product={product} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:inline-flex -left-11 h-9 w-9 border-border/80 bg-background text-foreground shadow-sm hover:bg-muted hover:text-foreground disabled:opacity-30" />
            <CarouselNext className="hidden sm:inline-flex -right-11 h-9 w-9 border-border/80 bg-background text-foreground shadow-sm hover:bg-muted hover:text-foreground disabled:opacity-30" />
          </Carousel>
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button asChild>
            <Link to="/tienda?filter=bestsellers">
              Ver Todos los Más Vendidos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
