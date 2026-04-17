"use client";
import { useState, useTransition } from "react";
import { saveSetting } from "@/lib/supabase/actions";

export default function ReglamentoEditor({ initialValue }: { initialValue: string }) {
  const [text, setText] = useState(initialValue);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await saveSetting("regulations", text);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setSaved(false); }}
        rows={24}
        placeholder="Escribí el reglamento acá..."
        className="w-full border-2 border-[#E5E7EB] rounded-[10px] px-4 py-3 text-sm text-[#1C1917] leading-relaxed resize-y focus:outline-none focus:border-[#CC4E0D] font-mono"
      />
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="btn-primary px-6 py-2 disabled:opacity-50"
        >
          {isPending ? "Guardando..." : "Guardar"}
        </button>
        {saved && (
          <span className="text-sm text-[#036039] font-medium">Guardado</span>
        )}
      </div>
    </div>
  );
}
