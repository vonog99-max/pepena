import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useGameStore } from '../store/gameStore';
import { Button } from '../components/ui/Button';
import { CharacterModel } from '../components/3d/CharacterModel';
import { formatNumber } from '../utils';

function HeroModelThumb({ hero }: { hero: any }) {
  return (
    <Canvas camera={{ position: [0, 1.5, 4], fov: 40 }} style={{ width: '100%', height: '100%' }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 5, 2]} intensity={1.5} />
      <Suspense fallback={null}>
        <group position={[0, -0.6, 0]}>
           <CharacterModel unit={{ base: hero, isPlayer: true }} />
        </group>
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}

function HeroModelDisplay({ hero }: { hero: any }) {
  return (
    <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1e293b] to-[#0f172a] flex items-center justify-center">
      <Canvas camera={{ position: [0, 2, 6], fov: 40 }} shadows>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={2} castShadow />
        <Suspense fallback={null}>
          <group position={[0, -1, 0]}>
             <CharacterModel unit={{ base: hero, isPlayer: true }} />
          </group>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

export function Heroes() {
  const { heroes, team, updateTeam } = useGameStore();
  const [selectedHeroInstance, setSelectedHeroInstance] = useState<string | null>(null);
  const [customLevelPoints, setCustomLevelPoints] = useState<number>(1);
  const [omegaError, setOmegaError] = useState<string | null>(null);

  const handleEquipBest = () => {
    const rarityOrder: Record<string, number> = {
      'Common': 0,
      'Rare': 1,
      'Epic': 2,
      'Legendary': 3,
      'Mythic': 4,
      'Celestial': 5,
      'Series': 6,
      'Limited': 7
    };

    const sortedHeroes = [...heroes].sort((a, b) => {
      const rarityDiff = (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
      if (rarityDiff !== 0) return rarityDiff;

      const powerA = a.level * 100 + a.attack + a.maxHp;
      const powerB = b.level * 100 + b.attack + b.maxHp;
      return powerB - powerA;
    });

    const bestHeroes = sortedHeroes.slice(0, 5);
    for (let i = 0; i < 5; i++) {
        updateTeam(i, bestHeroes[i]?.instanceId || null);
    }
  };

  const handleToggleTeam = (heroInstanceId: string) => {
    const isEquipped = team.includes(heroInstanceId);
    if (isEquipped) {
      const idx = team.indexOf(heroInstanceId);
      updateTeam(idx, null);
    } else {
      const emptySlot = team.indexOf(null);
      if (emptySlot !== -1) {
        updateTeam(emptySlot, heroInstanceId);
      }
    }
  };

  const selectedHero = selectedHeroInstance ? heroes.find(h => h.instanceId === selectedHeroInstance) : null;

  if (selectedHero) {
    const isEquipped = team.includes(selectedHero.instanceId);
    const elementIcon = selectedHero.skills[1]?.effectType === 'fire' ? '🔥' : selectedHero.skills[1]?.effectType === 'slash' ? '⚔️' : '✨';

    return (
      <div className="w-full h-full flex flex-col lg:flex-row relative bg-zinc-950 font-sans text-slate-200 overflow-hidden">
        <div className="w-full lg:w-3/5 h-[35vh] lg:h-full relative overflow-hidden bg-gradient-to-b from-slate-900 to-[#030712] shrink-0 border-b lg:border-b-0 lg:border-r border-zinc-900">
          {selectedHero.imageUrl ? (
            <img src={selectedHero.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-80" alt={selectedHero.name} />
          ) : (
            <HeroModelDisplay hero={selectedHero} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-black/30 pointer-events-none"></div>
          
          <button 
            className="absolute top-4 left-4 z-20 w-10 h-10 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-xl text-zinc-300 hover:text-white flex items-center justify-center shadow-xl active:scale-95 transition-all cursor-pointer" 
            onClick={() => setSelectedHeroInstance(null)}
          >
            ◀
          </button>

          <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1.5 max-w-[80%]">
             <div className="text-[10px] font-black text-amber-400 tracking-widest uppercase bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20 w-fit">{selectedHero.rarity}</div>
             <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight drop-shadow-md">
               {selectedHero.name}
             </h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6 bg-zinc-950 scrollbar-thin">
           <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
             <div>
                <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono">Hero Status</span>
                <h2 className="text-xl font-bold text-white uppercase tracking-wide">Combat Configuration</h2>
             </div>
             
             <Button 
               variant={isEquipped ? 'secondary' : 'primary'}
               className="px-6 py-2.5 text-xs font-black shadow-lg uppercase tracking-wider active:scale-95 transition-all"
               onClick={() => handleToggleTeam(selectedHero.instanceId)}
             >
               {isEquipped ? 'Unequip' : 'Equip Team'}
             </Button>
           </div>

           <div className="bg-zinc-900/50 border border-zinc-900 rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center text-sm border-b border-zinc-850/40 pb-2">
                <span className="text-zinc-400">Class Type</span>
                <span className="text-white font-bold">⚔️ Warrior</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-zinc-850/40 pb-2">
                <span className="text-zinc-400">Current Level</span>
                <span className="text-[#fde047] font-black font-mono">
                  Lv. {selectedHero.level === 99999 ? 'Ω Omega' : selectedHero.level}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-1">
                <div className="bg-zinc-950/60 border border-zinc-850 p-2.5 rounded-xl flex flex-col">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono">Health Points</span>
                  <span className="text-sm font-bold text-white font-mono mt-0.5">{formatNumber(selectedHero.maxHp)}</span>
                </div>
                <div className="bg-zinc-950/60 border border-zinc-850 p-2.5 rounded-xl flex flex-col">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono">Attack damage</span>
                  <span className="text-sm font-bold text-white font-mono mt-0.5">{formatNumber(selectedHero.attack)}</span>
                </div>
                <div className="bg-zinc-950/60 border border-zinc-850 p-2.5 rounded-xl flex flex-col">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono">Physical Armor</span>
                  <span className="text-sm font-bold text-white font-mono mt-0.5">{formatNumber(selectedHero.defense)}</span>
                </div>
                <div className="bg-zinc-950/60 border border-zinc-850 p-2.5 rounded-xl flex flex-col">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono">Base Speed</span>
                  <span className="text-sm font-bold text-white font-mono mt-0.5">{formatNumber(selectedHero.speed)}</span>
                </div>
              </div>
           </div>

           <div className="bg-zinc-900/50 border border-zinc-900 rounded-2xl p-4 flex flex-col gap-4">
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Enhance level</h3>
              
              <div className="flex gap-2">
                <input 
                  type="number" 
                  min="1" 
                  value={customLevelPoints}
                  onChange={(e) => setCustomLevelPoints(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 bg-zinc-950 border border-zinc-850 rounded-xl px-2 text-white font-mono text-center outline-none focus:border-zinc-700 text-sm"
                />
                <button 
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs tracking-widest uppercase py-3 rounded-xl border border-zinc-700 active:scale-95 transition-all cursor-pointer"
                  onClick={() => useGameStore.getState().levelUpHero(selectedHero.instanceId, selectedHero.level + customLevelPoints)}
                >
                  +{customLevelPoints} Levels
                </button>
                <button 
                  className="bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-black text-xs tracking-widest uppercase px-4 py-3 rounded-xl active:scale-95 transition-all cursor-pointer"
                  onClick={() => useGameStore.getState().levelUpHero(selectedHero.instanceId, Number.MAX_SAFE_INTEGER)}
                >
                  MAX
                </button>
              </div>

              <div className="w-full h-[1px] bg-zinc-900"></div>

              <button 
                className="w-full bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 hover:from-red-500 hover:via-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs tracking-widest uppercase py-3.5 rounded-xl border border-white/10 active:scale-95 transition-all shadow-lg"
                onClick={() => {
                  const success = useGameStore.getState().omegaAscendHero(selectedHero.instanceId);
                  if (!success) {
                    setOmegaError("Insufficient Gold! Requires 1.00 OV (Octovigintillion: 10⁸⁷) Gold. Defeat Gold Bounties or Campaign to earn it.");
                    setTimeout(() => setOmegaError(null), 5000);
                  } else {
                    setOmegaError(null);
                  }
                }}
              >
                Ω Omega Ascension
              </button>
              <div className="text-[10px] text-zinc-500 text-center font-bold tracking-wider uppercase">COST: 1.00 OV GOLD (10⁸⁷)</div>
              {omegaError && (
                <div className="text-[11px] text-red-500 bg-red-950/40 border border-red-900/50 rounded-xl p-3 text-center leading-snug font-medium">
                  {omegaError}
                </div>
              )}
           </div>

           <div className="flex flex-col gap-3">
             <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">Roster Skills</h3>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               {selectedHero.skills.slice(0, 10).map((s: any, i: number) => {
                 const skillIcon = s.effectType === 'fire' ? '🔥' : s.effectType === 'slash' ? '⚔️' : s.effectType === 'heal' ? '💖' : '✨';
                 return (
                   <div key={i} className="bg-zinc-900/50 border border-zinc-900 rounded-xl p-3 flex items-center gap-3">
                     <div className="w-10 h-10 bg-zinc-950 rounded-lg flex items-center justify-center border border-zinc-850 shrink-0 text-xl shadow-inner">
                       {skillIcon}
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="text-white font-bold text-xs truncate uppercase tracking-wider">{s.name}</div>
                       <div className="text-[10px] text-zinc-500 mt-0.5">Multiplier: {s.damageMultiplier * 100}%</div>
                     </div>
                   </div>
                 );
               })}
               {selectedHero.skills.length > 10 && (
                 <div className="bg-zinc-900/20 border border-dashed border-zinc-900 rounded-xl p-3 flex items-center justify-center text-zinc-500 text-[10px] uppercase font-mono tracking-widest">
                   + {selectedHero.skills.length - 10} additional skills unlocked
                 </div>
               )}
             </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-6 bg-[#0A0A0A]">
      <h2 className="text-3xl font-black mb-6 shrink-0 text-white drop-shadow-md">Heroes Hub</h2>

      <div className="mb-8 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-black text-zinc-600 uppercase tracking-widest">Active Team Formation</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => useGameStore.getState().deleteUnusedHeroes()}
              className="text-[10px] font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded hover:bg-red-500/20 transition-colors uppercase tracking-widest"
            >
              Delete Unused
            </button>
            <button 
              onClick={handleEquipBest}
              className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded hover:bg-yellow-500/20 transition-colors uppercase tracking-widest"
            >
              Equip Best
            </button>
          </div>
        </div>
        <div className="flex gap-4 p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl overflow-x-auto shadow-inner">
           {team.map((instId, i) => {
              const hero = heroes.find(h => h.instanceId === instId);
              return (
                <div key={i} className="w-24 h-24 shrink-0 rounded-xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center bg-black/40 group relative cursor-pointer" onClick={() => hero && setSelectedHeroInstance(hero.instanceId)}>
                  {hero ? (
                    <>
                      <div className="absolute inset-0 border-2 border-blue-500/50 rounded-xl pointer-events-none z-10"></div>
                      <div className="absolute inset-0 rounded-xl overflow-hidden bg-black/50">
                        {hero.imageUrl ? (
                          <img src={hero.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <HeroModelThumb hero={hero} />
                        )}
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-1 pt-4 text-center z-20 rounded-b-xl">
                        <div className="text-[10px] font-black leading-tight truncate w-full text-white">{hero.name}</div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); updateTeam(i, null); }} className="absolute -top-2 -right-2 bg-red-600/90 text-white w-6 h-6 rounded-full text-xs font-black shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-30 flex items-center justify-center hover:bg-red-500 hover:scale-110">×</button>
                    </>
                  ) : (
                    <span className="text-zinc-700 text-xs font-bold uppercase tracking-widest">+ Slot {i+1}</span>
                  )}
                </div>
              )
           })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <h3 className="text-xs font-black text-zinc-600 uppercase tracking-widest mb-3">Your Collection ({heroes.length})</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {heroes.map(hero => {
            const isEquipped = team.includes(hero.instanceId);
            return (
              <div 
                key={hero.instanceId} 
                className={`bg-zinc-950 border ${isEquipped ? 'border-blue-500/50' : 'border-zinc-800'} rounded-2xl p-4 flex flex-col relative group cursor-pointer hover:border-yellow-500/50 transition-colors shadow-lg`}
                onClick={() => setSelectedHeroInstance(hero.instanceId)}
              >
                <div className="w-full aspect-[4/5] bg-black rounded-xl mb-4 flex flex-col items-center justify-center shadow-inner overflow-hidden relative border border-zinc-800/50">
                  {hero.imageUrl ? (
                     <img src={hero.imageUrl} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-300" />
                  ) : (
                     <HeroModelThumb hero={hero} />
                  )}
                  {isEquipped && (
                     <div className="absolute top-2 right-2 bg-blue-600 text-[10px] font-bold text-white px-2 py-0.5 rounded shadow">EQUIPPED</div>
                  )}
                </div>
                
                <div className="font-black text-sm truncate mb-1 text-white" title={hero.name}>{hero.name}</div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 flex items-center justify-between">
                  <span>Lv. {hero.level}</span>
                  <span className={`px-1.5 py-0.5 rounded border ${hero.rarity === 'Legendary' ? 'border-yellow-600/50 text-yellow-500 bg-yellow-950/30' : 'border-zinc-700'}`}>
                    {hero.rarity}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
