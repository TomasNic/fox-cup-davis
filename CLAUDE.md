# Copa Davis Fox — Documentación del Proyecto

## Descripción

Web app para registrar y visualizar los resultados del torneo de tenis **Copa Davis Fox**, jugado entre amigos al estilo Copa Davis. Permite ver el ranking de jugadores, copas mensuales con sus resultados, partidos (singles y dobles) con sets, y un panel admin para cargar toda la información.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14 (App Router, TypeScript) |
| Estilos | Tailwind CSS v4 (`@theme inline`) |
| Base de datos | Supabase (PostgreSQL) |
| Auth admin | Cookie httpOnly (`cdx_admin`), contraseña por env var |
| Fuentes | Oswald (títulos), Inter (cuerpo) vía Google Fonts |

## Design tokens

| Token | Valor | Uso |
|-------|-------|-----|
| `#CC4E0D` | Naranja | Acento, botones primarios, activo |
| `#1C1917` | Negro sepia | Texto principal |
| `#6B7280` | Gris | Texto secundario, placeholders |
| `#9CA3AF` | Gris claro | Texto muy muted (scores perdidos, sin resultado) |
| `#E5E7EB` | Gris claro | Bordes |
| `#F6F7F9` | Fondo | Background general |
| `#036039` | Verde | Éxito, ganador |
| `#B42318` | Rojo | Error, eliminar |
| `#FFF7F2` | Surface+ | Fondo cálido para highlights |

Bordes redondeados: `rounded-[10px]` (cards) y `rounded-[12px]` (formularios).

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=https://znyqmbghimxjtboctqik.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # Solo Server Actions — nunca al browser
ADMIN_PASSWORD=...              # Contraseña del usuario admin
```

## Autenticación admin

- Usuario: `admin` / Contraseña: definida en `ADMIN_PASSWORD`
- Cookie: `cdx_admin` (httpOnly, sameSite: lax, 24h)
- Login: POST `/api/admin/login` con `{ username, password }`
- Logout: POST `/api/admin/logout`
- Guard: `src/app/admin/(protected)/layout.tsx` llama `checkAdminSession()` y redirige a `/admin` si no hay sesión
- La página de login `/admin/page.tsx` está **fuera** del route group `(protected)` para evitar loop de redirección

## Rutas

### Públicas
| Ruta | Descripción |
|------|-------------|
| `/` | Redirige a `/dashboard` |
| `/dashboard` | Inicio: ranking top 5 + próxima copa con countdown + última copa |
| `/cups` | Lista de copas (más reciente primero) |
| `/cups/[id]` | Detalle de copa: equipos, partidos en grilla 3 columnas, marcador |
| `/players` | Ranking completo de jugadores con stats |
| `/players/[id]` | Perfil de jugador: stats, historial por copa, compañeros y rivales |
| `/jugadores` | Redirige a `/players` |
| `/ranking` | Redirige a `/players` |
| `/calendario` | Vista de calendario (pendiente conectar a DB) |
| `/design-system` | Showcase de todos los componentes UI |

### Admin (requiere sesión)
| Ruta | Descripción |
|------|-------------|
| `/admin` | Login admin |
| `/admin/dashboard` | Panel con métricas (jugadores, copas) |
| `/admin/players` | Lista de jugadores con editar/eliminar |
| `/admin/players/new` | Formulario nuevo jugador |
| `/admin/players/[id]/edit` | Formulario editar jugador |
| `/admin/cups` | Lista de copas |
| `/admin/cups/new` | Formulario nueva copa |
| `/admin/cups/[id]` | Gestión de copa: equipos, partidos, carga de sets |

### API Routes
| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/admin/login` | POST | `{ username, password }` → set cookie |
| `/api/admin/logout` | POST | Elimina cookie → redirige a `/admin` |

## Biblioteca de componentes UI (`src/components/ui/`)

Todos los componentes se exportan desde el barrel `src/components/ui/index.ts`.

