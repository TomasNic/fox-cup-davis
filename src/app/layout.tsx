import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Copa Davis Fox",
  description: "Resultados y ranking del torneo Copa Davis Fox",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${oswald.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#F6F7F9] text-[#1C1917]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
