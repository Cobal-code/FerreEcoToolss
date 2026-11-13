# Publicación y rendimiento

La tienda se publica desde **Lovable** (Share → Publish), que ya sirve el sitio por CDN con HTTPS y compresión. Lovable no permite configurar cabeceras propias, así que lo de abajo solo aplica si algún día se publica en otro alojamiento.

## Lo que ya está optimizado en el código
- **Imágenes:** cada foto tiene variantes WebP de 400, 800 y 1200 px junto al original (`/images/productos/x.jpg` → `x-400.webp`, `x-800.webp`, `x-1200.webp`). Las tarjetas usan `srcset` y `sizes`, y las imágenes fuera de pantalla cargan de forma diferida. La versión de 1200 px solo se descarga al abrir el visor ampliado.
- **Imagen principal:** la foto del producto se carga con `fetchpriority="high"`.
- **Sin saltos de diseño:** las imágenes viven en contenedores con proporción fija, y el indicador de carga de cada página ocupa toda la pantalla.
- **Fuentes:** Google Fonts se carga sin bloquear el primer pintado.
- **Código:** las páginas secundarias se cargan bajo demanda. React, el router y React Query van en paquetes propios (`vendor-*`) que se mantienen en caché entre publicaciones.
- **Consultas:** las estadísticas de reseñas usan la caché de React Query (5 min) y en las tarjetas solo se piden cuando la tarjeta se acerca a la pantalla.

## Si se publica fuera de Lovable (Netlify, Vercel, Cloudflare Pages…)
1. Compilar con `npm run build` y publicar la carpeta `dist/`.
2. Configurar la redirección SPA: todas las rutas deben servir `index.html`.
3. Cabeceras de caché recomendadas:
   - `/assets/*` (archivos con hash): `Cache-Control: public, max-age=31536000, immutable`
   - `/images/*`: `Cache-Control: public, max-age=2592000` (30 días)
   - `/index.html`: `Cache-Control: no-cache`
4. Activar la compresión Brotli o gzip, que en esos servicios suele venir activada por defecto.

Ejemplo para Netlify o Cloudflare Pages (archivo `public/_headers`):

```
/assets/*
  Cache-Control: public, max-age=31536000, immutable
/images/*
  Cache-Control: public, max-age=2592000
/index.html
  Cache-Control: no-cache
```

## Al añadir fotos nuevas
Crea las variantes `-400.webp`, `-800.webp` y `-1200.webp` junto al original con la misma herramienta que se usó para las actuales. Si una foto no tiene variantes, la web usa el original automáticamente, pero pesará más.
