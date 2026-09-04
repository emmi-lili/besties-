# Amiguis

App web para conocer mejores amigas jugando (no citas). Nombre de trabajo configurable en `src/lib/constants.ts` (`APP_NAME`).

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion, Zod, bcryptjs
- Data layer con repositorios: mock ahora, Supabase después (`NEXT_PUBLIC_DATA_SOURCE`)

## Fase actual

**Fase 1** — setup, tipos, repositorios, mock con seed (12 perfiles), design system, rutas base.

## Desarrollo

```bash
npm install
npm run dev
```

```bash
npm test
npm run build
```

## Data source

```env
NEXT_PUBLIC_DATA_SOURCE=mock
```

Con `supabase`, los stubs lanzan errores "no implementado" (la abstracción tipada ya está).
