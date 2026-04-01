import Link from "next/link";
import { getPlayers } from "@/lib/supabase/queries";
import { playerShortName } from "@/types";
import DeletePlayerButton from "./DeletePlayerButton";

export default async function AdminPlayersPage() {
  const players = await getPlayers();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917]">
          Jugadores
        </h1>
        <Link
          href="/admin/players/new"
          className="bg-[#CC4E0D] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#b34409] transition-colors"
        >
          + Nuevo jugador
        </Link>
      </div>

      {players.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-[10px] py-12 text-center text-[#6B7280] text-sm">
          No hay jugadores. <Link href="/admin/players/new" className="text-[#CC4E0D] hover:underline">Agregar el primero</Link>.
        </div>
      ) : (
        <div className="space-y-2">
          {players.map((p) => (
            <div key={p.id} className="bg-white border border-[#E5E7EB] rounded-[10px] px-5 py-3 flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-[#E5E7EB] flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-[#6B7280]">{p.first_name[0]}{p.last_name[0]}</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-[#1C1917]">{playerShortName(p)}</p>
                {p.nickname && <p className="text-xs text-[#6B7280]">"{p.nickname}"</p>}
              </div>
              <span className="bg-[#CC4E0D]/10 text-[#CC4E0D] text-xs font-bold px-2 py-0.5 rounded-full">
                Cat. {p.category}
              </span>
              {p.ranking && <span className="text-xs text-[#6B7280]">Rank #{p.ranking}</span>}
              <div className="flex gap-3">
                <Link href={`/admin/players/${p.id}/edit`} className="text-xs text-[#CC4E0D] hover:underline font-medium">
                  Editar
                </Link>
                <DeletePlayerButton playerId={p.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
