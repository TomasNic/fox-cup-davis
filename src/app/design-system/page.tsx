import { Button, Input, Select, Textarea, Avatar, StatCard, CategoryBadge, StatusBadge, ResultBadge, MatchScore } from "@/components/ui";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-lg font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917] mb-1">{title}</h2>
      <div className="h-px bg-[#E5E7EB] mb-6" />
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 md:px-10 py-10 pb-24 md:pb-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917]">
            Design System
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">Copa Davis Fox — componentes reutilizables</p>
        </div>

        {/* COLORS */}
        <Section title="Colores">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: "Acento",    bg: "bg-[#CC4E0D]",  text: "text-white",       hex: "#CC4E0D" },
              { name: "Texto",     bg: "bg-[#1C1917]",  text: "text-white",       hex: "#1C1917" },
              { name: "Muted",     bg: "bg-[#6B7280]",  text: "text-white",       hex: "#6B7280" },
              { name: "Borde",     bg: "bg-[#E5E7EB]",  text: "text-[#1C1917]",   hex: "#E5E7EB" },
              { name: "Fondo",     bg: "bg-[#F6F7F9]",  text: "text-[#1C1917]",   hex: "#F6F7F9" },
              { name: "Éxito",     bg: "bg-[#036039]",  text: "text-white",       hex: "#036039" },
              { name: "Danger",    bg: "bg-[#B42318]",  text: "text-white",       hex: "#B42318" },
              { name: "Surface+",  bg: "bg-[#FFF7F2]",  text: "text-[#1C1917]",   hex: "#FFF7F2" },
            ].map((c) => (
              <div key={c.hex} className={`${c.bg} rounded-[10px] p-4`}>
                <p className={`text-sm font-semibold ${c.text}`}>{c.name}</p>
                <p className={`text-xs mt-0.5 ${c.text} opacity-70`}>{c.hex}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* TYPOGRAPHY */}
        <Section title="Tipografía">
          <p className="font-[var(--font-oswald)] text-4xl font-bold uppercase tracking-wide text-[#1C1917]">Oswald — Títulos</p>
          <p className="font-[var(--font-inter)] text-base text-[#6B7280] mt-2">Inter — Cuerpo de texto y UI</p>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-bold font-[var(--font-oswald)] uppercase text-[#1C1917]">Heading XL</p>
            <p className="text-lg font-bold font-[var(--font-oswald)] uppercase text-[#1C1917]">Heading LG</p>
            <p className="text-base font-bold font-[var(--font-oswald)] uppercase text-[#1C1917]">Heading MD</p>
            <p className="text-sm text-[#1C1917]">Body regular — texto principal</p>
            <p className="text-xs text-[#6B7280]">Caption — texto secundario y labels</p>
          </div>
        </Section>

        {/* BUTTONS */}
        <Section title="Botones">
          <Row label="Primary">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
          </Row>
          <Row label="Ghost">
            <Button variant="ghost" size="sm">Small</Button>
            <Button variant="ghost" size="md">Medium</Button>
            <Button variant="ghost" size="lg">Large</Button>
          </Row>
          <Row label="Danger">
            <Button variant="danger" size="sm">Eliminar</Button>
            <Button variant="danger" size="md">Eliminar</Button>
          </Row>
        </Section>

        {/* INPUTS */}
        <Section title="Inputs">
          <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-6 space-y-4 max-w-md">
            <Input label="Nombre *" placeholder="Juan" required />
            <Input label="Con error" placeholder="email@..." error="Este campo es requerido" />
            <Input label="Deshabilitado" placeholder="No editable" disabled value="Valor fijo" readOnly />
            <Select
              label="Categoría"
              placeholder="Seleccionar..."
              options={[
                { value: "A", label: "Categoría A" },
                { value: "B", label: "Categoría B" },
                { value: "C", label: "Categoría C" },
              ]}
            />
            <Textarea label="Descripción" placeholder="Escribe algo..." rows={3} />
          </div>
        </Section>

        {/* BADGES */}
        <Section title="Badges">
          <Row label="Categorías">
            <CategoryBadge category="A" />
            <CategoryBadge category="B" />
            <CategoryBadge category="C" />
            <CategoryBadge category="D" />
            <CategoryBadge category="E" />
          </Row>
          <Row label="Estado de copa">
            <StatusBadge status="upcoming" />
            <StatusBadge status="in_progress" />
            <StatusBadge status="completed" />
          </Row>
          <Row label="Resultado">
            <ResultBadge result="won" />
            <ResultBadge result="lost" />
            <ResultBadge result="draw" />
            <ResultBadge result="pending" />
          </Row>
        </Section>

        {/* AVATARS */}
        <Section title="Avatares">
          <Row label="Tamaños">
            <Avatar firstName="Juan" lastName="García" size="sm" />
            <Avatar firstName="Juan" lastName="García" size="md" />
            <Avatar firstName="Juan" lastName="García" size="lg" />
          </Row>
        </Section>

        {/* MATCH SCORE */}
        <Section title="Match Score">
          <div className="space-y-2">
            <MatchScore
              playersA={["J. García"]}
              playersB={["M. López"]}
              sets={[{ games_a: 6, games_b: 4 }, { games_a: 7, games_b: 5 }]}
              winner="A"
            />
            <MatchScore
              playersA={["R. Fernández"]}
              playersB={["P. Martínez"]}
              sets={[{ games_a: 3, games_b: 6 }, { games_a: 6, games_b: 4 }, { games_a: 4, games_b: 6 }]}
              winner="B"
            />
            <MatchScore
              playersA={["C. Rodríguez", "D. Sánchez"]}
              playersB={["L. Gómez", "A. Torres"]}
              sets={[{ games_a: 6, games_b: 3 }, { games_a: 6, games_b: 2 }]}
              winner="A"
            />
            <MatchScore
              playersA={["N. Herrera"]}
              playersB={["F. Díaz"]}
            />
          </div>
        </Section>

        {/* STAT CARDS */}
        <Section title="Stat Cards">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard value={42}   label="Puntaje"          accent />
            <StatCard value={12}   label="Partidos jugados" />
            <StatCard value={8}    label="Partidos ganados" />
            <StatCard value="3/5"  label="Copas" />
          </div>
        </Section>

      </main>
      <MobileNav />
    </div>
  );
}
