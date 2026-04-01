// ============================================================
// Copa Davis Fox — Tipos del dominio (Fase 2)
// ============================================================

export type PlayerCategory = "A" | "B" | "C" | "D" | "E";
export type CupStatus      = "upcoming" | "in_progress" | "completed";
export type MatchType      = "singles" | "doubles";
export type Team           = "A" | "B";

// --------------------------------
// Database (Supabase placeholder — reemplazar con gen types)
// --------------------------------
export type Database = {
  public: {
    Tables: {
      players:     { Row: Player;    Insert: PlayerInsert;    Update: PlayerUpdate    };
      cups:        { Row: Cup;       Insert: CupInsert;       Update: CupUpdate       };
      cup_players: { Row: CupPlayer; Insert: CupPlayerInsert; Update: CupPlayerUpdate };
      matches:     { Row: Match;     Insert: MatchInsert;     Update: MatchUpdate     };
      sets:        { Row: Set;       Insert: SetInsert;       Update: SetUpdate       };
    };
  };
};

// --------------------------------
// PLAYER
// --------------------------------
export interface Player {
  id:          string;
  first_name:  string;
  last_name:   string;
  nickname:    string | null;
  age:         number | null;
  weight_kg:   number | null;
  height_cm:   number | null;
  category:    PlayerCategory;
  ranking:     number | null;    // posición manual del admin
  description: string | null;
  avatar_url:  string | null;
  created_at:  string;
}

export type PlayerInsert = Omit<Player, "id" | "created_at">;
export type PlayerUpdate = Partial<Omit<Player, "id" | "created_at">>;

// Nombre completo helper
export function playerFullName(p: Pick<Player, "first_name" | "last_name" | "nickname">): string {
  return p.nickname ? `${p.first_name} "${p.nickname}" ${p.last_name}` : `${p.first_name} ${p.last_name}`;
}

export function playerShortName(p: Pick<Player, "first_name" | "last_name">): string {
  return `${p.first_name[0]}. ${p.last_name}`;
}

// --------------------------------
// CUP
// --------------------------------
export interface Cup {
  id:           string;
  name:         string;
  location:     string | null;
  date:         string;           // ISO date string
  status:       CupStatus;
  team_a_name:  string;
  team_b_name:  string;
  winner_team:  Team | null;      // null = empate o no jugada
  created_at:   string;
}

export type CupInsert = Omit<Cup, "id" | "created_at">;
export type CupUpdate = Partial<Omit<Cup, "id" | "created_at">>;

// --------------------------------
// CUP_PLAYER
// --------------------------------
export interface CupPlayer {
  id:        string;
  cup_id:    string;
  player_id: string;
  team:      Team;
}

export type CupPlayerInsert = Omit<CupPlayer, "id">;
export type CupPlayerUpdate = Partial<Omit<CupPlayer, "id">>;

export interface CupPlayerWithPlayer extends CupPlayer {
  player: Player;
}

// --------------------------------
// MATCH
// --------------------------------
export interface Match {
  id:                    string;
  cup_id:                string;
  type:                  MatchType;
  category:              PlayerCategory | null;  // solo singles
  team_a_player1_id:     string;
  team_a_player2_id:     string | null;          // solo dobles
  team_b_player1_id:     string;
  team_b_player2_id:     string | null;          // solo dobles
  winner_team:           Team | null;
  created_at:            string;
}

export type MatchInsert = Omit<Match, "id" | "created_at">;
export type MatchUpdate = Partial<Omit<Match, "id" | "created_at">>;

// --------------------------------
// SET
// --------------------------------
export interface Set {
  id:           string;
  match_id:     string;
  set_number:   1 | 2 | 3;
  games_team_a: number;
  games_team_b: number;
}

export type SetInsert = Omit<Set, "id">;
export type SetUpdate = Partial<Omit<Set, "id">>;

// --------------------------------
// TIPOS COMPUESTOS (para vistas)
// --------------------------------

export interface MatchWithDetails extends Match {
  sets: Set[];
  team_a_player1?: Player;
  team_a_player2?: Player;
  team_b_player1?: Player;
  team_b_player2?: Player;
}

export interface CupWithDetails extends Cup {
  players_a: Player[];
  players_b: Player[];
  matches:   MatchWithDetails[];
  score_a:   number;  // partidos ganados equipo A
  score_b:   number;  // partidos ganados equipo B
}

// Stats calculadas para el ranking de jugadores
export interface PlayerStats {
  player:         Player;
  cups_played:    number;
  cups_won:       number;
  matches_played: number;
  matches_won:    number;
  matches_lost:   number;
  sets_won:       number;
  sets_lost:      number;
  score:          number;  // +1 partido jugado, +1 partido ganado, +1 torneo jugado, +1 torneo ganado
  rank_position:  number;  // calculado
}

// Historial de un jugador en una copa
export interface PlayerCupHistory {
  cup:        Cup;
  team:       Team;
  result:     "won" | "lost" | "draw" | "pending";
  matches:    MatchWithDetails[];
  won:        number;
  lost:       number;
}

export interface PlayerHistory {
  player:      Player;
  stats:       PlayerStats;
  cup_history: PlayerCupHistory[];
  teammates:   { player: Player; times: number }[];
  rivals:      { player: Player; times: number; wins: number }[];
}
