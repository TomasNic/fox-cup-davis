import { updatePlayer } from "@/lib/supabase/actions";
import { getPlayer } from "@/lib/supabase/queries";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { PlayerCategory } from "@/types";
import { Input, Select, Textarea, Button } from "@/components/ui";
import AvatarUploader from "@/components/ui/AvatarUploader";

const categories: PlayerCategory[] = ["A", "B", "C", "D", "E"];

export default async function EditPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const player = await getPlayer(id);
  if (!player) notFound();

  async function handleUpdate(formData: FormData) {
    "use server";
    const avatarUrl = (formData.get("avatar_url") as string) || null;
    await updatePlayer(id, {
      first_name:  formData.get("first_name")  as string,
      last_name:   formData.get("last_name")   as string,
      nickname:    (formData.get("nickname")   as string) || null,
      age:         formData.get("age")         ? Number(formData.get("age"))       : null,
      weight_kg:   formData.get("weight_kg")   ? Number(formData.get("weight_kg")) : null,
      height_cm:   formData.get("height_cm")   ? Number(formData.get("height_cm")) : null,
      category:    formData.get("category")    as PlayerCategory,
      description: (formData.get("description") as string) || null,
      avatar_url:  avatarUrl,
    });
    redirect("/admin/players");
  }

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <Link href="/admin/players" className="text-xs text-[#6B7280] hover:text-[#CC4E0D]">← Jugadores</Link>
        <h1 className="text-2xl font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917] mt-1">
          Editar Jugador
        </h1>
      </div>

      <form action={handleUpdate} className="bg-white border border-[#E5E7EB] rounded-[12px] p-6 space-y-4">
        <AvatarUploader
          currentUrl={player.avatar_url}
          firstName={player.first_name}
          lastName={player.last_name}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input name="first_name" label="Nombre *"   required defaultValue={player.first_name} />
          <Input name="last_name"  label="Apellido *" required defaultValue={player.last_name} />
        </div>
        <Input name="nickname" label="Apodo" defaultValue={player.nickname ?? ""} />
        <div className="grid grid-cols-3 gap-4">
          <Input name="age"       label="Edad"        type="number" min="1" max="99" defaultValue={player.age ?? ""} />
          <Input name="weight_kg" label="Peso (kg)"   type="number" step="0.1"       defaultValue={player.weight_kg ?? ""} />
          <Input name="height_cm" label="Altura (cm)" type="number" step="0.1"       defaultValue={player.height_cm ?? ""} />
        </div>
        <Select
          name="category"
          label="Categoría *"
          required
          defaultValue={player.category}
          options={categories.map((c) => ({ value: c, label: `Categoría ${c}` }))}
        />
        <Textarea name="description" label="Descripción" rows={3} defaultValue={player.description ?? ""} />
        <div className="flex gap-3 pt-2">
          <Button type="submit" size="lg">Guardar cambios</Button>
          <Link href="/admin/players" className="text-sm text-[#6B7280] px-4 py-2.5 hover:text-[#1C1917]">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