| Componente | Descripción |
|------------|-------------|
| `Button` | Variantes: `primary` (default), `ghost`, `danger`. Tamaños: `sm`, `md`, `lg` |
| `Input` | Con `label`, `error`, `disabled`. Borde visible `border-2` para accesibilidad |
| `Select` | Prop `options: {value, label}[]`, `placeholder`, `label`, `error` |
| `Textarea` | Con `label`, `error`, `rows` |
| `Avatar` | Iniciales como fallback o `avatarUrl`. Tamaños: `sm`, `md`, `lg` |
| `StatCard` | Número grande + label. Prop `accent` para fondo naranja. Acepta `className` |
| `CategoryBadge` | Badge de categoría A–E con color propio |
| `StatusBadge` | Badge de estado de copa: `upcoming`, `in_progress`, `completed` |
| `ResultBadge` | Badge de resultado: `won`, `lost`, `draw`, `pending` |
| `MatchScore` | Marcador de partido estilo ATP: dos filas (una por equipo), avatar con iniciales, checkmark ganador, scores por set en columnas alineadas. Props: `playersA[]`, `playersB[]`, `sets[]`, `winner` |
| `CupCountdown` | Countdown a la próxima copa (`DD:HH:MM:SS`). Client Component con `setInterval`. Solo se renderiza en el cliente para evitar hydration mismatch. Se muestra únicamente si `status === "upcoming"` |

### Design system showcase
`/design-system` muestra todos los componentes con ejemplos reales, incluyendo colores, tipografía, botones, inputs, badges, avatares, stat cards, y match scores.

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx                        # redirect → /dashboard
│   ├── layout.tsx                      # Root layout (fuentes, metadata)
│   ├── globals.css                     # Tokens Tailwind v4 + @layer components
│   ├── design-system/page.tsx          # Showcase de componentes UI
│   ├── dashboard/page.tsx              # Server Component
│   ├── cups/
│   │   ├── page.tsx                    # Server Component
│   │   └── [id]/page.tsx              # Server Component — grilla 3 col de MatchScore
│   ├── players/
│   │   ├── page.tsx                    # Server Component
│   │   └── [id]/page.tsx              # Server Component
│   ├── jugadores/page.tsx              # redirect → /players
│   ├── ranking/page.tsx                # redirect → /players
│   ├── calendario/page.tsx             # Client Component (pendiente DB)
│   ├── admin/
│   │   ├── page.tsx                    # Login form (Client Component)
│   │   └── (protected)/               # Route group — layout con auth guard
│   │       ├── layout.tsx
│   │       ├── dashboard/page.tsx
│   │       ├── players/
│   │       │   ├── page.tsx
│   │       │   ├── DeletePlayerButton.tsx  # Client Component
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/edit/page.tsx
│   │       └── cups/
│   │           ├── page.tsx
│   │           ├── new/page.tsx
│   │           └── [id]/
│   │               ├── page.tsx            # Server wrapper
│   │               └── CupAdminClient.tsx  # Client Component (interactividad)
│   └── api/
│       └── admin/
│           ├── login/route.ts
│           └── logout/route.ts
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                  # Client Component (usePathname)
│   │   └── MobileNav.tsx               # Client Component (usePathname)
│   └── ui/
│       ├── index.ts                    # Barrel export
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Textarea.tsx
│       ├── Avatar.tsx
│       ├── StatCard.tsx
│       ├── Badge.tsx                   # CategoryBadge, StatusBadge, ResultBadge
│       ├── MatchScore.tsx
│       └── CupCountdown.tsx
├── lib/
│   ├── auth.ts                         # loginAdmin / logoutAdmin / checkAdminSession
│   └── supabase/
│       ├── client.ts                   # Browser client (anon key)
│       ├── server.ts                   # Server client (cookies)
│       ├── queries.ts                  # Funciones de lectura (Server Components)
│       └── actions.ts                  # Server Actions con service_role key
└── types/
    └── index.ts                        # Tipos del dominio + helpers
