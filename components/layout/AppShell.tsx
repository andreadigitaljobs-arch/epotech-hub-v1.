"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { BottomNav } from "./BottomNav";
import { DesktopNav } from "./DesktopNav";
import { NavigationProgress } from "./NavigationProgress";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname === "/admin";
  
  if (isAdmin) {
    return (
      <div className="min-h-[100dvh] bg-[var(--bg)]">
        <NavigationProgress />
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--bg)] md:flex-row">
      <NavigationProgress />
      <DesktopNav />
      <main className="flex-1 pb-24 md:pb-0">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div key={pathname} className="page-animate">
            {children}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
