import { createClient } from "./server";
import type {
  Cup, CupWithDetails, CupPlayerWithPlayer,
  Match, MatchWithDetails, Set,
  Player, PlayerStats, PlayerHistory, PlayerCupHistory,
  Team,
} from "@/types";

// ----------------------------------------------------------------
// CUPS
// ----------------------------------------------------------------

export async function getCups(): Promise<Cup[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cups")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Cup[];
}

export async function getCupWithDetails(id: string): Promise<CupWithDetails | null> {
  const supabase = await createClient();

  // Copa
  const { data: cup, error: cupErr } = await supabase
    .from("cups")
    .select("*")
    .eq("id", id)
    .single();
  if (cupErr || !cup) return null;

  // Jugadores de la copa
  const { data: cupPlayers, error: cpErr } = await supabase
    .from("cup_players")
    .select("*, player:players(*)")
    .eq("cup_id", id);
  if (cpErr) throw new Error(cpErr.message);

  // Partidos de la copa
  const { data: matches, error: matchErr } = await supabase
    .from("matches")
    .select("*")
    .eq("cup_id", id)
    .order("created_at");
  if (matchErr) throw new Error(matchErr.message);

  // Sets de todos los partidos
  const matchIds = (matches as Match[]).map((m) => m.id);
  let sets: Set[] = [];
  if (matchIds.length > 0) {
    const { data: setsData, error: setsErr } = await supabase
      .from("sets")
      .select("*")
      .in("match_id", matchIds)
      .order("set_number");
    if (setsErr) throw new Error(setsErr.message);
    sets = setsData as Set[];
  }

  // IDs únicos de jugadores para enriquecer los partidos
  const playerIds = new globalThis.Set<string>();
  (matches as Match[]).forEach((m) => {
    playerIds.add(m.team_a_player1_id);
    playerIds.add(m.team_b_player1_id);
    if (m.team_a_player2_id) playerIds.add(m.team_a_player2_id);
    if (m.team_b_player2_id) playerIds.add(m.team_b_player2_id);
  });

  const { data: playersData } = await supabase
    .from("players")
    .select("*")
    .in("id", Array.from(playerIds));

  const playerMap: Record<string, Player> = {};
  ((playersData ?? []) as Player[]).forEach((p) => { playerMap[p.id] = p; });

  // Armar MatchWithDetails
  const matchesWithDetails: MatchWithDetails[] = (matches as Match[]).map((m) => ({
    ...m,
    sets: sets.filter((s) => s.match_id === m.id),
    team_a_player1: playerMap[m.team_a_player1_id],
    team_a_player2: m.team_a_player2_id ? playerMap[m.team_a_player2_id] : undefined,
    team_b_player1: playerMap[m.team_b_player1_id],
    team_b_player2: m.team_b_player2_id ? playerMap[m.team_b_player2_id] : undefined,
  }));

  const typed = cupPlayers as CupPlayerWithPlayer[];
  const players_a = typed.filter((cp) => cp.team === "A").map((cp) => cp.player);
  const players_b = typed.filter((cp) => cp.team === "B").map((cp) => cp.player);

  const score_a = matchesWithDetails.filter((m) => m.winner_team === "A").length;
  const score_b = matchesWithDetails.filter((m) => m.winner_team === "B").length;

  return {
    ...(cup as Cup),
    players_a,
    players_b,
    matches: matchesWithDetails,
    score_a,
    score_b,
  };
}

// ----------------------------------------------------------------
// PLAYERS
// ----------------------------------------------------------------

export async function getPlayers(): Promise<Player[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .order("ranking", { ascending: true, nullsFirst: false });
  if (error) throw new Error(error.message);
  return data as Player[];
}

export async function getPlayer(id: string): Promise<Player | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as Player;
}

