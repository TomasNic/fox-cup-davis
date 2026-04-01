import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import Link from "next/link";
import { getCups, getPlayerRanking } from "@/lib/supabase/queries";
import { playerShortName } from "@/types";
import type { Cup, PlayerStats } from "@/types";
import { CupCountdown } from "@/components/ui";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
}

function CupStatusBadge({ status }: { status: Cup["status"] }) {
  const map = {
    upcoming:    { label: "Próximamente", cls: "bg-blue-100 text-blue-700" },
    in_progress: { label: "En curso",     cls: "bg-orange-100 text-orange-700" },
    completed:   { label: "Finalizada",   cls: "bg-green-100 text-green-700" },
  } as const;
  const { label, cls } = map[status];
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>;
}

export default async function DashboardPage() {
  const [cups, ranking] = await Promise.all([getCups(), getPlayerRanking()]);

  const upcomingCup  = cups.find((c) => c.status === "upcoming" || c.status === "in_progress");
  const lastCup      = cups.find((c) => c.status === "completed");
  const top5         = ranking.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <Navbar />
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 py-8 pb-24 md:pb-8 flex flex-col lg:flex-row gap-8">

        {/* Ranking */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917]">
              Ranking General
            </h1>
            <Link href="/players" className="text-sm text-[#CC4E0D] font-medium hover:underline">Ver todos</Link>
          </div>

          <div className="space-y-2">
            {top5.map((s: PlayerStats) => (
              <Link
                key={s.player.id}
                href={`/players/${s.player.id}`}
                className="bg-white border border-[#E5E7EB] rounded-[10px] px-5 py-4 flex items-center gap-4 hover:border-[#CC4E0D]/40 transition-colors"
              >
                <span className="text-lg font-bold text-[#CC4E0D] w-8 font-[var(--font-oswald)] shrink-0">
                  {String(s.rank_position).padStart(2, "0")}
                </span>
                <div className="w-10 h-10 rounded-full bg-[#E5E7EB] flex items-center justify-center shrink-0">
                  <span className="text-xs font-semibold text-[#6B7280]">
                    {s.player.first_name[0]}{s.player.last_name[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1C1917]">{playerShortName(s.player)}</p>
                  <p className="text-xs text-[#6B7280]">Cat. {s.player.category}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#6B7280] shrink-0">
                  <span className="hidden sm:inline"><strong className="text-[#1C1917]">{s.matches_played}</strong> PJ · <strong className="text-[#1C1917]">{s.cups_played}</strong> TJ</span>
                  <span className="text-base font-bold text-[#CC4E0D] font-[var(--font-oswald)]">{s.score} <span className="text-xs font-normal text-[#6B7280]">pts</span></span>
                </div>
              </Link>
            ))}
          </div>

          {ranking.length === 0 && (
            <div className="bg-white border border-[#E5E7EB] rounded-[10px] py-12 text-center text-[#6B7280] text-sm">
              Aún no hay datos de jugadores.
            </div>
          )}
        </div>

        {/* Sidebar copas */}
        <div className="w-full lg:w-[300px] shrink-0 space-y-4">
          {upcomingCup && (
            <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917]">
                  Próxima Copa
                </h2>
                <CupStatusBadge status={upcomingCup.status} />
              </div>
              <p className="font-semibold text-[#1C1917]">{upcomingCup.name}</p>
              <p className="text-sm text-[#6B7280] mt-0.5">{formatDate(upcomingCup.date)}</p>
              {upcomingCup.location && <p className="text-xs text-[#6B7280] mt-0.5">{upcomingCup.location}</p>}
              <div className="mt-3 flex items-center gap-2 text-sm font-medium">
                <span className="px-3 py-1 bg-[#F6F7F9] rounded-full">{upcomingCup.team_a_name}</span>
                <span className="text-[#6B7280]">vs</span>
                <span className="px-3 py-1 bg-[#F6F7F9] rounded-full">{upcomingCup.team_b_name}</span>
              </div>
              {upcomingCup.status === "upcoming" && (
                <CupCountdown date={upcomingCup.date} />
              )}
              <Link href={`/cups/${upcomingCup.id}`} className="mt-4 block text-center text-sm text-[#CC4E0D] font-medium hover:underline">
                Ver detalle →
              </Link>
            </div>
          )}

          {lastCup && (
            <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-5">
              <h2 className="text-base font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917] mb-3">
                Última Copa
              </h2>
              <p className="font-semibold text-[#1C1917]">{lastCup.name}</p>
              <p className="text-xs text-[#6B7280] mt-0.5">{formatDate(lastCup.date)}</p>
              <div className="mt-3 flex items-center gap-3 text-sm font-semibold">
                <span className={lastCup.winner_team === "A" ? "text-[#036039]" : "text-[#6B7280]"}>
                  {lastCup.team_a_name}
                </span>
                <span className="text-[#6B7280] font-normal">vs</span>
                <span className={lastCup.winner_team === "B" ? "text-[#036039]" : "text-[#6B7280]"}>
                  {lastCup.team_b_name}
                </span>
              </div>
              {lastCup.winner_team ? (
                <p className="mt-1 text-xs text-[#036039] font-medium">
                  Ganó {lastCup.winner_team === "A" ? lastCup.team_a_name : lastCup.team_b_name}
                </p>
              ) : (
                <p className="mt-1 text-xs text-[#6B7280]">Empate</p>
              )}
              <Link href={`/cups/${lastCup.id}`} className="mt-4 block text-center text-sm text-[#CC4E0D] font-medium hover:underline">
                Ver resultados →
              </Link>
            </div>
          )}

          <Link
            href="/cups"
            className="block bg-[#CC4E0D] text-white text-center text-sm font-semibold py-3 rounded-[10px] hover:bg-[#b34409] transition-colors"
          >
            Ver todas las copas
          </Link>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
