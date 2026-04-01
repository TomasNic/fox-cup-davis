import Link from "next/link";
import { getCups, getPlayers } from "@/lib/supabase/queries";

export default async function AdminDashboardPage() {
  const [cups, players] = await Promise.all([getCups(), getPlayers()]);
  const completedCups = cups.filter((c) => c.status === "completed").length;

  return (
    <div>
      <h1 className="text-2xl font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917] mb-6">
        Panel de Administración
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Jugadores",       value: players.length },
          { label: "Copas totales",   value: cups.length },
          { label: "Copas jugadas",   value: completedCups },
          { label: "Próximas copas",  value: cups.filter((c) => c.status === "upcoming").length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-[#E5E7EB] rounded-[10px] p-4 text-center">
            <p className="text-3xl font-bold font-[var(--font-oswald)] text-[#CC4E0D]">{value}</p>
            <p className="text-xs text-[#6B7280] uppercase tracking-wide mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/players"
          className="bg-white border border-[#E5E7EB] rounded-[12px] p-6 hover:border-[#CC4E0D]/40 transition-colors"
        >
          <h2 className="font-bold text-[#1C1917] font-[var(--font-oswald)] text-lg uppercase">Jugadores</h2>
          <p className="text-sm text-[#6B7280] mt-1">Agregar, editar y gestionar jugadores y sus categorías.</p>
        </Link>
        <Link
          href="/admin/cups"
          className="bg-white border border-[#E5E7EB] rounded-[12px] p-6 hover:border-[#CC4E0D]/40 transition-colors"
        >
          <h2 className="font-bold text-[#1C1917] font-[var(--font-oswald)] text-lg uppercase">Copas</h2>
          <p className="text-sm text-[#6B7280] mt-1">Crear copas, asignar jugadores, cargar partidos y resultados.</p>
        </Link>
      </div>
    </div>
  );
}
