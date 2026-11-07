"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { BrandProvider, useBrand } from "@/lib/brand-context";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { brands, selectedBrand, setSelectedBrand } = useBrand();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans relative">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 glow-ambient pointer-events-none z-0" />
      <div className="fixed inset-0 bg-tech-grid opacity-60 pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          brands={brands}
          selectedBrand={selectedBrand}
          onSelectBrand={(b) => setSelectedBrand(b)}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono relative">
        <div className="fixed inset-0 glow-ambient pointer-events-none" />
        <div className="glass-modal p-8 rounded-[12px] flex flex-col items-center space-y-3 z-10">
          <div className="w-10 h-10 rounded-[6px] bg-white/10 border border-white/30 flex items-center justify-center animate-pulse text-white shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L3 21H7.5L12 11.5L16.5 21H21L12 3Z" fill="#FFFFFF" />
              <path d="M8.5 15.5H15.5" stroke="#FFFFFF" strokeWidth="1.8" />
            </svg>
          </div>
          <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-white font-bold">
            Synchronizing Governance Vault...
          </p>
        </div>
      </div>
    );
  }

  return (
    <BrandProvider>
      <DashboardContent>{children}</DashboardContent>
    </BrandProvider>
  );
}
