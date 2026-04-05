import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import Link from "next/link";
import { getCups, getPlayerRanking } from "@/lib/supabase/queries";
import { playerShortName } from "@/types";
import type { Cup, PlayerStats } from "@/types";
import { CupCountdown, Avatar } from "@/components/ui";

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

  const upcomingCup   = cups.find((c) => c.status === "upcoming" || c.status === "in_progress");
  const completedCups = cups.filter((c) => c.status === "completed").slice(0, 3);
  const top3          = ranking.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <Navbar />
      <main className="page-main space-y-8">

        {/* Grilla superior: Próxima Copa | Copas anteriores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Próxima Copa */}
          {upcomingCup ? (
            <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-5 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917]">
                  Próxima Copa
                </h2>
                <CupStatusBadge status={upcomingCup.status} />
              </div>
              <p className="font-semibold text-[#1C1917]">{upcomingCup.name}</p>
              <p className="text-sm text-[#6B7280] mt-0.5">{formatDate(upcomingCup.date)}</p>
              {upcomingCup.location && <p className="text-xs text-[#6B7280] mt-0.5">{upcomingCup.location}</p>}
              <div className="mt-3 flex items-center gap-2 text-sm font-medium flex-wrap">
                <span className="px-3 py-1 bg-[#F6F7F9] rounded-full">{upcomingCup.team_a_name}</span>
                <span className="text-[#6B7280]">vs</span>
                <span className="px-3 py-1 bg-[#F6F7F9] rounded-full">{upcomingCup.team_b_name}</span>
              </div>
              {upcomingCup.status === "upcoming" && (
                <CupCountdown date={upcomingCup.date} />
              )}
              <Link href={`/cups/${upcomingCup.id}`} className="mt-auto pt-4 block text-center text-sm text-[#CC4E0D] font-medium hover:underline">
                Ver detalle →
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-5 flex items-center justify-center text-sm text-[#9CA3AF]">
              Sin próxima copa programada
            </div>
          )}

          {/* Copas anteriores */}
          <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-5 flex flex-col">
            <h2 className="text-sm font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917] mb-4">
              Copas anteriores
            </h2>
            {completedCups.length === 0 ? (
              <p className="text-sm text-[#9CA3AF] flex-1 flex items-center">Sin copas finalizadas aún.</p>
            ) : (
              <div className="space-y-3 flex-1">
                {completedCups.map((cup) => (
                  <Link
                    key={cup.id}
                    href={`/cups/${cup.id}`}
                    className="flex items-center justify-between gap-3 hover:opacity-80 transition-opacity"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1C1917] truncate">{cup.name}</p>
                      <p className="text-xs text-[#6B7280]">{formatDate(cup.date)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {cup.winner_team ? (
                        <p className="text-xs font-semibold text-[#036039]">
                          {cup.winner_team === "A" ? cup.team_a_name : cup.team_b_name}
                        </p>
                      ) : (
                        <p className="text-xs text-[#9CA3AF]">Empate</p>
                      )}
                      <p className="text-[10px] text-[#9CA3AF]">
                        {cup.team_a_name} vs {cup.team_b_name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <Link href="/cups" className="mt-4 block text-center text-sm text-[#CC4E0D] font-medium hover:underline">
              Ver todas las copas →
            </Link>
          </div>
        </div>

        {/* Ranking General */}
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917] mb-4">
            Ranking General
          </h1>

          <div className="space-y-2">
            {top3.map((s: PlayerStats) => (
              <Link
                key={s.player.id}
                href={`/players/${s.player.id}`}
                className="bg-white border border-[#E5E7EB] rounded-[10px] px-5 py-4 flex items-center gap-4 hover:border-[#CC4E0D]/40 transition-colors"
              >
                <span className="text-lg font-bold text-[#CC4E0D] w-8 font-[var(--font-oswald)] shrink-0">
                  {String(s.rank_position).padStart(2, "0")}
                </span>
                <Avatar firstName={s.player.first_name} lastName={s.player.last_name} avatarUrl={s.player.avatar_url} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1C1917]">{playerShortName(s.player)}</p>
                  <p className="text-xs text-[#6B7280]">Cat. {s.player.category}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#6B7280] shrink-0">
                  <span className="hidden sm:inline">
                    <strong className="text-[#1C1917]">{s.matches_played}</strong> PJ · <strong className="text-[#1C1917]">{s.cups_played}</strong> TJ
                  </span>
                  <span className="text-base font-bold text-[#CC4E0D] font-[var(--font-oswald)]">
                    {s.score} <span className="text-xs font-normal text-[#6B7280]">pts</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {ranking.length === 0 && (
            <div className="bg-white border border-[#E5E7EB] rounded-[10px] py-12 text-center text-[#6B7280] text-sm">
              Aún no hay datos de jugadores.
            </div>
          )}

          <div className="mt-3 text-center">
            <Link href="/players" className="text-sm text-[#CC4E0D] font-medium hover:underline">
              Ver todo el ranking →
            </Link>
          </div>
        </div>

      </main>
      <MobileNav />
    </div>
  );
}
