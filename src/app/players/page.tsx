import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { getPlayerRanking } from "@/lib/supabase/queries";
import { checkAdminSession } from "@/lib/auth";
import { playerShortName } from "@/types";
import { Avatar } from "@/components/ui";

export default async function PlayersPage() {
  const [ranking, isAdmin] = await Promise.all([getPlayerRanking(), checkAdminSession()]);

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <Navbar />
      <main className="page-main">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917]">
            Jugadores
          </h1>
          {isAdmin && (
            <Link
              href="/admin/players/new"
              className="bg-[#CC4E0D] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#b34409] transition-colors"
            >
              + Nuevo jugador
            </Link>
          )}
        </div>

        {ranking.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-[10px] py-16 text-center text-[#6B7280] text-sm">
            No hay jugadores registrados.
          </div>
        ) : (
          <div className="space-y-2">
            {/* Header */}
            <div className="hidden md:grid grid-cols-[40px_1fr_80px_80px_80px_80px_80px_80px] gap-4 px-5 py-2 text-xs font-bold text-[#6B7280] uppercase tracking-wide">
              <span>#</span>
              <span>Jugador</span>
              <span className="text-center">PJ</span>
              <span className="text-center">PG</span>
              <span className="text-center">PP</span>
              <span className="text-center">TJ</span>
              <span className="text-center">TG</span>
              <span className="text-center">Puntaje</span>
            </div>
            {/* Leyenda columnas */}
            <div className="hidden md:grid grid-cols-[40px_1fr_80px_80px_80px_80px_80px_80px] gap-4 px-5 pb-1 text-[10px] text-[#9CA3AF]">
              <span />
              <span />
              <span className="text-center">Partidos jugados</span>
              <span className="text-center">Partidos ganados</span>
              <span className="text-center">Partidos perdidos</span>
              <span className="text-center">Torneos jugados</span>
              <span className="text-center">Torneos ganados</span>
              <span />
            </div>
            {ranking.map((s) => {
              const isFirst = s.rank_position === 1;
              return isFirst ? (
                <Link
                  key={s.player.id}
                  href={`/players/${s.player.id}`}
                  className="relative bg-[#CC4E0D] border border-[#CC4E0D] rounded-[10px] px-5 py-4 grid grid-cols-[40px_1fr_auto] md:grid-cols-[40px_1fr_80px_80px_80px_80px_80px_80px] gap-4 items-center hover:border-[#b34409] transition-colors overflow-hidden"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-bold text-white font-[var(--font-oswald)]">01</span>
                    <svg className="w-4 h-4 text-white shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar firstName={s.player.first_name} lastName={s.player.last_name} avatarUrl={s.player.avatar_url} size="md" />
                    <div>
                      <p className="font-bold text-base text-white">{playerShortName(s.player)}</p>
                      {s.player.nickname && <p className="text-xs text-white/70">"{s.player.nickname}"</p>}
                    </div>
                  </div>
                  {/* Mobile: solo puntaje */}
                  <span className="md:hidden text-sm font-bold text-white font-[var(--font-oswald)]">
                    {s.score} pts
                  </span>
                  {/* Desktop columns */}
                  <p className="hidden md:block text-center text-sm text-white">{s.matches_played}</p>
                  <p className="hidden md:block text-center text-sm text-white font-medium">{s.matches_won}</p>
                  <p className="hidden md:block text-center text-sm text-white font-medium">{s.matches_lost}</p>
                  <p className="hidden md:block text-center text-sm text-white">{s.cups_played}</p>
                  <p className="hidden md:block text-center text-sm text-white font-medium">{s.cups_won}</p>
                  <p className="hidden md:block text-center">
                    <span className="text-base font-bold text-white font-[var(--font-oswald)]">{s.score}</span>
                    <span className="text-xs text-white/70 ml-1">pts</span>
                  </p>
                </Link>
              ) : (
                <Link
                  key={s.player.id}
                  href={`/players/${s.player.id}`}
                  className="bg-white border border-[#E5E7EB] rounded-[10px] px-5 py-3 grid grid-cols-[40px_1fr_auto] md:grid-cols-[40px_1fr_80px_80px_80px_80px_80px_80px] gap-4 items-center hover:border-[#CC4E0D]/40 transition-colors"
                >
                  <span className="text-base font-bold text-[#CC4E0D] font-[var(--font-oswald)]">
                    {String(s.rank_position).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-3">
                    <Avatar firstName={s.player.first_name} lastName={s.player.last_name} avatarUrl={s.player.avatar_url} />
                    <div>
                      <p className="font-semibold text-sm text-[#1C1917]">{playerShortName(s.player)}</p>
                      {s.player.nickname && <p className="text-xs text-[#6B7280]">"{s.player.nickname}"</p>}
                    </div>
                  </div>
                  {/* Mobile: solo puntaje */}
                  <span className="md:hidden text-sm font-bold text-[#CC4E0D] font-[var(--font-oswald)]">
                    {s.score} pts
                  </span>
                  {/* Desktop columns */}
                  <p className="hidden md:block text-center text-sm text-[#1C1917]">{s.matches_played}</p>
                  <p className="hidden md:block text-center text-sm text-[#036039] font-medium">{s.matches_won}</p>
                  <p className="hidden md:block text-center text-sm text-[#B42318] font-medium">{s.matches_lost}</p>
                  <p className="hidden md:block text-center text-sm text-[#1C1917]">{s.cups_played}</p>
                  <p className="hidden md:block text-center text-sm text-[#036039] font-medium">{s.cups_won}</p>
                  <p className="hidden md:block text-center">
                    <span className="text-base font-bold text-[#CC4E0D] font-[var(--font-oswald)]">{s.score}</span>
                    <span className="text-xs text-[#6B7280] ml-1">pts</span>
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
