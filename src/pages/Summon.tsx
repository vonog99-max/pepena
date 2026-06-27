import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { HERO_DATABASE } from '../data/db';
import { Button } from '../components/ui/Button';
import { audio } from '../audio/sounds';
import { motion, AnimatePresence } from 'motion/react';

const RATES = {
  Common: 62,
  Rare: 24,
  Epic: 11,
  Legendary: 2.4,
  Mythic: 0.5,
  '∞ infinite and beyond stars ★': 0.1
};

const RARITY_COLORS = {
  Common: 'text-slate-400 border-slate-600 bg-slate-900',
  Rare: 'text-blue-400 border-blue-600 bg-blue-950',
  Epic: 'text-purple-400 border-purple-600 bg-purple-950',
  Legendary: 'text-yellow-400 border-yellow-600 bg-yellow-950',
  Mythic: 'text-red-400 border-red-600 bg-red-950',
  '∞ infinite and beyond stars ★': 'text-[#ec4899] border-pink-700 bg-pink-950/40'
};

const EGG_ASSETS = {
  Common: {
    emoji: '🥚',
    count: 1,
    glow: 'shadow-[0_0_15px_rgba(148,163,184,0.3)] bg-slate-950 border-slate-700',
    color: 'from-slate-500 to-slate-400 text-slate-300'
  },
  Rare: {
    emoji: '🥚',
    count: 2,
    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.4)] bg-blue-950/40 border-blue-800',
    color: 'from-blue-600 to-blue-400 text-blue-300'
  },
  Epic: {
    emoji: '🥚',
    count: 3,
    glow: 'shadow-[0_0_25px_rgba(168,85,247,0.5)] bg-purple-950/40 border-purple-800',
    color: 'from-purple-600 to-purple-400 text-purple-300'
  },
  Legendary: {
    emoji: '🥚',
    count: 4,
    glow: 'shadow-[0_0_30px_rgba(234,179,8,0.6)] bg-yellow-950/40 border-yellow-800',
    color: 'from-amber-500 to-yellow-400 text-yellow-300'
  },
  Mythic: {
    emoji: '🥚',
    count: 5,
    glow: 'shadow-[0_0_35px_rgba(239,68,68,0.7)] bg-red-950/40 border-red-800',
    color: 'from-red-600 to-rose-400 text-red-300'
  },
  '∞ infinite and beyond stars ★': {
    emoji: '🪐',
    count: 3,
    glow: 'shadow-[0_0_40px_rgba(236,72,153,0.8)] bg-pink-950/40 border-pink-800',
    color: 'from-pink-600 to-purple-500 text-pink-300'
  }
};

