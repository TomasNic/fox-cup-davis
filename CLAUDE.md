# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Copa Davis Fox — Documentación del Proyecto

## Descripción

Web app para registrar y visualizar los resultados del torneo de tenis **Copa Davis Fox**, jugado entre amigos al estilo Copa Davis. Permite ver el ranking de jugadores, copas mensuales con sus resultados, partidos (singles y dobles) con sets, y un panel admin para cargar toda la información.

## Stack

| Capa | Tecnología |
|------|------------|
| Framework | Next.js (App Router, Server Components) |
| UI | React + Tailwind CSS v4 |
| Base de datos | Supabase (PostgreSQL) |
| Auth | Cookie httpOnly simple (`cdx_admin`, 24h) |
| Storage | Supabase Storage (bucket `avatars`) |
| Image crop | react-easy-crop |

> **Importante:** Esta versión de Next.js puede tener cambios que difieren de versiones previas. Antes de escribir código, revisar las guías en `node_modules/next/dist/docs/` si hay dudas sobre APIs o convenciones.

## Comandos

```bash
npm run dev       # Servidor de desarrollo en localhost:3000
npm run build     # Build de producción
npm run start     # Servidor de producción
```

No hay linter, formatter ni tests configurados.

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=https://znyqmbghimxjtboctqik.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # Solo Server Actions — nunca al browser
ADMIN_PASSWORD=...              # Contraseña del usuario admin
```

## Arquitectura

### Patrón central

- **Server Components por defecto** — el data fetching ocurre server-side con queries directas a Supabase en `src/lib/supabase/queries.ts`
- **Server Actions para mutaciones** — en `src/lib/supabase/actions.ts`, todas usan `adminClient()` (service_role) y llaman `revalidatePath()` al terminar
- **Sin cliente HTTP ni ORM** — llamadas directas al SDK de Supabase
- **Sin estado global** (no Redux, Zustand, Context API) — los Client Components (`"use client"`) solo se usan para interactividad

### Capas de datos

| Archivo | Rol |
|---------|-----|
| `src/lib/supabase/client.ts` | Browser client (anon key, lectura pública) |
| `src/lib/supabase/server.ts` | Server client (cookies, para auth) |
| `src/lib/supabase/queries.ts` | Funciones de lectura usadas en Server Components |
| `src/lib/supabase/actions.ts` | Server Actions con service_role (todas las escrituras) |
| `src/lib/auth.ts` | `loginAdmin / logoutAdmin / checkAdminSession` |

### Autenticación admin

- Usuario: `admin` / Contraseña: definida en `ADMIN_PASSWORD`
- Cookie: `cdx_admin` (httpOnly, sameSite: lax, 24h)
- Login: POST `/api/admin/login` con `{ username, password }`
- Guard: `src/app/admin/(protected)/layout.tsx` llama `checkAdminSession()` y redirige a `/admin` si no hay sesión
- La página de login `/admin/page.tsx` está **fuera** del route group `(protected)` para evitar loop de redirección

## Rutas

### Públicas
| Ruta | Descripción |
|------|-------------|
| `/` | Redirige a `/dashboard` |
| `/dashboard` | Inicio: próxima copa (full width) + ranking top 3 + copas anteriores |
| `/cups` | Lista de copas (más reciente primero) |
| `/cups/[id]` | Detalle de copa: equipos, partidos en grilla 3 columnas, marcador |
| `/players` | Ranking completo con stats y foto de perfil |
| `/players/[id]` | Perfil: stats, historial por copa, compañeros y rivales |
| `/jugadores` | Redirige a `/players` |
| `/ranking` | Redirige a `/players` |
| `/design-system` | Showcase de todos los componentes UI |

### Admin (requiere sesión)
| Ruta | Descripción |
|------|-------------|
| `/admin` | Login admin |
| `/admin/dashboard` | Panel con métricas |
| `/admin/players` | Lista con editar/eliminar |
| `/admin/players/new` | Formulario nuevo jugador |
| `/admin/players/[id]/edit` | Formulario editar jugador |
| `/admin/cups` | Lista de copas con botón eliminar por fila |
| `/admin/cups/new` | Formulario nueva copa |
| `/admin/cups/[id]` | Gestión de copa: equipos, partidos, carga de sets, editar fecha, eliminar copa |

### API Routes
| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/admin/login` | POST | `{ username, password }` → set cookie |
| `/api/admin/logout` | POST | Elimina cookie → redirige a `/admin` |
| `/api/admin/upload-avatar` | POST | `FormData` con `file` → Supabase Storage → `{ url }` |

## Componentes UI (`src/components/ui/`)

Exportados desde el barrel `src/components/ui/index.ts`.

| Componente | Notas clave |
|------------|-------------|
| `Button` | Variantes: `primary`, `ghost`, `danger`. Tamaños: `sm`, `md`, `lg` |
| `Input` | `label`, `error`, `disabled`. Borde `border-2` para accesibilidad |
| `Select` | `options: {value, label}[]`, `placeholder`, `label`, `error` |
| `Textarea` | `label`, `error`, `rows` |
| `Avatar` | Circular con fallback de iniciales. Tamaños: `sm` (28px), `md` (36px), `lg` (64px) |
| `StatCard` | Número grande + label. Prop `accent` para fondo naranja |
| `CategoryBadge` | Categoría A–E con color propio |
| `StatusBadge` | Estado de copa: `upcoming`, `in_progress`, `completed` |
| `ResultBadge` | Resultado: `won`, `lost`, `draw`, `pending` |
| `MatchScore` | Marcador ATP: dos filas, avatar, checkmark ganador, scores por set. Props: `playersA/B: {name, avatarUrl?}[]`, `sets[]`, `winner` |
| `CupCountdown` | Countdown `DD:HH:MM:SS`. Client Component, solo se renderiza en cliente (evita hydration mismatch) |
| `AvatarUploader` | Crop circular con `react-easy-crop` + Canvas API (máx 512px JPEG) → POST a `/api/admin/upload-avatar`. Renderiza modal vía `createPortal` en `<body>` |

