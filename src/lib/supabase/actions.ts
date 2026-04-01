"use server";

import { createClient as createServiceClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type {
  PlayerInsert, PlayerUpdate,
  CupInsert, CupUpdate,
  MatchInsert, Team,
} from "@/types";

// Service role client — bypasea RLS, solo se usa en Server Actions
function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY no configurada");
  return createServiceClient(url, key);
}

// ----------------------------------------------------------------
// PLAYERS
// ----------------------------------------------------------------

export async function createPlayer(data: PlayerInsert) {
  const supabase = adminClient();
  const { error } = await supabase.from("players").insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/players");
  revalidatePath("/dashboard");
}

export async function updatePlayer(id: string, data: PlayerUpdate) {
  const supabase = adminClient();
  const { error } = await supabase.from("players").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/players");
  revalidatePath(`/players/${id}`);
  revalidatePath("/dashboard");
}

export async function deletePlayer(id: string) {
  const supabase = adminClient();
  const { error } = await supabase.from("players").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/players");
  revalidatePath("/dashboard");
  redirect("/admin/players");
}

// ----------------------------------------------------------------
// CUPS
// ----------------------------------------------------------------

export async function createCup(data: CupInsert) {
  const supabase = adminClient();
  const { data: cup, error } = await supabase
    .from("cups")
    .insert(data)
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/cups");
  revalidatePath("/dashboard");
  redirect(`/admin/cups/${cup.id}`);
}

export async function updateCup(id: string, data: CupUpdate) {
  const supabase = adminClient();
  const { error } = await supabase.from("cups").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/cups");
  revalidatePath(`/cups/${id}`);
  revalidatePath("/dashboard");
}

// ----------------------------------------------------------------
// CUP PLAYERS
// ----------------------------------------------------------------

export async function assignPlayerToCup(cupId: string, playerId: string, team: Team) {
  const supabase = adminClient();
  const { error } = await supabase
    .from("cup_players")
    .upsert({ cup_id: cupId, player_id: playerId, team }, { onConflict: "cup_id,player_id" });
  if (error) throw new Error(error.message);
  revalidatePath(`/cups/${cupId}`);
  revalidatePath(`/admin/cups/${cupId}`);
}

export async function removePlayerFromCup(cupId: string, playerId: string) {
  const supabase = adminClient();
  const { error } = await supabase
    .from("cup_players")
    .delete()
    .eq("cup_id", cupId)
    .eq("player_id", playerId);
  if (error) throw new Error(error.message);
  revalidatePath(`/cups/${cupId}`);
  revalidatePath(`/admin/cups/${cupId}`);
}

// ----------------------------------------------------------------
// MATCHES
// ----------------------------------------------------------------

export async function createMatch(data: MatchInsert) {
  const supabase = adminClient();
  const { error } = await supabase.from("matches").insert(data);
  if (error) throw new Error(error.message);
  revalidatePath(`/cups/${data.cup_id}`);
  revalidatePath(`/admin/cups/${data.cup_id}`);
}

export async function deleteMatch(matchId: string, cupId: string) {
  const supabase = adminClient();
  const { error } = await supabase.from("matches").delete().eq("id", matchId);
  if (error) throw new Error(error.message);
  revalidatePath(`/cups/${cupId}`);
  revalidatePath(`/admin/cups/${cupId}`);
}

// ----------------------------------------------------------------
// SETS — guarda todos los sets de un partido y recalcula ganadores
// ----------------------------------------------------------------

export async function saveSets(
  matchId: string,
  setsData: { set_number: 1 | 2 | 3; games_team_a: number; games_team_b: number }[]
) {
  const supabase = adminClient();

  // Borrar sets anteriores
  await supabase.from("sets").delete().eq("match_id", matchId);

  // Insertar sets nuevos
  if (setsData.length > 0) {
    const { error } = await supabase.from("sets").insert(
      setsData.map((s) => ({ ...s, match_id: matchId }))
    );
    if (error) throw new Error(error.message);
  }

  // Calcular ganador del partido (más sets ganados)
  let sets_a = 0, sets_b = 0;
  setsData.forEach((s) => {
    if (s.games_team_a > s.games_team_b) sets_a++;
    else if (s.games_team_b > s.games_team_a) sets_b++;
  });

  const matchWinner: Team | null =
    sets_a > sets_b ? "A" : sets_b > sets_a ? "B" : null;

  const { data: matchRow, error: matchErr } = await supabase
    .from("matches")
    .update({ winner_team: matchWinner })
    .eq("id", matchId)
    .select("cup_id")
    .single();

  if (matchErr) throw new Error(matchErr.message);

  // Recalcular ganador de la copa
  const cupId = matchRow.cup_id;
  await recalculateCupWinner(cupId);

  revalidatePath(`/cups/${cupId}`);
  revalidatePath(`/admin/cups/${cupId}`);
  revalidatePath("/dashboard");
}

// ----------------------------------------------------------------
// Helper — recalcula winner_team en la copa según partidos ganados
// ----------------------------------------------------------------
async function recalculateCupWinner(cupId: string) {
  const supabase = adminClient();

  const { data: matches } = await supabase
    .from("matches")
    .select("winner_team")
    .eq("cup_id", cupId);

  if (!matches) return;

  let score_a = 0, score_b = 0;
  matches.forEach((m: { winner_team: string | null }) => {
    if (m.winner_team === "A") score_a++;
    else if (m.winner_team === "B") score_b++;
  });

  // Solo marcar ganador si hay al menos 1 partido con resultado
  const cupWinner: Team | null =
    score_a === 0 && score_b === 0 ? null :
    score_a > score_b ? "A" :
    score_b > score_a ? "B" : null;

  await supabase
    .from("cups")
    .update({ winner_team: cupWinner })
    .eq("id", cupId);
}
