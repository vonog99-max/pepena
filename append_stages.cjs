const fs = require('fs');

const file = 'src/data/db.ts';
let content = fs.readFileSync(file, 'utf8');

const worldNames = [
  'Shadow Realm', 'Crystal Caverns', 'Frozen Tundra', 'Desert of Despair', 
  'Ethereal Plane', 'Cursed Marshes', 'Void Nebula', 'Celestial Peaks', 'Infernal Abyss'
];

let newStages = [];
let enemyList = ['slime', 'goblin', 'wolf', 'orc', 'skeleton', 'dark_mage', 'gargoyle', 'minotaur', 'fire_elemental', 'wraith', 'water_elemental'];
let bossList = ['dragon_boss', 'archdemon_boss'];

for (let c = 6; c <= 20; c++) {
  const worldName = worldNames[c % worldNames.length];
  
  for (let s = 1; s <= 5; s++) {
    const isBoss = s === 5;
    const sName = isBoss ? 'Boss' : `Stage ${s}`;
    let enemies = [];
    if (isBoss) {
      enemies.push(bossList[c % bossList.length] || 'archdemon_boss');
      enemies.push(enemyList[Math.floor(Math.random()*enemyList.length)]);
    } else {
      enemies.push(enemyList[Math.floor(Math.random()*enemyList.length)]);
      enemies.push(enemyList[Math.floor(Math.random()*enemyList.length)]);
    }
    
    newStages.push(`  { id: '${c}-${s}', worldName: '${worldName}', stageName: '${sName}', isBoss: ${isBoss}, enemies: ${JSON.stringify(enemies)}, rewards: { gold: ${c * 100 * s}, gems: ${c * 10 * s}, xp: ${c * 150 * s} } }`);
  }
}

const lines = content.split('\n');
const insertIndex = lines.findIndex(line => line.includes('export const STAGES_DATABASE: WorldStage[] = [')) + 1;
lines.splice(insertIndex, 0, newStages.join(',\n') + ',');

fs.writeFileSync(file, lines.join('\n'));
