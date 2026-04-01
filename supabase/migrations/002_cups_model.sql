-- ============================================================
-- Copa Davis Fox — Modelo de Copas (Fase 2)
-- Aplica DESPUÉS de 001_initial_schema.sql
-- O ejecutar desde cero en un proyecto limpio
-- ============================================================

-- --------------------------------
-- ENUMS
-- --------------------------------
CREATE TYPE player_category AS ENUM ('A','B','C','D','E');
CREATE TYPE cup_status      AS ENUM ('upcoming','in_progress','completed');
CREATE TYPE match_type      AS ENUM ('singles','doubles');

-- --------------------------------
-- PLAYERS
-- --------------------------------
CREATE TABLE players (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name   TEXT NOT NULL,
  last_name    TEXT NOT NULL,
  nickname     TEXT,
  age          INT,
  weight_kg    NUMERIC(5,1),
  height_cm    NUMERIC(5,1),
  category     player_category NOT NULL,
  ranking      INT,           -- posición asignada manualmente por el admin
  description  TEXT,
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------
-- CUPS
-- Una copa = un torneo mensual entre dos equipos
-- --------------------------------
CREATE TABLE cups (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,                        -- ej: "Copa Abril 2025"
  location     TEXT,                                 -- lugar físico
  date         DATE NOT NULL,
  status       cup_status NOT NULL DEFAULT 'upcoming',
  team_a_name  TEXT NOT NULL DEFAULT 'Equipo A',
  team_b_name  TEXT NOT NULL DEFAULT 'Equipo B',
  winner_team  TEXT CHECK (winner_team IN ('A','B')), -- null = empate o no jugada
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------
-- CUP_PLAYERS
-- Asignación de jugadores a equipos para cada copa
-- --------------------------------
CREATE TABLE cup_players (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cup_id     UUID NOT NULL REFERENCES cups(id) ON DELETE CASCADE,
  player_id  UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  team       TEXT NOT NULL CHECK (team IN ('A','B')),
  UNIQUE (cup_id, player_id)
);

-- --------------------------------
-- MATCHES
-- Cada partido dentro de una copa (singles o dobles)
-- Los jugadores se referencian directamente (sin tabla junction)
-- Singles: player1 de cada equipo
-- Dobles: player1 + player2 de cada equipo
-- --------------------------------
CREATE TABLE matches (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cup_id               UUID NOT NULL REFERENCES cups(id) ON DELETE CASCADE,
  type                 match_type NOT NULL,
  category             player_category,            -- solo para singles
  team_a_player1_id    UUID NOT NULL REFERENCES players(id),
  team_a_player2_id    UUID REFERENCES players(id), -- solo dobles
  team_b_player1_id    UUID NOT NULL REFERENCES players(id),
  team_b_player2_id    UUID REFERENCES players(id), -- solo dobles
  winner_team          TEXT CHECK (winner_team IN ('A','B')), -- calculado al cargar sets
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------
-- SETS
-- Un partido tiene 2 o 3 sets. El ganador = quien gana más sets.
-- --------------------------------
CREATE TABLE sets (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id     UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  set_number   INT NOT NULL CHECK (set_number BETWEEN 1 AND 3),
  games_team_a INT NOT NULL DEFAULT 0 CHECK (games_team_a >= 0),
  games_team_b INT NOT NULL DEFAULT 0 CHECK (games_team_b >= 0),
  UNIQUE (match_id, set_number)
);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX ON cups        (date DESC);
CREATE INDEX ON cups        (status);
CREATE INDEX ON cup_players (cup_id);
CREATE INDEX ON cup_players (player_id);
CREATE INDEX ON matches     (cup_id);
CREATE INDEX ON sets        (match_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- Lectura pública en todo.
-- Escritura solo desde el servidor (service_role key),
-- NO se expone al browser — se hace via Server Actions.
-- ============================================================
ALTER TABLE players     ENABLE ROW LEVEL SECURITY;
ALTER TABLE cups        ENABLE ROW LEVEL SECURITY;
ALTER TABLE cup_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches     ENABLE ROW LEVEL SECURITY;
ALTER TABLE sets        ENABLE ROW LEVEL SECURITY;

-- Lectura pública
CREATE POLICY "players: lectura pública"     ON players     FOR SELECT USING (TRUE);
CREATE POLICY "cups: lectura pública"        ON cups        FOR SELECT USING (TRUE);
CREATE POLICY "cup_players: lectura pública" ON cup_players FOR SELECT USING (TRUE);
CREATE POLICY "matches: lectura pública"     ON matches     FOR SELECT USING (TRUE);
CREATE POLICY "sets: lectura pública"        ON sets        FOR SELECT USING (TRUE);

-- Escritura: solo service_role (desde Server Actions en Next.js)
-- El service_role bypasea RLS automáticamente en Supabase.
-- No se necesita política adicional para escritura.
