-- Agregar campo maps_url a cups para almacenar link de Google Maps
ALTER TABLE cups ADD COLUMN IF NOT EXISTS maps_url text;
