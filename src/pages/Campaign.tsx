import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { STAGES_DATABASE } from '../data/db';
import { formatNumber } from '../utils';
import { Button } from '../components/ui/Button';
import { audio } from '../audio/sounds';
import { Skull, Clock, ChevronLeft, ChevronRight, ShieldAlert, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Campaign({ onStartBattle }: { onStartBattle: (id: string) => void }) {
  const { campaignProgress } = useGameStore();
  
  const campaignStages = STAGES_DATABASE.filter(s => !s.id.startsWith('event-'));
  const bonusGoldEvents = STAGES_DATABASE.filter(s => s.id.startsWith('event-') && s.id !== 'event-global-boss');
  const chapters = Array.from(new Set(campaignStages.map(s => parseInt(s.id.split('-')[0]))))
                   .sort((a, b) => a - b);
  
  const [currentChapter, setCurrentChapter] = useState(1);
  const [timeLeft, setTimeLeft] = useState('');
  const [showGoldBounties, setShowGoldBounties] = useState(false);

  useEffect(() => {
    const pStr = String(campaignProgress).split('-')[0];
    const pNum = parseInt(pStr) || 1;
    setCurrentChapter(Math.max(1, pNum));
  }, [campaignProgress]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextReset = new Date();
      nextReset.setUTCHours(24, 0, 0, 0);
      const diff = nextReset.getTime() - now.getTime();
      
      if (diff <= 0) return '00:00:00';
      
      const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
      const m = Math.floor((diff / (1000 * 60)) % 60).toString().padStart(2, '0');
      const s = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
      
      return `${h}:${m}:${s}`;
    };

    setTimeLeft(calculateTimeLeft());
    const int = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(int);
  }, []);

  const handleStart = (id: string) => {
    audio.playClick();
    onStartBattle(id);
  };

  const handlePrevChapter = () => {
    if (currentChapter > 1) setCurrentChapter(currentChapter - 1);
  };

  const handleNextChapter = () => {
    if (currentChapter < Math.max(...chapters)) setCurrentChapter(currentChapter + 1);
  };

  const currentStages = campaignStages.filter(s => parseInt(s.id.split('-')[0]) === currentChapter);

  return (
    <div className="w-full h-full p-6 overflow-y-auto bg-gradient-to-b from-[#060608] to-[#0a0a0f] text-slate-200">
      
      <div className="mb-10 w-full relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 via-red-900/20 to-purple-900/40 rounded-3xl blur-xl"></div>
        <div className="relative bg-black/60 border border-purple-500/30 rounded-3xl overflow-hidden p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-500/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex-1 z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-red-600 text-white text-[10px] font-black tracking-widest px-2 py-1 rounded">LIVE EVENT</span>
              <div className="flex items-center gap-1.5 text-purple-300 text-sm font-mono bg-purple-900/40 px-3 py-1 rounded-full border border-purple-500/20">
                <Clock className="w-4 h-4" />
                {timeLeft}
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-2 drop-shadow-[0_2px_10px_rgba(168,85,247,0.5)] flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-red-500" />
              Global Boss
            </h3>
            <p className="text-purple-300/80 text-sm max-w-md">The Global Void Entity has appeared! Join players worldwide in defeating this cosmic threat before the time runs out.</p>
            
            <div className="mt-4 bg-black/80 border border-red-900/50 rounded-xl p-3 inline-block">
              <div className="text-xs text-red-400 font-bold uppercase tracking-widest mb-1">Entity HP</div>
              <div className="text-xl md:text-2xl font-mono font-black text-red-500">{formatNumber(1e100)}</div>
            </div>
          </div>

          <div className="z-10 w-full md:w-auto shrink-0 flex flex-col gap-3 items-center">
            <button 
              onClick={() => handleStart('event-global-boss')}
              className="w-full md:w-64 bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-500 hover:to-red-500 text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(239,68,68,0.6)] transition-all hover:scale-105 active:scale-95 border border-white/20 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Skull className="w-5 h-5" />
                FIGHT BOSS
              </span>
            </button>
            <div className="text-xs text-purple-400 font-mono tracking-wider">REWARDS: INSTANT MYTHIC GEAR</div>
          </div>
        </div>
      </div>

      <div className="mb-10 border border-yellow-600/20 bg-yellow-950/5 rounded-3xl p-6">
        <button 
          onClick={() => { audio.playClick(); setShowGoldBounties(!showGoldBounties); }}
          className="w-full flex items-center justify-between text-left focus:outline-none"
        >
          <div>
            <h2 className="text-2xl font-black uppercase tracking-widest text-[#fde047] drop-shadow-md flex items-center gap-2">
              <span>🪙 Gold Bounties (Omega Ascension Prep)</span>
            </h2>
            <p className="text-zinc-400 text-xs mt-1">Defeat these weak targets to easily gather Octovigintillion gold and achieve Omega Ascension!</p>
          </div>
          <div className="p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
            {showGoldBounties ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {showGoldBounties && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {bonusGoldEvents.map((stage) => (
              <div key={stage.id} className="p-6 rounded-3xl border border-yellow-600/30 bg-yellow-950/10 hover:border-yellow-400 hover:shadow-[0_0_35px_rgba(234,179,8,0.15)] group backdrop-blur-sm transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-[10px] font-black text-yellow-500 mb-1 tracking-widest uppercase">SPECIAL EVENT</div>
                    <h4 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">{stage.stageName}</h4>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 text-yellow-400 group-hover:scale-110 transition-transform">
                    🪙
                  </div>
                </div>
                <div className="text-xs text-zinc-400 mb-6 flex flex-col gap-1.5 font-mono bg-black/40 p-3 rounded-xl border border-white/5">
                  <div>Target HP: <span className="text-green-500 font-bold">Weak (EASY WIN)</span></div>
                  <div>Gold Reward: <span className="text-yellow-400 font-black">{formatNumber(stage.rewards.gold)}</span></div>
                  <div>Gem Reward: <span className="text-blue-400 font-black">+{formatNumber(stage.rewards.gems)}</span></div>
                </div>
                <button 
                  onClick={() => handleStart(stage.id)} 
                  className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-black font-black uppercase tracking-wider py-3 rounded-xl shadow-lg active:scale-95 transition-all"
                >
                  CLAIM BOUNTY
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h2 className="text-3xl font-black uppercase tracking-widest text-white drop-shadow-md">Campaign</h2>
        
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-2 shadow-inner">
          <button 
            onClick={handlePrevChapter}
            disabled={currentChapter === 1}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/50 text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-black/50 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="px-6 py-2 text-center min-w-[140px]">
            <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Chapter</div>
            <div className="text-2xl font-black text-white">{currentChapter}</div>
          </div>

          <button 
            onClick={handleNextChapter}
            disabled={currentChapter === Math.max(...chapters)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/50 text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-black/50 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentChapter}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {currentStages.map((stage) => {
            let isUnlocked = false;
            
            const parseStage = (id: string) => {
              const [c, s] = id.split('-').map(Number);
              return { c: c || 0, s: s || 0 };
            };
            
            const currentObj = parseStage(stage.id);
            const progressObj = parseStage(campaignProgress);

            if (currentObj.c < progressObj.c) {
              isUnlocked = true;
            } else if (currentObj.c === progressObj.c) {
              if (currentObj.s <= progressObj.s) {
                isUnlocked = true;
              }
            }

            return (
              <div 
                key={stage.id} 
                className={`p-6 rounded-3xl border transition-all ${
                  isUnlocked 
                    ? 'bg-black/40 border-blue-500/30 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] group backdrop-blur-sm' 
                    : 'bg-black/20 border-white/5 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-[10px] font-black text-blue-400 mb-1 tracking-widest uppercase">{stage.worldName}</div>
                    <div className="text-2xl font-black text-white flex items-center gap-2">
                       {stage.stageName}
                       {stage.isBoss && <span className="text-[9px] bg-red-600/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30 tracking-widest uppercase">BOSS</span>}
                    </div>
                  </div>
                  {isUnlocked && (
                     <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                       <Sparkles className="w-4 h-4" />
                     </div>
                  )}
                </div>
                
                <div className="text-xs text-zinc-400 mb-6 font-mono bg-white/5 inline-block px-3 py-1.5 rounded-lg border border-white/5">
                  Hostile Units: <span className="text-white font-bold">{stage.enemies.length}</span>
                </div>
                
                <div className="flex gap-2">
                  {isUnlocked ? (
                    <button 
                      onClick={() => handleStart(stage.id)} 
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider py-3 rounded-xl transition-all shadow-lg active:scale-95 border border-blue-400/50"
                    >
                      Deploy Team
                    </button>
                  ) : (
                    <button disabled className="w-full bg-white/5 text-zinc-500 font-bold uppercase tracking-wider py-3 rounded-xl border border-white/5">
                      Classified
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
