-- ============================================================
-- Copa Davis Fox — Datos de ejemplo
-- Ejecutar DESPUÉS de 002_cups_model.sql
-- ============================================================

-- --------------------------------
-- PLAYERS (10 jugadores)
-- --------------------------------
INSERT INTO players (id, first_name, last_name, nickname, age, weight_kg, height_cm, category, ranking, description) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Martín',    'López',    'El Toro',    32, 80.0, 180.0, 'A', 1,  'Líder del ranking. Juego agresivo desde el fondo.'),
  ('a1000000-0000-0000-0000-000000000002', 'Javier',    'Pérez',    'Javi',       28, 75.5, 178.0, 'A', 2,  'Gran saque y volea.'),
  ('a1000000-0000-0000-0000-000000000003', 'Carlos',    'Gómez',    'Carlitos',   35, 82.0, 175.0, 'B', 3,  'Especialista en dobles.'),
  ('a1000000-0000-0000-0000-000000000004', 'Rodrigo',   'García',   'Rodri',      29, 78.0, 182.0, 'B', 4,  'Consistente desde el fondo.'),
  ('a1000000-0000-0000-0000-000000000005', 'Diego',     'Torres',   'El Mago',    31, 70.0, 172.0, 'C', 5,  'Jugador técnico, buen slice.'),
  ('a1000000-0000-0000-0000-000000000006', 'Lucas',     'Ruiz',     'Luky',       26, 73.0, 177.0, 'C', 6,  'Rápido en la cancha.'),
  ('a1000000-0000-0000-0000-000000000007', 'Federico',  'Sánchez',  'Fede',       33, 85.0, 183.0, 'D', 7,  'Potencia desde el fondo.'),
  ('a1000000-0000-0000-0000-000000000008', 'Andrés',    'Martínez', 'Andy',       27, 69.0, 170.0, 'D', 8,  'Buen jugador de dobles.'),
  ('a1000000-0000-0000-0000-000000000009', 'Santiago',  'Morales',  'Santi',      30, 77.0, 179.0, 'E', 9,  'En desarrollo. Mejora constante.'),
  ('a1000000-0000-0000-0000-000000000010', 'Nicolás',   'Herrera',  'Nico',       24, 68.0, 174.0, 'E', 10, 'El más joven del grupo.');

-- --------------------------------
-- COPA 1: COMPLETADA (Marzo 2026)
-- Equipo Fox vs Equipo DJ
-- --------------------------------
INSERT INTO cups (id, name, location, date, status, team_a_name, team_b_name, winner_team) VALUES
  ('c1000000-0000-0000-0000-000000000001',
   'Copa Marzo 2026',
   'Club de Tenis Fox',
   '2026-03-15',
   'completed',
   'Equipo Fox',
   'Equipo DJ',
   'A');

-- Asignación de jugadores a equipos
INSERT INTO cup_players (cup_id, player_id, team) VALUES
  -- Equipo Fox (A): López, García, Torres, Martínez, Herrera
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'A'),
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000004', 'A'),
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000005', 'A'),
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000008', 'A'),
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000010', 'A'),
  -- Equipo DJ (B): Pérez, Gómez, Ruiz, Sánchez, Morales
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'B'),
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003', 'B'),
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000006', 'B'),
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000007', 'B'),
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000009', 'B');

