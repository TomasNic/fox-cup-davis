-- ============================================================
-- Copa Davis Fox — Tabla de configuración general (settings)
-- ============================================================

CREATE TABLE settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

-- Lectura pública
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_public_read" ON settings
  FOR SELECT TO anon USING (true);

-- Seed inicial
INSERT INTO settings (key, value) VALUES ('regulations', '');