## Base de datos

Schema en `supabase/migrations/002_cups_model.sql`. Seed en `supabase/seed.sql`.
Migraciones se aplican manualmente en el SQL Editor de Supabase: https://supabase.com/dashboard/project/znyqmbghimxjtboctqik/sql

### Tablas

| Tabla | Descripción |
|-------|-------------|
| `players` | Jugadores: nombre, apodo, edad, peso, altura, categoría (A-E), ranking, avatar |
| `cups` | Copas mensuales: nombre, fecha, lugar, estado, equipos A/B, ganador |
| `cup_players` | Relación jugador ↔ copa con asignación de equipo (A o B) |
| `matches` | Partidos: tipo (singles/dobles), categoría, jugadores, ganador |
| `sets` | Sets individuales: juegos por equipo (máx 3 por partido) |

### Enums PostgreSQL
- `player_category`: `A | B | C | D | E`
- `cup_status`: `upcoming | in_progress | completed`
- `match_type`: `singles | doubles`

### RLS
- **Lectura pública** en todas las tablas (`SELECT` para `anon`)
- **Escritura**: solo via `SUPABASE_SERVICE_ROLE_KEY` en Server Actions (bypasea RLS)

## Queries principales (`src/lib/supabase/queries.ts`)

| Función | Descripción |
|---------|-------------|
| `getCups()` | Lista copas ordenadas por fecha desc |
| `getCupWithDetails(id)` | Copa completa: jugadores, partidos, sets, scores calculados |
| `getPlayers()` | Jugadores ordenados por ranking manual |
| `getPlayer(id)` | Un jugador por ID |
| `getPlayerRanking()` | Score = `matches_played + matches_won + cups_played + cups_won`. El campo `ranking` de la tabla es legacy — el score real se calcula en TypeScript |
| `getPlayerHistory(id)` | Perfil completo: historial por copa, compañeros y rivales |

## Server Actions (`src/lib/supabase/actions.ts`)

| Acción | Descripción |
|--------|-------------|
| `createPlayer / updatePlayer / deletePlayer` | CRUD jugadores |
| `createCup / updateCup / deleteCup` | CRUD copas |
| `assignPlayerToCup / removePlayerFromCup` | Gestión de equipos |
| `createMatch / deleteMatch` | Gestión de partidos |
| `saveSets(matchId, sets)` | Guarda sets → recalcula `winner_team` del partido y del ganador de la copa |

## Lógica de negocio

- **Ganador de partido**: quien gana más sets (ej: 2 de 3)
- **Ganador de copa**: quien gana más partidos
- Ambos se recalculan en `saveSets()`
- **Score de ranking**: `matches_played + matches_won + cups_played + cups_won`
- **Orden ranking**: score desc, desempate por apellido alfabético

## Tipos (`src/types/index.ts`)

- Base: `Player`, `Cup`, `CupPlayer`, `Match`, `Set`
- Compuestos: `CupWithDetails`, `MatchWithDetails`, `PlayerStats`, `PlayerHistory`, `PlayerCupHistory`
- Helpers: `playerFullName(p)`, `playerShortName(p)` (ej: "J. Pérez")
- `PlayerStats`: `matches_played`, `matches_won`, `matches_lost`, `cups_played`, `cups_won`, `score`, `rank_position`
- Variantes Insert/Update para cada entidad

## Design tokens

| Token | Valor | Uso |
|-------|-------|-----|
| `#CC4E0D` | Naranja | Acento, botones primarios, activo |
| `#1C1917` | Negro sepia | Texto principal |
| `#6B7280` | Gris | Texto secundario, placeholders |
| `#9CA3AF` | Gris claro | Texto muy muted (scores perdidos) |
| `#E5E7EB` | Gris claro | Bordes |
| `#F6F7F9` | Fondo | Background general |
| `#036039` | Verde | Éxito, ganador |
| `#B42318` | Rojo | Error, eliminar |
| `#FFF7F2` | Surface+ | Fondo cálido para highlights |

Bordes redondeados: `rounded-[10px]` (cards) y `rounded-[12px]` (formularios).
Fuentes: Inter (body), Oswald (headings).

## Layout components (`src/components/layout/`)

| Componente | Descripción |
|------------|-------------|
| `Navbar` | Header sticky con logo, nav links desktop y botón admin |
| `MobileNav` | Bottom nav flotante (`fixed bottom-4`, `md:hidden`) con Inicio/Copas/Jugadores/Reglamento |
| `Footer` | Footer en todas las páginas públicas: nombre del sitio, columnas Sitio y Más (incluye `/design-system`), copyright con año dinámico |

## Responsive / Mobile

- Mobile-first (375px+). Bottom nav fijo (`MobileNav`, `md:hidden`) con Inicio/Copas/Jugadores
- `Navbar` en mobile: oculta nav links y search input; muestra ícono de búsqueda que despliega input full-width
- `MatchScore`: padding y scores reducidos en mobile (`px-3 sm:px-4`, `w-5 sm:w-7`)
- `CupAdminClient`: header y grids stackean en mobile (`flex-col sm:flex-row`, `grid-cols-1 sm:grid-cols-2`)
