interface SetResult {
  games_a: number;
  games_b: number;
}

interface PlayerInfo {
  name: string;
  avatarUrl?: string | null;
}

interface MatchScoreProps {
  /** Jugadores del equipo A (nombre + avatar opcional) */
  playersA: PlayerInfo[];
  /** Jugadores del equipo B */
  playersB: PlayerInfo[];
  /** Sets jugados */
  sets?: SetResult[];
  /** Equipo ganador; null = pendiente */
  winner?: "A" | "B" | null;
  className?: string;
}

function initials(name: string): string {
  return name
    .split(" / ")[0]
    .split(/\s+/)
    .map((w) => w.replace(/\W/g, "").charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface RowProps {
  players: PlayerInfo[];
  won: boolean;
  hasResult: boolean;
  setScores: number[];
  oppScores: number[];
}

function PlayerRow({ players, won, hasResult, setScores, oppScores }: RowProps) {
  const dimmed = hasResult && !won;
  const firstPlayer = players[0];

  return (
    <div className="flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-3">
      {/* Avatar */}
      {firstPlayer.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={firstPlayer.avatarUrl}
          alt={firstPlayer.name}
          className="w-8 h-8 rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center shrink-0">
          <span className="text-[10px] font-bold text-[#6B7280]">{initials(firstPlayer.name)}</span>
        </div>
      )}

      {/* Nombre(s) */}
      <span
        className={`flex-1 text-sm font-semibold transition-colors ${
          dimmed ? "text-[#9CA3AF]" : "text-[#1C1917]"
        }`}
      >
        {players.map((p) => p.name).join(" / ")}
      </span>

      {/* Checkmark */}
      <span className="w-4 sm:w-5 shrink-0 text-center">
        {won && <span className="text-[#036039] text-sm font-bold" role="img" aria-label="Ganador">✓</span>}
      </span>

      {/* Scores por set */}
      {!hasResult ? (
        <span className="text-xs text-[#9CA3AF] pr-1">Sin resultado</span>
      ) : (
        setScores.map((score, i) => {
          const wonSet = score > oppScores[i];
          return (
            <span
              key={i}
              className={`w-5 sm:w-7 shrink-0 text-center text-xs sm:text-sm tabular-nums font-bold ${
                wonSet ? "text-[#1C1917]" : "text-[#6B7280]"
              }`}
            >
              {score}
            </span>
          );
        })
      )}
    </div>
  );
}

export default function MatchScore({
  playersA,
  playersB,
  sets = [],
  winner = null,
  className = "",
}: MatchScoreProps) {
  const hasResult = sets.length > 0;
  const scoresA = sets.map((s) => s.games_a);
  const scoresB = sets.map((s) => s.games_b);

  return (
    <div
      className={`bg-white border border-[#E5E7EB] rounded-[10px] overflow-hidden divide-y divide-[#F3F4F6] ${className}`}
    >
      <PlayerRow
        players={playersA}
        won={winner === "A"}
        hasResult={hasResult}
        setScores={scoresA}
        oppScores={scoresB}
      />
      <PlayerRow
        players={playersB}
        won={winner === "B"}
        hasResult={hasResult}
        setScores={scoresB}
        oppScores={scoresA}
      />
    </div>
  );
}
