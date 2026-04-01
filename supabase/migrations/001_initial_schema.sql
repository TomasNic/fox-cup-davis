-- ============================================================
-- Copa Davis Fox — Esquema inicial de base de datos
-- Aplicar en Supabase SQL Editor o con: npx supabase db push
-- ============================================================

-- --------------------------------
-- EXTENSIONES
-- --------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- --------------------------------
-- PROFILES
-- Extiende auth.users con nombre, avatar y rol
-- --------------------------------
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name        TEXT,
  avatar_url  TEXT,
  role        TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'viewer')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- --------------------------------
-- PLAYERS
-- Jugadores del torneo
-- --------------------------------
CREATE TABLE players (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  country     TEXT NOT NULL DEFAULT 'ARG',
  avatar_url  TEXT,
  bio         TEXT,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------
-- TOURNAMENTS
-- Ediciones del torneo (Fox DJ Open Edición 5, 6, etc.)
-- --------------------------------
CREATE TABLE tournaments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,           -- "Fox DJ Open"
  edition     INT  NOT NULL,           -- 5, 6, 7...
  start_date  DATE,
  end_date    DATE,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'upcoming'
                CHECK (status IN ('upcoming', 'active', 'finished')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------
-- MATCHES
-- Partidos del torneo
-- --------------------------------
CREATE TABLE matches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id   UUID REFERENCES tournaments(id) ON DELETE SET NULL,
  round           TEXT,                -- 'Grupo' | 'Cuartos de Final' | 'Semifinal' | 'Final'
  format          TEXT NOT NULL CHECK (format IN ('singles', 'doubles')),
  scheduled_at    TIMESTAMPTZ,
  duration_min    INT,                 -- duración estimada en minutos
  court           TEXT,
  status          TEXT NOT NULL DEFAULT 'scheduled'
                    CHECK (status IN ('scheduled', 'live', 'finished', 'cancelled')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------
-- MATCH_PLAYERS
-- Vincula jugadores a un partido (team A vs team B)
-- Singles: 1 jugador por equipo | Dobles: 2 jugadores por equipo
-- --------------------------------
CREATE TABLE match_players (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id    UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  player_id   UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  team        TEXT NOT NULL CHECK (team IN ('A', 'B')),
  UNIQUE (match_id, player_id)
);

-- --------------------------------
-- MATCH_RESULTS
-- Resultado de un partido finalizado
-- --------------------------------
CREATE TABLE match_results (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id        UUID UNIQUE NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  winner_team     TEXT NOT NULL CHECK (winner_team IN ('A', 'B')),
  score           TEXT,                -- Texto libre: "6-3, 7-5" o "6-4, 3-6, 7-6"
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------
-- RANKINGS
-- Snapshot de ranking por formato de juego
-- Se actualiza manualmente o mediante trigger tras cargar resultados
-- --------------------------------
CREATE TABLE rankings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id   UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  format      TEXT NOT NULL CHECK (format IN ('general', 'singles', 'doubles')),
  points      INT  NOT NULL DEFAULT 0,
  position    INT  NOT NULL,
  trend       INT  NOT NULL DEFAULT 0,  -- +1 subió, -1 bajó, 0 sin cambio
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (player_id, format)
);

-- --------------------------------
-- NEWS
-- Noticias y novedades del torneo
-- --------------------------------
CREATE TABLE news (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  content     TEXT,
  image_url   TEXT,
  tag         TEXT CHECK (tag IN ('Resultado', 'Torneo', 'Jugador', 'General')),
  published   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by  UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX ON rankings (format, position);
CREATE INDEX ON matches (tournament_id, scheduled_at);
CREATE INDEX ON matches (status);
CREATE INDEX ON news (published, created_at DESC);
CREATE INDEX ON match_players (match_id);
CREATE INDEX ON match_players (player_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE players       ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches       ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE rankings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE news          ENABLE ROW LEVEL SECURITY;

-- Helper: verifica si el usuario autenticado tiene rol admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ---- profiles ----
-- Cada usuario ve y edita solo su propio perfil
CREATE POLICY "profiles: lectura propia"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "profiles: edición propia"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- ---- players ----
-- Lectura pública, escritura solo admin
CREATE POLICY "players: lectura pública"
  ON players FOR SELECT
  USING (TRUE);

CREATE POLICY "players: escritura admin"
  ON players FOR ALL
  USING (is_admin());

-- ---- tournaments ----
CREATE POLICY "tournaments: lectura pública"
  ON tournaments FOR SELECT
  USING (TRUE);

CREATE POLICY "tournaments: escritura admin"
  ON tournaments FOR ALL
  USING (is_admin());

-- ---- matches ----
CREATE POLICY "matches: lectura pública"
  ON matches FOR SELECT
  USING (TRUE);

CREATE POLICY "matches: escritura admin"
  ON matches FOR ALL
  USING (is_admin());

-- ---- match_players ----
CREATE POLICY "match_players: lectura pública"
  ON match_players FOR SELECT
  USING (TRUE);

CREATE POLICY "match_players: escritura admin"
  ON match_players FOR ALL
  USING (is_admin());

-- ---- match_results ----
CREATE POLICY "match_results: lectura pública"
  ON match_results FOR SELECT
  USING (TRUE);

CREATE POLICY "match_results: escritura admin"
  ON match_results FOR ALL
  USING (is_admin());

-- ---- rankings ----
CREATE POLICY "rankings: lectura pública"
  ON rankings FOR SELECT
  USING (TRUE);

CREATE POLICY "rankings: escritura admin"
  ON rankings FOR ALL
  USING (is_admin());

-- ---- news ----
-- Lectura pública solo para noticias publicadas; admin ve todas
CREATE POLICY "news: lectura pública"
  ON news FOR SELECT
  USING (published = TRUE OR is_admin());

CREATE POLICY "news: escritura admin"
  ON news FOR ALL
  USING (is_admin());
