import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = Array.from({ length: 100 }, (_, i) => {
  const types = ['battles_won', 'heroes_summoned', 'gold_earned', 'bosses_defeated'] as const;
  const type = types[i % 4];
  const targets = [1, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000, 500000000, 1000000000, 5000000000, 10000000000, 50000000000, 100000000000, 500000000000, 1000000000000, 5000000000000];
  const level = Math.floor(i / 4) % targets.length;
  const target = targets[level];
  
  const names = {
    'battles_won': `Warrior Tier ${level + 1}`,
    'heroes_summoned': `Summoner Tier ${level + 1}`,
    'gold_earned': `Tycoon Tier ${level + 1}`,
    'bosses_defeated': `Slayer Tier ${level + 1}`
  };

  const descriptions = {
    'battles_won': `Win ${target} battles in total.`,
    'heroes_summoned': `Summon ${target} heroes.`,
    'gold_earned': `Earn ${target} gold in total.`,
    'bosses_defeated': `Defeat ${target} boss enemies.`
  };

  return {
    id: `ach_${type}_${level}`,
    name: names[type],
    description: descriptions[type],
    type,
    targetCount: target
  };
});
