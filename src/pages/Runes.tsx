import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Button } from '../components/ui/Button';
import { formatNumber } from '../utils';
import { Hexagon, Sparkles, Zap, ShieldAlert, Heart, Star, Compass } from 'lucide-react';

interface RuneItem {
  id: string;
  name: string;
  statName: string;
  baseBoost: number;
  perLevelBoost: number;
  icon: React.ReactNode;
  colorClass: string;
  glowClass: string;
}

export function Runes() {
  const { inventory, deductGems } = useGameStore();
  const [activeRuneId, setActiveRuneId] = useState<string>('strike');

  const runeStrikeLevel = inventory.materials['rune_strike_level'] || 1;
  const runeShieldLevel = inventory.materials['rune_shield_level'] || 1;
  const runeHeartLevel = inventory.materials['rune_heart_level'] || 1;
  const runeSwiftLevel = inventory.materials['rune_swift_level'] || 1;

  const isStrikeEquipped = inventory.materials['rune_strike_equipped'] !== 0;
  const isShieldEquipped = inventory.materials['rune_shield_equipped'] !== 0;
  const isHeartEquipped = inventory.materials['rune_heart_equipped'] !== 0;
  const isSwiftEquipped = inventory.materials['rune_swift_equipped'] !== 0;

  const runesList: RuneItem[] = [
    {
      id: 'strike',
      name: 'Strike Rune',
      statName: 'Attack Power',
      baseBoost: 10,
      perLevelBoost: 3,
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      colorClass: 'text-amber-400 border-amber-900/40 bg-amber-950/20',
      glowClass: 'shadow-[0_0_15px_rgba(245,158,11,0.25)] border-amber-500'
    },
    {
      id: 'shield',
      name: 'Aegis Rune',
      statName: 'Defense Shielding',
      baseBoost: 12,
      perLevelBoost: 4,
      icon: <ShieldAlert className="w-6 h-6 text-blue-400" />,
      colorClass: 'text-blue-400 border-blue-900/40 bg-blue-950/20',
      glowClass: 'shadow-[0_0_15px_rgba(59,130,246,0.25)] border-blue-500'
    },
    {
      id: 'heart',
      name: 'Vitality Rune',
      statName: 'Maximum Health',
      baseBoost: 15,
      perLevelBoost: 5,
      icon: <Heart className="w-6 h-6 text-emerald-400" />,
      colorClass: 'text-emerald-400 border-emerald-900/40 bg-emerald-950/20',
      glowClass: 'shadow-[0_0_15px_rgba(16,185,129,0.25)] border-emerald-500'
    },
    {
      id: 'swift',
      name: 'Alacrity Rune',
      statName: 'Movement Speed',
      baseBoost: 8,
      perLevelBoost: 2.5,
      icon: <Compass className="w-6 h-6 text-purple-450" />,
      colorClass: 'text-purple-400 border-purple-900/45 bg-purple-950/20',
      glowClass: 'shadow-[0_0_15px_rgba(168,85,247,0.25)] border-purple-500'
    }
  ];

  const currentRune = runesList.find(r => r.id === activeRuneId) || runesList[0];
  
  const getRuneLevel = (id: string) => {
    if (id === 'strike') return runeStrikeLevel;
    if (id === 'shield') return runeShieldLevel;
    if (id === 'heart') return runeHeartLevel;
    return runeSwiftLevel;
  };

  const isEquipped = (id: string) => {
    if (id === 'strike') return isStrikeEquipped;
    if (id === 'shield') return isShieldEquipped;
    if (id === 'heart') return isHeartEquipped;
    return isSwiftEquipped;
  };

  const handleToggleEquip = (id: string) => {
    const updatedMaterials = { ...inventory.materials };
    const key = `rune_${id}_equipped`;
    const current = updatedMaterials[key] !== 0;
    updatedMaterials[key] = current ? 0 : 1;

    useGameStore.setState({
      inventory: {
        ...inventory,
        materials: updatedMaterials
      }
    });
  };

  const handleUpgradeRune = (id: string) => {
    const currentLvl = getRuneLevel(id);
    const upgradeCost = currentLvl * 15;
    if (inventory.gems < upgradeCost) return;

    const updatedMaterials = { ...inventory.materials };
    updatedMaterials[`rune_${id}_level`] = currentLvl + 1;

    useGameStore.setState({
      inventory: {
        ...inventory,
        gems: inventory.gems - upgradeCost,
        materials: updatedMaterials
      }
    });
  };

  const handleMaxUpgradeRune = (id: string) => {
    let currentLvl = getRuneLevel(id);
    let currentGems = inventory.gems;
    let cost = currentLvl * 15;
    
    if (currentGems < cost) return;
    
    while (currentGems >= cost) {
      currentGems -= cost;
      currentLvl++;
      cost = currentLvl * 15;
    }
    
    const updatedMaterials = { ...inventory.materials };
    updatedMaterials[`rune_${id}_level`] = currentLvl;
    
    useGameStore.setState({
      inventory: {
        ...inventory,
        gems: currentGems,
        materials: updatedMaterials
      }
    });
  };

  return (
    <div className="h-full bg-[#0F0F0F] text-slate-200 flex flex-col overflow-y-auto p-6 md:p-8">
      
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Hexagon className="w-5 h-5 text-purple-400 animate-spin-slow" />
            Arcane Rune Altar
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Carve, bind, and upgrade primordial monolith fragments to increase squad stats.</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 rounded-lg py-2 px-4 flex items-center gap-2 text-xs">
          <Star className="w-4 h-4 text-[#ca8a04]" />
          <span className="text-zinc-400">Gems Available:</span>
          <span className="font-mono font-bold text-white">{formatNumber(inventory.gems)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden h-[340px] md:h-[400px]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-950/10 via-transparent to-transparent pointer-events-none"></div>

          <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-full border-4 border-dashed border-zinc-800/40 flex items-center justify-center animate-spin-slow"></div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-16 md:gap-24">
              {runesList.map((rune) => {
                const active = isEquipped(rune.id);
                const selected = activeRuneId === rune.id;
                
                return (
                  <button
                    key={rune.id}
                    onClick={() => setActiveRuneId(rune.id)}
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-xl border flex items-center justify-center relative transition-all duration-200 hover:scale-105 ${
                      selected 
                        ? rune.glowClass 
                        : active 
                          ? 'border-zinc-700 bg-zinc-900 text-slate-200' 
                          : 'border-zinc-900 bg-zinc-950 text-zinc-600'
                    }`}
                  >
                    {rune.icon}
                    {active && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#22c55e] border border-black rounded-full animate-pulse"></span>
                    )}
                    <span className="absolute -bottom-1 -left-1 text-[8px] font-bold bg-black/80 px-1 rounded border border-zinc-800">
                      R.{getRuneLevel(rune.id)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-950/60 border border-zinc-900 rounded-2xl p-6 h-full space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#ca8a04]">Active Selection</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{currentRune.name}</h3>
              </div>
              <div className={`px-2.5 py-1 rounded border text-[10px] font-bold uppercase tracking-wider ${currentRune.colorClass}`}>
                Rarity I
              </div>
            </div>

            <div className="bg-black/40 border border-zinc-900 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-zinc-900 pb-2">
                <span className="text-zinc-500">Enhanced Stat</span>
                <span className="font-semibold text-white">{currentRune.statName}</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-zinc-900 pb-2">
                <span className="text-zinc-500">Current Boost</span>
                <span className="font-mono font-bold text-[#22c55e]">
                   +{((currentRune.baseBoost + (getRuneLevel(currentRune.id) - 1) * currentRune.perLevelBoost)).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Next Level Boost</span>
                <span className="font-mono font-semibold text-blue-400">
                   +{((currentRune.baseBoost + getRuneLevel(currentRune.id) * currentRune.perLevelBoost)).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant={isEquipped(currentRune.id) ? 'secondary' : 'primary'}
                className="flex-1 text-xs font-bold"
                onClick={() => handleToggleEquip(currentRune.id)}
              >
                {isEquipped(currentRune.id) ? 'De-activate Rune' : 'Activate Rune'}
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-900">
            <div className="flex items-center justify-between mb-3 text-xs text-zinc-500">
              <span>Upgrade Monolith Boosts</span>
              <span>Cost: <span className="font-mono text-cyan-400 font-bold">{getRuneLevel(currentRune.id) * 15} Gems</span></span>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1 text-[10px] sm:text-xs font-black flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border-none text-white px-2"
                disabled={inventory.gems < getRuneLevel(currentRune.id) * 15}
                onClick={() => handleUpgradeRune(currentRune.id)}
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>+1 Lvl</span>
              </Button>
              <Button
                className="flex-1 text-[10px] sm:text-xs font-black flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 border-none text-white px-2"
                disabled={inventory.gems < getRuneLevel(currentRune.id) * 15}
                onClick={() => handleMaxUpgradeRune(currentRune.id)}
              >
                <Zap className="w-4 h-4 shrink-0" />
                <span>Max Upgrade</span>
              </Button>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
