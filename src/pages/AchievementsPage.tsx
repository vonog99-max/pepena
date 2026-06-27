import React from 'react';
import { useGameStore } from '../store/gameStore';
import { ACHIEVEMENTS } from '../data/achievements';
import { Trophy, CheckCircle, Circle } from 'lucide-react';
import { audio } from '../audio/sounds';

export function AchievementsPage() {
  const { profile, updateProfile } = useGameStore();

  const unlockedCount = ACHIEVEMENTS.filter(a => profile.achievements[a.id]).length;
  const progressPercent = Math.round((unlockedCount / ACHIEVEMENTS.length) * 100) || 0;

  const togglePinAchievement = (achId: string) => {
    audio.playClick();
    const currentPins = profile.pinnedAchievements || [];
    if (currentPins.includes(achId)) {
      updateProfile({ pinnedAchievements: currentPins.filter(id => id !== achId) });
    } else {
      if (currentPins.length >= 3) {
        // Just replace the oldest pin
        const newPins = [...currentPins.slice(1), achId];
        updateProfile({ pinnedAchievements: newPins });
      } else {
        updateProfile({ pinnedAchievements: [...currentPins, achId] });
      }
    }
  };

  return (
    <div className="w-full h-full p-4 sm:p-6 md:p-8 bg-[#060608] relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5 pointer-events-none mix-blend-screen"></div>
      
      <div className="relative z-10 flex flex-col h-full max-w-5xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)] flex items-center gap-3">
              <Trophy className="w-8 h-8" />
              Achievements
            </h1>
            <p className="text-zinc-400 text-sm mt-1 font-mono">Unlock milestones for glory</p>
          </div>
          
          <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 flex items-center gap-4 min-w-[250px]">
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold text-zinc-300 uppercase tracking-widest mb-1">
                <span>Completion</span>
                <span className="text-amber-400">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                <div 
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
            <div className="text-2xl font-black text-amber-500 font-mono">
              {unlockedCount}<span className="text-zinc-600 text-sm">/{ACHIEVEMENTS.length}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3 hide-scrollbar pb-10">
          {ACHIEVEMENTS.map(ach => {
            const isUnlocked = profile.achievements[ach.id];
            const isPinned = profile.pinnedAchievements?.includes(ach.id);

            return (
              <div 
                key={ach.id}
                className={`relative overflow-hidden p-4 rounded-2xl transition-all ${
                  isUnlocked 
                    ? 'bg-amber-900/40' 
                    : 'bg-zinc-800 opacity-70'
                }`}
              >
                {isUnlocked && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
                )}
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 ${
                    isUnlocked ? 'bg-amber-500/20 border-amber-400 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'bg-zinc-800 border-zinc-700 text-zinc-600'
                  }`}>
                    <Trophy size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-black uppercase tracking-wider text-sm md:text-base ${isUnlocked ? 'text-amber-300' : 'text-zinc-400'}`}>
                      {ach.name}
                    </h3>
                    <p className="text-zinc-500 text-xs mt-0.5">{ach.description}</p>
                    
                    {ach.reward && (
                      <div className="mt-2 inline-block px-2 py-0.5 bg-black/40 rounded border border-white/5 text-[10px] font-mono text-emerald-400">
                        Reward: {ach.reward.type === 'gems' ? `+${ach.reward.value} Gems` : `${ach.reward.value} Stats`}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {isUnlocked ? (
                      <div className="text-amber-500 flex items-center gap-1 text-xs font-bold uppercase tracking-widest">
                        <CheckCircle size={14} /> Unlocked
                      </div>
                    ) : (
                      <div className="text-zinc-600 flex items-center gap-1 text-xs font-bold uppercase tracking-widest">
                        <Circle size={14} /> Locked
                      </div>
                    )}
                    
                    {isUnlocked && (
                      <button 
                        onClick={() => togglePinAchievement(ach.id)}
                        className={`px-3 py-1 text-[10px] uppercase font-black tracking-widest rounded-lg border transition-all ${
                          isPinned 
                            ? 'bg-amber-500 text-amber-950 border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]' 
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'
                        }`}
                      >
                        {isPinned ? 'Pinned' : 'Pin to Profile'}
                      </button>
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
