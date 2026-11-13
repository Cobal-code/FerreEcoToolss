import { useState, useRef, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Truck, 
  Shield, 
  Package,
  Tag,
  Boxes,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Users
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ImageZoom } from "@/components/ImageZoom";
import { ImageLightbox } from "@/components/ImageLightbox";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductDescriptionRenderer } from "@/components/ProductDescriptionRenderer";

import { CountdownTimer } from "@/components/CountdownTimer";
import { ProductRatingSummary } from "@/components/reviews/ProductRatingSummary";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { useProductReviews } from "@/hooks/useProductReviews";
import { getSaleEndDate } from "@/utils/saleEndDate";
import { getWebpSrc } from "@/lib/imageSrc";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === Number(id));
  const reviewsSectionRef = useRef<HTMLDivElement>(null);
  const { averageRating, totalReviews } = useProductReviews(product?.id || 0);
  
  const allImages = product?.images && product.images.length > 0 
    ? product.images 
    : product?.image 
      ? [product.image] 
      : [];
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  // Semilla estable por producto: el orden "aleatorio" no cambia en cada re-render
  const shuffleSeed = useMemo(() => Math.random(), [id]);

  // Al pasar de un producto a otro, vuelve a la primera foto
  useEffect(() => {
    setSelectedImage(0);
    setLightboxOpen(false);
  }, [id]);
  
  const scrollToReviews = () => {
    reviewsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Producto no encontrado</h1>
          <Button asChild>
            <Link to="/tienda">Volver a la tienda</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get related products - include from other categories if needed
  let relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id);
  
  if (relatedProducts.length < 4) {
    const otherProducts = products
      .filter((p) => p.category !== product.category && p.id !== product.id)
      .slice(0, 4 - relatedProducts.length);
    relatedProducts = [...relatedProducts, ...otherProducts];
  }
  
  relatedProducts = relatedProducts.slice(0, 4);

  // Get "Customers also bought" products - complementary products from different categories
  const alsoBoightProducts = products
    .filter((p) => p.id !== product.id && !relatedProducts.find(r => r.id === p.id))
    .map((p) => ({ p, k: Math.sin(p.id * 12.9898 + shuffleSeed * 78.233) }))
    .sort((a, b) => a.k - b.k)
    .map(({ p }) => p)
    .slice(0, 4);

  // Navigation functions for image gallery
  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/carrito");
  };

  const isImageUrl = (img: string) => img.startsWith('/') || img.startsWith('http');
  const currentImage = allImages[selectedImage] || allImages[0] || product.image;

  // Get deterministic sale end date based on product ID
  const saleEndDate = getSaleEndDate(product.id);

  return (
    <div className="min-h-screen py-6 md:py-10">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Button variant="ghost" asChild className="mb-4 md:mb-6 -ml-3 text-muted-foreground hover:text-foreground hover:bg-muted">
          <Link to="/tienda" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Volver a la tienda</span>
          </Link>
        </Button>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 mb-16 md:mb-20">
          {/* Image Gallery */}
          <div className="space-y-4 lg:sticky lg:top-40 lg:self-start">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-border/70 bg-white shadow-soft flex items-center justify-center">
              {isImageUrl(currentImage) ? (
                <ImageZoom 
                  onOpen={() => setLightboxOpen(true)}
                  src={currentImage} 
                  alt={product.name}
                  className="w-full h-full p-4"
                />
              ) : (
                <span className="text-[10rem] leading-none">{currentImage}</span>
              )}
              
              {product.isOnSale && (
                <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 z-10 hover:bg-destructive">
                  ¡OFERTA!
                </Badge>
              )}

              {/* Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Imagen anterior"
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-border/80 bg-background/90 text-foreground backdrop-blur-sm shadow-md hover:bg-background hover:text-foreground hover:border-border"
                    onClick={handlePrevImage}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Imagen siguiente"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-border/80 bg-background/90 text-foreground backdrop-blur-sm shadow-md hover:bg-background hover:text-foreground hover:border-border"
                    onClick={handleNextImage}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
            
            <ImageLightbox
              images={allImages}
              index={Math.min(selectedImage, Math.max(allImages.length - 1, 0))}
              onIndexChange={setSelectedImage}
              open={lightboxOpen}
              onOpenChange={setLightboxOpen}
              alt={product.name}
            />

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2.5 justify-center flex-wrap">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    aria-label={`Ver imagen ${index + 1}`}
                    aria-current={selectedImage === index ? "true" : undefined}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-colors duration-200 flex items-center justify-center bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                      selectedImage === index 
                        ? 'border-primary' 
                        : 'border-border/70 hover:border-primary/50'
                    }`}
                  >
                    {isImageUrl(img) ? (
                      <img
                        src={getWebpSrc(img, 400)}
                        alt={`${product.name} - imagen ${index + 1}`}
                        width={80}
                        height={80}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <span className="text-3xl">{img}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-5 md:space-y-6">
            {/* Category Badge */}
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" />
              <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider border-border bg-muted/50 text-muted-foreground hover:bg-muted/50">
                {product.category}
              </Badge>
            </div>
            
            {/* Title */}
            <h1 className="font-display text-[1.75rem] sm:text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
              {product.name}
            </h1>

            {/* Rating Summary */}
            <ProductRatingSummary
              averageRating={averageRating}
              totalReviews={totalReviews}
              onClick={scrollToReviews}
            />

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* Price Section */}
            <div className="rounded-2xl border border-border/70 bg-muted/40 p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-3">
                <Tag className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Precio</span>
              </div>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground tabular-nums">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through tabular-nums">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.originalPrice && (
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0 hover:bg-green-100">
                  Ahorras {formatPrice(product.originalPrice - product.price)}
                </Badge>
              )}
              
              {/* Countdown Timer for Sale Products */}
              {product.isOnSale && (
                <div className="pt-2">
                  <CountdownTimer endDate={saleEndDate} />
                </div>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-3 px-4 py-3 bg-background border border-border/70 rounded-xl">
              <Boxes className="h-5 w-5 text-muted-foreground" />
              <div>
                <span className="text-sm text-muted-foreground">Stock disponible:</span>
                <span className={`ml-2 font-bold ${product.stock > 10 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                  {product.stock} unidades
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col min-[420px]:flex-row gap-3 pt-1">
              <Button
                size="lg"
                className="flex-1 min-h-[3.25rem] text-base font-bold shadow-lg shadow-primary/25"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Comprar Ahora
              </Button>
              <AddToCartButton
                size="lg"
                variant="outline"
                className="flex-1 min-h-[3.25rem] text-base font-semibold"
                onAdd={handleAddToCart}
                label="Agregar"
                soldOut={product.stock === 0}
                soldOutLabel="Agregar"
              />
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2">
              <Card className="h-full shadow-none bg-muted/30">
                <CardContent className="p-3 sm:p-4 text-center">
                  <Truck className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide">Envío rápido</p>
                </CardContent>
              </Card>
              <Link to="/devoluciones" className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <Card className="h-full shadow-none bg-muted/30 hover:bg-background hover:border-primary/30 hover:shadow-soft cursor-pointer">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide">Garantía</p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/devoluciones" className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <Card className="h-full shadow-none bg-muted/30 hover:bg-background hover:border-primary/30 hover:shadow-soft cursor-pointer">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <Package className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide">Devoluciones</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-16 md:mb-20">
          <h2 className="font-display text-2xl font-extrabold mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10"><Wrench className="h-5 w-5 text-primary" /></span>
            Descripción del Producto
          </h2>
          <div className="bg-card rounded-2xl p-5 sm:p-8 border border-border/70 shadow-soft">
            <ProductDescriptionRenderer description={product.description} />
          </div>

        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-16">
            <h2 className="font-display text-2xl font-extrabold mb-6 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10"><Tag className="h-5 w-5 text-primary" /></span>
              Productos Relacionados
            </h2>
            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}

        {/* Customers Also Bought */}
        {alsoBoightProducts.length > 0 && (
          <div className="mb-16">
            <h2 className="font-display text-2xl font-extrabold mb-6 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10"><Users className="h-5 w-5 text-primary" /></span>
              Clientes También Compraron
            </h2>
            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {alsoBoightProducts.map((alsoBoughtProduct) => (
                <ProductCard key={alsoBoughtProduct.id} product={alsoBoughtProduct} />
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <ReviewsSection ref={reviewsSectionRef} productId={product.id} />
      </div>
    </div>
  );
};

export default ProductDetail;
