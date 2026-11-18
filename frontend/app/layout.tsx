import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Nav } from "@/components/Nav";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AeroCheck — Controle de Inspeções",
  description: "Acompanhamento de inspeções de manutenção de aeronaves",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        <div className="shell">
          <aside className="sidebar">
            <div className="brand">
              <span className="brand-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
              </span>
              <span>
                AeroCheck
                <small>Manutenção</small>
              </span>
            </div>
            <Nav />
            <p className="sidebar-foot">Inspeções A-Check, C-Check e estruturais da frota.</p>
          </aside>
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}