import type { ReactNode } from "react";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

export default function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen bg-brand-dark">
      <div className="fixed inset-0 z-0 bg-grid pointer-events-none opacity-40 md:opacity-60" />
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="cyber-mesh" />
        <div className="scanline-overlay hidden lg:block" />
        <div className="beam beam-left hidden xl:block" />
        <div className="beam beam-right hidden xl:block" />
      </div>
      <div className="relative z-10">
        <Navbar />
        {children}
        <Footer />
      </div>
    </main>
  );
}