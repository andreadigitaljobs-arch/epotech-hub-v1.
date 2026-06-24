"use client";

import { useThemeColor } from "@/components/layout/ThemeColorHandler";
import { ArrowLeft, CalendarDays } from "lucide-react";
import Link from "next/link";
import CalendarioTab from "@/app/contenido/CalendarioTab";
import { Toast, ToastType } from "@/components/ui/Toast";
import { useState } from "react";

export default function CalendarioPage() {
  useThemeColor("#f8fafc");
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: "", type: "success", isVisible: false,
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type, isVisible: true });
  };

  return (
    <div className="min-h-screen bg-white pb-8">
      {/* HEADER */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="flex items-center gap-4 px-4 py-4">
          <Link href="/" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition-all">
            <ArrowLeft size={18} className="text-slate-600" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#0a192f] flex items-center justify-center">
              <CalendarDays size={18} className="text-[#48c1d2]" />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-800 uppercase tracking-wider leading-none">Calendario</h1>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Planificación semanal de contenido</p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <CalendarioTab showToast={showToast} />

      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(t => ({ ...t, isVisible: false }))}
      />
    </div>
  );
}