// ----------------------------------------------------------------
// RANKING (calculado en TypeScript)
// Criterios: copas ganadas > partidos ganados > sets ganados > nombre
// ----------------------------------------------------------------
export async function getPlayerRanking(): Promise<PlayerStats[]> {
  const supabase = await createClient();

  const [{ data: players }, { data: cups }, { data: cupPlayers }, { data: matches }, { data: sets }] =
    await Promise.all([
      supabase.from("players").select("*"),
      supabase.from("cups").select("*"),
      supabase.from("cup_players").select("*"),
      supabase.from("matches").select("*"),
      supabase.from("sets").select("*"),
    ]);

  const cupMap: Record<string, Cup> = {};
  ((cups ?? []) as Cup[]).forEach((c) => { cupMap[c.id] = c; });

  const statsMap: Record<string, PlayerStats> = {};
  ((players ?? []) as Player[]).forEach((p) => {
    statsMap[p.id] = {
      player: p,
      cups_played: 0,
      cups_won: 0,
      matches_played: 0,
      matches_won: 0,
      matches_lost: 0,
      sets_won: 0,
      sets_lost: 0,
      score: 0,
      rank_position: 0,
    };
  });

  // Copas
  ((cupPlayers ?? []) as { cup_id: string; player_id: string; team: Team }[]).forEach((cp) => {
    const s = statsMap[cp.player_id];
    if (!s) return;
    const cup = cupMap[cp.cup_id];
    if (!cup) return;
    if (cup.status === "completed") {
      s.cups_played++;
      if (cup.winner_team === cp.team) s.cups_won++;
    }
  });

  // Construir mapa player → team por copa
  type CupTeamMap = Record<string, Record<string, Team>>; // cupId → playerId → team
  const cupTeamMap: CupTeamMap = {};
  ((cupPlayers ?? []) as { cup_id: string; player_id: string; team: Team }[]).forEach((cp) => {
    if (!cupTeamMap[cp.cup_id]) cupTeamMap[cp.cup_id] = {};
    cupTeamMap[cp.cup_id][cp.player_id] = cp.team;
  });

  // Sets por partido
  const setsByMatch: Record<string, { games_team_a: number; games_team_b: number }[]> = {};
  ((sets ?? []) as { match_id: string; games_team_a: number; games_team_b: number }[]).forEach((s) => {
    if (!setsByMatch[s.match_id]) setsByMatch[s.match_id] = [];
    setsByMatch[s.match_id].push(s);
  });

  // Partidos
  ((matches ?? []) as Match[]).forEach((m) => {
    const playerIds = [
      m.team_a_player1_id,
      m.team_a_player2_id,
      m.team_b_player1_id,
      m.team_b_player2_id,
    ].filter(Boolean) as string[];

    const matchSets = setsByMatch[m.id] ?? [];
    let sets_a = 0, sets_b = 0;
    matchSets.forEach((s) => {
      if (s.games_team_a > s.games_team_b) sets_a++;
      else if (s.games_team_b > s.games_team_a) sets_b++;
    });

    playerIds.forEach((pid) => {
      const s = statsMap[pid];
      if (!s) return;
      const playerTeam = pid === m.team_a_player1_id || pid === m.team_a_player2_id ? "A" : "B";
      if (m.winner_team) {
        s.matches_played++;
        if (m.winner_team === playerTeam) s.matches_won++;
        else s.matches_lost++;
      }
      // Sets
      if (playerTeam === "A") {
        s.sets_won  += sets_a;
        s.sets_lost += sets_b;
      } else {
        s.sets_won  += sets_b;
        s.sets_lost += sets_a;
      }
    });
  });

  // Calcular score: +1 partido jugado, +1 partido ganado, +1 torneo jugado, +1 torneo ganado
  Object.values(statsMap).forEach((s) => {
    s.score = s.matches_played + s.matches_won + s.cups_played + s.cups_won;
  });

  // Ordenar: score desc → partidos ganados desc → partidos jugados desc → apellido asc
  const sorted = Object.values(statsMap).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.matches_won !== a.matches_won) return b.matches_won - a.matches_won;
    if (b.matches_played !== a.matches_played) return b.matches_played - a.matches_played;
    return a.player.last_name.localeCompare(b.player.last_name);
  });

  sorted.forEach((s, i) => { s.rank_position = i + 1; });
  return sorted;
}

