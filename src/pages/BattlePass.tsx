import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Star, Gift, Gem, Coins, Lock, CheckCircle2, ChevronUp } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { formatNumber } from '../utils';

export function BattlePass() {
  const { profile, inventory, addHero, updateProfile, deductRubies, deductGems, awardRewards } = useGameStore();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isPremium = profile.hasBattlePass;
  const currentBPLevel = Math.min(20, Math.max(profile.battlePassLevel || 1, Math.floor(profile.level / 2) + 1));

  const rewards = Array.from({ length: 20 }, (_, i) => ({
    level: i + 1,
    free: { type: i % 2 === 0 ? 'coins' : 'gems', amount: i % 2 === 0 ? 500 * (i + 1) : 50 * (i + 1) },
    premium: { type: i === 19 ? 'hero' : 'ruby', amount: i === 19 ? 'Saitama' : 50 }
  }));

  const handleUnlockPremium = () => {
    setSuccessMsg(null);
    setErrorMsg(null);
    if (isPremium) return;

    if (deductRubies(300)) {
      updateProfile({ hasBattlePass: true });
      setSuccessMsg("Successfully unlocked Premium Battle Pass!");
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setErrorMsg("Insufficient Rubies! You need 300 Rubies to unlock Premium Battle Pass.");
      setTimeout(() => setErrorMsg(null), 4000);
    }
  };

  const handleBuyLevel = () => {
    setSuccessMsg(null);
    setErrorMsg(null);
    if (profile.battlePassLevel >= 20) {
      setErrorMsg("Battle Pass is already at maximum level.");
      return;
    }

    if (deductGems(100)) {
      const nextLvl = (profile.battlePassLevel || 1) + 1;
      updateProfile({ battlePassLevel: nextLvl });
      setSuccessMsg(`Upgraded Battle Pass to Level ${nextLvl}!`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setErrorMsg("Insufficient Gems! Upgrading costs 100 Gems.");
      setTimeout(() => setErrorMsg(null), 4000);
    }
  };

  const handleClaimAll = () => {
    setSuccessMsg(null);
    setErrorMsg(null);

    const claimed = { ...(profile.claimedRewards || {}) };
    let coinsEarned = 0;
    let gemsEarned = 0;
    let rubiesEarned = 0;
    let sSummoned = false;
    let claimedCount = 0;

    rewards.forEach(tier => {
      if (tier.level <= currentBPLevel) {
        const freeKey = `free_${tier.level}`;
        if (!claimed[freeKey]) {
          claimed[freeKey] = true;
          claimedCount++;
          if (tier.free.type === 'coins') coinsEarned += tier.free.amount as number;
          if (tier.free.type === 'gems') gemsEarned += tier.free.amount as number;
        }

        if (isPremium) {
          const premKey = `prem_${tier.level}`;
          if (!claimed[premKey]) {
            claimed[premKey] = true;
            claimedCount++;
            if (tier.premium.type === 'ruby') rubiesEarned += tier.premium.amount as number;
            if (tier.premium.type === 'hero') sSummoned = true;
          }
        }
      }
    });

    if (claimedCount === 0) {
      setErrorMsg("No unclaimed rewards available at your current level.");
      setTimeout(() => setErrorMsg(null), 4000);
      return;
    }

    awardRewards(coinsEarned, gemsEarned, 0, rubiesEarned);
    if (sSummoned) {
      addHero('saitama_hero');
    }

    updateProfile({ claimedRewards: claimed });
    
    let summary = `Claimed rewards: `;
    if (coinsEarned > 0) summary += `+${formatNumber(coinsEarned)} Gold `;
    if (gemsEarned > 0) summary += `+${formatNumber(gemsEarned)} Gems `;
    if (rubiesEarned > 0) summary += `+${formatNumber(rubiesEarned)} Rubies `;
    if (sSummoned) summary += `+Saitama (One Punch Man) `;

    setSuccessMsg(summary.trim());
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  return (
    <div className="w-full h-full p-6 overflow-y-auto text-white bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="bg-gradient-to-r from-purple-950 to-indigo-950 border border-purple-500/20 p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none"></div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">SEASON 1</h1>
            <p className="text-purple-300 mt-1 tracking-widest uppercase text-xs font-bold">Absolute Hero Pass</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="bg-purple-900/40 border border-purple-500/20 rounded-full px-4 py-1 text-xs">
                Pass Level: <span className="font-extrabold text-purple-300">{currentBPLevel} / 20</span>
              </div>
              <div className="text-xs text-zinc-400">
                (Based on profile level {profile.level})
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {!isPremium ? (
              <button 
                onClick={handleUnlockPremium}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-extrabold py-3 px-6 rounded-xl shadow-lg shadow-pink-500/20 transition-all active:scale-95 text-sm"
              >
                Unlock Premium (300 Rubies)
              </button>
            ) : (
              <div className="bg-purple-900/20 border border-purple-500/30 text-purple-300 font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} className="text-purple-400" /> Premium Active
              </div>
            )}
            
            {currentBPLevel < 20 && (
              <button 
                onClick={handleBuyLevel}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold py-3 px-6 rounded-xl text-sm flex items-center gap-2 transition-all active:scale-95"
              >
                <ChevronUp size={16} className="text-blue-400" /> +1 Level (100 Gems)
              </button>
            )}
          </div>
        </div>

        {successMsg && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-sm font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0 rotate-45 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex justify-between items-center bg-zinc-950 p-4 border border-zinc-900 rounded-xl">
          <div className="text-xs text-zinc-400">
            Current Rubies: <span className="font-bold text-white ml-1">{inventory.rubies || 0}</span>
          </div>
          <button 
            onClick={handleClaimAll}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-6 rounded-lg transition-all flex items-center gap-2 text-sm shadow-md active:scale-95"
          >
            <Gift size={16} /> Claim All Rewards
          </button>
        </div>

        <div className="space-y-3">
          {rewards.map((tier) => {
            const isUnlocked = tier.level <= currentBPLevel;
            const isFreeClaimed = !!profile.claimedRewards?.[`free_${tier.level}`];
            const isPremClaimed = !!profile.claimedRewards?.[`prem_${tier.level}`];

            return (
              <div key={tier.level} className="flex gap-4">
                <div className={`w-16 h-20 border rounded-xl flex flex-col items-center justify-center shrink-0 ${isUnlocked ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-950/40 border-zinc-900 opacity-60'}`}>
                  <div className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">LVL</div>
                  <div className={`text-2xl font-black ${isUnlocked ? 'text-zinc-200' : 'text-zinc-600'}`}>{tier.level}</div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className={`relative rounded-xl p-4 border flex items-center justify-between ${isUnlocked ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-950/20 border-zinc-900/40 opacity-60'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-950 flex items-center justify-center border border-zinc-800">
                        {tier.free.type === 'coins' ? <Coins className="text-yellow-500" size={18} /> : <Gem className="text-blue-400" size={18} />}
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider">Free Reward</div>
                        <div className="font-bold text-xs text-white">{formatNumber(tier.free.amount as number)} {tier.free.type.toUpperCase()}</div>
                      </div>
                    </div>
                    {isFreeClaimed && (
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">Claimed</span>
                    )}
                  </div>

                  <div className={`relative rounded-xl p-4 border flex items-center justify-between ${isPremium && isUnlocked ? 'bg-purple-950/20 border-purple-500/30' : 'bg-zinc-950/40 border-zinc-900'}`}>
                    {!isPremium && (
                      <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-end pr-4 z-10">
                        <Lock size={14} className="text-zinc-600" />
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-950/50 flex items-center justify-center border border-purple-500/20">
                        {tier.premium.type === 'ruby' ? <Star className="text-purple-400" size={18} /> : <Star className="text-pink-400 animate-pulse" size={18} />}
                      </div>
                      <div>
                        <div className="text-[10px] text-purple-400 font-extrabold uppercase tracking-wider">Premium Reward</div>
                        <div className="font-bold text-xs text-white">
                          {tier.premium.type === 'hero' ? 'Saitama (One Punch Man)' : `${tier.premium.amount} RUBIES`}
                        </div>
                      </div>
                    </div>
                    {isPremium && isPremClaimed && (
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">Claimed</span>
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
