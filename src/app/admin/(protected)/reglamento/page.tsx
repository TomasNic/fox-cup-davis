import { getSetting } from "@/lib/supabase/queries";
import ReglamentoEditor from "./ReglamentoEditor";

export default async function AdminReglamentoPage() {
  const regulations = await getSetting("regulations");

  return (
    <div>
      <h1 className="text-2xl font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917] mb-2">
        Reglamento
      </h1>
      <p className="text-sm text-[#6B7280] mb-6">
        El texto se muestra tal cual en la página pública de reglamento.
      </p>
      <ReglamentoEditor initialValue={regulations} />
    </div>
  );
}