```

## Base de datos

Schema en `supabase/migrations/002_cups_model.sql`. Seed en `supabase/seed.sql`.

### Tablas

| Tabla | Descripción |
|-------|-------------|
| `players` | Jugadores: nombre, apodo, edad, peso, altura, categoría (A-E), ranking, avatar |
| `cups` | Copas mensuales: nombre, fecha, lugar, estado, equipos A/B, ganador |
| `cup_players` | Relación jugador ↔ copa con asignación de equipo (A o B) |
| `matches` | Partidos: tipo (singles/dobles), categoría (solo singles), jugadores, ganador |
| `sets` | Sets individuales: juegos por equipo (máx 3 sets por partido) |

### Enums PostgreSQL
- `player_category`: `A | B | C | D | E`
- `cup_status`: `upcoming | in_progress | completed`
- `match_type`: `singles | doubles`

### RLS
- **Lectura pública** en todas las tablas (política SELECT para `anon`)
- **Escritura**: solo via `SUPABASE_SERVICE_ROLE_KEY` en Server Actions (bypasea RLS automáticamente)

## Queries principales (`src/lib/supabase/queries.ts`)

| Función | Descripción |
|---------|-------------|
| `getCups()` | Lista copas ordenadas por fecha desc |
| `getCupWithDetails(id)` | Copa completa: jugadores, partidos con jugadores, sets, scores calculados |
| `getPlayers()` | Jugadores ordenados por ranking manual |
| `getPlayer(id)` | Un jugador por ID |
| `getPlayerRanking()` | Calcula score en TypeScript: `matches_played + matches_won + cups_played + cups_won`. Ordena por score desc, luego apellido |
| `getPlayerHistory(id)` | Perfil completo: historial por copa, compañeros y rivales frecuentes |

## Server Actions (`src/lib/supabase/actions.ts`)

Todas usan `adminClient()` (service_role) y llaman `revalidatePath()` al terminar.

| Acción | Descripción |
|--------|-------------|
| `createPlayer(data)` | Inserta jugador |
| `updatePlayer(id, data)` | Actualiza jugador |
| `deletePlayer(id)` | Elimina jugador → redirect `/admin/players` |
| `createCup(data)` | Crea copa → redirect `/admin/cups/[id]` |
| `updateCup(id, data)` | Actualiza copa |
| `assignPlayerToCup(cupId, playerId, team)` | Asigna jugador a equipo (upsert) |
| `removePlayerFromCup(cupId, playerId)` | Quita jugador de copa |
| `createMatch(data)` | Agrega partido a copa |
| `deleteMatch(matchId, cupId)` | Elimina partido |
| `saveSets(matchId, sets)` | Guarda sets → recalcula `winner_team` del partido y de la copa |

## Lógica de negocio

- **Ganador de partido**: quien gana más sets (ej: 2 de 3)
- **Ganador de copa**: quien gana más partidos
- Ambos se recalculan automáticamente en `saveSets()`
- **Score de jugador**: `matches_played + matches_won + cups_played + cups_won` (+1 por cada hito)
- **Ranking**: ordenado por `score` desc, desempate por apellido alfabético. El campo `ranking` en la tabla `players` es manual/legacy — el score real se calcula en TypeScript

## Tipos (`src/types/index.ts`)

Tipos base: `Player`, `Cup`, `CupPlayer`, `Match`, `Set`
Tipos compuestos: `CupWithDetails`, `MatchWithDetails`, `PlayerStats`, `PlayerHistory`, `PlayerCupHistory`
Helpers: `playerFullName(p)`, `playerShortName(p)` (ej: "J. Pérez")
Variantes Insert/Update para cada entidad.

## Comandos

```bash
npm run dev       # Servidor de desarrollo en localhost:3000
npm run build     # Build de producción
npm run start     # Servidor de producción
```

## Migraciones SQL

Las migraciones se aplican manualmente en el SQL Editor de Supabase:
- Dashboard: https://supabase.com/dashboard/project/znyqmbghimxjtboctqik/sql
- Archivos: `supabase/migrations/002_cups_model.sql` y `supabase/seed.sql`
