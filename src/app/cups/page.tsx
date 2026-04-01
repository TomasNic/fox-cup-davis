import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import Link from "next/link";
import { getCups } from "@/lib/supabase/queries";
import { checkAdminSession } from "@/lib/auth";
import type { Cup } from "@/types";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
}

function CupCard({ cup }: { cup: Cup }) {
  const statusConfig = {
    upcoming:    { label: "Próximamente", cls: "bg-blue-100 text-blue-700" },
    in_progress: { label: "En curso",     cls: "bg-orange-100 text-orange-700" },
    completed:   { label: "Finalizada",   cls: "bg-green-100 text-green-700" },
  } as const;
  const { label, cls } = statusConfig[cup.status];

  return (
    <Link
      href={`/cups/${cup.id}`}
      className="bg-white border border-[#E5E7EB] rounded-[12px] p-5 flex flex-col gap-3 hover:border-[#CC4E0D]/40 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-[#1C1917] font-[var(--font-oswald)] text-lg leading-tight">{cup.name}</p>
          <p className="text-xs text-[#6B7280] mt-0.5">{formatDate(cup.date)}</p>
          {cup.location && <p className="text-xs text-[#6B7280]">{cup.location}</p>}
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${cls}`}>{label}</span>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className={`flex-1 text-center py-1.5 rounded-md font-semibold border
          ${cup.winner_team === "A" ? "bg-[#036039]/10 border-[#036039]/20 text-[#036039]" : "bg-[#F6F7F9] border-[#E5E7EB] text-[#1C1917]"}`}>
          {cup.team_a_name}
        </span>
        <span className="text-[#6B7280] font-medium">vs</span>
        <span className={`flex-1 text-center py-1.5 rounded-md font-semibold border
          ${cup.winner_team === "B" ? "bg-[#036039]/10 border-[#036039]/20 text-[#036039]" : "bg-[#F6F7F9] border-[#E5E7EB] text-[#1C1917]"}`}>
          {cup.team_b_name}
        </span>
      </div>

      {cup.status === "completed" && (
        <p className="text-xs text-center text-[#6B7280]">
          {cup.winner_team
            ? `Ganó ${cup.winner_team === "A" ? cup.team_a_name : cup.team_b_name}`
            : "Empate"}
        </p>
      )}
    </Link>
  );
}

export default async function CupsPage() {
  const [cups, isAdmin] = await Promise.all([getCups(), checkAdminSession()]);

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <Navbar />
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 py-8 pb-24 md:pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917]">
            Copas
          </h1>
          {isAdmin && (
            <Link
              href="/admin/cups/new"
              className="bg-[#CC4E0D] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#b34409] transition-colors"
            >
              + Nueva copa
            </Link>
          )}
        </div>

        {cups.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-[10px] py-16 text-center text-[#6B7280] text-sm">
            No hay copas registradas aún.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cups.map((cup) => <CupCard key={cup.id} cup={cup} />)}
          </div>
        )}
      </main>
      <MobileNav />
    </div>
  );
}
