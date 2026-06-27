const fs = require('fs');
const file = 'src/data/db.ts';
let content = fs.readFileSync(file, 'utf8');

const boss = `  { 
    id: 'global_boss_event', name: 'Global Void Entity', rarity: 'Mythic', 
    level: 999, maxHp: 24242873758261676573213, attack: 5000, defense: 2000, speed: 200, 
    modelType: 'sphere', modelColor: '#4c1d95',
    isBoss: true,
    skills: [
      { name: 'Annihilation', damageMultiplier: 5.0, cooldown: 10, effectType: 'dark' },
      { name: 'Cosmic Rain', damageMultiplier: 3.0, cooldown: 5, effectType: 'fire' }
    ]
  },`;

const lines = content.split('\n');
const insertIndex = lines.findIndex(line => line.includes('export const ENEMIES_DATABASE: Enemy[] = [')) + 1;
lines.splice(insertIndex, 0, boss);

// Also add to STAGES_DATABASE
const stage = `  { id: 'event-global-boss', worldName: 'Event', stageName: 'Global Boss', isBoss: true, enemies: ['global_boss_event'], rewards: { gold: 1000000, gems: 10000, xp: 50000 } },`;
const stageInsertIndex = lines.findIndex(line => line.includes('export const STAGES_DATABASE: WorldStage[] = [')) + 1;
lines.splice(stageInsertIndex, 0, stage);

fs.writeFileSync(file, lines.join('\n'));
