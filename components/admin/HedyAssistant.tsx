"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertCircle,
  Database,
  History,
  TrendingUp,
  Brain,
  Trash2
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { askHedy, HedyResponse } from '@/lib/ai/hedy';
import { supabase } from '@/lib/supabase';

export function HedyAssistant() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [pendingActions, setPendingActions] = useState<any[] | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const chatRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    loadHistory();
    setupSpeechRecognition();
    // Silencio absoluto: cancelamos cualquier voz pendiente en el navegador
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  async function loadHistory() {
    const { data } = await supabase
      .from('chat_history')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(50);
    if (data) setMessages(data);
  }

  function setupSpeechRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'es-ES';
      recognitionRef.current.continuous = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setInput(text);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }

  async function handleSend() {
    if (!input.trim() || loading) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await askHedy(input, messages);
      const hedyMsg = { 
        role: 'hedy', 
        content: response.message, 
        strategic_feedback: response.strategic_feedback 
      };

      setMessages(prev => [...prev, hedyMsg]);
      /* Desactivado temporalmente por error 400 en Supabase
      await supabase.from('chat_history').insert([
        { role: 'user', content: userMsg.content },
        { role: 'hedy', content: hedyMsg.content }
      ]);
      */

      // Guardamos las acciones en el estado para que se procesen si el usuario acepta
      if (response.actions && response.actions.length > 0) {
        setPendingActions(response.actions);
      } else {
        setPendingActions(null);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  async function confirmActions() {
    if (!pendingActions) return;
    setIsSaving(true);

    try {
      for (const action of pendingActions) {
        if (!action.table) continue;
        
        if (action.op === 'INSERT') {
          await supabase.from(action.table).insert(action.data);
        } else if (action.op === 'UPDATE' && action.table === 'proyectos') {
          if (!action.data || !action.data.id) continue;
          const { id, ...updates } = action.data;
          await supabase.from('proyectos').update(updates).eq('id', id);
        } else if (action.op === 'PATCH' && action.table === 'config_estrategia') {
          const { data: current } = await supabase.from('config_estrategia').select('*').single();
          if (action.data.target === 'infraestructura') {
            const updatedHub = current.hub_infraestructura.map((item: any) => 
              item.id === action.data.id ? { ...item, ...action.data } : item
            );
            await supabase.from('config_estrategia').update({ hub_infraestructura: updatedHub }).eq('id', current.id);
          } else if (action.data.target === 'social_media_idea') {
            const updatedIdeas = [...(current.hub_social_media?.monthlyIdeas || []), action.data.idea];
            const updatedSocial = { ...current.hub_social_media, monthlyIdeas: updatedIdeas };
            await supabase.from('config_estrategia').update({ hub_social_media: updatedSocial }).eq('id', current.id);
          }
        }
      }

      setMessages(prev => [...prev, { role: 'hedy', content: "✅ Cambios aplicados con éxito en Servicios Master y Bitácora." }]);
      setPendingActions(null);
    } catch (err) {
      console.error(err);
      alert("Error al aplicar cambios.");
    } finally {
      setIsSaving(false);
    }
  }

  async function clearChat() {
    if (!confirm("¿Seguro que quieres borrar toda la conversación? No se puede deshacer.")) return;
    setLoading(true);
    await supabase.from('chat_history').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    setMessages([]);
    setLoading(false);
  }

  function toggleListening() {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  }

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-160px)] lg:h-[calc(100vh-180px)]">
      {/* Container Principal */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden relative">
        
        {/* Chat Area */}
        <div className="flex flex-1 flex-col rounded-[20px] lg:rounded-[40px] border-2 bg-white/50 backdrop-blur-md shadow-2xl overflow-hidden min-h-[400px] transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-[var(--primary)] px-4 lg:px-8 py-4 lg:py-5 text-white">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-xl lg:rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <Brain className="text-[var(--accent)]" size={20} />
              </div>
              <div>
                <h3 className="text-base lg:text-lg font-black tracking-tight">Hedy Assistant</h3>
                <p className="text-[8px] lg:text-[10px] font-bold uppercase tracking-widest text-[#93c5fd]">Strategic Support Active</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={loadHistory}
                title="Refrescar Chat"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <History size={18} className={loading ? "animate-spin" : ""} />
              </button>
              <button 
                onClick={clearChat}
                title="Borrar Conversación"
                className="p-2 hover:bg-red-500/20 text-red-200 hover:text-red-100 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-4 lg:space-y-6 scrollbar-hide">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center py-10">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[30px] bg-blue-50 text-blue-600 shadow-inner group">
                   <Brain size={40} className="group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-3xl font-black text-[var(--primary)] tracking-tighter">¿En qué trabajamos hoy?</h3>
                <p className="mt-3 max-w-md text-sm font-bold text-gray-500 leading-relaxed">
                  Soy tu socia estratégica. Aquí tienes algunas cosas que puedo hacer por ti ahora mismo:
                </p>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
                  {[
                    { icon: <TrendingUp size={18} />, title: "Gestionar CRM", desc: "Sube el progreso de tus servicios (Web, Landing, CRM...)", prompt: "Avancé hoy en el CRM al 60%" },
                    { icon: <Sparkles size={18} />, title: "Ideas de Contenido", desc: "Guarda ideas para tus reels o videos de TikTok", prompt: "Tengo una idea para un video de TikTok..." },
                    { icon: <History size={18} />, title: "Bitácora Diaria", desc: "Registra qué hiciste hoy para que no se olvide", prompt: "Anota mis logros de hoy: Diseñé el logo y..." },
                    { icon: <Database size={18} />, title: "Referencias", desc: "Añade videos o cuentas que te inspiren", prompt: "Guarda este video de referencia: https://..." }
                  ].map((cap, i) => (
                    <button 
                      key={i}
                      onClick={() => setInput(cap.prompt)}
                      className="flex flex-col items-start p-5 rounded-[24px] border-2 border-gray-100 bg-white hover:border-blue-400 hover:shadow-xl transition-all text-left group"
                    >
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {cap.icon}
                      </div>
                      <span className="text-sm font-black text-[var(--primary)]">{cap.title}</span>
                      <span className="text-[10px] font-bold text-gray-400 mt-1 leading-tight">{cap.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-[30px] p-6 shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-[var(--primary)] text-white' 
                    : 'bg-white border-2 border-gray-100 text-[var(--primary)]'
                }`}>
                  <p className="text-sm font-bold leading-relaxed">{msg.content}</p>
                  {msg.strategic_feedback && (
                    <div className="mt-4 border-t pt-4 text-xs font-medium text-blue-600 italic">
                      {msg.strategic_feedback}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* In-Chat Action Confirmation */}
            {pendingActions && (
              <div className="flex justify-start animate-in slide-in-from-left duration-300">
                <div className="max-w-[85%] rounded-[30px] border-2 border-blue-500 bg-blue-50 p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-4 text-blue-600">
                    <Database size={20} />
                    <h4 className="text-sm font-black uppercase tracking-tighter">Acción Requerida</h4>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    {pendingActions.map((action, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-bold text-blue-800 bg-blue-100/50 p-2 rounded-xl">
                        <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[8px] uppercase">{action.op}</span>
                        <span>{action.table === 'actividad' ? 'Añadir a Bitácora' : 'Actualizar Servicio'}</span>
                        {action.data.categoria && <span className="text-blue-400">• {action.data.categoria}</span>}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={confirmActions}
                      disabled={isSaving}
                      className="flex-1 rounded-2xl bg-blue-600 py-3 text-sm font-black text-white shadow-lg hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      {isSaving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <><CheckCircle2 size={18} /> Confirmar</>}
                    </button>
                    <button 
                      onClick={() => setPendingActions(null)}
                      disabled={isSaving}
                      className="flex-1 rounded-2xl bg-white border-2 border-blue-200 py-3 text-sm font-black text-blue-600 hover:bg-blue-50 transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-2 rounded-[20px] bg-gray-100 p-4">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-blue-400" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:-.3s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:-.5s]" />
                </div>
              </div>
            )}
          </div>

           {/* Input Area */}
          <div className="border-t p-4 lg:p-6 bg-white/50">
            <div className="relative flex items-center gap-2 lg:gap-3">
              <button 
                onClick={toggleListening}
                className={`flex h-12 w-12 lg:h-14 lg:w-14 shrink-0 items-center justify-center rounded-xl lg:rounded-2xl transition-all ${
                  isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <input 
                type="text" 
                value={input}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Dile algo a Hedy..."
                className="w-full rounded-xl lg:rounded-2xl border-2 border-gray-100 bg-white px-4 lg:px-6 py-3 lg:py-4 text-sm lg:text-base font-bold text-[var(--primary)] outline-none focus:border-blue-400 transition-all shadow-inner"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="absolute right-2 flex h-8 w-8 lg:h-10 lg:w-10 items-center justify-center rounded-lg lg:rounded-xl bg-blue-600 text-white shadow-lg hover:shadow-blue-200 disabled:opacity-30 disabled:shadow-none transition-all hover:scale-105"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
