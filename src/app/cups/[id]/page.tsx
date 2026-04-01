import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCupWithDetails } from "@/lib/supabase/queries";
import { checkAdminSession } from "@/lib/auth";
import { playerShortName } from "@/types";
import type { MatchWithDetails, Player } from "@/types";
import { MatchScore } from "@/components/ui";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
}

function MatchRow({ match }: { match: MatchWithDetails }) {
  const playerA = [match.team_a_player1, match.team_a_player2].filter(Boolean) as Player[];
  const playerB = [match.team_b_player1, match.team_b_player2].filter(Boolean) as Player[];
  const sets = (match.sets ?? [])
    .sort((a, b) => a.set_number - b.set_number)
    .map((s) => ({ games_a: s.games_team_a, games_b: s.games_team_b }));

  return (
    <MatchScore
      playersA={playerA.map((p) => playerShortName(p))}
      playersB={playerB.map((p) => playerShortName(p))}
      sets={sets}
      winner={match.winner_team}
    />
  );
}

export default async function CupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [cup, isAdmin] = await Promise.all([getCupWithDetails(id), checkAdminSession()]);
  if (!cup) notFound();

  const singles = cup.matches.filter((m) => m.type === "singles")
    .sort((a, b) => (a.category ?? "").localeCompare(b.category ?? ""));
  const doubles = cup.matches.filter((m) => m.type === "doubles");

  const categories = [...new globalThis.Set(singles.map((m) => m.category).filter(Boolean))] as string[];

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <Navbar />
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 py-8 pb-24 md:pb-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <Link href="/cups" className="text-xs text-[#6B7280] hover:text-[#CC4E0D] mb-1 inline-block">← Copas</Link>
            <h1 className="text-2xl font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917]">{cup.name}</h1>
            <p className="text-sm text-[#6B7280] mt-1">{formatDate(cup.date)}{cup.location ? ` · ${cup.location}` : ""}</p>
          </div>
          {isAdmin && (
            <Link
              href={`/admin/cups/${cup.id}`}
              className="bg-[#CC4E0D] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#b34409] transition-colors"
            >
              Gestionar
            </Link>
          )}
        </div>

        {/* Marcador */}
        <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-6 mb-6">
          <div className="flex items-center justify-around gap-4">
            <div className={`flex-1 text-center ${cup.winner_team === "A" ? "text-[#036039]" : "text-[#1C1917]"}`}>
              <p className="text-base font-bold font-[var(--font-oswald)]">{cup.team_a_name}</p>
              <p className="text-5xl font-bold font-[var(--font-oswald)] mt-1">{cup.score_a}</p>
              {cup.winner_team === "A" && <p className="text-xs text-[#036039] font-semibold mt-1">GANADOR</p>}
            </div>
            <div className="text-center shrink-0">
              <p className="text-2xl font-bold text-[#6B7280]">vs</p>
              <p className="text-xs text-[#6B7280] mt-1">partidos</p>
            </div>
            <div className={`flex-1 text-center ${cup.winner_team === "B" ? "text-[#036039]" : "text-[#1C1917]"}`}>
              <p className="text-base font-bold font-[var(--font-oswald)]">{cup.team_b_name}</p>
              <p className="text-5xl font-bold font-[var(--font-oswald)] mt-1">{cup.score_b}</p>
              {cup.winner_team === "B" && <p className="text-xs text-[#036039] font-semibold mt-1">GANADOR</p>}
            </div>
          </div>
        </div>

        {/* Equipos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {[{ team: "A" as const, name: cup.team_a_name, players: cup.players_a },
            { team: "B" as const, name: cup.team_b_name, players: cup.players_b }].map(({ name, players }) => (
            <div key={name} className="bg-white border border-[#E5E7EB] rounded-[10px] p-4">
              <p className="font-bold text-sm font-[var(--font-oswald)] uppercase text-[#6B7280] mb-3">{name}</p>
              <div className="space-y-2">
                {players.map((p) => (
                  <Link key={p.id} href={`/players/${p.id}`} className="flex items-center gap-2 hover:text-[#CC4E0D]">
                    <div className="w-7 h-7 rounded-full bg-[#E5E7EB] flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-semibold text-[#6B7280]">{p.first_name[0]}{p.last_name[0]}</span>
                    </div>
                    <span className="text-sm font-medium text-[#1C1917]">{playerShortName(p)}</span>
                    <span className="ml-auto text-xs text-[#6B7280]">Cat. {p.category}</span>
                  </Link>
                ))}
                {players.length === 0 && <p className="text-xs text-[#6B7280]">Sin jugadores asignados</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Partidos Singles */}
        {singles.length > 0 && (
          <div className="mb-8">
            <h2 className="text-base font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917] mb-3">
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

        {/* Partidos Dobles */}
        {doubles.length > 0 && (
          <div className="mb-8">
            <h2 className="text-base font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917] mb-3">
              Dobles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {doubles.map((m) => <MatchRow key={m.id} match={m} />)}
            </div>
          </div>
        )}

        {cup.matches.length === 0 && (
          <div className="bg-white border border-[#E5E7EB] rounded-[10px] py-12 text-center text-[#6B7280] text-sm">
            Aún no hay partidos cargados.
          </div>
        )}
      </main>
      <MobileNav />
    </div>
  );
}
