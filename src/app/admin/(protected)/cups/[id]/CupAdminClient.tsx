"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  assignPlayerToCup, removePlayerFromCup,
  createMatch, saveSets, updateCup, deleteCup,
} from "@/lib/supabase/actions";
import type { CupWithDetails, Player, MatchWithDetails, Team, PlayerCategory, MatchType } from "@/types";
import { playerShortName } from "@/types";
import MatchScore from "@/components/ui/MatchScore";

// ---- Sets Editor ----
function SetsEditor({ match, labelA, labelB, onSaved }: { match: MatchWithDetails; labelA: string; labelB: string; onSaved: () => void }) {
  const [sets, setSets] = useState<{ set_number: 1|2|3; games_team_a: number; games_team_b: number }[]>(
    match.sets.length > 0
      ? match.sets.map((s) => ({ set_number: s.set_number as 1|2|3, games_team_a: s.games_team_a, games_team_b: s.games_team_b }))
      : [{ set_number: 1, games_team_a: 0, games_team_b: 0 }, { set_number: 2, games_team_a: 0, games_team_b: 0 }]
  );
  const [isPending, startTransition] = useTransition();

  function updateSet(i: number, field: "games_team_a" | "games_team_b", value: number) {
    setSets((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  }

  function addSet() {
    if (sets.length >= 3) return;
    setSets((prev) => [...prev, { set_number: (prev.length + 1) as 1|2|3, games_team_a: 0, games_team_b: 0 }]);
  }

  function removeLastSet() {
    if (sets.length <= 2) return;
    setSets((prev) => prev.slice(0, -1));
  }

  function handleSave() {
    startTransition(async () => {
      await saveSets(match.id, sets);
      onSaved();
    });
  }

  return (
    <div className="mt-2 space-y-2 bg-[#F6F7F9] rounded-md p-3">
      <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-[#6B7280] text-center mb-1">
        <span>Set</span><span className="truncate">{labelA}</span><span className="truncate">{labelB}</span>
      </div>
      {sets.map((s, i) => (
        <div key={i} className="grid grid-cols-3 gap-2 items-center">
          <span className="text-xs text-center text-[#6B7280]">Set {i + 1}</span>
          <input type="number" min="0" max="99" value={s.games_team_a}
            onChange={(e) => updateSet(i, "games_team_a", Number(e.target.value))}
            className="field-sm text-center w-full" />
          <input type="number" min="0" max="99" value={s.games_team_b}
            onChange={(e) => updateSet(i, "games_team_b", Number(e.target.value))}
            className="field-sm text-center w-full" />
        </div>
      ))}
      <div className="flex gap-2 pt-1">
        {sets.length < 3 && (
          <button onClick={addSet} type="button" className="btn-ghost text-xs">+ Set {sets.length + 1}</button>
        )}
        {sets.length > 2 && (
          <button onClick={removeLastSet} type="button" className="btn-danger text-xs">- Quitar set</button>
        )}
        <button onClick={handleSave} disabled={isPending} type="button"
          className="btn-primary ml-auto px-3 py-1.5 text-xs">
          {isPending ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
}

// ---- Main Page ----
interface Props {
  cup: CupWithDetails;
  allPlayers: Player[];
}

export default function AdminCupDetailClient({ cup, allPlayers }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

  const assignedIds = new Set([...cup.players_a.map((p) => p.id), ...cup.players_b.map((p) => p.id)]);
  const unassigned  = allPlayers.filter((p) => !assignedIds.has(p.id));

  const [addPlayerTeam, setAddPlayerTeam] = useState<Team>("A");
  const [addPlayerId, setAddPlayerId]     = useState("");

  const [mapsUrl, setMapsUrl] = useState(cup.maps_url ?? "");
  const [date, setDate] = useState(cup.date);
  const [matchType,     setMatchType]     = useState<MatchType>("singles");
  const [matchCategory, setMatchCategory] = useState<PlayerCategory>("A");
  const [playerA1, setPlayerA1] = useState("");
  const [playerA2, setPlayerA2] = useState("");
  const [playerB1, setPlayerB1] = useState("");
  const [playerB2, setPlayerB2] = useState("");

  function refresh() { startTransition(() => { router.refresh(); }); }

  async function handleAssign() {
    if (!addPlayerId) return;
    await assignPlayerToCup(cup.id, addPlayerId, addPlayerTeam);
    setAddPlayerId("");
    refresh();
  }

  async function handleCreateMatch() {
    if (!playerA1 || !playerB1) return;
    await createMatch({
      cup_id: cup.id,
      type: matchType,
      category: matchType === "singles" ? matchCategory : null,
      team_a_player1_id: playerA1,
      team_a_player2_id: matchType === "doubles" && playerA2 ? playerA2 : null,
      team_b_player1_id: playerB1,
      team_b_player2_id: matchType === "doubles" && playerB2 ? playerB2 : null,
      winner_team: null,
    });
    setPlayerA1(""); setPlayerA2(""); setPlayerB1(""); setPlayerB2("");
    refresh();
  }

  async function handleStatusChange(status: string) {
    await updateCup(cup.id, { status: status as "upcoming" | "in_progress" | "completed" });
    refresh();
  }

  const singles = cup.matches.filter((m) => m.type === "singles");
  const doubles = cup.matches.filter((m) => m.type === "doubles");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <Link href="/admin/cups" className="text-xs text-[#6B7280] hover:text-[#CC4E0D]">← Copas</Link>
          <h1 className="text-2xl font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917] mt-1">{cup.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <label className="text-xs text-[#6B7280]">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="field-sm text-sm"
            />
            <button
              type="button"
              onClick={() => updateCup(cup.id, { date }).then(refresh)}
              className="btn-primary px-3 py-1 text-xs"
            >
              Guardar
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select value={cup.status} onChange={(e) => handleStatusChange(e.target.value)}
            className="field-sm">
            <option value="upcoming">Próximamente</option>
            <option value="in_progress">En curso</option>
            <option value="completed">Finalizada</option>
          </select>
          <button
            type="button"
            onClick={() => {
              if (!confirm(`¿Eliminar "${cup.name}"? Esta acción no se puede deshacer.`)) return;
              startTransition(() => deleteCup(cup.id));
            }}
            disabled={isPending}
            className="btn-danger text-sm disabled:opacity-50"
          >
            Eliminar copa
          </button>
        </div>
      </div>

      {/* Score */}
      <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-5 flex justify-around text-center">
        <div>
          <p className="font-bold text-[#1C1917]">{cup.team_a_name}</p>
          <p className="text-4xl font-bold font-[var(--font-oswald)] text-[#CC4E0D]">{cup.score_a}</p>
        </div>
        <div className="text-[#6B7280] text-sm self-center">partidos</div>
        <div>
          <p className="font-bold text-[#1C1917]">{cup.team_b_name}</p>
          <p className="text-4xl font-bold font-[var(--font-oswald)] text-[#CC4E0D]">{cup.score_b}</p>
        </div>
      </div>

      {/* Google Maps */}
      <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-5">
        <h2 className="font-bold text-sm font-[var(--font-oswald)] uppercase text-[#1C1917] mb-3">Ubicación</h2>
        <div className="flex gap-2">
          <textarea
            value={mapsUrl}
            onChange={(e) => setMapsUrl(e.target.value)}
            placeholder='Pegar iframe de Google Maps (ej: <iframe src="https://www.google.com/maps/embed?..." ...></iframe>)'
            rows={2}
            className="field-sm flex-1 resize-none text-xs"
          />
          <button
            type="button"
            onClick={() => {
              const url = mapsUrl.trim() || null;
              updateCup(cup.id, { maps_url: url }).then(refresh);
            }}
            className="btn-primary px-4 py-1.5 text-sm"
          >
            Guardar
          </button>
        </div>
        {cup.maps_url && (
          <p className="text-xs text-[#6B7280] mt-2 truncate">
            Actual: <a href={cup.maps_url} target="_blank" rel="noopener noreferrer" className="text-[#CC4E0D] hover:underline">{cup.maps_url}</a>
          </p>
        )}
      </div>

      {/* Asignar jugadores */}
      <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-5">
        <h2 className="font-bold text-sm font-[var(--font-oswald)] uppercase text-[#1C1917] mb-4">Equipos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {(["A", "B"] as Team[]).map((team) => {
            const teamPlayers = team === "A" ? cup.players_a : cup.players_b;
            const teamName    = team === "A" ? cup.team_a_name : cup.team_b_name;
            return (
              <div key={team}>
                <p className="text-xs font-bold text-[#6B7280] uppercase mb-2">{teamName}</p>
                {teamPlayers.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 py-1">
                    <span className="text-sm text-[#1C1917]">{playerShortName(p)}</span>
                    <span className="text-xs text-[#6B7280]">Cat.{p.category}</span>
                    <button onClick={() => { removePlayerFromCup(cup.id, p.id).then(refresh); }}
                      className="btn-danger ml-auto text-xs">×</button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        {unassigned.length > 0 && (
          <div className="flex gap-2 pt-3 border-t border-[#E5E7EB]">
            <select value={addPlayerId} onChange={(e) => setAddPlayerId(e.target.value)}
              className="field-sm flex-1">
              <option value="">Seleccionar jugador...</option>
              {unassigned.map((p) => <option key={p.id} value={p.id}>{playerShortName(p)} (Cat.{p.category})</option>)}
            </select>
            <select value={addPlayerTeam} onChange={(e) => setAddPlayerTeam(e.target.value as Team)}
              className="field-sm">
              <option value="A">{cup.team_a_name}</option>
              <option value="B">{cup.team_b_name}</option>
            </select>
            <button onClick={handleAssign} className="btn-primary px-4 py-1.5">
              Agregar
            </button>
          </div>
        )}
      </div>

      {/* Crear partido */}
      <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-5">
        <h2 className="font-bold text-sm font-[var(--font-oswald)] uppercase text-[#1C1917] mb-4">Nuevo Partido</h2>
        <div className="space-y-3">
          <div className="flex gap-3 items-center">
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input type="radio" name="mtype" value="singles" checked={matchType === "singles"} onChange={() => setMatchType("singles")} /> Singles
            </label>
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input type="radio" name="mtype" value="doubles" checked={matchType === "doubles"} onChange={() => setMatchType("doubles")} /> Dobles
            </label>
            {matchType === "singles" && (
              <select value={matchCategory} onChange={(e) => setMatchCategory(e.target.value as PlayerCategory)}
                className="field-sm">
                {(["A","B","C","D","E"] as PlayerCategory[]).map((c) => <option key={c} value={c}>Cat. {c}</option>)}
              </select>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-[#6B7280] mb-1">{cup.team_a_name}</p>
              <select value={playerA1} onChange={(e) => setPlayerA1(e.target.value)}
                className="field-sm w-full">
                <option value="">Jugador 1...</option>
                {cup.players_a.map((p) => <option key={p.id} value={p.id}>{playerShortName(p)}</option>)}
              </select>
              {matchType === "doubles" && (
                <select value={playerA2} onChange={(e) => setPlayerA2(e.target.value)}
                  className="field-sm w-full mt-1">
                  <option value="">Jugador 2...</option>
                  {cup.players_a.filter((p) => p.id !== playerA1).map((p) => <option key={p.id} value={p.id}>{playerShortName(p)}</option>)}
                </select>
              )}
            </div>
            <div>
              <p className="text-xs text-[#6B7280] mb-1">{cup.team_b_name}</p>
              <select value={playerB1} onChange={(e) => setPlayerB1(e.target.value)}
                className="field-sm w-full">
                <option value="">Jugador 1...</option>
                {cup.players_b.map((p) => <option key={p.id} value={p.id}>{playerShortName(p)}</option>)}
              </select>
              {matchType === "doubles" && (
                <select value={playerB2} onChange={(e) => setPlayerB2(e.target.value)}
                  className="field-sm w-full mt-1">
                  <option value="">Jugador 2...</option>
                  {cup.players_b.filter((p) => p.id !== playerB1).map((p) => <option key={p.id} value={p.id}>{playerShortName(p)}</option>)}
                </select>
              )}
            </div>
          </div>
          <button onClick={handleCreateMatch} disabled={!playerA1 || !playerB1 || isPending}
            className="btn-primary px-5 py-2">
            Agregar partido
          </button>
        </div>
      </div>

      {/* Partidos con editor de sets */}
      {(singles.length > 0 || doubles.length > 0) && (
        <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-5">
          <h2 className="font-bold text-sm font-[var(--font-oswald)] uppercase text-[#1C1917] mb-4">Resultados</h2>
          {[...singles, ...doubles].map((m: MatchWithDetails) => {
            const pA = [m.team_a_player1, m.team_a_player2].filter(Boolean) as Player[];
            const pB = [m.team_b_player1, m.team_b_player2].filter(Boolean) as Player[];
            const label = m.type === "singles" ? `Singles Cat. ${m.category}` : "Dobles";
            const sets = (m.sets ?? [])
              .sort((a, b) => a.set_number - b.set_number)
              .map((s) => ({ games_a: s.games_team_a, games_b: s.games_team_b }));
            return (
              <div key={m.id} className="border-b border-[#E5E7EB] py-3 last:border-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs text-[#6B7280] font-semibold">{label}</span>
                  <button
                    type="button"
                    onClick={() => setExpandedMatch(expandedMatch === m.id ? null : m.id)}
                    className="ml-auto text-[#CC4E0D] text-xs font-semibold hover:underline"
                  >
                    {expandedMatch === m.id ? "Cerrar editor ▲" : "Editar sets ▼"}
                  </button>
                </div>
                <MatchScore
                  playersA={pA.map((p) => ({ name: playerShortName(p), avatarUrl: p.avatar_url }))}
                  playersB={pB.map((p) => ({ name: playerShortName(p), avatarUrl: p.avatar_url }))}
                  sets={sets}
                  winner={m.winner_team}
                />
                {expandedMatch === m.id && (
                  <SetsEditor
                    match={m}
                    labelA={pA.map((p) => playerShortName(p)).join(" / ")}
                    labelB={pB.map((p) => playerShortName(p)).join(" / ")}
                    onSaved={() => { setExpandedMatch(null); refresh(); }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