-- Partidos de la copa completada
-- Singles Cat A: López vs Pérez → gana A (López) 6-4, 6-3
INSERT INTO matches (id, cup_id, type, category, team_a_player1_id, team_b_player1_id, winner_team) VALUES
  ('e1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'singles', 'A',
   'a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'A');
INSERT INTO sets (match_id, set_number, games_team_a, games_team_b) VALUES
  ('e1000000-0000-0000-0000-000000000001', 1, 6, 4),
  ('e1000000-0000-0000-0000-000000000001', 2, 6, 3);

-- Singles Cat B: García vs Gómez → gana B (Gómez) 3-6, 6-4, 6-3
INSERT INTO matches (id, cup_id, type, category, team_a_player1_id, team_b_player1_id, winner_team) VALUES
  ('e1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'singles', 'B',
   'a1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000003', 'B');
INSERT INTO sets (match_id, set_number, games_team_a, games_team_b) VALUES
  ('e1000000-0000-0000-0000-000000000002', 1, 3, 6),
  ('e1000000-0000-0000-0000-000000000002', 2, 6, 4),
  ('e1000000-0000-0000-0000-000000000002', 3, 3, 6);

-- Singles Cat C: Torres vs Ruiz → gana A (Torres) 6-2, 7-5
INSERT INTO matches (id, cup_id, type, category, team_a_player1_id, team_b_player1_id, winner_team) VALUES
  ('e1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'singles', 'C',
   'a1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000006', 'A');
INSERT INTO sets (match_id, set_number, games_team_a, games_team_b) VALUES
  ('e1000000-0000-0000-0000-000000000003', 1, 6, 2),
  ('e1000000-0000-0000-0000-000000000003', 2, 7, 5);

-- Singles Cat D: Martínez vs Sánchez → gana B (Sánchez) 4-6, 6-3, 6-4
INSERT INTO matches (id, cup_id, type, category, team_a_player1_id, team_b_player1_id, winner_team) VALUES
  ('e1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001', 'singles', 'D',
   'a1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000007', 'B');
INSERT INTO sets (match_id, set_number, games_team_a, games_team_b) VALUES
  ('e1000000-0000-0000-0000-000000000004', 1, 4, 6),
  ('e1000000-0000-0000-0000-000000000004', 2, 6, 3),
  ('e1000000-0000-0000-0000-000000000004', 3, 4, 6);

-- Singles Cat E: Herrera vs Morales → gana A (Herrera) 6-3, 6-4
INSERT INTO matches (id, cup_id, type, category, team_a_player1_id, team_b_player1_id, winner_team) VALUES
  ('e1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000001', 'singles', 'E',
   'a1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000009', 'A');
INSERT INTO sets (match_id, set_number, games_team_a, games_team_b) VALUES
  ('e1000000-0000-0000-0000-000000000005', 1, 6, 3),
  ('e1000000-0000-0000-0000-000000000005', 2, 6, 4);

-- Dobles 1: López+Torres vs Pérez+Gómez → gana A 7-5, 6-4
INSERT INTO matches (id, cup_id, type, category, team_a_player1_id, team_a_player2_id, team_b_player1_id, team_b_player2_id, winner_team) VALUES
  ('e1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000001', 'doubles', NULL,
   'a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000005',
   'a1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000003', 'A');
INSERT INTO sets (match_id, set_number, games_team_a, games_team_b) VALUES
  ('e1000000-0000-0000-0000-000000000006', 1, 7, 5),
  ('e1000000-0000-0000-0000-000000000006', 2, 6, 4);

-- Dobles 2: García+Martínez vs Ruiz+Sánchez → gana B 5-7, 6-3, 6-2
INSERT INTO matches (id, cup_id, type, category, team_a_player1_id, team_a_player2_id, team_b_player1_id, team_b_player2_id, winner_team) VALUES
  ('e1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000001', 'doubles', NULL,
   'a1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000008',
   'a1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000007', 'B');
INSERT INTO sets (match_id, set_number, games_team_a, games_team_b) VALUES
  ('e1000000-0000-0000-0000-000000000007', 1, 5, 7),
  ('e1000000-0000-0000-0000-000000000007', 2, 3, 6),
  ('e1000000-0000-0000-0000-000000000007', 3, 2, 6);

-- Resultado final copa: A ganó 4 partidos, B ganó 3 → winner_team = 'A' (ya insertado arriba)

-- --------------------------------
-- COPA 2: UPCOMING (Abril 2026)
-- --------------------------------
INSERT INTO cups (id, name, location, date, status, team_a_name, team_b_name) VALUES
  ('c1000000-0000-0000-0000-000000000002',
   'Copa Abril 2026',
   'Club de Tenis Fox',
   '2026-04-19',
   'upcoming',
   'Equipo Fox',
   'Equipo DJ');

-- Asignación tentativa (mismos equipos que marzo)
INSERT INTO cup_players (cup_id, player_id, team) VALUES
  ('c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'A'),
  ('c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000004', 'A'),
  ('c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000005', 'A'),
  ('c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000008', 'A'),
  ('c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000010', 'A'),
  ('c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', 'B'),
  ('c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000003', 'B'),
  ('c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000006', 'B'),
  ('c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000007', 'B'),
  ('c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000009', 'B');