// ----------------------------------------------------------------
// HISTORIAL DE UN JUGADOR
// ----------------------------------------------------------------
export async function getPlayerHistory(id: string): Promise<PlayerHistory | null> {
  const supabase = await createClient();

  const player = await getPlayer(id);
  if (!player) return null;

  // Copas del jugador
  const { data: cupPlayersData } = await supabase
    .from("cup_players")
    .select("*, cup:cups(*)")
    .eq("player_id", id);

  if (!cupPlayersData) return null;

  // Partidos donde participó
  const { data: matchesA } = await supabase
    .from("matches")
    .select("*")
    .or(`team_a_player1_id.eq.${id},team_a_player2_id.eq.${id}`);
  const { data: matchesB } = await supabase
    .from("matches")
    .select("*")
    .or(`team_b_player1_id.eq.${id},team_b_player2_id.eq.${id}`);

  const allMatches = [...(matchesA ?? []), ...(matchesB ?? [])] as Match[];
  const matchIds = allMatches.map((m) => m.id);

  let allSets: Set[] = [];
  if (matchIds.length > 0) {
    const { data: setsData } = await supabase
      .from("sets")
      .select("*")
      .in("match_id", matchIds);
    allSets = (setsData ?? []) as Set[];
  }

  const setsByMatch: Record<string, Set[]> = {};
  allSets.forEach((s) => {
    if (!setsByMatch[s.match_id]) setsByMatch[s.match_id] = [];
    setsByMatch[s.match_id].push(s);
  });

  // IDs de jugadores únicos para los compañeros/rivales
  const allPlayerIds = new globalThis.Set<string>();
  allMatches.forEach((m) => {
    [m.team_a_player1_id, m.team_a_player2_id, m.team_b_player1_id, m.team_b_player2_id]
      .filter(Boolean)
      .forEach((pid) => allPlayerIds.add(pid as string));
  });
  allPlayerIds.delete(id);

  const { data: relatedPlayers } = await supabase
    .from("players")
    .select("*")
    .in("id", Array.from(allPlayerIds));

  const playerMap: Record<string, Player> = {};
  ((relatedPlayers ?? []) as Player[]).forEach((p) => { playerMap[p.id] = p; });

  // Agrupar partidos por copa
  const matchesByCup: Record<string, Match[]> = {};
  allMatches.forEach((m) => {
    if (!matchesByCup[m.cup_id]) matchesByCup[m.cup_id] = [];
    matchesByCup[m.cup_id].push(m);
  });

  // Historial de copas
  const cup_history: PlayerCupHistory[] = [];
  let total_cups_won = 0, total_cups_played = 0;
  let total_matches_won = 0, total_matches_lost = 0;
  let total_sets_won = 0, total_sets_lost = 0;

  const typed = cupPlayersData as { cup: Cup; team: Team }[];
  typed.forEach(({ cup, team }) => {
    if (cup.status !== "completed") {
      cup_history.push({ cup, team, result: "pending", matches: [], won: 0, lost: 0 });
      return;
    }
    total_cups_played++;
    const result: PlayerCupHistory["result"] =
      cup.winner_team === null ? "draw" :
      cup.winner_team === team ? "won" : "lost";
    if (result === "won") total_cups_won++;

    const cupMatches = matchesByCup[cup.id] ?? [];
    const matchesWithSets: MatchWithDetails[] = cupMatches.map((m) => ({
      ...m,
      sets: setsByMatch[m.id] ?? [],
      team_a_player1: playerMap[m.team_a_player1_id],
      team_a_player2: m.team_a_player2_id ? playerMap[m.team_a_player2_id] : undefined,
      team_b_player1: playerMap[m.team_b_player1_id],
      team_b_player2: m.team_b_player2_id ? playerMap[m.team_b_player2_id] : undefined,
    }));

    let won = 0, lost = 0;
    cupMatches.forEach((m) => {
      const playerTeam = m.team_a_player1_id === id || m.team_a_player2_id === id ? "A" : "B";
      if (m.winner_team === playerTeam) { won++; total_matches_won++; }
      else if (m.winner_team)           { lost++; total_matches_lost++; }

      const mSets = setsByMatch[m.id] ?? [];
      let sa = 0, sb = 0;
      mSets.forEach((s) => {
        if (s.games_team_a > s.games_team_b) sa++;
        else if (s.games_team_b > s.games_team_a) sb++;
      });
      if (playerTeam === "A") { total_sets_won += sa; total_sets_lost += sb; }
      else                    { total_sets_won += sb; total_sets_lost += sa; }
    });

    cup_history.push({ cup, team, result, matches: matchesWithSets, won, lost });
  });

  // Compañeros y rivales
  const teammateCount: Record<string, number> = {};
  const rivalCount: Record<string, number> = {};
  const rivalWins: Record<string, number> = {};
  const rivalLosses: Record<string, number> = {};

  allMatches.forEach((m) => {
    const playerTeam = m.team_a_player1_id === id || m.team_a_player2_id === id ? "A" : "B";
    const teammates = playerTeam === "A"
      ? [m.team_a_player1_id, m.team_a_player2_id]
      : [m.team_b_player1_id, m.team_b_player2_id];
    const rivals = playerTeam === "A"
      ? [m.team_b_player1_id, m.team_b_player2_id]
      : [m.team_a_player1_id, m.team_a_player2_id];

    teammates.filter((pid): pid is string => !!pid && pid !== id).forEach((pid) => {
      teammateCount[pid] = (teammateCount[pid] ?? 0) + 1;
    });
    rivals.filter((pid): pid is string => !!pid).forEach((pid) => {
      rivalCount[pid] = (rivalCount[pid] ?? 0) + 1;
      if (m.winner_team === playerTeam) rivalWins[pid] = (rivalWins[pid] ?? 0) + 1;
      else if (m.winner_team) rivalLosses[pid] = (rivalLosses[pid] ?? 0) + 1;
    });
  });

  const teammates = Object.entries(teammateCount)
    .map(([pid, times]) => ({ player: playerMap[pid], times }))
    .filter((x) => x.player)
    .sort((a, b) => b.times - a.times)
    .slice(0, 5);

  const rivals = Object.entries(rivalCount)
    .map(([pid, times]) => ({ player: playerMap[pid], times, wins: rivalWins[pid] ?? 0 }))
    .filter((x) => x.player)
    .sort((a, b) => b.times - a.times)
    .slice(0, 5);

  const matches_played = total_matches_won + total_matches_lost;
  const stats: PlayerStats = {
    player,
    cups_played:    total_cups_played,
    cups_won:       total_cups_won,
    matches_played,
    matches_won:    total_matches_won,
    matches_lost:   total_matches_lost,
    sets_won:       total_sets_won,
    sets_lost:      total_sets_lost,
    score:          matches_played + total_matches_won + total_cups_played + total_cups_won,
    rank_position:  0,
  };

  // Victim: rival al que más le ganaste (mínimo 1 victoria)
  const victimEntry = Object.entries(rivalWins)
    .filter(([, wins]) => wins > 0)
    .sort(([, a], [, b]) => b - a)[0];
  const victim = victimEntry && playerMap[victimEntry[0]]
    ? { player: playerMap[victimEntry[0]], wins: victimEntry[1] }
    : null;

  // Nemesis: rival que más veces te ganó (mínimo 1 derrota)
  const nemesisEntry = Object.entries(rivalLosses)
    .filter(([, losses]) => losses > 0)
    .sort(([, a], [, b]) => b - a)[0];
  const nemesis = nemesisEntry && playerMap[nemesisEntry[0]]
    ? { player: playerMap[nemesisEntry[0]], losses: nemesisEntry[1] }
    : null;

  return { player, stats, cup_history, teammates, rivals, victim, nemesis };
}

// ----------------------------------------------------------------
// SETTINGS
// ----------------------------------------------------------------

export async function getSetting(key: string): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("value").eq("key", key).single();
  return (data as { value: string } | null)?.value ?? "";
}
