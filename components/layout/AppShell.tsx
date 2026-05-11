"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { DesktopNav } from "./DesktopNav";
import { NavigationProgress } from "./NavigationProgress";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--bg)] md:flex-row pt-[env(safe-area-inset-top)]">
      <NavigationProgress />
      <DesktopNav />
      
      <main className="flex-1 pt-4 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0 overflow-x-hidden md:ml-72">
        <div className="mx-auto w-full px-4 md:px-8">
          <div key={pathname} className="page-animate">
            <React.Suspense fallback={<div className="hidden" />}>
              {children}
            </React.Suspense>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
