import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { products, categories } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, TrendingUp } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { normalizeText } from "@/utils/normalizeText";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [sortBy, setSortBy] = useState("name");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [showBestsellersOnly, setShowBestsellersOnly] = useState(
    searchParams.get("filter") === "bestsellers"
  );

  // Get bestsellers sorted by lowest stock (simulates high demand) - returns only top 8
  const getBestSellers = () => {
    return [...products]
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 8); // Only top 8 best sellers
  };

  useEffect(() => {
    // Check for bestsellers filter from URL
    const filterParam = searchParams.get("filter");
    if (filterParam === "bestsellers") {
      setShowBestsellersOnly(true);
    }
  }, []);

  useEffect(() => {
    let result = showBestsellersOnly ? getBestSellers() : [...products];

    // Filter by search query (accent-insensitive)
    if (searchQuery) {
      const normalizedQuery = normalizeText(searchQuery);
      result = result.filter(
        (product) =>
          normalizeText(product.name).includes(normalizedQuery) ||
          normalizeText(product.description).includes(normalizedQuery)
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter((product) => product.category === selectedCategory);
    }

    // Sort (only if not showing bestsellers, as they're already sorted by sales)
    if (!showBestsellersOnly) {
      result.sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "name":
          default:
            return a.name.localeCompare(b.name);
        }
      });
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, sortBy, showBestsellersOnly]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("name");
    setShowBestsellersOnly(false);
    setSearchParams({});
  };

  const toggleBestsellers = () => {
    if (showBestsellersOnly) {
      searchParams.delete("filter");
      setShowBestsellersOnly(false);
    } else {
      searchParams.set("filter", "bestsellers");
      setShowBestsellersOnly(true);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-extrabold mb-2">
            {showBestsellersOnly ? "Productos Más Vendidos" : "Nuestra Tienda"}
          </h1>
          <p className="text-muted-foreground">
            {showBestsellersOnly 
              ? "Los favoritos de nuestros clientes, ordenados por popularidad"
              : "Explora nuestro catálogo completo de productos"
            }
          </p>
        </div>

        {/* Filters */}
        <div className="bg-muted/40 rounded-2xl border border-border/70 p-4 sm:p-5 mb-6 md:mb-8">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Filtros y Búsqueda</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nombre (A-Z)</SelectItem>
                <SelectItem value="price-asc">Precio (Menor a Mayor)</SelectItem>
                <SelectItem value="price-desc">Precio (Mayor a Menor)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bestsellers Toggle & Active Filters */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/70">
            <Button
              variant={showBestsellersOnly ? "default" : "outline"}
              size="sm"
              onClick={toggleBestsellers}
              className={`gap-1.5 rounded-full ${showBestsellersOnly ? "" : "border border-border bg-background text-foreground hover:bg-muted hover:text-foreground hover:border-border hover:shadow-none"}`}
            >
              <TrendingUp className="h-4 w-4" />
              Más Vendidos
            </Button>
            
            {(searchQuery || selectedCategory !== "all" || showBestsellersOnly) && (
              <>
                <span className="text-sm text-muted-foreground ml-2">Filtros:</span>
                {showBestsellersOnly && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Más Vendidos
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary">
                    Búsqueda: {searchQuery}
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge variant="secondary">
                    Categoría: {selectedCategory}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="ml-auto"
                >
                  Limpiar filtros
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredProducts.length} de {products.length} productos
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product, index) => (
              <div key={product.id} className="relative h-full">
                {showBestsellersOnly && (
                  <div className="absolute top-5 left-5 z-10 bg-foreground/90 backdrop-blur-sm text-background text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 pointer-events-none">
                    <TrendingUp className="h-3 w-3" />
                    #{index + 1} Vendido
                  </div>
                )}
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-4">
              No se encontraron productos
            </p>
            <Button onClick={clearFilters} variant="outline">
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
