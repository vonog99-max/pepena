import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Button } from '../components/ui/Button';
import { formatNumber } from '../utils';
import { Swords, RotateCcw, Flame, Snowflake, Moon, Heart, Sparkles, ChevronRight, Award, Search, Check, Lock, Star } from 'lucide-react';

export function Skills() {
  const { heroes, inventory, profile } = useGameStore();
  const [selectedHeroId, setSelectedHeroId] = useState<string>(heroes[0]?.instanceId || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const selectedHero = heroes.find(h => h.instanceId === selectedHeroId);
  const maxEquipped = profile.hasBattlePass ? 10 : 5;

  const handleUpgradeSkill = (skillIndex: number) => {
    if (!selectedHero) return;
    const currentCost = Math.floor((selectedHero.level + (selectedHero.xp || 0) + 1) * 80);
    if (inventory.gold < currentCost) return;

    const updatedHeroes = heroes.map(h => {
      if (h.instanceId === selectedHero.instanceId) {
        const nextSkills = [...h.skills];
        const targetSkill = { ...nextSkills[skillIndex] };
        targetSkill.damageMultiplier = parseFloat((targetSkill.damageMultiplier + 0.1).toFixed(2));
        nextSkills[skillIndex] = targetSkill;
        return {
          ...h,
          skills: nextSkills,
          xp: (h.xp || 0) + 1
        };
      }
      return h;
    });

    useGameStore.setState(state => ({
      inventory: {
        ...state.inventory,
        gold: state.inventory.gold - currentCost
      },
      heroes: updatedHeroes
    }));
  };

  const handleMaxUpgradeSkill = (skillIndex: number) => {
    if (!selectedHero) return;
    
    let currentCost = Math.floor((selectedHero.level + (selectedHero.xp || 0) + 1) * 80);
    let currentGold = inventory.gold;
    
    if (currentGold < currentCost) return;

    let upgrades = 0;
    while (currentGold >= currentCost) {
      currentGold -= currentCost;
      upgrades++;
      currentCost = Math.floor((selectedHero.level + (selectedHero.xp || 0) + upgrades + 1) * 80);
    }

    const updatedHeroes = heroes.map(h => {
      if (h.instanceId === selectedHero.instanceId) {
        const nextSkills = [...h.skills];
        const targetSkill = { ...nextSkills[skillIndex] };
        targetSkill.damageMultiplier = parseFloat((targetSkill.damageMultiplier + (0.1 * upgrades)).toFixed(2));
        nextSkills[skillIndex] = targetSkill;
        return {
          ...h,
          skills: nextSkills,
          xp: (h.xp || 0) + upgrades
        };
      }
      return h;
    });

    useGameStore.setState(state => ({
      inventory: {
        ...state.inventory,
        gold: currentGold
      },
      heroes: updatedHeroes
    }));
  };

  const handleToggleEquip = (skillName: string) => {
    if (!selectedHero) return;
    const equipped = selectedHero.equippedSkills || [];
    let nextEquipped = [...equipped];

    if (nextEquipped.includes(skillName)) {
      nextEquipped = nextEquipped.filter(name => name !== skillName);
    } else {
      if (nextEquipped.length >= maxEquipped) {
        return;
      }
      nextEquipped.push(skillName);
    }

    const updatedHeroes = heroes.map(h => {
      if (h.instanceId === selectedHero.instanceId) {
        return {
          ...h,
          equippedSkills: nextEquipped
        };
      }
      return h;
    });

    useGameStore.setState({ heroes: updatedHeroes });
  };

  const getSkillIcon = (effectType: string) => {
    switch (effectType) {
      case 'fire': return <Flame className="w-5 h-5 text-red-400 animate-pulse" />;
      case 'ice': return <Snowflake className="w-5 h-5 text-blue-400 animate-pulse" />;
      case 'dark': return <Moon className="w-5 h-5 text-purple-400 animate-pulse" />;
      case 'heal': return <Heart className="w-5 h-5 text-[#22c55e] animate-pulse" />;
      default: return <Swords className="w-5 h-5 text-amber-400 animate-pulse" />;
    }
  };

  if (heroes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-[#0F0F0F]">
        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 mb-4">
          <Award className="w-8 h-8" />
        </div>
        <p className="text-zinc-400">Summon or acquire heroes to configure their battle skills!</p>
      </div>
    );
  }

  const equippedList = selectedHero ? (selectedHero.equippedSkills || []) : [];
  const activeEquippedSkills = selectedHero 
    ? selectedHero.skills.filter(s => equippedList.includes(s.name))
    : [];

  const searchedSkills = selectedHero 
    ? selectedHero.skills.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const itemsPerPage = 6;
  const totalPages = Math.ceil(searchedSkills.length / itemsPerPage);
  const paginatedSkills = searchedSkills.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col lg:flex-row h-full bg-[#0F0F0F] text-slate-200 divide-y lg:divide-y-0 lg:divide-x divide-zinc-900">
      <div className="w-full lg:w-80 shrink-0 flex flex-col h-1/3 lg:h-full bg-black/30">
        <div className="p-4 border-b border-zinc-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h2 className="font-bold text-sm uppercase tracking-wider text-slate-100">Squad Roster</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {heroes.map(hero => {
            const isSelected = hero.instanceId === selectedHeroId;
            return (
              <button
                key={hero.instanceId}
                onClick={() => {
                  setSelectedHeroId(hero.instanceId);
                  setCurrentPage(1);
                  setSearchQuery('');
                }}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-150 flex items-center justify-between ${
                  isSelected 
                    ? 'bg-zinc-900/90 border-[#ca8a04] shadow-[0_0_12px_rgba(202,138,4,0.15)] text-white' 
                    : 'bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md flex items-center justify-center text-xs font-bold" style={{ backgroundColor: hero.modelColor + '40', border: `1px solid ${hero.modelColor}` }}>
                    <span style={{ color: hero.modelColor }}>Lv.{hero.level}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-slate-200">{hero.name}</div>
                    <div className="text-[10px] text-zinc-550 uppercase font-bold tracking-widest">{hero.rarity}</div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-[#ca8a04]' : 'text-zinc-600'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {selectedHero ? (
        <div className="flex-1 flex flex-col h-2/3 lg:h-full overflow-y-auto p-6 space-y-6">
          <div className="bg-gradient-to-r from-zinc-900/60 to-transparent p-5 rounded-xl border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xl font-bold tracking-tight text-white">{selectedHero.name}</span>
                <span className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">{selectedHero.rarity}</span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">Configure and load active skills into your battle deck.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-center bg-black/30 border border-zinc-850 px-3 py-1.5 rounded-md min-w-[70px]">
                <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Level</div>
                <div className="text-sm font-bold text-white">{selectedHero.level}</div>
              </div>
              <div className="text-center bg-black/30 border border-zinc-850 px-3 py-1.5 rounded-md min-w-[70px]">
                <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Skill Level</div>
                <div className="text-sm font-bold text-blue-400">+{selectedHero.xp || 0}</div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-2">
                <Swords className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-xs uppercase tracking-widest text-white">Equipped Battle Deck</h3>
              </div>
              <span className="text-xs font-mono font-bold bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-850">
                {equippedList.length} / {maxEquipped} Slots
              </span>
            </div>

            {equippedList.length === 0 ? (
              <div className="py-4 text-center text-xs text-zinc-500 italic">
                No custom skills equipped. By default, the first {maxEquipped} skills are used in battles automatically.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                {activeEquippedSkills.map((skill, index) => (
                  <div key={index} className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-3 flex flex-col justify-between relative">
                    <button 
                      onClick={() => handleToggleEquip(skill.name)}
                      className="absolute top-2 right-2 text-[9px] bg-red-950 text-red-400 px-1.5 py-0.5 rounded border border-red-900/50 hover:bg-red-900 hover:text-white"
                    >
                      Remove
                    </button>
                    <div className="flex items-center gap-2 mb-2">
                      {getSkillIcon(skill.effectType)}
                      <div className="truncate pr-12 text-xs font-semibold text-white">{skill.name}</div>
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono mt-1">
                      {(skill.damageMultiplier * 100).toFixed(0)}% ATK • {skill.cooldown === 0 ? 'Instant' : `${skill.cooldown}s`}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!profile.hasBattlePass && (
              <div className="text-[10px] bg-indigo-950/30 border border-indigo-900/30 text-indigo-300 p-2.5 rounded-lg flex items-center justify-between">
                <span>Unlock the <strong>BattlePass</strong> to increase your battle deck capacity to <strong>10 active skills</strong>!</span>
                <Star className="w-4 h-4 text-pink-400 fill-pink-400 animate-pulse shrink-0 ml-2" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <h3 className="font-bold text-xs uppercase tracking-widest text-zinc-400">All Available Skills ({searchedSkills.length})</h3>
              
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedSkills.map((skill) => {
                const originalIndex = selectedHero.skills.findIndex(s => s.name === skill.name);
                const isEquipped = equippedList.includes(skill.name);
                const upgradeCost = Math.floor((selectedHero.level + (selectedHero.xp || 0) + 1) * 80);
                const hasGold = inventory.gold >= upgradeCost;

                return (
                  <div key={skill.name} className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-4 flex flex-col justify-between space-y-4 hover:border-zinc-850 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0">
                          {getSkillIcon(skill.effectType)}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-100">{skill.name}</h4>
                          <p className="text-[10px] text-zinc-550 uppercase mt-0.5 font-bold tracking-widest">{skill.effectType} trigger</p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant={isEquipped ? 'primary' : 'secondary'}
                        onClick={() => handleToggleEquip(skill.name)}
                        className={`text-[10px] font-bold px-2.5 py-1 h-auto ${isEquipped ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/60' : ''}`}
                      >
                        {isEquipped ? (
                          <span className="flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Equipped
                          </span>
                        ) : (
                          'Equip Slot'
                        )}
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-black/40 p-2 rounded-lg border border-zinc-900/60 text-xs text-zinc-400">
                      <div>
                        <span className="text-zinc-500 block text-[9px] uppercase">Damage</span>
                        <span className="font-mono text-white text-xs font-semibold">{(skill.damageMultiplier * 100).toFixed(0)}% ATK</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[9px] uppercase">Cooldown</span>
                        <span className="font-mono text-white text-xs font-semibold flex items-center gap-1">
                          <RotateCcw className="w-3 h-3 text-zinc-500" />
                          {skill.cooldown === 0 ? 'Instant' : `${skill.cooldown}s`}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={hasGold ? 'primary' : 'secondary'}
                        onClick={() => handleUpgradeSkill(originalIndex)}
                        disabled={!hasGold}
                        className="flex-1 text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-2 px-2"
                      >
                        <span>+1 Lvl</span>
                        <span className="text-zinc-500">•</span>
                        <span className="font-mono text-yellow-500 font-semibold">{formatNumber(upgradeCost)} G</span>
                      </Button>
                      <Button
                        size="sm"
                        variant={hasGold ? 'primary' : 'secondary'}
                        onClick={() => handleMaxUpgradeSkill(originalIndex)}
                        disabled={!hasGold}
                        className="flex-1 text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-2 px-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 border-none text-white"
                      >
                        <span>Max</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-zinc-900">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="text-xs px-3"
                >
                  Previous
                </Button>
                <span className="text-xs text-zinc-400">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="text-xs px-3"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
