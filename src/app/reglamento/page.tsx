import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import Footer from "@/components/layout/Footer";

export default function ReglamentoPage() {
  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <Navbar />

      <main className="page-main">
        <h1 className="text-2xl font-bold font-[var(--font-oswald)] uppercase tracking-wide text-[#1C1917] mb-6">
          Reglamento
        </h1>

        <div className="bg-white border border-[#E5E7EB] rounded-[10px] py-16 text-center">
          <svg className="mx-auto w-12 h-12 text-[#E5E7EB] mb-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h6M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-7-7z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 2v7h7" />
          </svg>
          <p className="text-[#6B7280] text-sm">El reglamento estará disponible próximamente.</p>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
