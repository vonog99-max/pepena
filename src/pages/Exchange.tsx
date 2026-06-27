import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Button } from '../components/ui/Button';
import { formatNumber } from '../utils';
import { audio } from '../audio/sounds';
import { ShoppingBag, Coins, Gem, Users, Sparkles, AlertCircle, ShoppingCart } from 'lucide-react';

interface ShopOffer {
  id: string;
  title: string;
  description: string;
  cost: number;
  currency: 'gems' | 'gold';
  rewardType: 'gold' | 'hero' | 'material';
  rewardValue: any;
  icon: React.ReactNode;
}

export function Exchange() {
  const { inventory, addHero } = useGameStore();
  
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const offers: ShopOffer[] = [
    {
      id: 'gold_minor',
      title: 'Merchant Purse',
      description: 'Exchange Gems for instantaneous royal treasury gold coins.',
      cost: 15,
      currency: 'gems',
      rewardType: 'gold',
      rewardValue: 1500,
      icon: <Coins className="w-8 h-8 text-yellow-500" />
    },
    {
      id: 'gold_major',
      title: 'Royal Chest of Gold',
      description: 'A bulk carriage containing deep reserves of kingdom standard currency.',
      cost: 50,
      currency: 'gems',
      rewardType: 'gold',
      rewardValue: 6000,
      icon: <Coins className="w-10 h-10 text-yellow-450 animate-pulse" />
    },
    {
      id: 'hero_assassin',
      title: 'Shadow Assassin Seal',
      description: 'Acquire high-priority recruitment contract of the Mythic assassin unit directly.',
      cost: 150,
      currency: 'gems',
      rewardType: 'hero',
      rewardValue: 'shadow_assassin',
      icon: <Users className="w-9 h-9 text-purple-400" />
    },
    {
      id: 'hero_druid',
      title: 'Arch Druid Pledge',
      description: 'Secure instant pledge contract for the legendary healing nature controller.',
      cost: 120,
      currency: 'gems',
      rewardType: 'hero',
      rewardValue: 'arch_druid',
      icon: <Users className="w-[34px] h-[34px] text-emerald-400" />
    },
    {
      id: 'hero_void',
      title: 'Void Weaver Key',
      description: 'Invoke the forbidden space-time mythic Void Weaver to join your vanguard.',
      cost: 200,
      currency: 'gems',
      rewardType: 'hero',
      rewardValue: 'void_weaver',
      icon: <Users className="w-[34px] h-[34px] text-indigo-400" />
    },
    {
      id: 'hero_berserker',
      title: 'Blaze Berserker Oath',
      description: 'Call upon the fire-infused giant of fury, Blaze Berserker.',
      cost: 60,
      currency: 'gems',
      rewardType: 'hero',
      rewardValue: 'blaze_berserker',
      icon: <Users className="w-[34px] h-[34px] text-orange-400" />
    },
    {
      id: 'hero_mage',
      title: 'Ice Mage Seal',
      description: 'Secure instant rank deployment contract for the Epic Ice wizard.',
      cost: 80,
      currency: 'gems',
      rewardType: 'hero',
      rewardValue: 'ice_mage',
      icon: <Users className="w-9 h-9 text-blue-400" />
    },
    {
      id: 'material_xp',
      title: 'Primordial Elixir x10',
      description: 'Infuses core materials supporting team attributes and leveling systems.',
      cost: 500,
      currency: 'gold',
      rewardType: 'material',
      rewardValue: { name: 'primordial_elixir', qty: 10 },
      icon: <Sparkles className="w-8 h-8 text-emerald-450" />
    }
  ];

  const handlePurchase = (offer: ShopOffer) => {
    setSuccessMsg(null);
    setErrorMsg(null);

    const isGem = offer.currency === 'gems';
    if (isGem) {
      if (inventory.gems < offer.cost) {
        setErrorMsg('Insufficient gems to fulfill this order.');
        return;
      }
    } else {
      if (inventory.gold < offer.cost) {
        setErrorMsg('Insufficient gold coins to secure this item.');
        return;
      }
    }

    let updatedInventory = { ...inventory };
    if (isGem) {
      updatedInventory.gems -= offer.cost;
    } else {
      updatedInventory.gold -= offer.cost;
    }

    if (offer.rewardType === 'gold') {
      updatedInventory.gold += offer.rewardValue;
    } else if (offer.rewardType === 'material') {
      const matName = offer.rewardValue.name;
      const currentQty = updatedInventory.materials[matName] || 0;
      updatedInventory.materials[matName] = currentQty + offer.rewardValue.qty;
    }

    useGameStore.setState({ inventory: updatedInventory });

    if (offer.rewardType === 'hero') {
      addHero(offer.rewardValue);
    }

    audio.playClick();
    setSuccessMsg(`Acquired: ${offer.title} successfully!`);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  return (
    <div className="w-full h-full p-6 overflow-y-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-yellow-500" />
            Kingdom Exchange
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Acquire valuable materials and legendary recruits using your Gems and Gold.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-zinc-950 border border-zinc-900 rounded-lg py-1.5 px-3 flex items-center gap-2 text-xs">
            <Coins className="w-3.5 h-3.5 text-yellow-500" />
            <span className="font-mono font-medium text-white">{formatNumber(inventory.gold)}</span>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 rounded-lg py-1.5 px-3 flex items-center gap-2 text-xs">
            <Gem className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-mono font-medium text-white">{formatNumber(inventory.gems)}</span>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="mb-4 p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 p-3.5 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {offers.map((offer) => {
          const isGem = offer.currency === 'gems';
          const canAfford = isGem ? inventory.gems >= offer.cost : inventory.gold >= offer.cost;

          return (
            <div key={offer.id} className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-800 transition-all duration-150 relative">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 shrink-0">
                    {offer.icon}
                  </div>
                  <div className="flex items-center gap-1 bg-black/40 border border-zinc-900 rounded-full px-2.5 py-1 text-xs">
                    {isGem ? <Gem className="w-3.5 h-3.5 text-purple-400" /> : <Coins className="w-3.5 h-3.5 text-yellow-500" />}
                    <span className="font-mono font-bold text-white">{formatNumber(offer.cost)}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-100">{offer.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{offer.description}</p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-zinc-900/40">
                <Button
                  className="w-full text-xs font-bold"
                  variant={canAfford ? 'primary' : 'secondary'}
                  onClick={() => handlePurchase(offer)}
                >
                  <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                  Exchange Currency
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
