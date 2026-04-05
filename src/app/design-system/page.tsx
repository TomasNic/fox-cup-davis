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
              playersA={[{ name: "Juan García" }]}
              playersB={[{ name: "Marcos López" }]}
              sets={[{ games_a: 6, games_b: 4 }, { games_a: 7, games_b: 5 }]}
              winner="A"
            />
            <MatchScore
              playersA={[{ name: "Rodrigo Fernández" }]}
              playersB={[{ name: "Pablo Martínez" }]}
              sets={[{ games_a: 3, games_b: 6 }, { games_a: 6, games_b: 4 }, { games_a: 4, games_b: 6 }]}
              winner="B"
            />
            <MatchScore
              playersA={[{ name: "Carlos Rodríguez" }, { name: "Diego Sánchez" }]}
              playersB={[{ name: "Lucas Gómez" }, { name: "Andrés Torres" }]}
              sets={[{ games_a: 6, games_b: 3 }, { games_a: 6, games_b: 2 }]}
              winner="A"
            />
            <MatchScore
              playersA={[{ name: "Nicolás Herrera" }]}
              playersB={[{ name: "Federico Díaz" }]}
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

        {/* SPACING */}
        <Section title="Espaciado">

          {/* 1 — Escala */}
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">Escala de tokens</p>
          <div className="bg-white border border-[#E5E7EB] rounded-[10px] divide-y divide-[#F3F4F6] mb-6">
            {[
              { token: "--space-1",  tw: "p-1  / gap-1",   px: "4px",  bar: 4  },
              { token: "--space-2",  tw: "p-2  / gap-2",   px: "8px",  bar: 8  },
              { token: "--space-3",  tw: "p-3  / gap-3",   px: "12px", bar: 12 },
              { token: "--space-4",  tw: "p-4  / gap-4",   px: "16px", bar: 16 },
              { token: "--space-5",  tw: "p-5  / gap-5",   px: "20px", bar: 20 },
              { token: "--space-6",  tw: "p-6  / gap-6",   px: "24px", bar: 24 },
              { token: "--space-8",  tw: "p-8  / gap-8",   px: "32px", bar: 32 },
              { token: "--space-10", tw: "p-10 / gap-10",  px: "40px", bar: 40 },
              { token: "--space-12", tw: "p-12 / gap-12",  px: "48px", bar: 48 },
            ].map(({ token, tw, px, bar }) => (
              <div key={token} className="flex items-center gap-4 px-4 py-2.5">
                <div
                  className="bg-[#CC4E0D]/15 border border-[#CC4E0D]/20 rounded shrink-0"
                  style={{ width: bar, height: 16, minWidth: 4 }}
                />
                <code className="text-xs text-[#CC4E0D] w-28 shrink-0">{token}</code>
                <span className="text-xs text-[#1C1917] flex-1">{tw}</span>
                <span className="text-xs font-semibold text-[#6B7280] tabular-nums">{px}</span>
              </div>
            ))}
          </div>

          {/* 2 — Contenedor de página */}
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">Contenedor de página — <code className="text-[#CC4E0D]">.page-main</code></p>
          <div className="bg-white border border-[#E5E7EB] rounded-[10px] overflow-hidden mb-6">
            {/* Visual diagram */}
            <div className="bg-[#F6F7F9] p-4 flex justify-center">
              <div className="w-full max-w-xs">
                {/* Outer box = viewport */}
                <div className="relative border-2 border-dashed border-[#E5E7EB] rounded p-2">
                  <span className="absolute -top-2.5 left-2 text-[10px] bg-[#F6F7F9] px-1 text-[#9CA3AF]">viewport</span>
                  {/* Top padding */}
                  <div className="bg-[#CC4E0D]/10 rounded h-4 flex items-center justify-center mb-0.5">
                    <span className="text-[9px] text-[#CC4E0D] font-semibold">top: 16px</span>
                  </div>
                  {/* Middle row: left pad + content + right pad */}
                  <div className="flex gap-0.5">
                    <div className="bg-[#CC4E0D]/10 rounded flex items-center justify-center" style={{ width: 28 }}>
                      <span className="text-[9px] text-[#CC4E0D] font-semibold" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>16px · 32px</span>
                    </div>
                    <div className="flex-1 bg-white border border-[#E5E7EB] rounded min-h-[48px] flex items-center justify-center">
                      <span className="text-[10px] text-[#6B7280]">contenido</span>
                    </div>
                    <div className="bg-[#CC4E0D]/10 rounded flex items-center justify-center" style={{ width: 28 }}>
                      <span className="text-[9px] text-[#CC4E0D] font-semibold" style={{ writingMode: "vertical-rl" }}>16px · 32px</span>
                    </div>
                  </div>
                  {/* Bottom padding */}
                  <div className="bg-[#CC4E0D]/10 rounded h-5 flex items-center justify-center mt-0.5">
                    <span className="text-[9px] text-[#CC4E0D] font-semibold">bottom: 96px mobile / 32px desktop</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Code */}
            <div className="px-5 py-4 font-mono text-xs space-y-0.5 border-t border-[#F3F4F6]">
              <p className="text-[#9CA3AF]">{"/* globals.css — @layer components */"}</p>
              <p className="text-[#1C1917]">{".page-main {"}</p>
              <p className="text-[#CC4E0D] pl-4">{"max-width: 1440px;  margin: 0 auto;"}</p>
              <p className="text-[#CC4E0D] pl-4">{"padding-top: 16px;              /* --space-4 */"}</p>
              <p className="text-[#CC4E0D] pl-4">{"padding-inline: 16px;           /* mobile  — --space-4 */"}</p>
              <p className="text-[#CC4E0D] pl-4">{"padding-inline: 32px;           /* md+     — --space-8 */"}</p>
              <p className="text-[#CC4E0D] pl-4">{"padding-bottom: 96px;           /* mobile  — nav clearance */"}</p>
              <p className="text-[#CC4E0D] pl-4">{"padding-bottom: 32px;           /* md+     — --space-8 */"}</p>
              <p className="text-[#1C1917]">{"}"}</p>
            </div>
            <div className="px-5 py-3 bg-[#F6F7F9] border-t border-[#F3F4F6] flex flex-wrap gap-2">
              {["dashboard", "cups", "cups/[id]", "players", "players/[id]", "reglamento"].map((p) => (
                <span key={p} className="text-[10px] font-mono bg-white border border-[#E5E7EB] px-2 py-0.5 rounded text-[#6B7280]">{p}</span>
              ))}
            </div>
          </div>

          {/* 3 — Card padding */}
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">Padding de cards</p>
          <div className="space-y-2 mb-6">
            {[
              { name: "Card SM",  desc: "list items, filas de tabla",           cls: "p-4",  token: "--card-padding-sm", px: "16px",
                usage: ["Ranking rows", "Cup history items", "Player list rows"] },
              { name: "Card MD",  desc: "cards estándar, secciones internas",   cls: "p-5",  token: "--card-padding-md", px: "20px",
                usage: ["Dashboard cards", "Cup cards", "Team panels"] },
              { name: "Card LG",  desc: "cards destacadas, secciones featured", cls: "p-6",  token: "--card-padding-lg", px: "24px",
                usage: ["Player profile", "Cup scoreboard", "Form containers"] },
            ].map(({ name, desc, cls, token, px, usage }) => (
              <div key={token} className={`bg-white border border-[#E5E7EB] rounded-[10px] ${cls}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#1C1917]">{name}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">{desc}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {usage.map((u) => (
                        <span key={u} className="text-[10px] bg-[#F6F7F9] border border-[#E5E7EB] px-1.5 py-0.5 rounded text-[#6B7280]">{u}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-mono font-bold text-[#CC4E0D]">{cls}</p>
                    <p className="text-[10px] text-[#6B7280] mt-0.5">{token}</p>
                    <p className="text-[10px] text-[#9CA3AF]">{px}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 4 — Ritmo vertical */}
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">Ritmo vertical</p>
          <div className="bg-white border border-[#E5E7EB] rounded-[10px] divide-y divide-[#F3F4F6]">
            {[
              { rule: "Título de sección → contenido",          cls: "mb-4",     px: "16px", example: "h2 → lista de items" },
              { rule: "Header de sidebar → lista",              cls: "mb-3",     px: "12px", example: "Compañeros / Rivales" },
              { rule: "Card principal → siguiente sección",     cls: "mb-8",     px: "32px", example: "Profile card → stats grid" },
              { rule: "Scoreboard → grilla de equipos",         cls: "mb-8",     px: "32px", example: "Cup detail" },
              { rule: "Secciones en dashboard",                 cls: "space-y-8", px: "32px", example: "Copa + Ranking" },
              { rule: "Grupos de sección (copas page)",         cls: "gap-10",   px: "40px", example: "Próximas / Anteriores" },
              { rule: "Page title → primer bloque",             cls: "mb-6",     px: "24px", example: "h1 → content area" },
            ].map(({ rule, cls, px, example }) => (
              <div key={rule} className="flex items-center gap-4 px-4 py-3">
                <div className="flex-1">
                  <p className="text-sm text-[#1C1917]">{rule}</p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">{example}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-mono font-semibold text-[#CC4E0D]">{cls}</p>
                  <p className="text-[10px] text-[#9CA3AF]">{px}</p>
                </div>
              </div>
            ))}
          </div>

        </Section>

      </main>
      <MobileNav />
    </div>
  );
}
