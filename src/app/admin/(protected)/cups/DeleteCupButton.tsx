"use client";
import { useTransition } from "react";
import { deleteCup } from "@/lib/supabase/actions";

export default function DeleteCupButton({ cupId, cupName }: { cupId: string; cupName: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`¿Eliminar "${cupName}"? Esta acción no se puede deshacer.`)) return;
    startTransition(() => deleteCup(cupId));
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
