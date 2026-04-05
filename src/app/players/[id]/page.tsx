import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlayerHistory } from "@/lib/supabase/queries";
import { checkAdminSession } from "@/lib/auth";
import { playerShortName } from "@/types";
import { Avatar, StatCard, CategoryBadge, ResultBadge } from "@/components/ui";

export default async function PlayerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [history, isAdmin] = await Promise.all([getPlayerHistory(id), checkAdminSession()]);
  if (!history) notFound();

  const { player, stats, cup_history, teammates, rivals } = history;

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <Navbar />
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 py-8 pb-24 md:pb-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/players" className="text-xs text-[#6B7280] hover:text-[#CC4E0D]">← Jugadores</Link>
          </div>
          {isAdmin && (
            <Link
              href={`/admin/players/${player.id}/edit`}
              className="text-sm text-[#CC4E0D] font-medium hover:underline"
            >
              Editar
            </Link>
          )}
        </div>

        {/* Perfil */}
        <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-6 mb-6 flex items-start gap-5">
          <Avatar firstName={player.first_name} lastName={player.last_name} avatarUrl={player.avatar_url} size="lg" />
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold font-[var(--font-oswald)] text-[#1C1917]">
                {player.first_name} {player.last_name}
              </h1>
              {player.nickname && <span className="text-[#6B7280] italic">"{player.nickname}"</span>}
              <CategoryBadge category={player.category} />
            </div>
            {player.description && <p className="text-sm text-[#6B7280] mt-2">{player.description}</p>}
            <div className="flex gap-4 mt-2 text-xs text-[#6B7280]">
              {player.age    && <span>{player.age} años</span>}
              {player.height_cm && <span>{player.height_cm} cm</span>}
              {player.weight_kg && <span>{player.weight_kg} kg</span>}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          <StatCard value={stats.score}           label="Puntaje"           accent className="col-span-2 sm:col-span-3 lg:col-span-1" />
          <StatCard value={stats.matches_played}  label="Partidos jugados" />
          <StatCard value={stats.matches_lost}    label="Partidos perdidos" />
          <StatCard value={stats.cups_played}     label="Torneos jugados" />
          <StatCard value={stats.cups_won}        label="Torneos ganados" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Historial copas */}
          <div className="flex-1">
            <h2 className="text-base font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917] mb-3">
              Historial de Copas
            </h2>
            {cup_history.length === 0 ? (
              <p className="text-sm text-[#6B7280]">Sin copas registradas.</p>
            ) : (
              <div className="space-y-2">
                {cup_history.map(({ cup, team, result, won, lost }) => (
                  <Link
                    key={cup.id}
                    href={`/cups/${cup.id}`}
                    className="bg-white border border-[#E5E7EB] rounded-[10px] px-4 py-3 flex items-center gap-3 hover:border-[#CC4E0D]/40"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-[#1C1917]">{cup.name}</p>
                      <p className="text-xs text-[#6B7280]">
                        {team === "A" ? cup.team_a_name : cup.team_b_name} · {won}W {lost}L
                      </p>
                    </div>
                    <ResultBadge result={result} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: compañeros y rivales */}
          <div className="w-full lg:w-[260px] shrink-0 space-y-5">
            {teammates.length > 0 && (
              <div>
                <h2 className="text-sm font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917] mb-2">
                  Compañeros frecuentes
                </h2>
                <div className="space-y-1.5">
                  {teammates.map(({ player: p, times }) => (
                    <Link key={p.id} href={`/players/${p.id}`} className="flex items-center gap-2 text-sm hover:text-[#CC4E0D]">
                      <Avatar firstName={p.first_name} lastName={p.last_name} avatarUrl={p.avatar_url} size="sm" />
                      <span className="text-[#1C1917]">{playerShortName(p)}</span>
                      <span className="ml-auto text-xs text-[#6B7280]">{times}×</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {rivals.length > 0 && (
              <div>
                <h2 className="text-sm font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917] mb-2">
                  Rivales frecuentes
                </h2>
                <div className="space-y-1.5">
                  {rivals.map(({ player: p, times, wins }) => (
                    <Link key={p.id} href={`/players/${p.id}`} className="flex items-center gap-2 text-sm hover:text-[#CC4E0D]">
                      <Avatar firstName={p.first_name} lastName={p.last_name} avatarUrl={p.avatar_url} size="sm" />
                      <span className="text-[#1C1917]">{playerShortName(p)}</span>
                      <span className="ml-auto text-xs text-[#6B7280]">{wins}/{times}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
