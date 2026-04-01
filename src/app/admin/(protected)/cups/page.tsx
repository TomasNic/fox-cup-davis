import Link from "next/link";
import { getCups } from "@/lib/supabase/queries";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
}

export default async function AdminCupsPage() {
  const cups = await getCups();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917]">Copas</h1>
        <Link href="/admin/cups/new" className="bg-[#CC4E0D] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#b34409] transition-colors">
          + Nueva copa
        </Link>
      </div>

      {cups.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-[10px] py-12 text-center text-[#6B7280] text-sm">
          No hay copas. <Link href="/admin/cups/new" className="text-[#CC4E0D] hover:underline">Crear la primera</Link>.
        </div>
      ) : (
        <div className="space-y-2">
          {cups.map((c) => (
            <div key={c.id} className="bg-white border border-[#E5E7EB] rounded-[10px] px-5 py-3 flex items-center gap-4">
              <div className="flex-1">
                <p className="font-semibold text-sm text-[#1C1917]">{c.name}</p>
                <p className="text-xs text-[#6B7280]">{formatDate(c.date)}{c.location ? ` · ${c.location}` : ""}</p>
              </div>
              <span className="text-xs text-[#6B7280]">{c.team_a_name} vs {c.team_b_name}</span>
              <Link href={`/admin/cups/${c.id}`} className="text-xs text-[#CC4E0D] hover:underline font-medium">
                Gestionar
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
