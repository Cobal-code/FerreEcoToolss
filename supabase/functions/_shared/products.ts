// Server-side product catalog for price validation
// This ensures cart prices can't be manipulated by clients
// IMPORTANT: Keep this in sync with src/data/products.ts

export interface ServerProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}

// Product catalog - prices are authoritative from server
export const productCatalog: ServerProduct[] = [
  { id: 1, name: "Pistola Para Pintar 450W Total", price: 145000, category: "Herramientas Eléctricas", stock: 45 },
  { id: 2, name: "Pistola Para Pintar + Mini Compresor Total 550W", price: 180000, category: "Herramientas Eléctricas", stock: 38 },
  { id: 3, name: "Pistola Para Pintar Truper - Vaso Aluminio Reforzado", price: 70000, category: "Herramientas Manuales", stock: 28 },
  { id: 4, name: "Pulidora 4-1/2\" 710W Total + Mango Auxiliar", price: 145000, category: "Herramientas Eléctricas", stock: 32 },
  { id: 5, name: "Pulidora 700W Truper 4-1/2\"", price: 150000, category: "Herramientas Eléctricas", stock: 25 },
  { id: 6, name: "Taladro Inalámbrico Total 12V - 2 Baterías + Maletín", price: 190000, category: "Herramientas Eléctricas", stock: 75 },
  { id: 7, name: "Electrobomba Pretul 1/2HP - 20M altura", price: 130000, category: "Herramientas Eléctricas", stock: 15 },
  { id: 8, name: "Careta Inteligente Total", price: 90000, category: "Herramientas Manuales", stock: 20 },
  { id: 9, name: "Destornillador Set 6 Piezas Total", price: 35000, category: "Herramientas Manuales", stock: 60 },
  { id: 10, name: "Electrobomba Truper 1/2HP - 40M Altura Maxima", price: 165000, category: "Herramientas Eléctricas", stock: 20 },
  { id: 11, name: "Copas x22 herramientas 1/4\" mm, Pretul", price: 55000, category: "Herramientas Manuales", stock: 22 },
  { id: 12, name: "Destornilladores De Golpe Total x6 Pcs", price: 40000, category: "Herramientas Manuales", stock: 12 },
  { id: 13, name: "Juego Sierra copas x11 Pcs - Aluminio Madera", price: 40000, category: "Herramientas Eléctricas", stock: 18 },
  { id: 14, name: "Lijadora De Palma Total 240w", price: 150000, category: "Herramientas Eléctricas", stock: 30 },
  { id: 15, name: "COPAS 3/8\" mm Para Mecánico x21 Pcs, Pretul", price: 90000, category: "Herramientas Manuales", stock: 16 },
  { id: 16, name: "Copas + Kit Herramientas x83 pcs - 1/4\"-3/8\"", price: 100000, category: "Herramientas Manuales", stock: 10 },
  { id: 17, name: "Pistola de Calor 1500W - Truper", price: 140000, category: "Herramientas Eléctricas", stock: 24 },
  { id: 18, name: "RototoMartillo Taladro Bosh - Doble Mandril", price: 280000, category: "Herramientas Eléctricas", stock: 120 },
  { id: 19, name: "Juego De Copas + Rache 1/4-3/8 x40pcs", price: 35000, category: "Herramientas Manuales", stock: 95 },
  { id: 20, name: "Taladro Inalámbrico TOTAL 20V – 2 Baterías + Kit de Accesorios", price: 350000, category: "Herramientas Eléctricas", stock: 85 },
  { id: 21, name: "PULIDORA 2000W 7\" INDUSTRIAL (TOTAL)", price: 385000, category: "Herramientas Eléctricas", stock: 65 },
  { id: 22, name: "Taladro Inalámbrico de Impacto DEWALT Réplica 24V – 2 Baterías + 3 Copas de Impacto", price: 285000, category: "Herramientas Eléctricas", stock: 42 },
  { id: 23, name: "Taladro DEWALT 24V Inalámbrico – Kit Completo con 2 Baterías, Copas y Puntas", price: 185000, category: "Herramientas Eléctricas", stock: 150 },
  { id: 24, name: "Pistola de Fulminantes – Kit Completo con Gafas, Fulminantes", price: 120000, category: "Sujeción", stock: 55 },
  { id: 25, name: "Gafas para Soldadura con Oxiacetileno, Sombra 6, TRUPER", price: 30000, category: "Seguridad", stock: 35 },
  { id: 26, name: "Hombre Solo de Presion 10\" Mordaza Recta Mango Vinil, Truper", price: 43000, category: "Herramientas Manuales", stock: 28 },
  { id: 27, name: "Flexómetro Gripper Contra Impactos 5m Cinta 19mm, Truper", price: 20000, category: "Medición", stock: 18 },
  { id: 28, name: "Sierra Caladora 400W, PRETUL", price: 139000, category: "Herramientas Eléctricas", stock: 14 },
  { id: 29, name: "Pulidora Angular 4-1/2\", 1100W, TRUPER PRO", price: 200000, category: "Herramientas Eléctricas", stock: 11 },
  { id: 30, name: "Careta Inteligente Para Soldar Sombra 9-13, Aguila, PRETUL", price: 72000, category: "Seguridad", stock: 40 },
  { id: 31, name: "Lijadora orbital 1/4 hoja, 240W, TRUPER PRO", price: 150000, category: "Herramientas Eléctricas", stock: 50 },
  { id: 32, name: "Electrobomba Truper 1HP - 60M Altura Maxima, TRUPER", price: 280000, category: "Herramientas Eléctricas", stock: 32 },
  { id: 33, name: "Transportador de Ángulos Digital", price: 42000, category: "Medición", stock: 15 },
  { id: 34, name: "Casco de Seguridad Tipo II", price: 18500, category: "Seguridad", stock: 48 },
  { id: 35, name: "Lentes de Protección Antirayas", price: 5600, category: "Seguridad", stock: 90 },
  { id: 36, name: "Guantes de Cuero Reforzados", price: 8900, category: "Seguridad", stock: 75 },
  { id: 37, name: "Botas de Seguridad Puntera Acero", price: 31500, category: "Seguridad", stock: 35 },
  { id: 38, name: "Mascarilla Respirador N95 x10", price: 12500, category: "Seguridad", stock: 120 },
  { id: 39, name: "Arnés de Seguridad Completo", price: 62300, category: "Seguridad", stock: 15 },
  { id: 40, name: "Protectores Auditivos Orejeras", price: 14500, category: "Seguridad", stock: 42 },
  { id: 41, name: "Chaleco Reflectante Alta Visibilidad", price: 6800, category: "Seguridad", stock: 68 },
];

/**
 * Get a product by ID with server-side validated price
 */
export function getProductById(id: number): ServerProduct | undefined {
  return productCatalog.find(p => p.id === id);
}

/**
 * Validate cart items and return items with server-side prices
 * Returns null if any product is invalid
 */
export function validateCartItems(items: Array<{ id: number; quantity: number }>): Array<{
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
}> | null {
  const validatedItems: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    category: string;
  }> = [];

  for (const item of items) {
    const product = getProductById(item.id);
    if (!product) {
      console.error(`Invalid product ID: ${item.id}`);
      return null;
    }

    // Cap quantity at available stock
    const validQuantity = Math.min(Math.max(1, item.quantity), product.stock, 100);

    validatedItems.push({
      id: product.id,
      name: product.name,
      price: product.price, // Always use server-side price
      quantity: validQuantity,
      category: product.category,
    });
  }

  return validatedItems;
}

/**
 * Calculate total from validated items
 */
export function calculateTotal(items: Array<{ price: number; quantity: number }>): number {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}
