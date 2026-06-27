import React from 'react';
import { useGameStore } from '../store/gameStore';

export function Inventory() {
  const { inventory } = useGameStore();

  return (
    <div className="w-full h-full p-6 overflow-y-auto">
      <h2 className="text-3xl font-black mb-6">Inventory</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors"></div>
          <div className="text-4xl mb-2">🪙</div>
          <div className="text-2xl font-bold font-mono text-yellow-400">{inventory.gold}</div>
          <div className="text-sm text-slate-500 font-medium tracking-wide">GOLD</div>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors"></div>
          <div className="text-4xl mb-2">💎</div>
          <div className="text-2xl font-bold font-mono text-purple-400">{inventory.gems}</div>
          <div className="text-sm text-slate-500 font-medium tracking-wide">GEMS</div>
        </div>
      </div>

      <h3 className="text-xl font-bold mt-12 mb-4 border-b border-slate-800 pb-2">Materials</h3>
      <div className="text-slate-500 text-sm">No materials empty.</div>
    </div>
  );
}
