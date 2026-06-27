export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Celestial' | 'Series' | 'Limited' | '∞ infinite and beyond stars ★';

export interface Skill {
  name: string;
  damageMultiplier: number;
  cooldown: number;
  effectType: 'slash' | 'fire' | 'ice' | 'dark' | 'heal' | 'fire_breath' | 'kamehameha' | 'meteor' | 'red_kamehameha' | 'bankai' | 'punch' | 'consecutive_punches' | 'serious_punch' | 'table_flip' | 'headbutt' | 'squirt_gun' | 'sneeze' | 'zeno_erase' | 'zeno_blast' | 'zeno_disintegrate' | 'zeno_spark' | 'zeno_judgment' | 'saitama_300_punches' | 'zeno_300_erasures' | 'supernova_collapse';
}

export interface Gear {
  id: string;
  name: string;
  type: 'sword' | 'shield' | 'armor' | 'accessory';
  rarity: Rarity;
  attackBonus: number;
  defenseBonus: number;
  hpBonus: number;
  equippedTo?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  targetCount: number;
  type: 'battles_won' | 'heroes_summoned' | 'gold_earned' | 'bosses_defeated';
}

export interface BattlePassReward {
  level: number;
  type: 'gold' | 'gems' | 'ruby' | 'hero' | 'gear';
  amount?: number;
  itemId?: string;
  isPremium: boolean;
}

export interface UnitBase {
  id: string;
  name: string;
  level: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  skills: Skill[];
  modelColor: string;
  modelType: 'box' | 'sphere' | 'cylinder' | 'cone';
  imageUrl?: string;
  rarity?: Rarity;
  isBoss?: boolean;
}

export interface Hero extends UnitBase {
  rarity: Rarity;
}

export interface Enemy extends UnitBase {}

export interface PlayerHero extends Hero {
  instanceId: string;
  xp: number;
  equippedSkills?: string[];
}

export interface PlayerInventory {
  gold: number;
  gems: number;
  rubies: number;
  materials: Record<string, number>;
  shards: Record<string, number>;
  artifacts: string[];
  gears: Gear[];
}

export interface PlayerProfile {
  username: string;
  userId: string;
  serverId: string;
  level: number;
  xp: number;
  gender: 'male' | 'female' | 'unspecified';
  avatarUrl?: string;
  album: string[];
  hasBattlePass: boolean;
  battlePassLevel: number;
  achievements: Record<string, boolean>;
  claimedRewards?: Record<string, boolean>;
  pinnedAchievements?: string[];
  friends?: string[];
  stats: {
    battlesWon: number;
    heroesSummoned: number;
    goldEarned: number;
    bossesDefeated: number;
    rebirths?: number;
    timePlayed?: number; // in seconds
  };
}

export interface WorldStage {
  id: string;
  worldName: string;
  stageName: string;
  isBoss: boolean;
  enemies: string[];
  rewards: { gold: number; gems: number; xp: number; ruby?: number; gearChance?: number };
}

