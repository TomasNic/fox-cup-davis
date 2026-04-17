import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCupWithDetails } from "@/lib/supabase/queries";
import { checkAdminSession } from "@/lib/auth";
import { playerShortName } from "@/types";
import type { Player } from "@/types";
import { Avatar } from "@/components/ui";
import CupMatchesFilter from "./CupMatchesFilter";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
}

/** Extrae la URL src de un iframe de Google Maps, o devuelve la URL directa si es una URL válida */
function extractMapsSrc(raw: string): string | null {
  try {
    // Si es un iframe pegado, extraer el src
    const srcMatch = raw.match(/src=["']([^"']+)["']/);
    if (srcMatch) return srcMatch[1];

    // Si es una URL directa de Google Maps, construir embed
    if (raw.includes("google.com/maps") || raw.includes("goo.gl/maps")) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(raw)}&output=embed&z=15`;
    }

    return null;
  } catch {
    return null;
  }
}


export default async function CupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [cup, isAdmin] = await Promise.all([getCupWithDetails(id), checkAdminSession()]);
  if (!cup) notFound();

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <Navbar />
      <main className="page-main">

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
        <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-6 mb-8">
          <div className="flex items-center justify-around gap-4">
            <div className={`flex-1 text-center ${cup.winner_team === "A" ? "text-[#036039]" : "text-[#1C1917]"}`}>
              <p className="text-base font-bold font-[var(--font-oswald)]">{cup.team_a_name}</p>
              <p className="text-3xl sm:text-5xl font-bold font-[var(--font-oswald)] mt-1">{cup.score_a}</p>
              {cup.winner_team === "A" && <p className="text-xs text-[#036039] font-semibold mt-1">GANADOR</p>}
            </div>
            <div className="text-center shrink-0">
              <p className="text-xl sm:text-2xl font-bold text-[#6B7280]">vs</p>
              <p className="text-xs text-[#6B7280] mt-1">partidos</p>
            </div>
            <div className={`flex-1 text-center ${cup.winner_team === "B" ? "text-[#036039]" : "text-[#1C1917]"}`}>
              <p className="text-base font-bold font-[var(--font-oswald)]">{cup.team_b_name}</p>
              <p className="text-3xl sm:text-5xl font-bold font-[var(--font-oswald)] mt-1">{cup.score_b}</p>
              {cup.winner_team === "B" && <p className="text-xs text-[#036039] font-semibold mt-1">GANADOR</p>}
            </div>
          </div>
        </div>

        {/* Equipos + Mapa */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[{ team: "A" as const, name: cup.team_a_name, players: cup.players_a },
            { team: "B" as const, name: cup.team_b_name, players: cup.players_b }].map(({ name, players }) => (
            <div key={name} className="bg-white border border-[#E5E7EB] rounded-[10px] p-4">
              <p className="font-bold text-sm font-[var(--font-oswald)] uppercase text-[#6B7280] mb-3">{name}</p>
              <div className="space-y-2">
                {players.map((p) => (
                  <Link key={p.id} href={`/players/${p.id}`} className="flex items-center gap-2 hover:text-[#CC4E0D]">
                    <Avatar firstName={p.first_name} lastName={p.last_name} avatarUrl={p.avatar_url} size="sm" />
                    <span className="text-sm font-medium text-[#1C1917]">{playerShortName(p)}</span>
                    <span className="ml-auto text-xs text-[#6B7280]">Cat. {p.category}</span>
                  </Link>
                ))}
                {players.length === 0 && <p className="text-xs text-[#6B7280]">Sin jugadores asignados</p>}
              </div>
            </div>
          ))}
          {(() => {
            const iframeSrc = cup.maps_url ? extractMapsSrc(cup.maps_url) : null;
            return iframeSrc ? (
              <div className="bg-white border border-[#E5E7EB] rounded-[10px] overflow-hidden flex flex-col">
                <div className="flex items-center gap-2 px-4 pt-4 pb-2">
                  <svg className="w-4 h-4 text-[#6B7280] shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-medium text-[#1C1917] truncate">{cup.location ?? "Ubicación"}</span>
                </div>
                <iframe
                  src={iframeSrc}
                  className="w-full flex-1 min-h-[200px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  title="Ubicación de la copa"
                />
              </div>
            ) : null;
          })()}
        </div>

        <CupMatchesFilter
          matches={cup.matches}
          playersA={cup.players_a}
          playersB={cup.players_b}
        />
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
