import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { formatNumber } from '../../utils';
import { Coins, Gem, ArrowLeft, ShieldAlert, MessageSquare, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { GlobalChat } from '../chat/GlobalChat';

export function GameLayout({ children, currentTab, onTabChange }: { children: React.ReactNode, currentTab: string, onTabChange: (tab: string) => void }) {
  const { inventory } = useGameStore();
  const { user, isAdmin } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#060608] text-slate-200 flex flex-col font-sans overflow-hidden h-screen selection:bg-blue-500/30">
      
      <header className="h-16 bg-[#060608]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-50 w-full relative">
        <div className="flex items-center gap-4 relative z-10">
          {currentTab !== 'home' ? (
            <button 
              onClick={() => onTabChange('home')}
              className="group flex items-center gap-2.5 hover:bg-white/5 p-2 rounded-xl transition-all text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-semibold tracking-wide hidden sm:block">Return</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-sm shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                H
              </div>
              <span className="font-bold text-white tracking-widest uppercase hidden sm:block text-sm">Hero RPG</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 z-10">
          {isAdmin && (
            <button 
              onClick={() => onTabChange('admin')}
              className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 bg-red-500/10 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-red-500/20 active:scale-95 transition-all"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Admin</span>
            </button>
          )}

          <div className="flex items-center gap-2 sm:gap-3 bg-zinc-900/60 border border-zinc-800 px-2 sm:px-3 py-1.5 rounded-xl shadow-xl">
            <div className="flex items-center gap-1 sm:gap-1.5">
               <Coins className="w-3.5 h-3.5 text-emerald-400" />
               <span className="font-mono text-xs sm:text-sm font-medium tracking-wide text-zinc-200">{formatNumber(inventory.gold)}</span>
            </div>
            <div className="w-px h-4 bg-zinc-800"></div>
            <div className="flex items-center gap-1 sm:gap-1.5">
               <Gem className="w-3.5 h-3.5 text-fuchsia-400" />
               <span className="font-mono text-xs sm:text-sm font-medium tracking-wide text-fuchsia-100">{formatNumber(inventory.gems)}</span>
            </div>
            <div className="w-px h-4 bg-zinc-800"></div>
            <div className="flex items-center gap-1 sm:gap-1.5 bg-red-500/5 px-1.5 py-0.5 rounded-lg border border-red-500/10">
               <Gem className="w-3.5 h-3.5 text-red-500" />
               <span className="font-mono text-xs sm:text-sm font-medium tracking-wide text-red-100">{formatNumber(inventory.rubies || 0)}</span>
               <button 
                 onClick={() => onTabChange('shop')}
                 className="p-1 hover:bg-white/10 rounded-md transition-colors text-amber-400 hover:text-amber-300 ml-1 flex items-center justify-center border border-transparent hover:border-white/10"
                 title="Open Shop"
               >
                 <ShoppingCart className="w-3 h-3" />
               </button>
            </div>
          </div>
          
          <button 
            onClick={() => setChatOpen(!chatOpen)}
            className={`p-2 rounded-xl border transition-all active:scale-95 ${chatOpen ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'}`}
          >
             <MessageSquare size={16} />
          </button>
        </div>
        
        <div className="absolute top-0 inset-x-1/4 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <main className="flex-1 relative overflow-hidden bg-gradient-to-b from-[#060608] to-[#0a0a0f]">
          {children}
        </main>
        {chatOpen && <GlobalChat onClose={() => setChatOpen(false)} />}
      </div>
    </div>
  );
}
