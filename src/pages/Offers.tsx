import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

const Offers = () => {
  // Filtramos solo los productos en oferta
  const offerProducts = products.filter(product => product.isOnSale);

  return (
    <div className="min-h-screen py-10 md:py-14">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Tag className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">Ofertas Especiales</h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Aprovecha nuestras mejores promociones en herramientas y equipamiento
          </p>
          <Badge variant="secondary" className="mt-6 text-sm sm:text-base px-5 py-1.5">
            Hasta 30% de descuento
          </Badge>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {offerProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Offers;
