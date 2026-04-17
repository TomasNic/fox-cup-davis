"use client";
import { useState } from "react";
import { playerShortName } from "@/types";
import type { MatchWithDetails, Player } from "@/types";
import { MatchScore } from "@/components/ui";

function MatchRow({ match }: { match: MatchWithDetails }) {
  const playerA = [match.team_a_player1, match.team_a_player2].filter(Boolean) as Player[];
  const playerB = [match.team_b_player1, match.team_b_player2].filter(Boolean) as Player[];
  const sets = (match.sets ?? [])
    .sort((a, b) => a.set_number - b.set_number)
    .map((s) => ({ games_a: s.games_team_a, games_b: s.games_team_b }));

  return (
    <MatchScore
      playersA={playerA.map((p) => ({ name: playerShortName(p), avatarUrl: p.avatar_url }))}
      playersB={playerB.map((p) => ({ name: playerShortName(p), avatarUrl: p.avatar_url }))}
      sets={sets}
      winner={match.winner_team}
    />
  );
}

interface Props {
  matches: MatchWithDetails[];
  playersA: Player[];
  playersB: Player[];
}

export default function CupMatchesFilter({ matches, playersA, playersB }: Props) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");

  const allPlayers = [...playersA, ...playersB];

  function matchIncludesPlayer(m: MatchWithDetails, playerId: string) {
    return (
      m.team_a_player1?.id === playerId ||
      m.team_a_player2?.id === playerId ||
      m.team_b_player1?.id === playerId ||
      m.team_b_player2?.id === playerId
    );
  }

  const filtered = selectedPlayerId
    ? matches.filter((m) => matchIncludesPlayer(m, selectedPlayerId))
    : matches;

  const singles = filtered
    .filter((m) => m.type === "singles")
    .sort((a, b) => (a.category ?? "").localeCompare(b.category ?? ""));
  const doubles = filtered.filter((m) => m.type === "doubles");

  const categories = [
    ...new globalThis.Set(singles.map((m) => m.category).filter(Boolean)),
  ] as string[];

  const selectedPlayer = allPlayers.find((p) => p.id === selectedPlayerId);

  return (
    <div>
      {/* Filtro */}
      {allPlayers.length > 0 && matches.length > 0 && (
        <div className="flex items-center gap-3 mb-6">
          <label htmlFor="player-filter" className="text-sm text-[#6B7280] shrink-0">
            Ver solo los partidos de:
          </label>
          <select
            id="player-filter"
            value={selectedPlayerId}
            onChange={(e) => setSelectedPlayerId(e.target.value)}
            className="field-sm"
          >
            <option value="">Todos</option>
            {allPlayers.map((p) => (
              <option key={p.id} value={p.id}>{playerShortName(p)}</option>
            ))}
          </select>
        </div>
      )}

      {/* Sin resultados para el filtro */}
      {selectedPlayerId && filtered.length === 0 && (
        <div className="bg-white border border-[#E5E7EB] rounded-[10px] py-10 text-center text-[#6B7280] text-sm">
          {selectedPlayer ? `${playerShortName(selectedPlayer)} no tiene partidos en esta copa.` : "Sin partidos."}
        </div>
      )}

      {/* Singles */}
      {singles.length > 0 && (
        <div className="mb-8">
          <h2 className="text-base font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917] mb-4">
            Singles
          </h2>
          {categories.map((cat) => (
            <div key={cat} className="mb-4">
              <p className="text-xs font-bold text-[#6B7280] uppercase mb-2">Categoría {cat}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {singles.filter((m) => m.category === cat).map((m) => (
                  <MatchRow key={m.id} match={m} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dobles */}
      {doubles.length > 0 && (
        <div className="mb-8">
          <h2 className="text-base font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917] mb-4">
            Dobles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {doubles.map((m) => (
              <MatchRow key={m.id} match={m} />
            ))}
          </div>
        </div>
      )}

      {/* Sin partidos en absoluto */}
      {matches.length === 0 && (
        <div className="bg-white border border-[#E5E7EB] rounded-[10px] py-12 text-center text-[#6B7280] text-sm">
          Aún no hay partidos cargados.
        </div>
      )}
    </div>
  );
}
