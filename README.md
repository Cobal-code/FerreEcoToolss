# FerreEcoTools

Tienda en línea de herramientas y materiales de construcción: https://ferreecotools.com

## Tecnologías

- Vite
- TypeScript
- React
- shadcn-ui (Radix UI)
- Tailwind CSS
- Supabase (base de datos y Edge Functions)

## Desarrollo local

Requiere Node.js y npm.

```sh
npm i
npm run dev
```

La tienda queda disponible en http://localhost:8080. Las variables de entorno se copian de `.env.example` a `.env`.

## Compilar

```sh
npm run build
```

El resultado queda en `dist/`. Para publicarlo y optimizar el rendimiento, ver `PUBLICACION-RENDIMIENTO.md`.
