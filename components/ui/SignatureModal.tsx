"use client";

import { useRef, useState, useEffect } from "react";
import { X, Trash2, Save, Download, PenTool, CheckCircle2 } from "lucide-react";
import { createPortal } from "react-dom";

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureData: string) => void;
  onReset: () => void;
  savedSignature?: string | null;
}

export function SignatureModal({ isOpen, onClose, onSave, onReset, savedSignature }: SignatureModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isLocked, setIsLocked] = useState(!!savedSignature);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (savedSignature) {
      setIsLocked(true);
    } else {
      setIsLocked(false);
      setHasSignature(false);
    }
  }, [savedSignature]);

  useEffect(() => {
    if (isOpen && canvasRef.current && !isLocked) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Set transparent background
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#142d53"; // Dark brand color for signature
      }
      
      // Resize canvas to its display size
      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx?.scale(window.devicePixelRatio, window.devicePixelRatio);
        if (ctx) {
          ctx.lineJoin = "round";
          ctx.lineCap = "round";
          ctx.lineWidth = 3;
          ctx.strokeStyle = "#142d53";
        }
      };
      
      resize();
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }
  }, [isOpen, isLocked]);

  // If already locked, draw the saved signature on open
  useEffect(() => {
    if (isOpen && isLocked && savedSignature && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
        };
        img.src = savedSignature;
      }
    }
  }, [isOpen, isLocked, savedSignature]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (isLocked) return;
    setIsDrawing(true);
    const pos = getPos(e);
    const ctx = canvasRef.current?.getContext("2d");
    ctx?.beginPath();
    ctx?.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isLocked) return;
    const pos = getPos(e);
    const ctx = canvasRef.current?.getContext("2d");
    ctx?.lineTo(pos.x, pos.y);
    ctx?.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const clear = () => {
    if (isLocked) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
    }
  };

  const handleSave = () => {
    if (!hasSignature || isLocked) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      onSave(dataUrl);
      setIsLocked(true);
    }
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "firma_epotech_sebastian.png";
      link.href = dataUrl;
      link.click();
    }
  };

  const handleReset = () => {
    if (confirm("¿Estás seguro de que quieres eliminar esta firma? Tendrás que realizarla de nuevo.")) {
      onReset();
      setIsLocked(false);
      setHasSignature(false);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      ctx?.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0);
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#0a192f]/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#48c1d2]/10 flex items-center justify-center text-[#48c1d2]">
              <PenTool size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#142d53] tracking-tighter">Firma Digital Epotech</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {isLocked ? "Firma Registrada y Protegida" : "Dibuja tu firma en el recuadro"}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 flex-1 flex flex-col gap-6">
          <div 
            className={`relative flex-1 bg-slate-50 rounded-[2rem] border-2 border-dashed transition-all overflow-hidden ${
              isLocked ? "border-emerald-200 bg-emerald-50/20" : "border-slate-200 hover:border-[#48c1d2]/50"
            }`}
          >
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className={`w-full h-full cursor-crosshair touch-none ${isLocked ? "cursor-default" : ""}`}
            />
            
            {isLocked && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                <CheckCircle2 size={14} />
                Firma Protegida
              </div>
            )}

            {!hasSignature && !isLocked && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <span className="text-2xl font-black text-slate-300 uppercase tracking-[0.5em] -rotate-12">Firma Aquí</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {!isLocked ? (
              <>
                <button
                  onClick={clear}
                  disabled={!hasSignature}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 disabled:opacity-30"
                >
                  <Trash2 size={16} /> Limpiar
                </button>
                <button
                  onClick={handleSave}
                  disabled={!hasSignature}
                  className="w-full flex-1 bg-[#48c1d2] text-[#142d53] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#48c1d2]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save size={16} /> Guardar Firma Definitiva
                </button>
              </>
            ) : (
              <div className="w-full flex flex-col gap-3">
                <button
                  onClick={download}
                  className="w-full bg-[#142d53] text-[#48c1d2] py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Download size={20} /> Descargar PNG Transparente
                </button>
                <button
                  onClick={handleReset}
                  className="w-full py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} /> Eliminar Firma y Volver a Empezar
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-slate-50/50 border-t border-slate-100 text-center">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">
            * La firma se exportará con fondo transparente para su aplicación en branding, landing pages y contenido personalizado.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
