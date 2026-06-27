const fs = require('fs');
const content = fs.readFileSync('src/data/db.ts', 'utf8');

const rarities = ['Mythic', 'Celestial', 'Series', 'Limited'];
const modelTypes = ['box', 'cone', 'cylinder', 'sphere'];
const elements = ['fire', 'ice', 'dark', 'slash', 'heal'];

const prefixes = ['Cosmic', 'Abyssal', 'Divine', 'Infernal', 'Frozen', 'Spectral', 'Radiant', 'Void', 'Ethereal', 'Astral', 'Nebula', 'Eclipse', 'Twilight', 'Lunar', 'Solar', 'Chaos', 'Order', 'Ancient', 'Primeval', 'Vanguard', 'Omega', 'Alpha', 'Zenith', 'Apex', 'Nova', 'Quasar', 'Pulsar', 'Stellar', 'Galactic', 'Universal'];
const nouns = ['Knight', 'Mage', 'Dragon', 'Phoenix', 'Titan', 'Wraith', 'Seraph', 'Demon', 'Valkyrie', 'Leviathan', 'Behemoth', 'Chimera', 'Hydra', 'Kraken', 'Gargoyle', 'Ogre', 'Troll', 'Goblin', 'Orc', 'Elf', 'Dwarf', 'Human', 'Cyborg', 'Android', 'Mutant', 'Alien', 'Ghost', 'Zombie', 'Vampire', 'Werewolf'];

const skillsDict = {
  'fire': ['Inferno Blast', 'Meteor Strike', 'Solar Flare', 'Magma Eruption', 'Flame Claws', 'Blazing Comet', 'Phoenix Dive'],
  'ice': ['Blizzard Storm', 'Glacial Spike', 'Absolute Zero', 'Tsunami Sweep', 'Frost Armor', 'Cryo Beam', 'Ice Shards'],
  'dark': ['Void Collapse', 'Shadow Rift', 'Abyssal Terror', 'Spectral Sip', 'Dark Pulsar', 'Eclipse Strike', 'Nightmare Gaze'],
  'slash': ['Blade Matrix', 'Omnislash', 'Shattering Strike', 'Earthquake Smash', 'Gale Pierce', 'Fatal Backstab', 'Meteor Cleave'],
  'heal': ['Divine Sanctuary', 'Regenerate Matrix', 'Holy Light', 'Nature Aura', 'Life Tap', 'Celestial Guard', 'Healing Rain']
};

let additionalHeroes = [];

for (let i = 0; i < 30; i++) {
  const prefix = prefixes[i % prefixes.length];
  const noun = nouns[(i + 5) % nouns.length];
  const rarity = rarities[Math.floor(Math.random() * rarities.length)];
  const elementType = elements[Math.floor(Math.random() * elements.length)];
  
  const skillNames = skillsDict[elementType];
  let hSkills = [];
  
  let baseDmg = 1.0;
  
  // Basic skill
  hSkills.push(`{ name: '${skillNames[0]}', damageMultiplier: ${elementType === 'heal' ? -1.0 : 1.2}, cooldown: 0, effectType: '${elementType}' }`);
  
  // Ultimate skill
  hSkills.push(`{ name: '${skillNames[1]}', damageMultiplier: ${elementType === 'heal' ? -3.0 : 3.5}, cooldown: 5, effectType: '${elementType}' }`);
  
  if (Math.random() > 0.5) {
      hSkills.push(`{ name: '${skillNames[2]}', damageMultiplier: ${elementType === 'heal' ? -2.0 : 2.5}, cooldown: 3, effectType: '${elementType}' }`);
  }

  const modelType = modelTypes[Math.floor(Math.random() * modelTypes.length)];
  const modelColors = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#22c55e', '#84cc16'];
  const modelColor = modelColors[Math.floor(Math.random() * modelColors.length)];

  const maxHp = 1500 + Math.floor(Math.random() * 3000);
  const attack = 200 + Math.floor(Math.random() * 500);
  const defense = 100 + Math.floor(Math.random() * 300);
  const speed = 100 + Math.floor(Math.random() * 100);

  additionalHeroes.push(`  {
    id: 'hero_${prefix.toLowerCase()}_${noun.toLowerCase()}_${i}', name: '${prefix} ${noun}', rarity: '${rarity}', level: 1,
    maxHp: ${maxHp}, attack: ${attack}, defense: ${defense}, speed: ${speed}, modelType: '${modelType}', modelColor: '${modelColor}',
    skills: [
      ${hSkills.join(',\n      ')}
    ]
  }`);
}

const modifiedContent = content.replace(
  'export const HERO_DATABASE: Hero[] = [',
  'export const HERO_DATABASE: Hero[] = [\n' + additionalHeroes.join(',\n') + ','
);

fs.writeFileSync('src/data/db.ts', modifiedContent, 'utf8');
