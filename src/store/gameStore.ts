import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PlayerHero, PlayerInventory, PlayerProfile } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { HERO_DATABASE, STAGES_DATABASE } from '../data/db';
import { ACHIEVEMENTS } from '../data/achievements';

interface GameState {
  inventory: PlayerInventory;
  heroes: PlayerHero[];
  team: (string | null)[];
  campaignProgress: string;
  profile: PlayerProfile;
  
  initialize: () => void;
  addHero: (heroId: string) => void;
  updateTeam: (index: number, instanceId: string | null) => void;
  levelUpHero: (instanceId: string, targetLevel: number) => void;
  progressCampaign: () => void;
  awardRewards: (gold: number, gems: number, xp: number, rubies?: number) => void;
  deductGems: (amount: number) => boolean;
  deductRubies: (amount: number) => boolean;
  adminAddCurrency: (gold: number, gems: number, rubies?: number) => void;
  adminAddXp: (xp: number) => void;
  adminUnlockAllHeroes: () => void;
  adminUnlockAllAchievements: () => void;
  deleteUnusedHeroes: () => void;
  viewingUserId: string | null;
  setViewingUserId: (id: string | null) => void;
  resetEverything: () => void;
  omegaAscendHero: (instanceId: string) => boolean;
  updateProfile: (updates: Partial<PlayerProfile>) => void;
  recordStat: (statType: 'battlesWon' | 'heroesSummoned' | 'goldEarned' | 'bossesDefeated', amount: number) => void;
  doRebirth: (isMax?: boolean) => void;
  incrementTimePlayed: (seconds: number) => void;
}