export function Summon() {
  const { deductGems, addHero, recordStat, awardRewards } = useGameStore();
  const [summoned, setSummoned] = useState<any[]>([]);

  const [autoDelete, setAutoDelete] = useState<Record<string, boolean>>({
    Common: false,
    Rare: false,
    Epic: false,
    Legendary: false,
    Mythic: false,
    '∞ infinite and beyond stars ★': false
  });

  const pullHero = () => {
    const roll = Math.random() * 100;
    let rarity = 'Common';
    let cumulative = 0;
    for (const [r, chance] of Object.entries(RATES)) {
      cumulative += chance;
      if (roll <= cumulative) {
        rarity = r;
        break;
      }
    }
    
    const possible = HERO_DATABASE.filter(h => h.rarity === rarity);
    return possible[Math.floor(Math.random() * possible.length)] || HERO_DATABASE[0];
  };

  const handleSummon = (times: number) => {
    const cost = times * 100;
    if (deductGems(cost)) {
      audio.playSummon();
      const results = [];
      let totalRefund = 0;
      
      for (let i = 0; i < times; i++) {
        const hero = pullHero();
        const shouldDelete = !!autoDelete[hero.rarity];

        if (shouldDelete) {
          totalRefund += 50;
          results.push({ ...hero, autoDeleted: true });
          recordStat('heroesSummoned', 1);
        } else {
          results.push(hero);
          addHero(hero.id);
        }
      }

      if (totalRefund > 0) {
        awardRewards(totalRefund, 0, 0);
      }
      setSummoned(results);
    } else {
      audio.playHit();
      alert('Not enough gems!');
    }
  };

  return (
    <div className="w-full h-full p-6 flex flex-col items-center overflow-y-auto bg-[#0A0A0B] text-white">
      <h2 className="text-3xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8 uppercase">Summon Portal</h2>
      
      <div className="w-full max-w-4xl bg-zinc-900/60 border border-zinc-850 p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-1">Auto-Delete Configuration</h3>
          <p className="text-xs text-zinc-400">Choose which rarities to recycle automatically for +50 Gold coins upon summoning.</p>
        </div>
        <div className="flex flex-wrap gap-3 max-w-xl justify-end">
          {Object.keys(RATES).map((rarity) => (
            <label key={rarity} className="flex items-center gap-2 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors text-xs">
              <input 
                type="checkbox" 
                checked={!!autoDelete[rarity]}
                onChange={(e) => { 
                  audio.playClick(); 
                  setAutoDelete(prev => ({ ...prev, [rarity]: e.target.checked }));
                }}
                className="accent-emerald-500 w-3.5 h-3.5"
              />
              <span className="truncate max-w-[140px]">{rarity}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mb-12">
        <Button onClick={() => handleSummon(1)} className="px-8 py-4 text-lg flex flex-col items-center shadow-lg shadow-purple-950/20">
          <span className="font-bold">Summon x1</span>
          <span className="text-xs opacity-90 mt-1 font-mono">💎 100</span>
        </Button>
        <Button onClick={() => handleSummon(10)} variant="secondary" className="px-8 py-4 text-lg flex flex-col items-center shadow-lg shadow-zinc-950/30">
          <span className="font-bold">Summon x10</span>
          <span className="text-xs opacity-90 mt-1 font-mono">💎 1000</span>
        </Button>
      </div>

      {summoned.length > 0 && (
        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-5 gap-4 pb-12">
          <AnimatePresence>
            {summoned.map((hero, i) => (
              <motion.div
                key={`${hero.id}-${i}`}
                initial={{ opacity: 0, scale: 0.9, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center relative ${RARITY_COLORS[hero.rarity as keyof typeof RARITY_COLORS] || 'text-white border-white'} shadow-md`}
              >
                {hero.autoDeleted && (
                  <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-red-950 border border-red-500/30 text-[8px] font-black uppercase text-red-400 rounded-md">
                    Recycled +50🪙
                  </span>
                )}
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-inner" style={{ backgroundColor: hero.modelColor }}>
                  <span className="text-lg">
                    {hero.modelType === 'box' ? '⬛' : hero.modelType === 'sphere' ? '⏺' : '▲'}
                  </span>
                </div>
                <div className="font-bold text-xs leading-tight text-white mb-1 truncate max-w-full">{hero.name}</div>
                <div className="text-[9px] uppercase tracking-wider font-extrabold opacity-75">{hero.rarity}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="w-full max-w-4xl space-y-6">
        <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400 uppercase tracking-wide">Egg Portals & Rarity Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
          {Object.keys(RATES).map((rarity) => {
            const eggConf = EGG_ASSETS[rarity as keyof typeof EGG_ASSETS] || EGG_ASSETS.Common;
            const correspondingHeroes = HERO_DATABASE.filter(h => h.rarity === rarity);

            return (
              <div 
                key={rarity} 
                className={`p-5 rounded-2xl border bg-zinc-950/80 flex flex-col gap-4 hover:bg-zinc-950 transition-all ${RARITY_COLORS[rarity as keyof typeof RARITY_COLORS] || 'border-zinc-800'}`}
              >
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                  <div>
                    <span className="text-sm font-black tracking-wider uppercase">{rarity}</span>
                    <span className="text-xs text-zinc-500 font-mono ml-2">({RATES[rarity as keyof typeof RATES]}%)</span>
                  </div>
                  <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border ${eggConf.glow}`}>
                    {Array.from({ length: eggConf.count }).map((_, idx) => (
                      <span key={idx} className="text-xl animate-pulse filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        {eggConf.emoji}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Available Heroes:</div>
                  <div className="flex flex-wrap gap-2.5">
                    {correspondingHeroes.map((hero) => (
                      <div 
                        key={hero.id} 
                        className="group relative flex flex-col items-center justify-center p-2 bg-black/40 rounded-xl border border-zinc-900 w-[58px] aspect-square transition-all hover:border-zinc-700"
                      >
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center shadow-md relative shrink-0"
                          style={{ backgroundColor: hero.modelColor }}
                        >
                          <span className="text-xs">
                            {hero.modelType === 'box' ? '⬛' : hero.modelType === 'sphere' ? '⏺' : '▲'}
                          </span>
                        </div>
                        <div className="absolute bottom-1 text-[8px] text-zinc-400 font-black text-center truncate w-full px-1">
                          {hero.name}
                        </div>
                        
                        <div className="absolute -top-8 bg-zinc-900 border border-zinc-800 text-[10px] text-white px-2 py-1 rounded-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                          {hero.name} (Lvl 1 base)
                        </div>
                      </div>
                    ))}
                    {correspondingHeroes.length === 0 && (
                      <span className="text-xs text-zinc-600 italic">No pool adventurers registered</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
