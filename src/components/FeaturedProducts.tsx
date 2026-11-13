import { ProductCardCompact } from "@/components/ProductCardCompact";
import { products } from "@/data/products";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

export const FeaturedProducts = () => {
  const featuredProducts = products.slice(0, 8);

  return (
    <section className="py-14 md:py-20 bg-muted/50 border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between gap-6 mb-8 md:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
            </div>
            <h2 className="font-display text-[1.75rem] leading-tight sm:text-3xl md:text-4xl font-extrabold mb-2">
              Productos Destacados
            </h2>
            <p className="text-muted-foreground">
              Las mejores opciones para tus proyectos
            </p>
          </div>
          <Button variant="outline" asChild className="hidden md:flex border border-border bg-background text-foreground hover:bg-muted hover:text-foreground hover:border-border hover:shadow-none">
            <Link to="/tienda">
              Ver Todos
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
              {featuredProducts.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="pl-4 basis-[82%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <ProductCardCompact product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:inline-flex -left-11 h-9 w-9 border-border/80 bg-background text-foreground shadow-sm hover:bg-muted hover:text-foreground disabled:opacity-30" />
            <CarouselNext className="hidden sm:inline-flex -right-11 h-9 w-9 border-border/80 bg-background text-foreground shadow-sm hover:bg-muted hover:text-foreground disabled:opacity-30" />
          </Carousel>
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button asChild>
            <Link to="/tienda">
              Ver Todos los Productos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
