"use client";
import { useTransition } from "react";
import { deletePlayer } from "@/lib/supabase/actions";

export default function DeletePlayerButton({ playerId }: { playerId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("¿Eliminar jugador?")) return;
    startTransition(() => deletePlayer(playerId));
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-xs text-[#B42318] hover:underline disabled:opacity-50"
    >
      {isPending ? "Eliminando..." : "Eliminar"}
    </button>
  );
}
