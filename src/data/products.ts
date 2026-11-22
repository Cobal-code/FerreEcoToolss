import { Product } from "@/contexts/CartContext";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GUÍA PARA AGREGAR PRODUCTOS DESDE GITHUB
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ESTRUCTURA DE IMÁGENES:
 * - Coloca las imágenes en: public/images/productos/
 * - Usa nombres descriptivos sin espacios: taladro-bosch-1.jpg
 * - Formatos soportados: .jpg, .png, .webp
 * 
 * RUTAS DE IMÁGENES:
 * - Siempre usa rutas relativas desde public: "/images/productos/nombre.jpg"
 * - NO uses URLs externas (GitHub raw, etc.)
 * 
 * ESTRUCTURA DE PRODUCTO:
 * {
 *   id: number,                    // ID único incremental
 *   name: string,                  // Nombre del producto
 *   price: number,                 // Precio en COP (sin puntos ni comas)
 *   originalPrice?: number,        // Precio original (solo si hay descuento)
 *   isOnSale?: boolean,            // true si está en oferta
 *   category: string,              // Una de las categorías definidas abajo
 *   image: string,                 // Imagen principal: "/images/productos/nombre.jpg"
 *   images?: string[],             // Galería: ["/images/productos/nombre-1.jpg", ...]
 *   description: string,           // Descripción detallada
 *   stock: number                  // Cantidad en inventario
 * }
 * 
 * CATEGORÍAS VÁLIDAS:
 * - "Herramientas Manuales"
 * - "Herramientas Eléctricas"
 * - "Bombas e Hidrolavadoras"
 * - "Sujeción"           (pinzas de presión, remachadoras, fijación)
 * - "Medición"
 * - "Seguridad"          (incluye caretas y gafas para soldar)
 * - "Hogar"              (pequeños electrodomésticos)
 *
 * Al agregar o cambiar productos, actualiza también
 * supabase/functions/_shared/products.ts (validación de precios del pedido).
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const products: Product[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // HERRAMIENTAS ELÉCTRICAS - PINTURA
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 1,
    name: "Pistola Para Pintar 450W Total",
    price: 145000,
    originalPrice: 160000,
    isOnSale: true,
    shortDescription: "Rociadora eléctrica de 450W con boquilla ajustable y recipiente de 800 ml. Ideal para pintar interiores, muebles y superficies de metal o madera con acabados finos.",
    category: "Herramientas Eléctricas",
    image: "/images/productos/pis.jpg",
    images: [
      "/images/productos/pis.jpg",
      "/images/productos/pis2.jpg",
      "/images/productos/pis3.jpg"
    ],
    description: `## Pistola Rociadora TOTAL 450W
Herramienta de **acabado profesional** con diseño industrial ergonómico, pensada para lograr capas parejas y sin goteos en cada pasada.

> Ideal para pintura de interiores, muebles, metal y madera, con acabados finos y detallados.

## Ficha técnica
| Especificación | Detalle |
| Potencia | **450W** |
| Voltaje | 110-120V ~ 50/60Hz |
| Recipiente | 800 ml |
| Boquilla | Ajustable, varios patrones de rociado |
| Diseño | Ergonómico y liviano |

## Características destacadas
* Compatible con pinturas **base agua y solvente**
* Fácil limpieza y mantenimiento
* Producto nuevo en empaque original
* Marca: **TOTAL**

---
Herramienta confiable y práctica, lista para usar. Lleva tus proyectos de pintura al siguiente nivel.`,
    stock: 45
  },
  {
    id: 2,
    name: "Pistola Para Pintar + Mini Compresor Total 550W",
    price: 180000,
    originalPrice: 200000,
    isOnSale: true,
    shortDescription: "Sistema completo de pintura con mini compresor integrado de 550W. Rociado uniforme y controlado para acabados profesionales en madera, metal y paredes.",
    category: "Herramientas Eléctricas",
    image: "/images/productos/pist1.jpg",
    images: [
      "/images/productos/pist1.jpg",
      "/images/productos/pist2.jpg",
      "/images/productos/pist3.jpg",
      "/images/productos/pist4.jpg"
    ],
    description: `## Pistola de Pintura TOTAL HVLP 550W
Sistema **completo con mini compresor integrado** para acabados profesionales en pintura automotriz, carpintería y decoración.

[[Potencia|Motor de **550W** con flujo máximo de 550 ml/min.]]
[[Capacidad|Recipiente de **800 ml** para trabajos continuos.]]
[[Voltaje|110-120V ~ 50/60Hz, listo para uso doméstico.]]
[[Viscosidad|Admite hasta **50 DIN/s** de viscosidad máxima.]]

## Beneficios
- Rociado **uniforme y controlado** de alta eficiencia
- Ideal para madera, metal, plástico y paredes
- Boquilla ajustable con distintos patrones de rociado
- Diseño ergonómico y liviano
- Fácil limpieza y mantenimiento

> Producto nuevo en empaque original. Marca **TOTAL**.`,
    stock: 38
  },
  {
    id: 3,
    name: "Pistola Para Pintar Truper - Vaso Aluminio Reforzado",
    price: 70000,
    shortDescription: "Pistola neumática Truper con vaso de aluminio reforzado de 1 litro. Boquilla de 1.2 mm para rociado preciso y uniforme en carpintería y decoración.",
    category: "Herramientas Manuales",
    image: "/images/productos/pintar-5.jpg",
    images: [
      "/images/productos/pintar-5.jpg",
      "/images/productos/pintar-6.jpg",
      "/images/productos/pintar-2.jpg",
      "/images/productos/pintar-3.jpg",
      "/images/productos/pintar-4.jpg",
      "/images/productos/pintar-1.jpg"
    ],
    description: `La pistola **TRUPER** está diseñada para trabajos de pintura que requieren precisión, resistencia y un acabado uniforme. Su cuerpo y vaso en **aluminio reforzado** garantizan durabilidad y un desempeño confiable tanto en uso profesional como doméstico.

## Especificaciones técnicas
| Parámetro | Valor |
| Presión de trabajo | 35–45 PSI |
| Presión máxima | 70 PSI |
| Capacidad del vaso | 1 litro |
| Consumo máximo de aire | 113 L/min |
| Conexión | 1/4" NPT |
| Boquilla | 1.2 mm |
| Peso | 626 g |

## Características principales
Ofrece una **salida de pintura ajustable y controlada**, con flujo continuo de aire para un rociado uniforme. Su diseño ergonómico y liviano facilita el manejo en jornadas largas, mientras que el vaso de aluminio reforzado aporta resistencia adicional.

Es una herramienta versátil, ideal para proyectos de **carpintería, metal, plásticos y decoración** en interiores.

* Producto nuevo en empaque original
* Marca reconocida: **TRUPER**`,
    stock: 28
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HERRAMIENTAS ELÉCTRICAS - PULIDORAS / ESMERILADORAS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 4,
    name: "Pulidora 4-1/2\" 710W Total + Mango Auxiliar",
    price: 145000,
    shortDescription: "Esmeriladora angular de 710W a 12,000 RPM con mango auxiliar y disco incluido. Perfecta para corte, desbaste y pulido en metal y construcción.",
    category: "Herramientas Eléctricas",
    image: "/images/productos/puli-3.jpg",
    images: [
      "/images/productos/puli-3.jpg",
      "/images/productos/puli-2.jpg",
      "/images/productos/puli-4.jpg",
    ],
    description: `## Pulidora Angular TOTAL 4-1/2" 710W
Esmeriladora angular ideal para **corte, desbaste y pulido** en metal y construcción, con motor de rendimiento estable y confiable.

### Especificaciones técnicas
| Dato | Valor |
| Voltaje | 110-120V ~ 50/60Hz |
| Potencia de entrada | **710W** |
| Velocidad sin carga | 12,000 RPM |
| Diámetro del disco | 4-1/2" |
| Rosca del husillo | 5/8" - 11 UNC |

### Incluye
- 1 mango auxiliar para mayor estabilidad
- 1 disco de corte
- Empaque: caja de color

### Características destacadas
* Diseño compacto y ergonómico
* Apta para **trabajo continuo**
* Uso ferretero, profesional y doméstico
* Garantía: **1 año**
* Marca: **TOTAL**

> Herramienta confiable y práctica para potenciar tu equipo de trabajo.`,
    stock: 32
  },
  {
    id: 5,
    name: "Pulidora 700W Truper 4-1/2\"",
    price: 150000,
    shortDescription: "Pulidora Truper Pro de 700W con kit completo: mango auxiliar, protección y disco incluidos. Compacta y resistente para trabajos exigentes.",
    category: "Herramientas Eléctricas",
    image: "/images/productos/pulitru-1.jpg",
    images: [
      "/images/productos/pulitru-1.jpg",
      "/images/productos/pulitru-2.jpg",
      "/images/productos/pulitru-3.jpg",
      "/images/productos/pulitru-4.jpg"
    ],
    description: `## ¿Por qué elegirla?
[[Motor 700W|Fuerza y **rendimiento constante** en trabajos exigentes.]]
[[Compacta|Construcción **robusta y resistente** para uso diario.]]
[[Ergonomía|Diseño que brinda **control y comodidad** prolongada.]]
[[Disco 4-1/2"|Medida estándar, fácil de reemplazar.]]

## Incluye todo lo que necesitas
- **Mango auxiliar** para mayor estabilidad
- **Protección de disco** para seguridad
- **Disco de pulir** listo para usar

## Especificaciones técnicas
| Especificación | Detalle |
| Potencia | 700W |
| Diámetro del disco | 4-1/2" |
| Construcción | Robusta y compacta |

> Ideal para corte, desbaste y pulido en metal y construcción. Marca reconocida: **TRUPER PRO**.`,
    stock: 25
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HERRAMIENTAS ELÉCTRICAS - TALADROS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 6,
    name: "Taladro Inalámbrico Total 12V - 2 Baterías + Maletín",
    price: 190000,
    shortDescription: "Taladro inalámbrico de 12V con 2 baterías de litio, cargador rápido TYPE-C y maletín rígido. Ideal para perforar y atornillar en madera, metal y plástico.",
    category: "Herramientas Eléctricas",
    image: "/images/productos/talato-1.jpg",
    images: [
      "/images/productos/talato-1.jpg",
      "/images/productos/talato-2.jpg",
      "/images/productos/talato-3.jpg"
    ],
    description: `El taladro inalámbrico **TOTAL TDLI12202** combina potencia y practicidad en un diseño compacto. Con **12V** de fuerza y baterías de litio de larga duración, es la herramienta perfecta para perforar y atornillar en madera, metal y plástico.

## Especificaciones técnicas
- Voltaje: **12V**
- Baterías de litio-ion de **1.5Ah (x2)**
- Cargador rápido con puerto **TYPE-C**

## Lo que incluye el kit
* Dos baterías de litio-ion para mayor autonomía
* Cargador rápido TYPE-C
* Maletín plástico rígido para transporte seguro
* Accesorios prácticos para diferentes tareas

## Características principales
Su diseño **ergonómico y liviano** facilita el trabajo continuo sin fatiga. Es ideal para carpintería, instalaciones y reparaciones, ofreciendo siempre un rendimiento confiable.

> Producto nuevo en su empaque original. Marca reconocida: **TOTAL**.`,
    stock: 75
  },
  {
    id: 7,
    name: "Electrobomba Pretul 1/2HP - 20M altura",
    price: 130000,
    originalPrice: 145000,
    isOnSale: true,
    shortDescription: "Bomba de agua de 1/2 HP con altura máxima de 20 metros. Aumenta la presión en sistemas de riego y distribución con impulsor de latón de alta resistencia.",
    category: "Bombas e Hidrolavadoras",
    image: "/images/productos/pretulelect-11.jpg",
    images: [
      "/images/productos/pretulelect-11.jpg",
      "/images/productos/pretulelect-18.jpg",
      "/images/productos/pretulelect-12.jpg",
      "/images/productos/pretulelect-13.jpg",
      "/images/productos/pretulelect-15.jpg",
      "/images/productos/pretulelect-16.jpg"
    ],
    description: `## Electrobomba PRETUL 1/2HP
Disponible en **Villavicencio, Meta** con entrega directa en la puerta.

| Detalle | Valor |
| Estado | Nuevo |
| Marca | **PRETUL** |
| Modelo | BOAP-1/2P3 |
| Potencia | 0.5 HP |
| Altura máxima | **20 metros** |

## Beneficios principales
[[Óptimo rendimiento|Aumenta la presión en cañerías de **riego y distribución**.]]
[[Mayor potencia|Impulsa el agua con **fuerza centrífuga**, logrando velocidad y altura.]]
[[Excelente succión|Los líquidos alcanzan hasta **20 m de altura**.]]
[[Gran capacidad|Impulsor de **latón de alta presión**, resistente a la abrasión y a altos volúmenes.]]

* Producto nuevo y confiable
* Ideal para riego, distribución y múltiples usos`,
    stock: 15
  },
  {
    id: 8,
    name: "Careta Inteligente Total",
    price: 90000,
    originalPrice: 105000,
    isOnSale: true,
    shortDescription: "Careta de soldadura con filtro auto oscurecedor que se adapta automáticamente al arco. Compatible con soldadura MIG, TIG y MMA para máxima protección.",
    category: "Seguridad",
    image: "/images/productos/careta-total-int-2.jpg",
    images: [
      "/images/productos/careta-total-int-2.jpg",
      "/images/productos/careta-total-int-1.jpg",
      "/images/productos/careta-total-int-3.jpg",
      "/images/productos/careta-total-int-4.jpg"
    ],
    description: `Protección, tecnología y comodidad en un solo producto. Esta careta de soldador **TOTAL** brinda seguridad profesional con un **filtro auto oscurecedor** que se adapta automáticamente a la intensidad del arco, ideal para soldadura **MIG, TIG y MMA**.

## Características del producto
| Característica | Detalle |
| Marca | TOTAL |
| Modelo | **SUPER ZOOM** |
| Filtro | Auto oscurecedor |
| Ventana de visión | 90 x 35 mm |
| Diseño | Ergonómico y ligero |
| Color | Azul con negro |
| Línea | One-Stop Tools Station |

## Ventajas
* Ideal para soldadores **profesionales y aficionados**
* Compatible con múltiples tipos de soldadura
* Protección ocular confiable y ajuste cómodo

> Producto nuevo, en su empaque original y listo para usar. No arriesgues tu seguridad: trabaja con confianza y estilo.`,
    stock: 20
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HERRAMIENTAS MANUALES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 9,
    name: "Destornillador Set 6 Piezas Total",
    price: 35000,
    originalPrice: 40000,
    isOnSale: true,
    shortDescription: "Set profesional de 6 destornilladores planos y Phillips con mangos ergonómicos. Imprescindible para montaje, reparaciones y mantenimiento general.",
    category: "Herramientas Manuales",
    image: "/images/productos/der1.jpg",
    images: [
      "/images/productos/der1.jpg",
      "/images/productos/der2.jpg",
      "/images/productos/der3.jpg"
    ],
    description: `Una herramienta **imprescindible** para profesionales y entusiastas del bricolaje: compacta, resistente y lista para acompañarte en cada proyecto.

## Incluye
- Destornilladores **planos** de diferentes tamaños
- Destornilladores **Phillips** (estrella)
- Cada pieza claramente identificada

## Características
[[Mangos ergonómicos|Agarre cómodo incluso en jornadas largas.]]
[[Cabezas duraderas|Materiales de **alta calidad** que resisten el uso intensivo.]]
[[Diseño versátil|Resistente y práctico para cualquier tarea.]]
[[Modelo|Set **THT250606** de 6 piezas.]]

## Aplicaciones
* Montaje de muebles
* Reparación de electrodomésticos
* Trabajos de mantenimiento general
* Ideal para taller, hogar o negocio

> Producto nuevo en empaque original. Marca reconocida: **TOTAL**.`,
    stock: 60
  },
  {
    id: 10,
    name: "Electrobomba Truper 1/2HP - 40M Altura Maxima",
    price: 165000,
    shortDescription: "Electrobomba Truper de 1/2 HP con altura máxima de 40 m y flujo de 40 L/min. Potencia superior para riego agrícola y tanques elevados.",
    category: "Bombas e Hidrolavadoras",
    image: "/images/productos/electro-truper12111-8.jpg",
    images: [
      "/images/productos/electro-truper12111-8.jpg",
      "/images/productos/electro-truper12111-6.jpg",
      "/images/productos/electro-truper12111-5.jpg",
      "/images/productos/electro-truper12111-4.jpg",
      "/images/productos/electro-truper12111-2.jpg",
      "/images/productos/electro-truper12111-3.jpg",
      "/images/productos/electro-truper12111-1.jpg",
      "/images/productos/electro-truper12111-7.jpg"
    ],
    description: `La electrobomba **TRUPER de 1/2 HP** está diseñada para ofrecer mayor presión y altura en el bombeo de agua, garantizando un rendimiento confiable en sistemas de riego, distribución y aplicaciones domésticas o profesionales.

## Especificaciones técnicas
| Parámetro | Valor |
| Potencia | 0.5 HP |
| Altura máxima | **40 m** |
| Flujo máximo | 40 L/min |
| Profundidad máx. de succión | 8 m |
| Estado | Nuevo |
| Marca | TRUPER |

## Beneficios principales
Gracias a su **fuerza centrífuga**, esta bomba impulsa el agua con potencia suficiente para alcanzar lugares altos (más de 15 m). Su diseño permite integrarse fácilmente en **sistemas hidroneumáticos**, incrementando la presión y asegurando un flujo constante en cañerías y ductos.

El impulsor y sus componentes están fabricados para resistir el **uso continuo**, ofreciendo durabilidad y eficiencia en cada aplicación.

> Producto disponible en Villavicencio, Meta — entrega directa en la puerta.

* Ideal para riego, distribución y múltiples usos
* Marca reconocida por su calidad y resistencia`,
    stock: 20
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HERRAMIENTAS ELÉCTRICAS - OTRAS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 11,
    name: "Copas x22 herramientas 1/4\" mm, Pretul",
    price: 55000,
    originalPrice: 75000,
    isOnSale: true,
    shortDescription: "Juego completo de 22 copas métricas 1/4\" con rache incluido. Piezas ergonómicas y duraderas ideales para trabajos mecánicos y de precisión.",
    category: "Herramientas Manuales",
    image: "/images/productos/copas-pretul-13.jpg",
    images: [
      "/images/productos/copas-pretul-13.jpg",
      "/images/productos/copas-pretul-12.jpg",
      "/images/productos/copas-pretul-16.jpg",
      "/images/productos/copas-pretul-15.jpg",
      "/images/productos/copas-pretul-11.jpg",
      "/images/productos/copas-pretul-14.jpg"
    ],
    description: `## Copas PRETUL — 22 herramientas 1/4" mm
Disponible en **Villavicencio, Meta** y demás ciudades, con entrega directa en la puerta.

### Incluye
- Juego completo de **22 piezas**
- Copas en medidas métricas (mm)
- **Rache de 1/4"**
- Variedad de tamaños y tipos para múltiples usos

### Características
| Característica | Detalle |
| Ergonomía | Mangos y piezas para agarre cómodo |
| Cabezas | Duraderas, de alta calidad |
| Resistencia | Apta para uso intensivo |
| Estado | Nuevo |
| Marca | **PRETUL** |

### Beneficios
* Precisión y fiabilidad en **trabajos mecánicos**
* Ideal para profesionales y aficionados
* Permite trabajar cómodamente durante períodos prolongados
* Rendimiento óptimo en todas las condiciones

> Producto nuevo en empaque original: equipa tu taller con un set completo y confiable.`,
    stock: 22
  },
  {
    id: 12,
    name: "Destornilladores De Golpe Total x6 Pcs",
    price: 40000,
    originalPrice: 50000,
    isOnSale: true,
    shortDescription: "Set de 6 destornilladores GO-THROUGH en acero Cr-V con mango ergonómico antideslizante. Diseño resistente a impactos para uso profesional.",
    category: "Herramientas Manuales",
    image: "/images/productos/DESTORtotal1.jpg",
    images: [
      "/images/productos/DESTORtotal1.jpg",
      "/images/productos/DESTORtotal2.jpg",
      "/images/productos/DESTORtotal3.jpg"
    ],
    description: `Potencia, precisión y durabilidad en tus manos. Este set **TOTAL THGS35061** está diseñado para profesionales exigentes y aficionados al bricolaje que buscan herramientas confiables.

## Características del producto
- Marca: **TOTAL**
- Modelo: THGS35061
- Tipo: Juego de destornilladores **GO-THROUGH** (de impacto)
- Material: **Acero Cr-V** (Cromo Vanadio) para máxima resistencia
- Mango ergonómico antideslizante en color verde
- Incluye soporte plástico para organización

## Contenido del set (6 piezas)
| Punta | Medida |
| Phillips | PH1 x 75 mm |
| Phillips | PH2 x 100 mm |
| Phillips | PH3 x 150 mm |
| Plano | SL4.0 x 75 mm |
| Plano | SL5.5 x 100 mm |
| Plano | SL6.5 x 150 mm |

* Ideal para trabajos mecánicos, eléctricos y carpintería
* El diseño **GO-THROUGH** permite golpear el mango sin dañar la herramienta
* Producto nuevo, sellado y original`,
    stock: 12
  },
  {
    id: 13,
    name: "Juego Sierra copas x11 Pcs - Aluminio Madera",
    price: 40000,
    shortDescription: "Set de 11 sierras copas para cortes limpios en madera y aluminio. Variedad de tamaños para múltiples aplicaciones en taller y obra.",
    category: "Herramientas Eléctricas",
    image: "/images/productos/copa-sierra-uyus-3.jpg",
    images: [
      "/images/productos/copa-sierra-uyus-3.jpg",
      "/images/productos/copa-sierra-uyus-2.jpg",
      "/images/productos/copa-sierra-uyus-1.jpg"
    ],
    description: `## Juego de Sierras Copas UYUSTOOLS
Set de **11 piezas** con entrega directa en la puerta.

### Incluye
- Set completo de **11 piezas**
- Copas diseñadas para cortar **madera y aluminio**
- Variedad de tamaños para diferentes aplicaciones

### Características
* Cuchillas afiladas para **cortes limpios y precisos**
* Diseño resistente y duradero
* Versatilidad para múltiples materiales
* Estado: Nuevo — Marca: **UYUSTOOLS**

### Beneficios
[[Corte eficiente|Rendimiento parejo en **madera y aluminio**.]]
[[Adaptabilidad|Se ajusta a distintos proyectos y espesores.]]
[[Uso mixto|Ideal para **profesionales y aficionados** al bricolaje.]]
[[Listo para usar|Herramienta confiable desde el primer corte.]]

> Producto nuevo en empaque original.`,
    stock: 18
  },
  {
    id: 14,
    name: "Lijadora De Palma Total 240w",
    price: 150000,
    originalPrice: 180000,
    isOnSale: true,
    shortDescription: "Lijadora orbital de 240W a 15,000 rpm con 5 hojas de lija y bolsa recolectora. Acabados perfectos en madera, metal y plástico.",
    category: "Herramientas Eléctricas",
    image: "/images/productos/LIJADORA-total-3.jpg",
    images: [
      "/images/productos/LIJADORA-total-3.jpg",
      "/images/productos/LIJADORA-total-4.jpg",
      "/images/productos/LIJADORA-total-2.jpg",
      "/images/productos/LIJADORA-total-1.jpg",
      "/images/productos/LIJADORA-total-5.jpg"
    ],
    description: `¡Acabados perfectos en menos tiempo! Esta lijadora orbital **TOTAL TF1301826** es ideal para carpintería, pintura, restauración y bricolaje. Su diseño compacto y potente motor te permiten trabajar con **precisión y comodidad**.

## Características del producto
| Especificación | Valor |
| Potencia | **240W** |
| Voltaje | 220-240V ~ 50Hz |
| Velocidad sin carga | 15,000 rpm |
| Tamaño de base | 90 x 187 mm |
| Modelo | TF1301826 |
| Empaque | Original en caja de color |

## Incluye
- **5 hojas de lija**
- **1 bolsa recolectora de polvo**

## Ventajas
* Ideal para lijar **madera, metal, plástico** y superficies pintadas
* Diseño ergonómico para uso prolongado
* Marca reconocida por su calidad y durabilidad

> Producto nuevo, sellado y listo para usar.`,
    stock: 30
  },
  {
    id: 15,
    name: "COPAS 3/8\" mm Para Mecánico x21 Pcs, Pretul",
    price: 90000,
    shortDescription: "Juego profesional de 21 copas 3/8\" mm con estuche plástico rígido. Cada pieza marcada para fácil identificación en trabajos mecánicos.",
    category: "Herramientas Manuales",
    image: "/images/productos/COPAS-21191-6.jpg",
    images: [
      "/images/productos/COPAS-21191-6.jpg",
      "/images/productos/COPAS-21191-2.jpg",
      "/images/productos/COPAS-21191-5.jpg",
      "/images/productos/COPAS-21191-4.jpg",
      "/images/productos/COPAS-21191-1.jpg",
      "/images/productos/COPAS-21191-3.jpg"
    ],
    description: `El juego de copas **PRETUL de 3/8" mm** es la solución perfecta para cualquier trabajo mecánico. Su estuche de plástico inyectado mantiene las piezas organizadas y **cada herramienta viene marcada** para una identificación inmediata.

## Especificaciones
| Dato | Valor |
| Medida | 3/8" mm |
| Total de piezas | **21** |
| Estuche | Plástico rígido e inyectado |
| Estado | Nuevo |
| Marca | PRETUL |

## Por qué conviene
* Comodidad, durabilidad y **precisión** en cada uso
* Piezas siempre organizadas y a la vista
* Entrega directa en la puerta

> Producto nuevo en empaque original: equipa tu taller con un set confiable y organizado.`,
    stock: 16
  },
  {
    id: 16,
    name: "Copas + Kit Herramientas x83 pcs - 1/4\"-3/8\"",
    price: 100000,
    originalPrice: 135000,
    isOnSale: true,
    shortDescription: "Kit completo de 83 piezas con desarmador de doble matraca, copas 1/4\"-3/8\", llaves allen y estuche de tela. Todo lo que necesitas en un solo kit.",
    category: "Herramientas Manuales",
    image: "/images/productos/copas-22984-2.jpg",
    images: [
      "/images/productos/copas-22984-2.jpg",
      "/images/productos/copas-22984-3.jpg",
      "/images/productos/copas-22984-4.jpg",
      "/images/productos/copas-22984-1.jpg",
      "/images/productos/copas-22984-5.jpg",
    ],
    description: `## Kit PRETUL de 83 piezas
Todo lo necesario para mecánica, mantenimiento y bricolaje en un solo estuche. **Entrega directa en la puerta.**

### Incluye
- Desarmador con **doble sistema de matraca**
- Resistencia de **11 lb-ft** de torque
- Mango **Comfort Grip** para mayor comodidad
- Estuche de tela resistente
- Herramientas marcadas para fácil identificación
- **2 organizadores** para llaves allen
- Total: **83 piezas** completas

### Características
[[Versatilidad|Diseño práctico para **múltiples aplicaciones**.]]
[[Durabilidad|Piezas resistentes al **uso intensivo**.]]
[[Organización|Estuche y organizadores para todo en su lugar.]]
[[Público|Mecánicos, técnicos y aficionados al bricolaje.]]

### Beneficios
* Kit **completo y listo** para cualquier tarea
* Herramientas organizadas y fáciles de transportar
* Perfecto para taller, hogar o negocio
* Calidad y respaldo de la marca **PRETUL**

> Estado: nuevo, en empaque original.`,
    stock: 10
  },
  {
    id: 17,
    name: "Pistola de Calor 1500W - Truper",
    price: 140000,
    originalPrice: 165000,
    isOnSale: true,
    shortDescription: "Pistola de calor de 1500W con diseño ergonómico. Ideal para encoger cables, remover pintura, moldear plásticos y múltiples aplicaciones industriales.",
    category: "Herramientas Eléctricas",
    image: "/images/productos/pistola-calor-truper-4.jpg",
    images: [
      "/images/productos/pistola-calor-truper-4.jpg",
      "/images/productos/pistola-calor-truper-3.jpg",
      "/images/productos/pistola-calor-truper-2.jpg",
      "/images/productos/pistola-calor-truper-1.jpg",
    ],
    description: `La herramienta ideal para trabajos de precisión con calor. La pistola **Truper Pro PISCA-A2** ofrece alto rendimiento y versatilidad para encoger cables, remover pintura, moldear plásticos y mucho más.

## Características técnicas
| Especificación | Valor |
| Modelo | PISCA-A2 |
| Potencia | **1500 W** |
| Intensidad | 12.5 A |
| Marca | Truper Pro |
| Color | Naranja con negro |
| Cable | De alimentación incluido |

## Ventajas
* Ideal para uso **profesional y doméstico**
* Diseño ergonómico para mayor comodidad
* Compatible con múltiples aplicaciones industriales y de bricolaje

> Producto nuevo, en caja original con especificaciones claras. Precio competitivo y calidad garantizada.`,
    stock: 24
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SUJECIÓN Y FIJACIÓN
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 18,
    name: "RototoMartillo Taladro Bosh - Doble Mandril",
    price: 280000,
    shortDescription: "Taladro percutor Bosch de 800W con sistema SDS-plus, doble mandril, 3 brocas, 2 cinceles y maletín. Perfora y cincela en concreto, madera y metal.",
    category: "Herramientas Eléctricas",
    image: "/images/productos/bosh-1.jpg",
    images: [
      "/images/productos/bosh-1.jpg",
      "/images/productos/bosh-3.jpg",
      "/images/productos/bosh-4.jpg",
      "/images/productos/bosh-2.jpg",
    ],
    description: `**Potencia alemana** para tus proyectos más exigentes. Este kit incluye el taladro percutor **Bosch GBH 2-26 DFR**, ideal para perforar y cincelar en concreto, mampostería, madera y metal.

## Contenido del kit
- Taladro percutor Bosch **GBH 2-26 DFR (SDS-plus)**
- Maletín rígido réplica Bosch
- Mango auxiliar desmontable
- Varilla de profundidad
- **3 brocas** de diferentes tamaños
- **2 cinceles**
- Mandril de cambio rápido para brocas estándar

## Características destacadas
[[Motor 800W|Potencia sostenida para **trabajo pesado y continuo**.]]
[[SDS-plus|Cambio rápido de accesorios sin herramientas extra.]]
[[3 funciones|**Perforación, percusión y cincelado** en un solo equipo.]]
[[Ergonomía|Empuñadura cómoda para mayor control.]]

* Producto original, en excelente estado y listo para usar
* Herramienta confiable, duradera y de **alto rendimiento**`,
    stock: 120
  },
  {
    id: 19,
    name: "Juego De Copas + Rache 1/4-3/8 x40pcs",
    price: 35000,
    shortDescription: "Kit económico de 40 piezas con copas 1/4\"-3/8\", raches, destornilladores y estuche compacto. Perfecto para reparaciones rápidas en hogar, auto y moto.",
    category: "Herramientas Manuales",
    image: "/images/productos/copas-eco.jpg",
    images: [
      "/images/productos/copas-eco.jpg",
      "/images/productos/copas-eco-1.jpg",
      "/images/productos/copas-eco-2.jpg",
    ],
    description: `## Juego de copas y herramientas — 40 piezas
Pago contra entrega y **envío gratis en Villavicencio, Meta**, con entrega directa en la puerta.

### Contenido detallado
| Grupo | Medidas |
| 14 piezas 1/4" mm | 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 9, 10, 11, 12, 13 mm |
| 14 piezas 1/4" pulgadas | 5/32", 3/16", 7/32", 1/4", 9/32", 5/16", 11/32", 3/8", 13/32", 7/16", 15/32", 1/2", 17/32", 9/16" |
| 3 piezas 1/4" (8PT) | 1/4", 5/16", 3/8" |
| Dados 3/8" | 5/8" y 15 mm |
| Manijas | DR. Ratchet 3/8" y DR. Spinner 1/4" – 6" |
| Extensión | 3/8" – 3" |
| Dado de bujía | DR. Spark – 21 mm |

También incluye **raches y destornilladores**, para un total de 40 herramientas diferentes en caja.

### Características
- Especial para trabajos en el **hogar** y uso doméstico
- Ideal para **auto y moto**
- Herramientas empacadas individualmente
- Estuche compacto: **24 x 12 x 4 cm**
- Estado: Nuevo

### Beneficios
* Kit completo y organizado
* Perfecto para reparaciones rápidas y mantenimiento general
* Herramientas resistentes para usos normales
* **Portátil** y fácil de guardar

> Producto nuevo en empaque original.`,
    stock: 95
  },
  {
    id: 20,
    name: "Taladro Inalámbrico TOTAL 20V – 2 Baterías + Kit de Accesorios",
    price: 350000,
    shortDescription: "Taladro inalámbrico de 20V con mandril metálico 1/2\", 2 baterías de litio, cargador rápido y maletín con accesorios. Máxima potencia y autonomía.",
    category: "Herramientas Eléctricas",
    image: "/images/productos/total-tala-20v-3.jpg",
    images: [
      "/images/productos/total-tala-20v-3.jpg",
      "/images/productos/total-tala-20v-2.jpg",
      "/images/productos/total-tala-20v-4.jpg",
      "/images/productos/total-tala-20v-5.jpg",
      "/images/productos/total-tala-20v-6.jpg",
      "/images/productos/total-tala-20v-1.jpg",
    ],
    description: `El taladro inalámbrico **TOTAL de 20V** está diseñado para ofrecer potencia, autonomía y versatilidad en cada proyecto. Su **mandril metálico de 1/2"** permite trabajar con brocas de mayor tamaño, garantizando un ajuste firme y seguro.

Con **dos baterías de litio-ion** incluidas tendrás energía para jornadas prolongadas, mientras que el cargador rápido reduce el tiempo de espera. El kit de accesorios y el maletín rígido completan un conjunto ideal para carpintería, instalaciones, reparaciones y trabajos en metal, madera o plástico.

## Especificaciones técnicas
| Especificación | Valor |
| Voltaje | **20V** |
| Mandril | 1/2" metálico |
| Baterías | 2 unidades de litio-ion |
| Cargador | Rápido |
| Extras | Kit de accesorios + maletín rígido |

## Beneficios
* Potencia de **20V** para perforar y atornillar con facilidad
* Mandril de 1/2" compatible con brocas grandes
* Dos baterías para **máxima autonomía**
* Diseño ergonómico y compacto para uso prolongado
* Kit completo listo para trabajar en cualquier entorno

> Producto nuevo en empaque original.`,
    stock: 85
  },
  {
    id: 21,
    name: "PULIDORA 2000W 7\" INDUSTRIAL (TOTAL)",
    price: 385000,
    shortDescription: "Pulidora industrial de 2000W con disco de 7\", mango auxiliar y escobilla de carbón extra. Diseñada para cortes y pulidos de alto rendimiento.",
    category: "Herramientas Eléctricas",
    image: "/images/productos/puli-2000w-2.jpg",
    images: [
      "/images/productos/puli-2000w-2.jpg",
      "/images/productos/puli-2000w-1.jpg",
      "/images/productos/puli-2000w-3.jpg",
    ],
    description: `La pulidora **TOTAL de 2000W** es una herramienta potente y confiable, diseñada para trabajos industriales y exigentes. Con su disco de **7"** y mango auxiliar ofrece control, seguridad y precisión en cada uso.

## Especificaciones técnicas
| Dato | Valor |
| Código de producto | UTG12018026 |
| Garantía | **1 año** |
| Voltaje | 110-120V~ / 60Hz |
| Potencia | **2000W** |
| Velocidad sin carga | 8450 /min |
| Diámetro de disco | 7" |
| Eje enroscado | 5/8 - 11UNC |
| Material | Plástico + Metal |
| Peso | 5.4 kg |
| Estilo de mango | Auxiliar |
| Incluye | Escobilla de carbón extra |

## Beneficios
* Potencia de 2000W para **trabajos exigentes**
* Disco de 7" ideal para cortes y pulidos industriales
* Mango auxiliar para mayor control y seguridad
* Construcción resistente en plástico y metal
* Escobilla de carbón extra para **prolongar la vida útil**

> Producto nuevo en empaque original.`,
    stock: 65
  },
  {
    id: 22,
    name: "Taladro Inalámbrico de Impacto DEWALT Réplica 24V – 2 Baterías + 3 Copas de Impacto",
    price: 285000,
    shortDescription: "Taladro de impacto inalámbrico de 24V con 2 baterías de litio y 3 copas de impacto. Alto torque para atornillado en superficies duras y trabajo mecánico.",
    category: "Herramientas Eléctricas",
    image: "/images/productos/impac-dewa-3.jpg",
    images: [
      "/images/productos/impac-dewa-3.jpg",
      "/images/productos/impac-dewa-2.jpg",
      "/images/productos/impac-dewa-1.jpg",
      "/images/productos/impac-dewa-4.jpg",
    ],
    description: `Este taladro de impacto **réplica DEWALT 24V** está diseñado para ofrecer potencia y versatilidad en instalación, reparación y mantenimiento. Su sistema de impacto facilita el **atornillado en superficies duras** y el uso prolongado gracias a sus dos baterías de litio-ion.

El kit incluye **3 copas de impacto**, ideales para trabajos mecánicos de alto torque. Su diseño ergonómico y compacto permite trabajar cómodamente en espacios reducidos.

## Especificaciones
- Voltaje: **24V**
- Tipo: taladro inalámbrico de impacto (réplica DEWALT)
- Baterías: **2 unidades** de litio-ion
- Accesorios: 3 copas de impacto
- Diseño ergonómico y compacto

## Beneficios
[[24V de potencia|Fuerza suficiente para **tareas exigentes**.]]
[[Sistema de impacto|Atornillado firme en **superficies duras**.]]
[[Doble batería|**Máxima autonomía** sin interrupciones.]]
[[3 copas incluidas|Listo para uso **mecánico** inmediato.]]

> Producto nuevo en empaque original. Ideal para hogar, taller y proyectos profesionales.`,
    stock: 42
  },
  {
    id: 23,
    name: "Taladro DEWALT 24V Inalámbrico – Kit Completo con 2 Baterías, Copas y Puntas",
    price: 185000,
    shortDescription: "Kit completo con taladro 24V, 2 baterías, brocas para metal y madera, 6 puntas, 9 copas y extensor flexible. Todo listo para cualquier proyecto.",
    category: "Herramientas Eléctricas",
    image: "/images/productos/tala-dewa-2.jpg",
    images: [
      "/images/productos/tala-dewa-2.jpg",
      "/images/productos/tala-dewa-3.jpg",
      "/images/productos/tala-dewa-1.jpg",
    ],
    description: `El taladro inalámbrico **DEWALT de 24V** combina potencia, autonomía y versatilidad en un solo equipo. Con dos baterías de litio-ion y un kit completo de accesorios tendrás todo lo necesario para trabajos en madera, metal y tareas mecánicas.

## Incluye
| Accesorio | Cantidad |
| Brocas para metal | 3 |
| Brocas para madera | 3 |
| Puntas de atornillado | 6 |
| Copas normales | 9 |
| Extensor de copa flexible | 1 |
| Baterías de litio-ion | **2** |

## Características
- Voltaje: **24V**
- Taladro inalámbrico de impacto
- Diseño ergonómico y compacto
- Ideal para hogar, taller y proyectos mecánicos

## Beneficios
* Potencia de 24V para perforar y atornillar con facilidad
* Kit completo para **madera, metal y mecánica ligera**
* Dos baterías para máxima autonomía
* **Extensor flexible** para llegar a espacios reducidos
* Herramientas organizadas y listas para usar

> Producto nuevo en empaque original.`,
    stock: 150
  },
  {
    id: 24,
    name: "Pistola de Fulminantes – Kit Completo con Gafas, Fulminantes",
    price: 120000,
    shortDescription: "Kit completo con pistola de fulminantes, gafas de seguridad, cepillo de limpieza y gotero de aceite. Práctica y segura para fijación ligera.",
    category: "Sujeción",
    image: "/images/productos/fulmi-2.jpg",
    images: [
      "/images/productos/fulmi-2.jpg",
      "/images/productos/fulmi-1.jpg",
      "/images/productos/fulmi-3.jpg",
    ],
    description: `La pistola de fulminantes es una herramienta **práctica y segura** para trabajos de fijación ligera. Este kit viene equipado con todo lo necesario para un uso cómodo y organizado.

## Incluye
- **Gafas de seguridad** para protección ocular
- **Cepillo de limpieza** para mantener la pistola en óptimas condiciones
- **Gotero de aceite** para lubricación y mayor durabilidad
- Fulminantes listos para usar
- **Caja organizadora** para guardar todo el kit

## Características
* Diseño compacto y resistente
* Fácil de usar en trabajos domésticos y de bricolaje
* Accesorios incluidos para prolongar la vida útil
* Estado: **Nuevo**

## Beneficios
[[Kit completo|Todo organizado en una sola caja.]]
[[Seguridad|**Gafas incluidas** para proteger la vista.]]
[[Mantenimiento|Cepillo y gotero para cuidado sencillo.]]
[[Transporte|Caja práctica para guardar y movilizar.]]`,
    stock: 55
  },
  {
    id: 25,
    name: "Gafas para Soldadura con Oxiacetileno, Sombra 6, TRUPER",
    price: 30000,
    shortDescription: "Gafas Truper con filtro sombra 6 para soldadura oxiacetileno. Protección confiable contra chispas y radiación, ligeras y cómodas para uso prolongado.",
    category: "Seguridad",
    image: "/images/productos/GASO.jpg",
    images: [
      "/images/productos/GASO.jpg",
      "/images/productos/GASO+E1.jpg",
      "/images/productos/GASO+FC1.jpg",
    ],
    description: `Las gafas **TRUPER** están diseñadas para brindar protección ocular confiable en trabajos de soldadura con **oxiacetileno**. Su filtro de **sombra 6** reduce la intensidad de la luz y protege contra chispas y radiación.

## Especificaciones
| Dato | Detalle |
| Marca | **TRUPER** |
| Tipo | Gafas para soldadura oxiacetileno |
| Sombra | **6** |
| Material | Resistente y duradero |
| Diseño | Ergonómico, ajuste cómodo |

## Beneficios
* Protección ocular contra **chispas y radiación**
* Sombra 6 ideal para soldadura oxiacetileno
* Diseño ligero y cómodo para uso prolongado
* Marca TRUPER: garantía de calidad y durabilidad

> Producto nuevo en empaque original: trabaja con seguridad y confianza.`,
    stock: 35
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MEDICIÓN Y MARCADO
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 26,
    name: "Hombre Solo de Presion 10\" Mordaza Recta Mango Vinil, Truper",
    price: 43000,
    shortDescription: "Pinza de presión de 10\" con mordaza recta y mango vinil antideslizante. Sujeción firme en piezas metálicas y de carpintería para trabajos de precisión.",
    category: "Sujeción",
    image: "/images/productos/PPT-10RX.jpg",
    images: [
      "/images/productos/PPT-10RX.jpg",
      "/images/productos/PPT-10RX+E1.jpg",
      "/images/productos/PPT-10RX+FC1.jpg",
      "/images/productos/PPT-10RX+FC2.jpg",
      "/images/productos/PPT-10RX+FC3.jpg",
      "/images/productos/PPT-10RX+FC5.jpg",
    ],
    description: `El **hombre solo de presión TRUPER de 10"** es una herramienta indispensable para sujeción firme y segura. Su **mordaza recta** permite un agarre preciso en piezas planas o de bordes rectos, y el mango recubierto en vinil ofrece comodidad y control.

## Especificaciones
- Marca: **TRUPER**
- Tipo: Hombre solo de presión
- Tamaño: **10"**
- Mordaza: Recta
- Mango: **Vinil antideslizante**
- Material: Acero de alta resistencia

## Beneficios
[[Sujeción firme|Agarre seguro en piezas **metálicas o de carpintería**.]]
[[Mordaza recta|Pensada para trabajos de **precisión**.]]
[[Mango vinil|Mayor comodidad y control en uso prolongado.]]
[[Construcción robusta|Acero de alta resistencia, **duradero**.]]

> Producto nuevo en empaque original. Ideal para taller, mecánica y bricolaje.`,
    stock: 28
  },
  {
    id: 27,
    name: "Flexómetro Gripper Contra Impactos 5m Cinta 19mm, Truper",
    price: 20000,
    originalPrice: 29500,
    isOnSale: true,
    shortDescription: "Flexómetro de 5 m con carcasa contra impactos, cinta impresa por ambos lados y gancho doble. Lectura fácil con números grandes y triple protección.",
    category: "Medición",
    image: "/images/productos/FH-5M.jpg",
    images: [
      "/images/productos/FH-5M.jpg",
      "/images/productos/FH-5M+E1.jpg",
      "/images/productos/FH-5M+FC1.jpg",
      "/images/productos/FH-5M+FC2.jpg",
    ],
    description: `El **flexómetro TRUPER Gripper de 5 metros** es una herramienta de medición confiable para uso industrial y profesional. Su carcasa de **ABS con cubierta de TPR** lo hace altamente resistente a impactos, mientras que la cinta de 19 mm, impresa por ambos lados y recubierta con laca, asegura una lectura clara y duradera.

## Especificaciones técnicas
| Dato | Valor |
| Código de producto | 14578 (Clave FH-5M) |
| Carcasa | ABS + cubierta de TPR resistente a impactos |
| Cinta | 5 m (16 ft) x 19 mm (3/4") x 0.13 mm |
| Impresión | Por ambos lados, recubierta de laca |
| Protección | **Triple capa** en el primer metro |
| Gancho | Doble, mide por ambos lados |
| Extensión sin doblarse | 1.9 – 2 m |
| Escala | cm-mm / ft-in |
| Color de cinta | Amarillo, números grandes |
| Clip | De palanca metálico |
| Norma | Cumple **NOM-046-SCFI** |
| Carcasa compacta | 7.5 cm alto x 3.5 cm ancho |
| Origen | China, bajo especificaciones de Grupo TRUPER |

## Beneficios
* **Durabilidad superior**: carcasa contra impactos y cinta con laca
* Lectura más fácil con números grandes e impresión a doble cara
* Mayor precisión con **triple protección** en el primer metro
* Versatilidad: escala métrica y en pulgadas
* Comodidad: clip metálico y gancho doble

> Producto nuevo en empaque original.`,
    stock: 18
  },
  {
    id: 28,
    name: "Sierra Caladora 400W, PRETUL",
    price: 139000,
    originalPrice: 158500,
    isOnSale: true,
    shortDescription: "Sierra caladora de 400W con base inclinable hasta 45° para cortes en bisel. Corta madera hasta 55 mm y metal hasta 6 mm con precisión.",
    category: "Herramientas Eléctricas",
    image: "/images/productos/CALA-P4.jpg",
    images: [
      "/images/productos/CALA-P4.jpg",
      "/images/productos/CALA-P4+E1.jpg",
      "/images/productos/CALA-P4+FC1.jpg",
    ],
    description: `La sierra caladora **PRETUL de 400W** ofrece cortes precisos y cómodos en distintos materiales. Su motor con **balero de bolas** garantiza durabilidad y desempeño constante, mientras que la zapata metálica inclinable permite cortes en ángulo de hasta **45°** hacia ambos lados.

## Especificaciones técnicas
| Dato | Valor |
| Marca | **PRETUL** (línea económica de TRUPER) |
| Código | 29003 (CALA-P4) o 24047 (CALA-P3, según modelo) |
| Potencia | **400W** |
| Voltaje / Frecuencia | 127V / 60Hz |
| Consumo | 3.1 A |
| Velocidad sin carga | 3,000 cpm |
| Longitud de carrera | 16 mm (5/8") |
| Corte en madera | hasta **55 mm** |
| Corte en metal | hasta **6 mm** |
| Base inclinable | 0°, 15°, 30° y 45° (izq./der.) |
| Segueta | Zanco tipo "T" o "U" según modelo |
| Extras | Botón de uso continuo; adaptador para aspiradora en algunos modelos |
| Ciclo de trabajo | 20 min de uso por 10 min de descanso |

## Beneficios
* **Versatilidad**: corta madera, metal y plástico con precisión
* **Durabilidad**: motor con balero de bolas
* **Comodidad**: botón de uso continuo y diseño ergonómico
* **Flexibilidad**: base inclinable hasta 45° para cortes en bisel
* **Practicidad**: opción de conectar aspiradora

> Producto nuevo en empaque original.`,
    stock: 14
  },
  {
    id: 29,
    name: "Pulidora Angular 4-1/2\", 1100W, TRUPER PRO",
    price: 200000,
    originalPrice: 240000,
    isOnSale: true,
    shortDescription: "Esmeriladora de 1100W con velocidad gradual de 6,000 a 12,000 rpm. Mango ajustable a 3 posiciones y guarda de cambio rápido para máximo control.",
    category: "Herramientas Eléctricas",
    image: "/images/productos/ESMA-45110.jpg",
    images: [
      "/images/productos/ESMA-45110.jpg",
      "/images/productos/ESMA-45110+FC1.jpg",
      "/images/productos/ESMA-45110+FC2.jpg",
    ],
    description: `## TRUPER PRO ESMA-45110
Esmeriladora angular **compacta y robusta**, ideal para herrería, construcción y mantenimiento. Su diseño ergonómico y componentes reforzados garantizan desempeño confiable en aplicaciones exigentes.

### Especificaciones técnicas
| Dato | Valor |
| Código | 100902 (Clave ESMA-45110) |
| Potencia | **1100W** |
| Voltaje / Frecuencia | 127V / 60Hz |
| Velocidad sin carga | **6,000 – 12,000 rpm** gradual |
| Diámetro de disco | 4-1/2" (115 mm) |
| Motor | Montado sobre balero de bolas |
| Encendido | Gradual, evita movimientos bruscos |
| Mango auxiliar | Ajustable a **3 posiciones** |
| Guarda | De ajuste rápido |
| Bloqueo de eje | Botón para cambio rápido de accesorios |
| Cable | 1.7 m |
| Ciclo de trabajo | 30 min de uso por 15 min de descanso |
| Fabricación | China, bajo especificaciones de Grupo TRUPER |

### Beneficios
* Potencia de 1100W para **cortes y desbastes exigentes**
* Mayor control y seguridad por encendido gradual y mango ajustable
* Durabilidad superior con motor de balero de bolas
* Apta para **acero, ladrillos, azulejos y piedra**
* Guarda de ajuste rápido y bloqueo para cambios sencillos

> Producto nuevo en empaque original.`,
    stock: 11
  },
  {
    id: 30,
    name: "Careta Inteligente Para Soldar Sombra 9-13, Aguila, PRETUL",
    price: 72000,
    shortDescription: "Careta electrónica con filtro True Color y sombra variable 9–13. Oscurecimiento automático en 1/15,000 segundos con panel solar y pila reemplazable.",
    category: "Seguridad",
    image: "/images/productos/CAREL-11AP.jpg",
    images: [
      "/images/productos/CAREL-11AP.jpg",
      "/images/productos/CAREL-11AP+E1.jpg",
      "/images/productos/CAREL-11AP+FC1.jpg",
      "/images/productos/CAREL-11AP+D1.jpg",
      "/images/productos/CAREL-11AP+D2.jpg",
    ],
    description: `La careta electrónica **PRETUL CAREL-11AP** con diseño de águila brinda protección ocular avanzada en soldadura. Su **filtro True Color** permite ver con mayor nitidez y colores reales, reduciendo la fatiga ocular.

## Especificaciones técnicas
| Dato | Valor |
| Marca | **PRETUL** (Grupo TRUPER) |
| Código | 29011 |
| Modelo | CAREL-11AP |
| Material | Polipropileno ligero, resistente a altas temperaturas |
| Filtro | Tecnología **True Color** |
| Sombra variable | **9–13** para soldadura / #4 en estado pasivo |
| Velocidad de oscurecimiento | **1/15,000 s** automático |
| Alimentación | Pila CR2032 reemplazable + panel solar |
| Control | Sensibilidad y retardo ajustables |
| Diseño | Gráfico de águila en la carcasa |
| Peso | Ligero para uso prolongado |
| Origen | China, bajo especificaciones de Grupo TRUPER |

## Beneficios
[[Protección confiable|Contra **radiación y chispas** de soldadura.]]
[[Visión real|Filtro True Color para trabajar con más precisión.]]
[[Comodidad|Cuerpo **ligero y resistente** para largas jornadas.]]
[[Autonomía|Pila reemplazable y **panel solar**.]]

* Versatilidad: sombra variable para distintos procesos
* Estilo único: diseño de águila que combina seguridad y estética

> Producto nuevo en empaque original.`,
    stock: 40
  },
  {
    id: 31,
    name: "Lijadora orbital 1/4 hoja, 240W, TRUPER PRO",
    price: 150000,
    shortDescription: "Lijadora orbital de 240W a 14,000 oscilaciones por minuto con recolector de polvo y microfiltro. Acabados finos y profesionales en madera, metal y plásticos.",
    category: "Herramientas Eléctricas",
    image: "/images/productos/LIOR-1-4A3.jpg",
    images: [
      "/images/productos/LIOR-1-4A3.jpg",
      "/images/productos/LIOR-1-4A3+E1.jpg",
      "/images/productos/LIOR-1-4A3+FC1.jpg",
      "/images/productos/LIOR-1-4A3+FC2.jpg",
    ],
    description: `La **TRUPER PRO LIOR-1/4A3** es una lijadora orbital de alto desempeño, ideal para carpintería, acabados finos y bricolaje exigente. Su motor de **240W** ofrece potencia constante en un diseño compacto y preciso.

## Especificaciones técnicas
| Dato | Valor |
| Código | 102746 (Clave LIOR-1/4A3) |
| Potencia | **240W** |
| Voltaje / Frecuencia | 127V / 60Hz |
| Velocidad sin carga | **14,000 opm** |
| Tamaño de lija | 1/4 de hoja estándar |
| Motor | Sobre balero de bolas |
| Sujeción | Mordazas para fijar la lija firmemente |
| Recolector de polvo | Bote translúcido con **microfiltro** |
| Interruptor | Hermético contra polvo |
| Diseño | Compacto, ligero, grip antiderrapante |
| Ciclo de trabajo | 30 min de uso por 15 min de descanso (máx. 3 h diarias) |
| Norma | Cumple **NOM-003-SCFI** |
| Origen | China, bajo especificaciones de Grupo TRUPER |

## Beneficios
* **Acabados finos y precisos** gracias a sus 14,000 opm
* Durabilidad superior con motor de balero e interruptor sellado
* Comodidad y control por grip antiderrapante y diseño ligero
* Área de trabajo limpia con recolector de polvo y microfiltro
* Versatilidad: ideal para **madera, metal y plásticos**

> Producto nuevo en empaque original.`,
    stock: 50
  },
  {
    id: 32,
    name: "Electrobomba Truper 1HP - 60M Altura Maxima, TRUPER",
    price: 280000,
    shortDescription: "Bomba periférica de 1 HP con altura máxima de 60 m y flujo de 45 L/min. Impulsor de latón para riego agrícola y llenado de tanques elevados.",
    category: "Bombas e Hidrolavadoras",
    image: "/images/productos/BOAP-1A2.jpg",
    images: [
      "/images/productos/BOAP-1A2.jpg",
      "/images/productos/BOAP-1A2+FC1.jpg",
      "/images/productos/BOAP-1A2+E1.jpg",
      "/images/productos/BOAP-1A2+FC3.jpg",
      "/images/productos/BOAP-1A2+FC4.jpg",
    ],
    description: `La **bomba periférica TRUPER** es una solución confiable para riego agrícola, llenado de tanques elevados y aplicaciones donde se requiere mayor presión y altura de bombeo. Su diseño compacto y materiales resistentes garantizan durabilidad y desempeño constante.

## Especificaciones técnicas
| Dato | Valor |
| Código | 12114 (Clave BOAP-1A2) |
| Potencia | **1 HP (750 W)** |
| Voltaje / Frecuencia | 127 V / 60 Hz |
| Altura máxima de bombeo | **60 m** |
| Flujo máximo | 45 L/min |
| Profundidad máx. de succión | 8 m |
| Embobinado | Aluminio |
| Impulsor | **Latón** |
| Ciclo de trabajo | 50 min de uso por 20 min de descanso (máx. 6 h diarias) |
| Aplicación | Agua limpia (sin partículas abrasivas) |
| Empaque | Caja individual |
| Norma | Cumple **NOM-003-SCFI** |
| Origen | China, bajo especificaciones de Grupo TRUPER |

## Beneficios
* **Mayor presión y altura**: ideal para tanques elevados o riego
* Impulsor de latón: más resistente al desgaste y a la corrosión
* Embobinado de aluminio: motor confiable y duradero
* Versatilidad agrícola y doméstica, apta para sistemas hidroneumáticos
* Ciclo de trabajo protegido: evita sobrecalentamiento

> Producto nuevo en empaque original.`,
    stock: 32
  },
  {
    id: 33,
    name: "Transportador de Ángulos Digital",
    price: 42000,
    shortDescription: "Transportador electrónico con rango completo de 0-360° y resolución de 0.05°. Pantalla LCD digital con función de retención de lectura y cero en cualquier posición.",
    category: "Medición",
    image: "/images/productos/pintar-5.jpg",
    images: [
      "/images/productos/pintar-5.jpg"
    ],
    description: `Transportador electrónico de **precisión** con rango completo de **0-360°**, pensado para carpintería, herrería e instalaciones donde el ángulo exacto marca la diferencia.

## Especificaciones
| Dato | Valor |
| Rango | **0-360°** |
| Resolución | 0.05° |
| Precisión | ±0.1° |
| Pantalla | LCD digital |
| Batería | CR2032 |

## Características
[[Brazos ajustables|Longitud de **200 mm** para mediciones amplias.]]
[[Retención de lectura|Congela el valor para copiarlo con calma.]]
[[Cero en cualquier posición|Referencia flexible según el trabajo.]]
[[Apagado automático|Ahorra batería cuando no se usa.]]`,
    stock: 15
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SEGURIDAD INDUSTRIAL
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 34,
    name: "Casco de Seguridad Tipo II",
    price: 18500,
    shortDescription: "Casco industrial tipo II con arnés de 4 puntos, sistema de ventilación y ranuras para accesorios. Protección lateral certificada ANSI/ISEA Z89.1.",
    category: "Seguridad",
    image: "/images/productos/puli-1.jpg",
    images: [
      "/images/productos/puli-1.jpg"
    ],
    description: `Casco industrial con **arnés ajustable** y sistema de ventilación certificado, diseñado para obras y entornos con riesgo de impacto lateral.

## Especificaciones
- Tipo: **II** (protección lateral)
- Material: Polietileno de alta densidad
- Arnés: **4 puntos** ajustable
- Peso: 350 g

## Características
* Sistema de **ventilación**
* Ranuras para accesorios
* Banda antisudor **reemplazable**
* Cumple normas **ANSI/ISEA Z89.1**

> Protección certificada para jornadas largas sin sacrificar comodidad.`,
    stock: 48
  },
  {
    id: 35,
    name: "Lentes de Protección Antirayas",
    price: 5600,
    shortDescription: "Gafas de policarbonato con protección UV 99.9%, recubrimiento antirayas y antivaho. Diseño envolvente con patillas ajustables, ligeras y cómodas.",
    category: "Seguridad",
    image: "/images/productos/pulitru-1.jpg",
    images: [
      "/images/productos/pulitru-1.jpg"
    ],
    description: `Gafas de seguridad en **policarbonato** con protección UV y doble recubrimiento **antirayas y antivaho**, para visión clara en todo momento.

| Especificación | Detalle |
| Material | Policarbonato |
| Protección | **UV 99.9%** |
| Recubrimiento | Antirayas y antivaho |
| Norma | ANSI Z87.1 |

## Características
* Diseño **envolvente** para cobertura lateral
* Patillas ajustables
* Ligeras y cómodas
* Cumple normas **ANSI Z87.1**`,
    stock: 90
  },
  {
    id: 36,
    name: "Guantes de Cuero Reforzados",
    price: 8900,
    shortDescription: "Guantes de carnaza con refuerzos en palma y dedos, puño largo y costuras reforzadas. Resistentes al calor, ideales para soldadura y construcción.",
    category: "Seguridad",
    image: "/images/productos/pulitru-2.jpg",
    images: [
      "/images/productos/pulitru-2.jpg"
    ],
    description: `Guantes de **carnaza** con refuerzos en palma y dedos, pensados para trabajo pesado, soldadura y construcción.

## Especificaciones
- Material: **Cuero carnaza**
- Refuerzos: Palma y dedos
- Talla: Universal
- Longitud: **Puño largo**

## Características
[[Resistencia al calor|Aptos para **calor moderado** y chispas.]]
[[Anti-abrasión|Protección frente a superficies rugosas.]]
[[Costuras reforzadas|Mayor vida útil en uso diario.]]
[[Uso ideal|**Soldadura y construcción**.]]`,
    stock: 75
  },
  {
    id: 37,
    name: "Botas de Seguridad Puntera Acero",
    price: 31500,
    originalPrice: 45000,
    isOnSale: true,
    shortDescription: "Botas industriales con puntera de acero (200 J), suela antideslizante dieléctrica hasta 18kV y cuero hidrofugado. Resistentes a aceites y químicos.",
    category: "Seguridad",
    image: "/images/productos/pulitru-3.jpg",
    images: [
      "/images/productos/pulitru-3.jpg"
    ],
    description: `Botas industriales con **puntera de acero** y suela antideslizante dieléctrica, para entornos húmedos, eléctricos y de alto tránsito.

## Especificaciones
| Dato | Valor |
| Puntera | **Acero (200 J)** |
| Suela | Poliuretano antideslizante |
| Dieléctrico | Hasta **18 kV** |
| Tallas disponibles | 38 - 45 |
| Norma | ASTM F2413 |

## Características
* Resistentes a **aceites y químicos**
* Plantilla **antiperforación**
* Cuero hidrofugado
* Cumple normas **ASTM F2413**`,
    stock: 35
  },
  {
    id: 38,
    name: "Mascarilla Respirador N95 x10",
    price: 12500,
    shortDescription: "Pack de 10 mascarillas N95 con filtración del 95%, válvula de exhalación y ajuste facial sellado. Clip nasal moldeable y bandas elásticas ajustables.",
    category: "Seguridad",
    image: "/images/productos/pulitru-4.jpg",
    images: [
      "/images/productos/pulitru-4.jpg"
    ],
    description: `Pack de mascarillas **N95** con filtro de alta eficiencia y **válvula de exhalación**, para ambientes con polvo, partículas y trabajos de lijado.

## Especificaciones
- Clasificación: **N95**
- Filtración: **95%** de partículas
- Cantidad: **10 unidades**
- Con válvula de exhalación

## Características
* Ajuste facial **sellado**
* Clip nasal moldeable
* Bandas elásticas ajustables
* Cumple normas **NIOSH**`,
    stock: 120
  },
  {
    id: 39,
    name: "Arnés de Seguridad Completo",
    price: 62300,
    originalPrice: 89000,
    isOnSale: true,
    shortDescription: "Arnés integral con anillos D dorsales y pectorales, capacidad de 140 kg. Hebillas de conexión rápida y correas acolchadas para trabajo en altura seguro.",
    category: "Seguridad",
    image: "/images/productos/bosh-3.jpg",
    images: [
      "/images/productos/bosh-3.jpg"
    ],
    description: `Arnés integral para **trabajo en altura** con anillos D dorsales y pectorales, ajustable en piernas y torso para un calce seguro.

| Especificación | Detalle |
| Tipo | Cuerpo completo |
| Anillos D | **Dorsal y pectoral** |
| Capacidad | **140 kg** |
| Ajustes | Piernas y torso |
| Norma | ANSI Z359.11 |

## Características
[[Conexión rápida|Hebillas que agilizan el **enganche seguro**.]]
[[Correas acolchadas|Comodidad durante toda la jornada.]]
[[Indicador de caída|Señal visual para retirar el equipo.]]
[[Certificación|Cumple **ANSI Z359.11**.]]`,
    stock: 15
  },
  {
    id: 40,
    name: "Protectores Auditivos Orejeras",
    price: 14500,
    shortDescription: "Orejeras con reducción de ruido NRR 27dB, almohadillas acolchadas reemplazables y diadema ajustable. Plegables para fácil transporte y almacenamiento.",
    category: "Seguridad",
    image: "/images/productos/bosh-4.jpg",
    images: [
      "/images/productos/bosh-4.jpg"
    ],
    description: `Orejeras de **reducción de ruido hasta 27 dB** con almohadillas acolchadas, ideales para uso con pulidoras, taladros y maquinaria.

## Especificaciones
- Reducción: **NRR 27 dB**
- Material: ABS y espuma
- Tipo: **Diadema ajustable**

## Características
* Almohadillas **reemplazables**
* Diadema acolchada
* **Plegables** para transporte
* Cumple normas **ANSI S3.19**`,
    stock: 42
  },
  {
    id: 41,
    name: "Chaleco Reflectante Alta Visibilidad",
    price: 6800,
    shortDescription: "Chaleco clase 2 en malla de poliéster amarillo fluorescente con cintas reflectivas de 50 mm. Ligero, transpirable y con cierre de velcro frontal.",
    category: "Seguridad",
    image: "/images/productos/pist1.jpg",
    images: [
      "/images/productos/pist1.jpg"
    ],
    description: `Chaleco de **alta visibilidad clase 2** con cintas reflectivas, indicado para trabajo en vías, obras y maniobras nocturnas.

| Especificación | Detalle |
| Clase | **2** (alta visibilidad) |
| Material | Malla de poliéster |
| Color | Amarillo fluorescente |
| Talla | Universal |
| Norma | ANSI/ISEA 107 |

## Características
* Cintas reflectivas de **50 mm**
* Cierre de **velcro** frontal
* Ligero y transpirable
* Cumple normas **ANSI/ISEA 107**`,
    stock: 68
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PRODUCTOS INCORPORADOS DESDE ferreimages/ (noviembre 2026)
  // Precios provisionales: revisar antes de confirmar.
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 42,
    name: "Licuadora Universal La Tradicional 1000W - Vaso de Vidrio 1.7 L",
    price: 250000,
    shortDescription: "Licuadora de 1000W con vaso de vidrio de 1,7 litros y 5 funciones: batir, puré, triturar, picar y pulso. Cuchilla desmontable para limpiar con facilidad.",
    category: "Hogar",
    image: "/images/productos/licuadora-universal-1000w-1.jpg",
    images: [
      "/images/productos/licuadora-universal-1000w-1.jpg",
      "/images/productos/licuadora-universal-1000w-2.jpg",
      "/images/productos/licuadora-universal-1000w-3.jpg",
      "/images/productos/licuadora-universal-1000w-4.jpg",
      "/images/productos/licuadora-universal-1000w-5.jpg",
      "/images/productos/licuadora-universal-1000w-6.jpg",
    ],
    description: `## Licuadora UNIVERSAL La Tradicional
Licuadora de **1000W** con vaso de vidrio, pensada para el uso diario en casa.

### Especificaciones
| Dato | Valor |
| Marca | **UNIVERSAL** |
| Línea | La Tradicional |
| Potencia | **1000W** |
| Vaso | Vidrio, **1,7 litros** |
| Funciones | Off, Batir, Puré, Triturar, Picar y Pulso |
| Cuchilla | Desmontable |
| Garantía | 2 años (según empaque) |

### Incluye
* Base con motor
* Vaso de vidrio con tapa
* Conjunto de cuchilla desmontable

> Producto nuevo en empaque original.`,
    stock: 10
  },
  {
    id: 43,
    name: "Destornillador de Impacto con Puntas 3/8\", Truper Expert",
    price: 75000,
    shortDescription: "Destornillador de impacto reversible para aflojar tornillos oxidados o muy apretados. Incluye 4 puntas, adaptador de 3/8\" y estuche.",
    category: "Herramientas Manuales",
    image: "/images/productos/destornillador-impacto-truper-dimp-38x-1.jpg",
    images: [
      "/images/productos/destornillador-impacto-truper-dimp-38x-1.jpg",
      "/images/productos/destornillador-impacto-truper-dimp-38x-2.jpg",
      "/images/productos/destornillador-impacto-truper-dimp-38x-3.jpg",
      "/images/productos/destornillador-impacto-truper-dimp-38x-4.jpg",
    ],
    description: `## TRUPER EXPERT DIMP-3/8X
Destornillador de impacto para **aflojar tornillos oxidados o demasiado apretados** golpeándolo con un martillo. Es reversible: afloja y aprieta.

### Especificaciones técnicas
| Dato | Valor |
| Código | 101176 (Clave DIMP-3/8X) |
| Cuadro | **3/8"** |
| Puntas | Acero S2 |
| Cuerpo | Acero al carbono, reversible |
| Largo | 16 cm |
| Norma | Puntas superan ASME B107.600 |

### Incluye
* 1 destornillador de impacto
* 4 puntas: cruz PH2 y PH3, planas de 8 y 10 mm
* Adaptador para puntas
* Estuche

> Producto nuevo en empaque original.`,
    stock: 10
  },
  {
    id: 44,
    name: "Pulidora Angular 4-1/2\" 1100W Industrial, TOTAL",
    price: 245000,
    shortDescription: "Pulidora industrial de 1100W y 12.000 rpm para disco de 4-1/2\". Caja de engranajes de aluminio, bloqueo de eje, mango auxiliar y guarda.",
    category: "Herramientas Eléctricas",
    image: "/images/productos/pulidora-total-1100w-utg110125563-1.jpg",
    images: [
      "/images/productos/pulidora-total-1100w-utg110125563-1.jpg",
      "/images/productos/pulidora-total-1100w-utg110125563-2.jpg",
      "/images/productos/pulidora-total-1100w-utg110125563-3.jpg",
      "/images/productos/pulidora-total-1100w-utg110125563-4.jpg",
    ],
    description: `## TOTAL Industrial UTG110125563
Pulidora angular de **1100W** de la línea industrial TOTAL, para corte y desbaste en metal y construcción.

### Especificaciones técnicas
| Dato | Valor |
| Modelo | UTG110125563 |
| Potencia | **1100W** |
| Voltaje | 110-120V ~ 50/60Hz |
| Velocidad sin carga | **12.000 rpm** |
| Diámetro de disco | 4-1/2" |
| Rosca del eje | 5/8"-11 UNC |
| Caja de engranajes | Aluminio |
| Bloqueo de eje | Sí |

### Incluye
* Pulidora
* Mango auxiliar
* Guarda
* Llave

> El disco se vende por separado. Producto nuevo en empaque original.`,
    stock: 10
  },
  {
    id: 45,
    name: "Plomada de Latón 8 oz (225 g), Truper",
    price: 45000,
    shortDescription: "Plomada de latón sólido de 8 oz con tapa atornillable para centrar el hilo y punta de acero templado de repuesto. Para topografía, plomería y construcción.",
    category: "Medición",
    image: "/images/productos/plomada-laton-truper-plom-8-1.jpg",
    images: [
      "/images/productos/plomada-laton-truper-plom-8-1.jpg",
      "/images/productos/plomada-laton-truper-plom-8-2.jpg",
    ],
    description: `## TRUPER PLOM-8
Plomada de **latón** para verificar verticales en obra, plomería y topografía.

### Especificaciones
| Dato | Valor |
| Código | 17070 (Clave PLOM-8) |
| Material | Latón |
| Peso | **8 oz (225 g)** |
| Tapa | Atornillable, facilita centrar el hilo |
| Punta | Acero templado, con repuesto incluido |

### Características
* Tapa atornillable para pasar y centrar el hilo
* Incluye **punta de acero templado de repuesto**
* Para topografía, plomería y construcción

> Producto nuevo en empaque original.`,
    stock: 10
  },
  {
    id: 46,
    name: "Alicate de Presión 10\" Quijada Recta, Stanley 84-371",
    price: 55000,
    shortDescription: "Alicate de presión de 10\" en acero cromo vanadio, con mordaza superior soldada con cobre y quijada recta para piezas planas y planchas de metal.",
    category: "Sujeción",
    image: "/images/productos/alicate-presion-stanley-84-371-1.jpg",
    images: [
      "/images/productos/alicate-presion-stanley-84-371-1.jpg",
      "/images/productos/alicate-presion-stanley-84-371-2.jpg",
      "/images/productos/alicate-presion-stanley-84-371-3.jpg",
    ],
    description: `## STANLEY 84-371
Alicate de presión (hombre solo) de **10" (254 mm)** con quijada recta.

### Especificaciones
| Dato | Valor |
| Referencia | 84-371 |
| Largo | **10" (254 mm)** |
| Quijada | Recta |
| Material | Acero cromo vanadio |
| Norma | Excede estándares ASME y Federal |

### Características
* Mordaza superior fija con **soldadura de cobre** para mayor fuerza de apriete
* Quijadas rectas para sujetar firmemente **piezas planas y planchas de metal**
* Tornillo de microajuste y palanca de fácil liberación

> Producto nuevo en empaque original.`,
    stock: 10
  },
  {
    id: 47,
    name: "Pinza de Presión 10\" Mordaza Curva, Truper",
    price: 43000,
    shortDescription: "Pinza de presión de 10\" con mordaza curva de acero al cromo molibdeno y apertura de 2\". Para tuberías, pernos, tornillos y tuercas.",
    category: "Sujeción",
    image: "/images/productos/pinza-presion-truper-ppt-10c-1.jpg",
    images: [
      "/images/productos/pinza-presion-truper-ppt-10c-1.jpg",
      "/images/productos/pinza-presion-truper-ppt-10c-2.jpg",
    ],
    description: `## TRUPER PPT-10C
Pinza de presión de **10"** con mordaza curva para máxima sujeción en superficies redondas.

### Especificaciones
| Dato | Valor |
| Código | 17423 (Clave PPT-10C) |
| Largo | **10" (25 cm)** |
| Apertura máxima | **2" (50 mm)** |
| Mordaza | Curva, acero al cromo molibdeno |
| Acabado | Niquelado |

### Características
* Para **tuberías, pernos, tornillos y tuercas**
* Tornillo de ajuste moleteado para mejor control
* Palanca de liberación y entrada para llave Allen

> Producto nuevo en empaque original.`,
    stock: 10
  },
  {
    id: 48,
    name: "Hidrolavadora 1400W 1900 PSI (130 bar), TOTAL",
    price: 380000,
    shortDescription: "Hidrolavadora eléctrica de 1400W con presión máxima de 130 bar (1900 psi) y caudal de 5,5 L/min. Motor de cobre, bomba de metal y parada automática.",
    category: "Bombas e Hidrolavadoras",
    image: "/images/productos/hidrolavadora-total-1400w-1.jpg",
    images: [
      "/images/productos/hidrolavadora-total-1400w-1.jpg",
      "/images/productos/hidrolavadora-total-1400w-2.jpg",
      "/images/productos/hidrolavadora-total-1400w-3.jpg",
      "/images/productos/hidrolavadora-total-1400w-4.jpg",
    ],
    description: `## Hidrolavadora TOTAL 1400W
Hidrolavadora eléctrica para lavar vehículos, pisos, fachadas y equipos.

### Especificaciones técnicas
| Dato | Valor |
| Potencia | **1400W** |
| Voltaje | 110-120V ~ 60Hz |
| Presión máxima | **130 bar (1900 psi)** |
| Caudal | **5,5 L/min** |
| Velocidad del motor | 16.800/min |
| Sistema | Parada automática (auto stop) |

### Características
* Motor con bobinado de **cobre**
* Bomba de metal de alta calidad
* Pistola de presión TOTAL
* Incluye manguera, lanza y accesorios

> Producto nuevo en empaque original.`,
    stock: 10
  },
  {
    id: 49,
    name: "Martillo Demoledor 1300W 20J Hexagonal + Maletín, TOTAL",
    price: 480000,
    shortDescription: "Demoledor industrial de 1300W con 20 J de energía de impacto y 3800 golpes/min. Encastre hexagonal, sistema antivibración, maletín y 2 cinceles.",
    category: "Herramientas Eléctricas",
    image: "/images/productos/demoledor-total-uth2130016-1.jpg",
    images: [
      "/images/productos/demoledor-total-uth2130016-1.jpg",
      "/images/productos/demoledor-total-uth2130016-2.jpg",
      "/images/productos/demoledor-total-uth2130016-3.jpg",
      "/images/productos/demoledor-total-uth2130016-4.jpg",
      "/images/productos/demoledor-total-uth2130016-5.jpg",
    ],
    description: `## TOTAL Industrial UTH2130016
Martillo demoledor para **cincelar concreto, ladrillo, piedra y asfalto**.

### Especificaciones técnicas
| Dato | Valor |
| Modelo | UTH2130016 |
| Potencia | **1300W** |
| Voltaje | 110-120V ~ 50/60Hz |
| Energía de impacto | **20 J** |
| Golpes por minuto | 3800/min |
| Encastre | Hexagonal (17 mm) |
| Peso aproximado | 7 kg |
| Sistema | Antivibración |

### Incluye
* Maletín BMC
* Cincel de punta y cincel plano
* Llave y grasa

> Producto nuevo en empaque original.`,
    stock: 10
  },
  {
    id: 50,
    name: "Rotomartillo SDS Plus 1050W 3 Funciones + Maletín, TOTAL",
    price: 450000,
    shortDescription: "Rotomartillo industrial de 1050W con 3 funciones. Perfora hasta 26 mm en concreto, 13 mm en acero y 40 mm en madera. Incluye maletín, brocas y cincel.",
    category: "Herramientas Eléctricas",
    image: "/images/productos/rotomartillo-total-uth110266-1.jpg",
    images: [
      "/images/productos/rotomartillo-total-uth110266-1.jpg",
      "/images/productos/rotomartillo-total-uth110266-2.jpg",
      "/images/productos/rotomartillo-total-uth110266-3.jpg",
      "/images/productos/rotomartillo-total-uth110266-4.jpg",
    ],
    description: `## TOTAL UTH110266
Rotomartillo de **3 funciones** para perforar y cincelar en concreto, ladrillo y mampostería.

### Especificaciones técnicas
| Dato | Valor |
| Modelo | UTH110266 |
| Potencia | **1050W** |
| Voltaje | 110-120V ~ 50/60Hz |
| Velocidad sin carga | 1100 rpm |
| Golpes por minuto | 3900/min |
| Perforación en concreto | **26 mm (1")** |
| Perforación en acero | 13 mm (1/2") |
| Perforación en madera | 40 mm (1-1/2") |
| Encastre | SDS Plus |

### Incluye
* Maletín
* Mango auxiliar
* Brocas y cincel SDS Plus
* Copa recolectora de polvo, llave y grasa

> Producto nuevo en empaque original.`,
    stock: 10
  },
  {
    id: 51,
    name: "Juego de Copas 1/2\" y 3/8\" x24 Piezas + Rache, Germany",
    price: 75000,
    shortDescription: "Juego de 24 piezas en acero cromo vanadio con rache, copas y puntas de cuadro 1/2\" y 3/8\". Organizador con asa para llevarlo a cualquier trabajo.",
    category: "Herramientas Manuales",
    image: "/images/productos/juego-copas-germany-24pcs-1.jpg",
    images: [
      "/images/productos/juego-copas-germany-24pcs-1.jpg",
      "/images/productos/juego-copas-germany-24pcs-2.jpg",
      "/images/productos/juego-copas-germany-24pcs-3.jpg",
    ],
    description: `## Juego de copas GERMANY 24 piezas
Juego de copas con rache para mecánica y mantenimiento.

### Especificaciones
| Dato | Valor |
| Piezas | **24** |
| Cuadro | 1/2" y 3/8" |
| Material | Acero cromo vanadio (Cr-V 6150) |
| Norma | DIN 3124 |
| Acabado | Cromado contra la oxidación |

### Incluye
* Rache
* Copas
* Puntas con copa
* Organizador con asa

> Producto nuevo en empaque original.`,
    stock: 10
  },
  {
    id: 52,
    name: "Cautín Tipo Lápiz 100W Trabajo Pesado, Truper",
    price: 45000,
    shortDescription: "Cautín de 100W para trabajo pesado, con temperatura máxima de 500 °C, punta de cobre niquelada y 3 puntas incluidas.",
    category: "Herramientas Eléctricas",
    image: "/images/productos/cautin-truper-cau-100-1.jpg",
    images: [
      "/images/productos/cautin-truper-cau-100-1.jpg",
      "/images/productos/cautin-truper-cau-100-2.jpg",
    ],
    description: `## TRUPER CAU-100
Cautín tipo lápiz de **100W** para soldadura con estaño en trabajos pesados.

### Especificaciones técnicas
| Dato | Valor |
| Código | 14623 (Clave CAU-100) |
| Potencia | **100W** |
| Voltaje | 120V ~ 60Hz |
| Temperatura máxima | **500 °C** |
| Punta | Cobre con recubrimiento de níquel |
| Mango | Nylon |

### Incluye
* Cautín
* 3 puntas: cónica, cónica fina y en "V"
* Soporte

> Producto nuevo en empaque original.`,
    stock: 10
  },
  {
    id: 53,
    name: "Esmeriladora Angular 4-1/2\" 1250W, TRUPER Industrial",
    price: 320000,
    shortDescription: "Esmeriladora industrial de 1250W y 11.000 rpm con motor sobre balero de bolas. Incluye disco abrasivo, guarda, mango auxiliar y llave.",
    category: "Herramientas Eléctricas",
    image: "/images/productos/esmeriladora-truper-esma-4512n-1.jpg",
    images: [
      "/images/productos/esmeriladora-truper-esma-4512n-1.jpg",
      "/images/productos/esmeriladora-truper-esma-4512n-2.jpg",
      "/images/productos/esmeriladora-truper-esma-4512n-3.jpg",
    ],
    description: `## TRUPER Industrial ESMA-4512N
Esmeriladora angular de **1250W** para corte y desbaste en uso industrial.

### Especificaciones técnicas
| Dato | Valor |
| Código | 12873 (Clave ESMA-4512N) |
| Potencia | **1250W** |
| Voltaje / Frecuencia | 127V / 60Hz |
| Corriente | 9,5 A |
| Velocidad | **11.000 rpm** |
| Diámetro de disco | 4-1/2" (115 mm) |
| Eje | 5/8"-11 UNC |
| Motor | Montado sobre balero de bolas |
| Carbones | Expuestos, de cambio fácil |
| Garantía | 5 años (según empaque) |

### Incluye
* Esmeriladora
* Disco abrasivo
* Guarda, mango auxiliar y llave

> Producto nuevo en empaque original.`,
    stock: 10
  },
  {
    id: 54,
    name: "Tijera de Aviación 10\" Corte Recto Industrial, TOTAL",
    price: 38000,
    shortDescription: "Tijera de aviación de 250 mm con corte recto para lámina. Corta acero al carbono de hasta 1,2 mm y acero inoxidable de hasta 0,7 mm.",
    category: "Herramientas Manuales",
    image: "/images/productos/tijera-aviacion-total-tht522106-1.jpg",
    images: [
      "/images/productos/tijera-aviacion-total-tht522106-1.jpg",
      "/images/productos/tijera-aviacion-total-tht522106-2.jpg",
    ],
    description: `## TOTAL Industrial THT522106
Tijera de aviación para **cortar lámina** en línea recta.

### Especificaciones
| Dato | Valor |
| Modelo | THT522106 |
| Largo | **10" (250 mm)** |
| Tipo de corte | Recto |
| Acero al carbono | Hasta **1,2 mm** |
| Acero inoxidable | Hasta **0,7 mm** |

### Características
* Mango bicolor antideslizante
* Seguro de cierre

> Producto nuevo en empaque original.`,
    stock: 10
  },
  {
    id: 55,
    name: "Remachadora Manual 10.5\", TOTAL",
    price: 45000,
    shortDescription: "Remachadora pop manual de 10,5\" para remaches de 2,4, 3,2, 4,0 y 4,8 mm. Tabla de espesores de remachado impresa en el empaque.",
    category: "Sujeción",
    image: "/images/productos/remachadora-total-tht32108s-1.jpg",
    images: [
      "/images/productos/remachadora-total-tht32108s-1.jpg",
      "/images/productos/remachadora-total-tht32108s-2.jpg",
    ],
    description: `## TOTAL THT32108S
Remachadora manual para **remaches pop** en lámina, aluminio y carpintería metálica.

### Especificaciones
| Dato | Valor |
| Modelo | THT32108S |
| Largo | **10,5"** |
| Remaches compatibles | 2,4 mm, 3,2 mm, 4,0 mm y 4,8 mm |

> Producto nuevo en empaque original.`,
    stock: 10
  }
];

export const categories = [
  "Herramientas Manuales",
  "Herramientas Eléctricas",
  "Bombas e Hidrolavadoras",
  "Sujeción",
  "Medición",
  "Seguridad",
  "Hogar"
];