const DEFAULT_PROFILE: PlayerProfile = {
  username: 'Guest' + Math.floor(Math.random() * 10000),
  userId: uuidv4(),
  serverId: 'Server-1',
  level: 1,
  xp: 0,
  gender: 'unspecified',
  album: [],
  hasBattlePass: false,
  battlePassLevel: 1,
  achievements: {},
  claimedRewards: {},
  pinnedAchievements: [],
  friends: [],
  stats: {
    battlesWon: 0,
    heroesSummoned: 0,
    goldEarned: 0,
    bossesDefeated: 0,
    rebirths: 0,
    timePlayed: 0
  }
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      inventory: { gold: 0, gems: 100, rubies: 0, materials: {}, shards: {}, artifacts: [], gears: [] },
      heroes: [],
      team: [null, null, null, null, null],
      campaignProgress: '1-1',
      profile: DEFAULT_PROFILE,
      viewingUserId: null,
      setViewingUserId: (id) => set({ viewingUserId: id }),

      initialize: () => {
        const state = get();
        if (state.heroes.length === 0) {
          const starterBase = HERO_DATABASE.find(h => h.id === 'warrior');
          if (starterBase) {
            set({
              heroes: [{ ...starterBase, rarity: 'Common', instanceId: uuidv4(), xp: 0 }]
            });
            const firstHero = get().heroes[0];
            set({ team: [firstHero.instanceId, null, null, null, null] });
          }
        } else {
          const updatedHeroes = state.heroes.map(h => {
             if (h.level >= 99999) {
               h.maxHp = Infinity;
               h.attack = Infinity;
               h.defense = Infinity;
             }
            const base = HERO_DATABASE.find(b => b.id === h.id);
            if (!base) return h;
            const updatedSkills = base.skills.map(bs => {
              const hs = h.skills?.find(s => s.name === bs.name);
              return hs || bs;
            });
            return { ...h, skills: updatedSkills };
          });
          set({ heroes: updatedHeroes });
        }
      },

      updateProfile: (updates) => {
        set(state => ({
          profile: { ...state.profile, ...updates }
        }));
      },

      recordStat: (statType, amount) => {
        set(state => {
          const newStats = { ...state.profile.stats };
          newStats[statType] += amount;
          return { profile: { ...state.profile, stats: newStats } };
        });
      },

      addHero: (heroId: string) => {
        const base = HERO_DATABASE.find(h => h.id === heroId);
        if (base) {
          set(state => ({
            heroes: [...state.heroes, { ...base, rarity: base.rarity || 'Common', instanceId: uuidv4(), xp: 0 }]
          }));
          get().recordStat('heroesSummoned', 1);
        }
      },

      updateTeam: (index: number, instanceId: string | null) => {
        const newTeam = [...get().team];
        newTeam[index] = instanceId;
        set({ team: newTeam });
      },

      levelUpHero: (instanceId: string, targetLevel: number) => {
        const state = get();
        const hero = state.heroes.find(h => h.instanceId === instanceId);
        if (!hero) return;

        const maxLevel = Number.MAX_SAFE_INTEGER;
        const actualTargetLevel = Math.min(targetLevel, maxLevel);
        if (hero.level >= actualTargetLevel) return;

        let totalCost = 0;
        let newLevel = hero.level;
        let currentGold = state.inventory.gold;
        
        // Fast math path if they request a huge number of levels or if it's MAX
        if (actualTargetLevel - hero.level > 1000 || actualTargetLevel === maxLevel) {
           const L = hero.level;
           // If targetLevel is maxLevel, we calculate how many levels we can afford
           // Cost from L to L+k-1 is 50 * k * (2L + k - 1)
           // a = 50, b = 50*(2L - 1), c = -currentGold
           const a = 50;
           const b = 50 * (2 * L - 1);
           const c = -currentGold;
           
           let k = 0;
           // If currentGold is extremely huge (e.g. 1e99), quadratic formula with standard numbers might lose precision or exceed max float
           // So we approximate k if gold is very large
           if (currentGold > 1e20) {
             k = Math.floor(Math.sqrt(currentGold / 50));
           } else {
             const discriminant = b * b - 4 * a * c;
             k = Math.floor((-b + Math.sqrt(discriminant)) / (2 * a));
           }
           
           if (k < 1) return; // can't even afford 1 level
           
           if (actualTargetLevel !== maxLevel && k > actualTargetLevel - L) {
             k = actualTargetLevel - L;
           }
           
           totalCost = 50 * k * (2 * L + k - 1);
           newLevel = L + k;
        } else {
          const goldNeededPerLevel = 100;
          for (let i = hero.level; i < actualTargetLevel; i++) {
            const cost = Math.floor(goldNeededPerLevel * i);
            if (currentGold >= totalCost + cost) {
              totalCost += cost;
              newLevel++;
            } else {
              break;
            }
          }
        }

        if (newLevel > hero.level) {
          // If level is huge, computing 1.05^k directly is best
          const diff = newLevel - hero.level;
          // cap the multiplier if diff is too huge so we don't get NaN/Infinity too early, though Infinity is fine
          const multiplier = Math.pow(1.05, diff);
          
          set(s => ({
            inventory: { ...s.inventory, gold: Math.max(0, s.inventory.gold - totalCost) },
            heroes: s.heroes.map(h => {
              if (h.instanceId === instanceId) {
                return {
                  ...h,
                  level: newLevel,
                  maxHp: h.maxHp * multiplier,
                  attack: h.attack * multiplier,
                  defense: h.defense * multiplier
                };
              }
              return h;
            })
          }));
        }
      },

      omegaAscendHero: (instanceId: string) => {
        const state = get();
        if (state.inventory.gold >= 1e87) {
          set(s => ({
            inventory: { ...s.inventory, gold: s.inventory.gold - 1e87 },
            heroes: s.heroes.map(h => {
              if (h.instanceId === instanceId) {
                return {
                  ...h,
                  level: 99999,
                  maxHp: Infinity,
                  attack: Infinity,
                  defense: Infinity,
                  skills: h.skills.map(skill => ({
                    ...skill,
                    damageMultiplier: 1000000 
                  }))
                };
              }
              return h;
            })
          }));
          return true;
        }
        return false;
      },

      awardRewards: (gold: number, gems: number, xp: number, rubies: number = 0) => {
        set(state => {
          let newXp = (state.profile.xp || 0) + xp;
          let newLevel = state.profile.level;
          
          let xpRequired = newLevel * 500;
          while (newXp >= xpRequired && newLevel < 1000) {
            newXp -= xpRequired;
            newLevel++;
            xpRequired = newLevel * 500;
          }
          if (newLevel >= 1000) {
            newLevel = 1000;
            newXp = 0;
          }
          
          return {
            inventory: {
              ...state.inventory,
              gold: state.inventory.gold + gold,
              gems: state.inventory.gems + gems,
              rubies: (state.inventory.rubies || 0) + rubies
            },
            profile: {
              ...state.profile,
              level: newLevel,
              xp: newXp
            }
          };
        });
        get().recordStat('goldEarned', gold);
      },

      progressCampaign: () => {
        const state = get();
        const currentStageIndex = STAGES_DATABASE.findIndex(s => s.id === state.campaignProgress);
        if (currentStageIndex >= 0 && currentStageIndex < STAGES_DATABASE.length - 1) {
          set({ campaignProgress: STAGES_DATABASE[currentStageIndex + 1].id });
        }
      },

      deductGems: (amount: number) => {
        const state = get();
        if (state.inventory.gems >= amount) {
          set(s => ({
            inventory: { ...s.inventory, gems: s.inventory.gems - amount }
          }));
          return true;
        }
        return false;
      },

      deductRubies: (amount: number) => {
        const state = get();
        if ((state.inventory.rubies || 0) >= amount) {
          set(s => ({
            inventory: { ...s.inventory, rubies: s.inventory.rubies - amount }
          }));
          return true;
        }
        return false;
      },

      adminAddXp: (xp: number) => {
        set(state => {
          let newXp = (state.profile.xp || 0) + xp;
          let newLevel = state.profile.level;
          
          if (xp === Infinity || newXp === Infinity) {
             newXp = 0;
             newLevel = 1000;
          } else {
            let xpRequired = newLevel * 500;
            while (newXp >= xpRequired && newLevel < 1000) {
              newXp -= xpRequired;
              newLevel++;
              xpRequired = newLevel * 500;
            }
            if (newLevel >= 1000) {
              newLevel = 1000;
              newXp = 0;
            }
          }
          
          return {
            profile: {
              ...state.profile,
              level: newLevel,
              xp: newXp
            }
          };
        });
      },

      adminAddCurrency: (gold: number, gems: number, rubies: number = 0) => {
        set(state => ({
          inventory: {
            ...state.inventory,
            gold: gold === Infinity ? Infinity : state.inventory.gold + gold,
            gems: gems === Infinity ? Infinity : state.inventory.gems + gems,
            rubies: (state.inventory.rubies || 0) + rubies
          }
        }));
      },

      deleteUnusedHeroes: () => {
        const state = get();
        set(state => {
          const equippedIds = new Set(state.team.filter(Boolean));
          const toDelete = state.heroes.filter(h => !equippedIds.has(h.instanceId));
          const refundGold = toDelete.length * 50; 
          return {
             heroes: state.heroes.filter(h => equippedIds.has(h.instanceId)),
             inventory: { ...state.inventory, gold: state.inventory.gold + refundGold }
          };
        });
      },

      adminUnlockAllHeroes: () => {
        const newHeroes = HERO_DATABASE.map(base => ({
          ...base,
          rarity: base.rarity || 'Mythic',
          instanceId: uuidv4(),
          xp: 0
        }));
        set(state => ({ heroes: [...state.heroes, ...newHeroes] }));
      },

      adminUnlockAllAchievements: () => {
        const allAch: Record<string, boolean> = {};
        ACHIEVEMENTS.forEach(ach => {
          allAch[ach.id] = true;
        });
        set(state => ({
          profile: {
            ...state.profile,
            achievements: allAch
          }
        }));
      },

      doRebirth: (isMax: boolean = false) => {
        const state = get();
        let currentRebirths = state.profile.stats.rebirths || 0;
        let currentLevel = state.profile.level;
        
        let rebirthsToGain = 0;
        let levelCost = 10 + currentRebirths * 10;
        
        if (isMax) {
           while (currentLevel >= levelCost) {
             currentLevel -= levelCost; // Using level as currency
             rebirthsToGain++;
             currentRebirths++;
             levelCost = 10 + currentRebirths * 10;
           }
        } else {
           if (currentLevel >= levelCost) {
             rebirthsToGain = 1;
             currentLevel -= levelCost;
           }
        }

        if (rebirthsToGain === 0) return;

        const starterBase = HERO_DATABASE.find(h => h.id === 'warrior');
        const defaultHero = starterBase ? {
          ...starterBase,
          rarity: 'Common' as const,
          instanceId: uuidv4(),
          xp: 0
        } : null;

        set({
          inventory: { gold: 0, gems: state.inventory.gems + (1000 * rebirthsToGain), rubies: (state.inventory.rubies || 0) + rebirthsToGain, materials: {}, shards: {}, artifacts: [], gears: [] },
          heroes: defaultHero ? [defaultHero] : [],
          team: defaultHero ? [defaultHero.instanceId, null, null, null, null] : [null, null, null, null, null],
          campaignProgress: '1-1',
          profile: {
            ...state.profile,
            level: 1, // Reset level to 1 after rebirth
            xp: 0,
            stats: {
              ...state.profile.stats,
              rebirths: (state.profile.stats.rebirths || 0) + rebirthsToGain
            }
          }
        });
      },

      incrementTimePlayed: (seconds: number) => {
        set(state => ({
          profile: {
            ...state.profile,
            stats: {
              ...state.profile.stats,
              timePlayed: (state.profile.stats.timePlayed || 0) + seconds
            }
          }
        }));
      },

      resetEverything: () => {
        const state = get();
        const starterBase = HERO_DATABASE.find(h => h.id === 'warrior');
        const defaultHero = starterBase ? {
          ...starterBase,
          rarity: 'Common' as const,
          instanceId: uuidv4(),
          xp: 0
        } : null;

        set({
          inventory: { gold: 0, gems: 100, rubies: 0, materials: {}, shards: {}, artifacts: [], gears: [] },
          heroes: defaultHero ? [defaultHero] : [],
          team: defaultHero ? [defaultHero.instanceId, null, null, null, null] : [null, null, null, null, null],
          campaignProgress: '1-1',
          profile: {
             ...DEFAULT_PROFILE,
             username: state.profile.username
          }
        });
      }
    }),
    {
      name: 'hero-rpg-storage',
      storage: createJSONStorage(() => localStorage, {
        reviver: (key, value) => {
          if (value === 'INFINITY_MAGIC') return Infinity;
          if (value === 'NEG_INFINITY_MAGIC') return -Infinity;
          return value;
        },
        replacer: (key, value) => {
          if (value === Infinity) return 'INFINITY_MAGIC';
          if (value === -Infinity) return 'NEG_INFINITY_MAGIC';
          return value;
        }
      })
    }
  )
);
