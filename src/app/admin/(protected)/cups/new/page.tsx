import { createCup } from "@/lib/supabase/actions";
import Link from "next/link";
import type { CupStatus } from "@/types";
import { Input, Select, Button } from "@/components/ui";

const statusOptions = [
  { value: "upcoming",    label: "Próximamente" },
  { value: "in_progress", label: "En curso" },
  { value: "completed",   label: "Finalizada" },
];

export default function NewCupPage() {
  async function handleCreate(formData: FormData) {
    "use server";
    await createCup({
      name:        formData.get("name")          as string,
      location:    (formData.get("location")     as string) || null,
      maps_url:    (formData.get("maps_url")     as string) || null,
      date:        formData.get("date")          as string,
      status:      (formData.get("status")       as CupStatus) ?? "upcoming",
      team_a_name: (formData.get("team_a_name")  as string) || "Equipo A",
      team_b_name: (formData.get("team_b_name")  as string) || "Equipo B",
      winner_team: null,
    });
  }

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <Link href="/admin/cups" className="text-xs text-[#6B7280] hover:text-[#CC4E0D]">← Copas</Link>
        <h1 className="text-2xl font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917] mt-1">
          Nueva Copa
        </h1>
      </div>

      <form action={handleCreate} className="bg-white border border-[#E5E7EB] rounded-[12px] p-6 space-y-4">
        <Input name="name" label="Nombre *" required placeholder="Copa Abril 2026" />
        <div className="grid grid-cols-2 gap-4">
          <Input name="date" label="Fecha *" type="date" required />
          <Select name="status" label="Estado" defaultValue="upcoming" options={statusOptions} />
        </div>
        <Input name="location" label="Lugar" placeholder="Club de Tenis Fox" />
        <Input name="maps_url" label="Link de Google Maps" placeholder="https://maps.google.com/..." />
        <div className="grid grid-cols-2 gap-4">
          <Input name="team_a_name" label="Nombre Equipo A" placeholder="Equipo A" />
          <Input name="team_b_name" label="Nombre Equipo B" placeholder="Equipo B" />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" size="lg">Crear copa</Button>
          <Link href="/admin/cups" className="text-sm text-[#6B7280] px-4 py-2.5 hover:text-[#1C1917]">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
