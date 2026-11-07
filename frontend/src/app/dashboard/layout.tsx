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
    <div className="min-h-screen bg-midnight text-offwhite flex flex-col font-sans">
      <Navbar
        brands={brands}
        selectedBrand={selectedBrand}
        onSelectBrand={(b) => setSelectedBrand(b)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-midnight">
          {children}
        </main>
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
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 rounded-[4px] bg-slate-deep border border-teal-muted flex items-center justify-center animate-pulse text-offwhite">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L3 21H7.5L12 11.5L16.5 21H21L12 3Z" fill="#F3F5F2" />
              <path d="M8.5 15.5H15.5" stroke="#71958C" strokeWidth="1.8" />
            </svg>
          </div>
          <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-teal-muted">
            Initializing Governance Core...
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
