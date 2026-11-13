import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Truck, CreditCard, Clock, Star, Zap, Wrench, Hammer, Ruler, HardHat, Link2, type LucideIcon } from "lucide-react";
import { BestSellers } from "@/components/BestSellers";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { products, categories } from "@/data/products";
import { useMemo } from "react";
import { getWebpSrc } from "@/lib/imageSrc";

// Función para mezclar array (Fisher-Yates shuffle)
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const categoryIcons: Record<string, LucideIcon> = {
  "Herramientas Manuales": Hammer,
  "Herramientas Eléctricas": Zap,
  "Sujeción": Link2,
  "Medición": Ruler,
  "Seguridad": HardHat,
};

const Home = () => {
  // Categorías con su número real de productos y una foto representativa
  const categoryCards = useMemo(
    () =>
      categories.map((name) => {
        const items = products.filter((p) => p.category === name);
        const cover = items.find((p) => p.image && (p.image.startsWith("/") || p.image.startsWith("http")));
        return { name, count: items.length, cover: cover?.image };
      }),
    [],
  );

  // Seleccionar 12 productos aleatorios para mostrar en el hero (rotación en cada carga)
  const heroProducts = useMemo(() => {
    const productsWithImages = products.filter(p => p.image);
    return shuffleArray(productsWithImages).slice(0, 12);
  }, []);

  // Posiciones para formar silueta de taladro/herramienta
  const thumbnailPositions = [
    // Cuerpo principal (diagonal)
    { row: 1, col: 1, delay: 0 },
    { row: 1, col: 2, delay: 100 },
    { row: 2, col: 2, delay: 200 },
    { row: 2, col: 3, delay: 300 },
    { row: 3, col: 3, delay: 400 },
    { row: 3, col: 4, delay: 500 },
    // Extensión lateral (broca/mango)
    { row: 1, col: 3, delay: 150 },
    { row: 2, col: 1, delay: 250 },
    { row: 4, col: 4, delay: 550 },
    // Detalles adicionales
    { row: 4, col: 3, delay: 450 },
    { row: 3, col: 2, delay: 350 },
    { row: 4, col: 2, delay: 600 },
  ];

  const features = [
    { icon: Truck, title: "Envío Rápido", text: "Despacho en 24-48 horas" },
    { icon: Shield, title: "Garantía Oficial", text: "Productos certificados" },
    { icon: CreditCard, title: "Pago Seguro", text: "Múltiples métodos de pago" },
    { icon: Wrench, title: "Asesoría Experta", text: "Te ayudamos a elegir" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-ink pt-10 pb-20 md:pt-16 md:pb-28">
        {/* Soft brand glow */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 h-[24rem] w-[24rem] rounded-full bg-secondary/10 blur-3xl" />

        {/* Geometric pattern using primary color */}
        <div className="absolute inset-0 opacity-[0.05]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(30 100% 50%) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Urgency Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 mb-6 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 duration-700">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 motion-safe:animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs sm:text-sm font-semibold text-primary">¡Ofertas por tiempo limitado!</span>
              </div>

              <h1 className="font-display text-[2.15rem] leading-[1.08] sm:text-5xl lg:text-6xl font-extrabold mb-5 text-primary-foreground motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 duration-1000">
                Compra <span className="text-primary">herramientas profesionales</span> con garantía
              </h1>

              <p className="text-base sm:text-lg md:text-xl leading-relaxed mb-8 text-primary-foreground/70 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-5 duration-1000 delay-150 max-w-xl mx-auto lg:mx-0">
                Taladros, pulidoras, pistolas de pintura y más. Envío rápido a toda Colombia.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-6 duration-1000 delay-300">
                <Button size="lg" className="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30" asChild>
                  <Link to="/tienda">
                    Ver productos
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border border-primary-foreground/20 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/30 hover:text-primary-foreground hover:shadow-none" asChild>
                  <Link to="/ofertas">
                    <Zap className="h-5 w-5 text-secondary" />
                    Ofertas activas
                  </Link>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2 text-sm text-primary-foreground/75 motion-safe:animate-in motion-safe:fade-in duration-1000 delay-300">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  <span className="font-medium">Envío 24-48h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="font-medium">Garantía oficial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-secondary" />
                  <span className="font-medium">Paga con Addi</span>
                </div>
              </div>

              {/* Social Proof */}
              <div className="mt-6 pt-6 border-t border-primary-foreground/10 flex items-center justify-center lg:justify-start gap-3 motion-safe:animate-in motion-safe:fade-in duration-1000 delay-500">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary ring-2 ring-ink flex items-center justify-center">
                      <Star className="h-3 w-3 text-primary-foreground fill-primary-foreground" />
                    </div>
                  ))}
                </div>
                <span className="text-sm text-primary-foreground/70">+500 clientes satisfechos</span>
              </div>
            </div>

            {/* Right Content - Product Thumbnails Composition */}
            <div className="relative motion-safe:animate-in motion-safe:fade-in duration-1000 delay-200">
              <div className="relative w-full max-w-[20rem] sm:max-w-md mx-auto aspect-square">
                {/* Glow effect behind composition */}
                <div className="absolute inset-6 bg-gradient-to-br from-primary/25 via-secondary/10 to-transparent rounded-full blur-3xl" />

                {/* Grid of thumbnails */}
                <div className="relative grid grid-cols-4 grid-rows-4 gap-2 sm:gap-2.5 p-2">
                  {thumbnailPositions.map((pos, index) => {
                    const product = heroProducts[index];
                    if (!product) return null;

                    return (
                      <Link
                        key={product.id}
                        to={`/producto/${product.id}`}
                        aria-label={product.name}
                        className="group aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-white ring-1 ring-white/10 shadow-lg shadow-black/30 transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 fill-mode-both"
                        style={{
                          gridRow: pos.row,
                          gridColumn: pos.col,
                          animationDelay: `${pos.delay}ms`,
                          animationDuration: '500ms',
                        }}
                      >
                        <img
                          src={getWebpSrc(product.image, 400)}
                          srcSet={`${getWebpSrc(product.image, 400)} 400w, ${getWebpSrc(product.image, 800)} 800w`}
                          sizes="(max-width: 768px) 25vw, 120px"
                          alt={product.name}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-110"
                          loading={index < 4 ? "eager" : "lazy"}
                          decoding={index < 4 ? "sync" : "async"}
                          {...{ fetchpriority: index === 0 ? "high" : index < 4 ? "auto" : "low" }}
                        />
                      </Link>
                    );
                  })}
                </div>

                {/* Floating badge */}
                <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-2 bg-secondary text-secondary-foreground rounded-full px-4 py-2 shadow-xl shadow-black/30 ring-4 ring-ink z-20">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span className="text-xs font-bold whitespace-nowrap">Hasta 30% OFF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 -mt-10 md:-mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 rounded-2xl border border-border/70 bg-card shadow-xl shadow-black/[0.06] overflow-hidden">
            {features.map(({ icon: Icon, title, text }, i) => (
              <div
                key={title}
                className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-6 ${
                  i % 2 === 1 ? "border-l border-border/60" : ""
                } ${i >= 2 ? "border-t lg:border-t-0 border-border/60" : ""} ${i === 2 ? "lg:border-l" : ""}`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-sm sm:text-base leading-tight">{title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="pt-16 md:pt-24" aria-labelledby="home-categories">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between gap-6 mb-6 md:mb-8">
            <h2 id="home-categories" className="font-display text-[1.75rem] leading-tight sm:text-3xl md:text-4xl font-extrabold">
              Categorías
            </h2>
            <Link to="/tienda" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:text-primary">
              Ver Todos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {categoryCards.map(({ name, count, cover }, i) => {
              const Icon = categoryIcons[name] ?? Wrench;
              const wide = i === categoryCards.length - 1 && categoryCards.length % 2 === 1;
              return (
                <Link
                  key={name}
                  to={`/tienda?category=${encodeURIComponent(name)}`}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-soft-hover active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    wide ? "col-span-2 sm:col-span-1" : ""
                  }`}
                >
                  <div className={`relative overflow-hidden bg-muted/50 dark:bg-white ${wide ? "aspect-[8/3] sm:aspect-[4/3]" : "aspect-[4/3]"}`}>
                    {cover && (
                      <img
                        src={getWebpSrc(cover, 400)}
                        alt=""
                        width={400}
                        height={300}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-contain p-3 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                      />
                    )}
                    <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-background/90 text-primary shadow-sm ring-1 ring-border/60 backdrop-blur-sm transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 p-3 sm:p-4">
                    <div className="min-w-0">
                      <h3 className="font-display text-sm sm:text-base font-bold leading-tight">{name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">
                        {count} {count === 1 ? "producto" : "productos"}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <BestSellers />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-12 sm:px-12 md:py-16 text-center">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />
            <div className="relative">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                <Wrench className="h-6 w-6" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary-foreground mb-4">
                ¿Necesitas asesoría para tu proyecto?
              </h2>
              <p className="text-base sm:text-lg text-primary-foreground/70 mb-8 max-w-2xl mx-auto leading-relaxed">
                Nuestro equipo de expertos está listo para ayudarte a encontrar las herramientas perfectas
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/contacto">
                  Contáctanos Ahora
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
