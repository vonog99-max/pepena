const fs = require('fs');
let content = fs.readFileSync('src/data/db.ts', 'utf8');

const lines = content.split('\n');

// Clean up lines 1 to 10
if (lines[1] && lines[1].includes('global_boss_event')) {
  lines.splice(0, 10);
}

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

const insertIndex = lines.findIndex(line => line.includes('export const ENEMY_DATABASE: Enemy[] = [')) + 1;
if (insertIndex > 0) {
  lines.splice(insertIndex, 0, boss);
}

fs.writeFileSync('src/data/db.ts', lines.join('\n'));
