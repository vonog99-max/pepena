import { Hero, Enemy, WorldStage } from '../types';

export const HERO_DATABASE: Hero[] = [
  {
    id: 'hero_cosmic_wraith_0', name: 'Cosmic Wraith', rarity: 'Celestial', level: 1,
    maxHp: 3092, attack: 272, defense: 225, speed: 134, modelType: 'sphere', modelColor: '#06b6d4',
    skills: [
      { name: 'Blade Matrix', damageMultiplier: 1.2, cooldown: 0, effectType: 'slash' },
      { name: 'Omnislash', damageMultiplier: 3.5, cooldown: 5, effectType: 'slash' }
    ]
  },
  {
    id: 'hero_abyssal_seraph_1', name: 'Abyssal Seraph', rarity: 'Celestial', level: 1,
    maxHp: 3141, attack: 420, defense: 376, speed: 162, modelType: 'cone', modelColor: '#06b6d4',
    skills: [
      { name: 'Blade Matrix', damageMultiplier: 1.2, cooldown: 0, effectType: 'slash' },
      { name: 'Omnislash', damageMultiplier: 3.5, cooldown: 5, effectType: 'slash' },
      { name: 'Shattering Strike', damageMultiplier: 2.5, cooldown: 3, effectType: 'slash' }
    ]
  },
  {
    id: 'hero_divine_demon_2', name: 'Divine Demon', rarity: 'Mythic', level: 1,
    maxHp: 3016, attack: 384, defense: 248, speed: 146, modelType: 'cone', modelColor: '#a855f7',
    skills: [
      { name: 'Divine Sanctuary', damageMultiplier: -1, cooldown: 0, effectType: 'heal' },
      { name: 'Regenerate Matrix', damageMultiplier: -3, cooldown: 5, effectType: 'heal' },
      { name: 'Holy Light', damageMultiplier: -2, cooldown: 3, effectType: 'heal' }
    ]
  },
  {
    id: 'hero_infernal_valkyrie_3', name: 'Infernal Valkyrie', rarity: 'Series', level: 1,
    maxHp: 2968, attack: 319, defense: 283, speed: 194, modelType: 'cone', modelColor: '#8b5cf6',
    skills: [
      { name: 'Blizzard Storm', damageMultiplier: 1.2, cooldown: 0, effectType: 'ice' },
      { name: 'Glacial Spike', damageMultiplier: 3.5, cooldown: 5, effectType: 'ice' },
      { name: 'Absolute Zero', damageMultiplier: 2.5, cooldown: 3, effectType: 'ice' }
    ]
  },
  {
    id: 'hero_frozen_leviathan_4', name: 'Frozen Leviathan', rarity: 'Limited', level: 1,
    maxHp: 3756, attack: 407, defense: 142, speed: 111, modelType: 'cone', modelColor: '#f43f5e',
    skills: [
      { name: 'Void Collapse', damageMultiplier: 1.2, cooldown: 0, effectType: 'dark' },
      { name: 'Shadow Rift', damageMultiplier: 3.5, cooldown: 5, effectType: 'dark' }
    ]
  },
  {
    id: 'hero_spectral_behemoth_5', name: 'Spectral Behemoth', rarity: 'Series', level: 1,
    maxHp: 1991, attack: 665, defense: 306, speed: 164, modelType: 'cylinder', modelColor: '#f43f5e',
    skills: [
      { name: 'Blizzard Storm', damageMultiplier: 1.2, cooldown: 0, effectType: 'ice' },
      { name: 'Glacial Spike', damageMultiplier: 3.5, cooldown: 5, effectType: 'ice' },
      { name: 'Absolute Zero', damageMultiplier: 2.5, cooldown: 3, effectType: 'ice' }
    ]
  },
  {
    id: 'hero_radiant_chimera_6', name: 'Radiant Chimera', rarity: 'Celestial', level: 1,
    maxHp: 1683, attack: 634, defense: 224, speed: 104, modelType: 'sphere', modelColor: '#84cc16',
    skills: [
      { name: 'Blizzard Storm', damageMultiplier: 1.2, cooldown: 0, effectType: 'ice' },
      { name: 'Glacial Spike', damageMultiplier: 3.5, cooldown: 5, effectType: 'ice' }
    ]
  },
  {
    id: 'hero_void_hydra_7', name: 'Void Hydra', rarity: 'Limited', level: 1,
    maxHp: 4300, attack: 387, defense: 121, speed: 156, modelType: 'sphere', modelColor: '#f43f5e',
    skills: [
      { name: 'Divine Sanctuary', damageMultiplier: -1, cooldown: 0, effectType: 'heal' },
      { name: 'Regenerate Matrix', damageMultiplier: -3, cooldown: 5, effectType: 'heal' }
    ]
  },
  {
    id: 'hero_ethereal_kraken_8', name: 'Ethereal Kraken', rarity: 'Series', level: 1,
    maxHp: 1732, attack: 411, defense: 299, speed: 112, modelType: 'cylinder', modelColor: '#3b82f6',
    skills: [
      { name: 'Blizzard Storm', damageMultiplier: 1.2, cooldown: 0, effectType: 'ice' },
      { name: 'Glacial Spike', damageMultiplier: 3.5, cooldown: 5, effectType: 'ice' }
    ]
  },
  {
    id: 'hero_astral_gargoyle_9', name: 'Astral Gargoyle', rarity: 'Mythic', level: 1,
    maxHp: 1847, attack: 574, defense: 129, speed: 134, modelType: 'cone', modelColor: '#d946ef',
    skills: [
      { name: 'Divine Sanctuary', damageMultiplier: -1, cooldown: 0, effectType: 'heal' },
      { name: 'Regenerate Matrix', damageMultiplier: -3, cooldown: 5, effectType: 'heal' },
      { name: 'Holy Light', damageMultiplier: -2, cooldown: 3, effectType: 'heal' }
    ]
  },
  {
    id: 'hero_nebula_ogre_10', name: 'Nebula Ogre', rarity: 'Mythic', level: 1,
    maxHp: 3881, attack: 488, defense: 299, speed: 102, modelType: 'cylinder', modelColor: '#3b82f6',
    skills: [
      { name: 'Blizzard Storm', damageMultiplier: 1.2, cooldown: 0, effectType: 'ice' },
      { name: 'Glacial Spike', damageMultiplier: 3.5, cooldown: 5, effectType: 'ice' }
    ]
  },
  {
    id: 'hero_eclipse_troll_11', name: 'Eclipse Troll', rarity: 'Celestial', level: 1,
    maxHp: 3861, attack: 482, defense: 124, speed: 142, modelType: 'cone', modelColor: '#0ea5e9',
    skills: [
      { name: 'Void Collapse', damageMultiplier: 1.2, cooldown: 0, effectType: 'dark' },
      { name: 'Shadow Rift', damageMultiplier: 3.5, cooldown: 5, effectType: 'dark' }
    ]
  },
  {
    id: 'hero_twilight_goblin_12', name: 'Twilight Goblin', rarity: 'Series', level: 1,
    maxHp: 3326, attack: 646, defense: 176, speed: 195, modelType: 'sphere', modelColor: '#06b6d4',
    skills: [
      { name: 'Divine Sanctuary', damageMultiplier: -1, cooldown: 0, effectType: 'heal' },
      { name: 'Regenerate Matrix', damageMultiplier: -3, cooldown: 5, effectType: 'heal' },
      { name: 'Holy Light', damageMultiplier: -2, cooldown: 3, effectType: 'heal' }
    ]
  },
  {
    id: 'hero_lunar_orc_13', name: 'Lunar Orc', rarity: 'Mythic', level: 1,
    maxHp: 2578, attack: 294, defense: 292, speed: 143, modelType: 'cone', modelColor: '#ec4899',
    skills: [
      { name: 'Void Collapse', damageMultiplier: 1.2, cooldown: 0, effectType: 'dark' },
      { name: 'Shadow Rift', damageMultiplier: 3.5, cooldown: 5, effectType: 'dark' },
      { name: 'Abyssal Terror', damageMultiplier: 2.5, cooldown: 3, effectType: 'dark' }
    ]
  },
  {
    id: 'hero_solar_elf_14', name: 'Solar Elf', rarity: 'Mythic', level: 1,
    maxHp: 3856, attack: 540, defense: 177, speed: 113, modelType: 'box', modelColor: '#10b981',
    skills: [
      { name: 'Divine Sanctuary', damageMultiplier: -1, cooldown: 0, effectType: 'heal' },
      { name: 'Regenerate Matrix', damageMultiplier: -3, cooldown: 5, effectType: 'heal' }
    ]
  },
  {
    id: 'hero_chaos_dwarf_15', name: 'Chaos Dwarf', rarity: 'Mythic', level: 1,
    maxHp: 3126, attack: 519, defense: 123, speed: 177, modelType: 'cone', modelColor: '#d946ef',
    skills: [
      { name: 'Divine Sanctuary', damageMultiplier: -1, cooldown: 0, effectType: 'heal' },
      { name: 'Regenerate Matrix', damageMultiplier: -3, cooldown: 5, effectType: 'heal' },
      { name: 'Holy Light', damageMultiplier: -2, cooldown: 3, effectType: 'heal' }
    ]
  },
  {
    id: 'hero_order_human_16', name: 'Order Human', rarity: 'Mythic', level: 1,
    maxHp: 2190, attack: 470, defense: 164, speed: 192, modelType: 'sphere', modelColor: '#06b6d4',
    skills: [
      { name: 'Blizzard Storm', damageMultiplier: 1.2, cooldown: 0, effectType: 'ice' },
      { name: 'Glacial Spike', damageMultiplier: 3.5, cooldown: 5, effectType: 'ice' }
    ]
  },
  {
    id: 'hero_ancient_cyborg_17', name: 'Ancient Cyborg', rarity: 'Celestial', level: 1,
    maxHp: 4187, attack: 439, defense: 369, speed: 171, modelType: 'sphere', modelColor: '#a855f7',
    skills: [
      { name: 'Void Collapse', damageMultiplier: 1.2, cooldown: 0, effectType: 'dark' },
      { name: 'Shadow Rift', damageMultiplier: 3.5, cooldown: 5, effectType: 'dark' },
      { name: 'Abyssal Terror', damageMultiplier: 2.5, cooldown: 3, effectType: 'dark' }
    ]
  },
  {
    id: 'hero_primeval_android_18', name: 'Primeval Android', rarity: 'Celestial', level: 1,
    maxHp: 3186, attack: 517, defense: 158, speed: 135, modelType: 'cylinder', modelColor: '#f43f5e',
    skills: [
      { name: 'Blade Matrix', damageMultiplier: 1.2, cooldown: 0, effectType: 'slash' },
      { name: 'Omnislash', damageMultiplier: 3.5, cooldown: 5, effectType: 'slash' },
      { name: 'Shattering Strike', damageMultiplier: 2.5, cooldown: 3, effectType: 'slash' }
    ]
  },
  {
    id: 'hero_vanguard_mutant_19', name: 'Vanguard Mutant', rarity: 'Series', level: 1,
    maxHp: 1792, attack: 583, defense: 288, speed: 142, modelType: 'cylinder', modelColor: '#0ea5e9',
    skills: [
      { name: 'Divine Sanctuary', damageMultiplier: -1, cooldown: 0, effectType: 'heal' },
      { name: 'Regenerate Matrix', damageMultiplier: -3, cooldown: 5, effectType: 'heal' },
      { name: 'Holy Light', damageMultiplier: -2, cooldown: 3, effectType: 'heal' }
    ]
  },
  {
    id: 'hero_omega_alien_20', name: 'Omega Alien', rarity: 'Series', level: 1,
    maxHp: 4475, attack: 635, defense: 208, speed: 110, modelType: 'box', modelColor: '#84cc16',
    skills: [
      { name: 'Divine Sanctuary', damageMultiplier: -1, cooldown: 0, effectType: 'heal' },
      { name: 'Regenerate Matrix', damageMultiplier: -3, cooldown: 5, effectType: 'heal' },
      { name: 'Holy Light', damageMultiplier: -2, cooldown: 3, effectType: 'heal' }
    ]
  },
  {
    id: 'hero_alpha_ghost_21', name: 'Alpha Ghost', rarity: 'Mythic', level: 1,
    maxHp: 4360, attack: 668, defense: 215, speed: 170, modelType: 'sphere', modelColor: '#0ea5e9',
    skills: [
      { name: 'Inferno Blast', damageMultiplier: 1.2, cooldown: 0, effectType: 'fire' },
      { name: 'Meteor Strike', damageMultiplier: 3.5, cooldown: 5, effectType: 'fire' }
    ]
  },
  {
    id: 'hero_zenith_zombie_22', name: 'Zenith Zombie', rarity: 'Limited', level: 1,
    maxHp: 1631, attack: 510, defense: 180, speed: 175, modelType: 'box', modelColor: '#6366f1',
    skills: [
      { name: 'Blizzard Storm', damageMultiplier: 1.2, cooldown: 0, effectType: 'ice' },
      { name: 'Glacial Spike', damageMultiplier: 3.5, cooldown: 5, effectType: 'ice' }
    ]
  },
  {
    id: 'hero_apex_vampire_23', name: 'Apex Vampire', rarity: 'Celestial', level: 1,
    maxHp: 4340, attack: 655, defense: 149, speed: 157, modelType: 'cylinder', modelColor: '#0ea5e9',
    skills: [
      { name: 'Inferno Blast', damageMultiplier: 1.2, cooldown: 0, effectType: 'fire' },
      { name: 'Meteor Strike', damageMultiplier: 3.5, cooldown: 5, effectType: 'fire' }
    ]
  },
  {
    id: 'hero_nova_werewolf_24', name: 'Nova Werewolf', rarity: 'Celestial', level: 1,
    maxHp: 3066, attack: 319, defense: 338, speed: 142, modelType: 'box', modelColor: '#a855f7',
    skills: [
      { name: 'Blizzard Storm', damageMultiplier: 1.2, cooldown: 0, effectType: 'ice' },
      { name: 'Glacial Spike', damageMultiplier: 3.5, cooldown: 5, effectType: 'ice' },
      { name: 'Absolute Zero', damageMultiplier: 2.5, cooldown: 3, effectType: 'ice' }
    ]
  },
  {
    id: 'hero_quasar_knight_25', name: 'Quasar Knight', rarity: 'Mythic', level: 1,
    maxHp: 1507, attack: 360, defense: 370, speed: 178, modelType: 'cone', modelColor: '#06b6d4',
    skills: [
      { name: 'Divine Sanctuary', damageMultiplier: -1, cooldown: 0, effectType: 'heal' },
      { name: 'Regenerate Matrix', damageMultiplier: -3, cooldown: 5, effectType: 'heal' },
      { name: 'Holy Light', damageMultiplier: -2, cooldown: 3, effectType: 'heal' }
    ]
  },
  {
    id: 'hero_pulsar_mage_26', name: 'Pulsar Mage', rarity: 'Celestial', level: 1,
    maxHp: 2219, attack: 419, defense: 122, speed: 123, modelType: 'sphere', modelColor: '#8b5cf6',
    skills: [
      { name: 'Blade Matrix', damageMultiplier: 1.2, cooldown: 0, effectType: 'slash' },
      { name: 'Omnislash', damageMultiplier: 3.5, cooldown: 5, effectType: 'slash' },
      { name: 'Shattering Strike', damageMultiplier: 2.5, cooldown: 3, effectType: 'slash' }
    ]
  },
  {
    id: 'hero_stellar_dragon_27', name: 'Stellar Dragon', rarity: 'Limited', level: 1,
    maxHp: 3752, attack: 300, defense: 221, speed: 173, modelType: 'cylinder', modelColor: '#22c55e',
    skills: [
      { name: 'Divine Sanctuary', damageMultiplier: -1, cooldown: 0, effectType: 'heal' },
      { name: 'Regenerate Matrix', damageMultiplier: -3, cooldown: 5, effectType: 'heal' }
    ]
  },
  {
    id: 'hero_galactic_phoenix_28', name: 'Galactic Phoenix', rarity: 'Mythic', level: 1,
    maxHp: 2274, attack: 567, defense: 198, speed: 169, modelType: 'box', modelColor: '#3b82f6',
    skills: [
      { name: 'Divine Sanctuary', damageMultiplier: -1, cooldown: 0, effectType: 'heal' },
      { name: 'Regenerate Matrix', damageMultiplier: -3, cooldown: 5, effectType: 'heal' }
    ]
  },
  {
    id: 'hero_universal_titan_29', name: 'Universal Titan', rarity: 'Limited', level: 1,
    maxHp: 2094, attack: 426, defense: 215, speed: 177, modelType: 'cylinder', modelColor: '#10b981',
    skills: [
      { name: 'Divine Sanctuary', damageMultiplier: -1, cooldown: 0, effectType: 'heal' },
      { name: 'Regenerate Matrix', damageMultiplier: -3, cooldown: 5, effectType: 'heal' }
    ]
  },
  {
    id: 'starter_hero', name: 'Apprentice Squire', rarity: 'Common', level: 1, 
    maxHp: 500, attack: 20, defense: 20, speed: 100, modelType: 'box', modelColor: '#ef4444',
    skills: [
      { name: 'Slash', damageMultiplier: 1.5, cooldown: 0, effectType: 'slash' },
      { name: 'Fireball', damageMultiplier: 2.5, cooldown: 3, effectType: 'fire' },
      { name: 'Shattering Stone', damageMultiplier: 1.8, cooldown: 4, effectType: 'slash' }
    ]
  },
  {
    id: 'ice_mage', name: 'Ice Mage', rarity: 'Epic', level: 1,
    maxHp: 800, attack: 220, defense: 50, speed: 110, modelType: 'cone', modelColor: '#3b82f6',
    skills: [
      { name: 'Frost Bolt', damageMultiplier: 1.2, cooldown: 0, effectType: 'ice' },
      { name: 'Blizzard', damageMultiplier: 2.0, cooldown: 3, effectType: 'ice' },
      { name: 'Absolute Zero', damageMultiplier: 3.2, cooldown: 5, effectType: 'ice' },
      { name: 'Frozen Needle', damageMultiplier: 1.6, cooldown: 2, effectType: 'ice' }
    ]
  },
  {
    id: 'shadow_assassin', name: 'Shadow Assassin', rarity: 'Mythic', level: 1,
    maxHp: 900, attack: 280, defense: 60, speed: 150, modelType: 'cylinder', modelColor: '#8b5cf6',
    skills: [
      { name: 'Backstab', damageMultiplier: 1.5, cooldown: 0, effectType: 'slash' },
      { name: 'Shadow Dance', damageMultiplier: 3.5, cooldown: 4, effectType: 'dark' },
      { name: 'Phantom Slash', damageMultiplier: 2.8, cooldown: 3, effectType: 'slash' },
      { name: 'Apocalypse Strike', damageMultiplier: 4.5, cooldown: 6, effectType: 'dark' }
    ]
  },
  {
    id: 'light_cleric', name: 'Light Cleric', rarity: 'Rare', level: 1,
    maxHp: 1100, attack: 100, defense: 90, speed: 90, modelType: 'sphere', modelColor: '#eab308',
    skills: [
      { name: 'Holy Bolt', damageMultiplier: 0.8, cooldown: 0, effectType: 'dark' },
      { name: 'Heal', damageMultiplier: -1.5, cooldown: 3, effectType: 'heal' },
      { name: 'Holy Protection', damageMultiplier: -2.2, cooldown: 5, effectType: 'heal' }
    ]
  },
  {
    id: 'earth_golem', name: 'Earth Golem', rarity: 'Common', level: 1,
    maxHp: 2000, attack: 80, defense: 150, speed: 70, modelType: 'box', modelColor: '#92400e',
    skills: [
      { name: 'Smash', damageMultiplier: 1.0, cooldown: 0, effectType: 'slash' },
      { name: 'Earthquake', damageMultiplier: 1.5, cooldown: 4, effectType: 'slash' },
      { name: 'Runic Fortification', damageMultiplier: -1.2, cooldown: 5, effectType: 'heal' }
    ]
  },
  {
    id: 'wind_ranger', name: 'Wind Ranger', rarity: 'Epic', level: 1,
    maxHp: 850, attack: 200, defense: 55, speed: 140, modelType: 'cylinder', modelColor: '#22c55e',
    skills: [
      { name: 'Quick Arrow', damageMultiplier: 1.1, cooldown: 0, effectType: 'slash' },
      { name: 'Gale Shot', damageMultiplier: 2.2, cooldown: 3, effectType: 'slash' },
      { name: 'Ethereal Pierce', damageMultiplier: 1.9, cooldown: 2, effectType: 'slash' }
    ]
  },
  {
    id: 'water_nymph', name: 'Water Nymph', rarity: 'Rare', level: 1,
    maxHp: 950, attack: 150, defense: 70, speed: 105, modelType: 'sphere', modelColor: '#0ea5e9',
    skills: [
      { name: 'Water Pulse', damageMultiplier: 1.0, cooldown: 0, effectType: 'ice' },
      { name: 'Tsunami', damageMultiplier: 1.8, cooldown: 3, effectType: 'ice' },
      { name: 'Ocean Sanctuary', damageMultiplier: -1.8, cooldown: 4, effectType: 'heal' },
      { name: 'Torrent Cascade', damageMultiplier: 2.1, cooldown: 2, effectType: 'ice' }
    ]
  },
  {
    id: 'thunder_brawler', name: 'Thunder Brawler', rarity: 'Legendary', level: 1,
    maxHp: 1300, attack: 240, defense: 85, speed: 120, modelType: 'box', modelColor: '#eab308',
    skills: [
      { name: 'Thunder Punch', damageMultiplier: 1.3, cooldown: 0, effectType: 'slash' },
      { name: 'Lightning Storm', damageMultiplier: 2.8, cooldown: 4, effectType: 'fire' },
      { name: 'Lightning Nova', damageMultiplier: 2.2, cooldown: 3, effectType: 'fire' }
    ]
  },
  {
    id: 'blood_vampire', name: 'Blood Vampire', rarity: 'Epic', level: 1,
    maxHp: 1000, attack: 210, defense: 65, speed: 125, modelType: 'cone', modelColor: '#b91c1c',
    skills: [
      { name: 'Bite', damageMultiplier: 1.2, cooldown: 0, effectType: 'slash' },
      { name: 'Blood Leech', damageMultiplier: 2.0, cooldown: 3, effectType: 'dark' },
      { name: 'Vampiric Burst', damageMultiplier: 2.4, cooldown: 4, effectType: 'dark' },
      { name: 'Bat Swarm', damageMultiplier: 1.6, cooldown: 2, effectType: 'dark' }
    ]
  },
  {
    id: 'iron_paladin', name: 'Iron Paladin', rarity: 'Legendary', level: 1,
    maxHp: 1800, attack: 140, defense: 180, speed: 80, modelType: 'box', modelColor: '#94a3b8',
    skills: [
      { name: 'Shield Bash', damageMultiplier: 0.9, cooldown: 0, effectType: 'slash' },
      { name: 'Divine Shield', damageMultiplier: -2.0, cooldown: 5, effectType: 'heal' },
      { name: 'Holy Verdict', damageMultiplier: 2.5, cooldown: 4, effectType: 'dark' },
      { name: 'Solar Flare', damageMultiplier: 2.1, cooldown: 3, effectType: 'fire' }
    ]
  },
  {
    id: 'arch_druid', name: 'Arch Druid', rarity: 'Legendary', level: 1,
    maxHp: 1400, attack: 180, defense: 100, speed: 115, modelType: 'cylinder', modelColor: '#10b981',
    skills: [
      { name: 'Gale Guard', damageMultiplier: -1.6, cooldown: 3, effectType: 'heal' },
      { name: 'Meteor Storm', damageMultiplier: 3.8, cooldown: 6, effectType: 'fire' },
      { name: 'Nature Wrath', damageMultiplier: 2.2, cooldown: 4, effectType: 'ice' }
    ]
  },
  {
    id: 'void_weaver', name: 'Void Weaver', rarity: 'Mythic', level: 1,
    maxHp: 1200, attack: 310, defense: 70, speed: 135, modelType: 'sphere', modelColor: '#4c1d95',
    skills: [
      { name: 'Dark Rift', damageMultiplier: 1.8, cooldown: 0, effectType: 'dark' },
      { name: 'Cosmic Collapse', damageMultiplier: 4.2, cooldown: 5, effectType: 'dark' },
      { name: 'Astral Transfusion', damageMultiplier: -2.5, cooldown: 4, effectType: 'heal' }
    ]
  },
  {
    id: 'blaze_berserker', name: 'Blaze Berserker', rarity: 'Rare', level: 1,
    maxHp: 1150, attack: 170, defense: 85, speed: 120, modelType: 'box', modelColor: '#f97316',
    skills: [
      { name: 'Blaze Cleave', damageMultiplier: 1.5, cooldown: 0, effectType: 'fire' },
      { name: 'Inferno Shock', damageMultiplier: 2.6, cooldown: 3, effectType: 'fire' }
    ]
  },
  {
    id: 'saitama_hero', name: 'Saitama (One Punch Man)', rarity: '∞ infinite and beyond stars ★', level: 1,
    maxHp: 450000, attack: 280000, defense: 180000, speed: 300, modelType: 'sphere', modelColor: '#facc15',
    skills: [
      { name: 'Normal Punch', damageMultiplier: 12.5, cooldown: 0, effectType: 'punch' },
      { name: 'Consecutive Normal Punches', damageMultiplier: 45.0, cooldown: 2, effectType: 'consecutive_punches' },
      { name: 'Serious Headbutt', damageMultiplier: 35.0, cooldown: 3, effectType: 'headbutt' },
      { name: 'Serious Squirt Gun', damageMultiplier: 40.0, cooldown: 4, effectType: 'squirt_gun' },
      { name: 'Serious Table Flip', damageMultiplier: 65.0, cooldown: 5, effectType: 'table_flip' },
      { name: 'Serious Sneeze', damageMultiplier: 80.0, cooldown: 5, effectType: 'sneeze' },
      { name: 'Serious Punch: 300 Death Blows', damageMultiplier: 300.0, cooldown: 6, effectType: 'saitama_300_punches' }
    ]
  },
  {
    id: 'zeno_hero', name: 'Grand Lord Zeno', rarity: '∞ infinite and beyond stars ★', level: 1,
    maxHp: 650000, attack: 350000, defense: 220000, speed: 400, modelType: 'sphere', modelColor: '#a855f7',
    skills: [
      { name: 'Zeno Spark', damageMultiplier: 25.0, cooldown: 0, effectType: 'zeno_spark' },
      { name: 'Zeno Disintegrate', damageMultiplier: 55.0, cooldown: 2, effectType: 'zeno_disintegrate' },
      { name: 'Zeno Erase Blast', damageMultiplier: 85.0, cooldown: 3, effectType: 'zeno_blast' },
      { name: 'Zeno Judgment Dome', damageMultiplier: 125.0, cooldown: 4, effectType: 'zeno_judgment' },
      { name: 'Zeno 300 Universe Erasure', damageMultiplier: 450.0, cooldown: 6, effectType: 'zeno_300_erasures' }
    ]
  },
  {
    id: 'goku_super_saiyan', name: 'Son Goku (Super Saiyan)', rarity: 'Celestial', level: 1,
    maxHp: 3804, attack: 520, defense: 380, speed: 180, modelType: 'sphere', modelColor: '#eab308',
    skills: [
      { name: 'Dragon Fist Strike', damageMultiplier: 3.5, cooldown: 0, effectType: 'slash' },
      { name: 'Red Kamehameha', damageMultiplier: 22.0, cooldown: 4, effectType: 'red_kamehameha' },
      { name: 'Super Spirit Bomb', damageMultiplier: 45.0, cooldown: 6, effectType: 'meteor' }
    ]
  },
  {
    id: 'ichigo_bankai', name: 'Ichigo Kurosaki (Bankai)', rarity: 'Series', level: 1,
    maxHp: 3512, attack: 580, defense: 310, speed: 210, modelType: 'cylinder', modelColor: '#1e1b4b',
    skills: [
      { name: 'Getsuga Tensho', damageMultiplier: 5.2, cooldown: 0, effectType: 'slash' },
      { name: 'Black Triangle Bankai', damageMultiplier: 32.0, cooldown: 5, effectType: 'bankai' },
      { name: 'Hollow Mask Outburst', damageMultiplier: 20.0, cooldown: 3, effectType: 'dark' }
    ]
  },
  {
    id: 'naruto_six_paths', name: 'Naruto Uzumaki (Six Paths)', rarity: 'Series', level: 1,
    maxHp: 3950, attack: 490, defense: 420, speed: 175, modelType: 'sphere', modelColor: '#f97316',
    skills: [
      { name: 'Rasen-Rampage Strike', damageMultiplier: 4.0, cooldown: 0, effectType: 'fire' },
      { name: 'Wind Release: Rasenshuriken', damageMultiplier: 24.5, cooldown: 4, effectType: 'ice' },
      { name: 'Tailed Beast Planetary Bomb', damageMultiplier: 48.0, cooldown: 6, effectType: 'dark' }
    ]
  },
  {
    id: 'luffy_gear5', name: 'Monkey D. Luffy (Gear 5)', rarity: 'Limited', level: 1,
    maxHp: 4400, attack: 460, defense: 450, speed: 190, modelType: 'sphere', modelColor: '#ffffff',
    skills: [
      { name: 'Gum-Gum Whiplash', damageMultiplier: 3.8, cooldown: 0, effectType: 'slash' },
      { name: 'White Lightning Shock', damageMultiplier: 14.2, cooldown: 3, effectType: 'fire' },
      { name: 'Giga Bajrang Gun', damageMultiplier: 52.0, cooldown: 6, effectType: 'meteor' }
    ]
  },
  {
    id: 'zoro_three_swords', name: 'Roronoa Zoro (Aura)', rarity: 'Legendary', level: 1,
    maxHp: 3200, attack: 610, defense: 290, speed: 165, modelType: 'box', modelColor: '#15803d',
    skills: [
      { name: 'Oni Giri Slice', damageMultiplier: 4.2, cooldown: 0, effectType: 'slash' },
      { name: 'Dragon Twister Shockwave', damageMultiplier: 18.0, cooldown: 3, effectType: 'slash' },
      { name: '1080 Pound Great Phoenix', damageMultiplier: 29.0, cooldown: 5, effectType: 'slash' }
    ]
  },
  {
    id: 'sasuke_rinnegan', name: 'Sasuke Uchiha (Rinnegan)', rarity: 'Limited', level: 1,
    maxHp: 3100, attack: 560, defense: 330, speed: 195, modelType: 'cone', modelColor: '#6366f1',
    skills: [
      { name: 'Chidori Blade Slash', damageMultiplier: 4.5, cooldown: 0, effectType: 'slash' },
      { name: 'Amaterasu Eternal Flame', damageMultiplier: 18.5, cooldown: 3, effectType: 'dark' },
      { name: 'Indra Heavenly Arrow', damageMultiplier: 50.0, cooldown: 6, effectType: 'meteor' }
    ]
  },
  {
    id: 'madara_rinnegan', name: 'Madara Uchiha (Koto)', rarity: 'Mythic', level: 1,
    maxHp: 4800, attack: 540, defense: 350, speed: 155, modelType: 'cylinder', modelColor: '#7f1d1d',
    skills: [
      { name: 'Flame Destroyer Breath', damageMultiplier: 6.2, cooldown: 0, effectType: 'fire' },
      { name: 'Cataclysmic Tengai Shinsei', damageMultiplier: 42.0, cooldown: 5, effectType: 'meteor' },
      { name: 'Perfect Susanoo Slash', damageMultiplier: 26.0, cooldown: 3, effectType: 'slash' }
    ]
  },
  {
    id: 'madara_uchiha_new', name: 'Madara Uchiha (Advance)', rarity: '∞ infinite and beyond stars ★', level: 1,
    maxHp: 550000, attack: 300000, defense: 200000, speed: 250, modelType: 'sphere', modelColor: '#18181b',
    skills: [
      { name: 'Susanoo Slash', damageMultiplier: 45.0, cooldown: 0, effectType: 'slash' },
      { name: 'Fire Destroyer', damageMultiplier: 90.0, cooldown: 4, effectType: 'fire' },
      { name: 'Cataclysmic Tengai', damageMultiplier: 180.0, cooldown: 6, effectType: 'meteor' }
    ]
  },
  {
    id: 'naruto_six_path_new', name: 'Naruto (Six Path Advance)', rarity: '∞ infinite and beyond stars ★', level: 1,
    maxHp: 520000, attack: 310000, defense: 210000, speed: 280, modelType: 'sphere', modelColor: '#ffffff',
    skills: [
      { name: 'Tailed Beast Bomb', damageMultiplier: 55.0, cooldown: 0, effectType: 'dark' },
      { name: 'Six Path Rasen-Shuriken', damageMultiplier: 100.0, cooldown: 3, effectType: 'fire' },
      { name: 'Truth-Seeking Orbs', damageMultiplier: 200.0, cooldown: 6, effectType: 'meteor' }
    ]
  },
  {
    id: 'roronoa_zoro_new', name: 'Roronoa Zoro (King of Hell)', rarity: '∞ infinite and beyond stars ★', level: 1,
    maxHp: 480000, attack: 350000, defense: 190000, speed: 350, modelType: 'box', modelColor: '#3f3f46',
    skills: [
      { name: 'Three Sword Style: Ashura', damageMultiplier: 60.0, cooldown: 0, effectType: 'slash' },
      { name: 'King of Hell: Dragon', damageMultiplier: 110.0, cooldown: 3, effectType: 'slash' },
      { name: '1080 Sword Style: Void', damageMultiplier: 220.0, cooldown: 6, effectType: 'slash' }
    ]
  }
];

export const ENEMY_DATABASE: Enemy[] = [
  { 
    id: 'global_boss_event', name: 'Global Void Entity', rarity: 'Mythic', 
    level: 999, maxHp: 1e100, attack: 1e6, defense: 2000, speed: 200, 
    modelType: 'sphere', modelColor: '#4c1d95',
    isBoss: true,
    skills: [
      { name: 'Fire Breath', damageMultiplier: 1.0, cooldown: 5, effectType: 'fire_breath' },
      { name: 'Stomp', damageMultiplier: 1.5, cooldown: 7, effectType: 'dark' },
      { name: 'Kamehameha', damageMultiplier: 1000.0, cooldown: 12, effectType: 'kamehameha' }
    ]
  },
  {
    id: 'slime', name: 'Slime', level: 1, maxHp: 100, attack: 15, defense: 5, speed: 80,
    modelType: 'sphere', modelColor: '#22c55e',
    skills: [{ name: 'Tackle', damageMultiplier: 1.0, cooldown: 0, effectType: 'slash' }]
  },
  {
    id: 'goblin', name: 'Goblin', level: 2, maxHp: 180, attack: 25, defense: 10, speed: 110,
    modelType: 'box', modelColor: '#65a30d',
    skills: [{ name: 'Stab', damageMultiplier: 1.2, cooldown: 0, effectType: 'slash' }]
  },
  {
    id: 'wolf', name: 'Dire Wolf', level: 3, maxHp: 250, attack: 30, defense: 15, speed: 130,
    modelType: 'cylinder', modelColor: '#71717a',
    skills: [{ name: 'Bite', damageMultiplier: 1.3, cooldown: 0, effectType: 'slash' }]
  },
  {
    id: 'skeleton', name: 'Skeleton Warrior', level: 4, maxHp: 1100, attack: 160, defense: 60, speed: 95,
    modelType: 'box', modelColor: '#f1f5f9',
    skills: [{ name: 'Bone Slash', damageMultiplier: 1.1, cooldown: 0, effectType: 'slash' }]
  },
  {
    id: 'orc', name: 'Orc Warrior', level: 5, maxHp: 1500, attack: 180, defense: 80, speed: 90,
    modelType: 'cylinder', modelColor: '#4d7c0f',
    skills: [{ name: 'Axe Swing', damageMultiplier: 1.5, cooldown: 2, effectType: 'slash' }]
  },
  {
    id: 'dark_mage', name: 'Dark Mage', level: 6, maxHp: 1200, attack: 220, defense: 50, speed: 105,
    modelType: 'cone', modelColor: '#581c87',
    skills: [{ name: 'Shadow Bolt', damageMultiplier: 1.8, cooldown: 1, effectType: 'dark' }]
  },
  {
    id: 'gargoyle', name: 'Stone Gargoyle', level: 7, maxHp: 2200, attack: 150, defense: 140, speed: 85,
    modelType: 'box', modelColor: '#52525b',
    skills: [{ name: 'Stone Claw', damageMultiplier: 1.2, cooldown: 0, effectType: 'slash' }]
  },
  {
    id: 'fire_elemental', name: 'Fire Elemental', level: 8, maxHp: 1800, attack: 240, defense: 60, speed: 115,
    modelType: 'sphere', modelColor: '#ea580c',
    skills: [{ name: 'Burn', damageMultiplier: 1.6, cooldown: 1, effectType: 'fire' }]
  },
  {
    id: 'minotaur', name: 'Minotaur Boss', level: 9, maxHp: 3500, attack: 260, defense: 110, speed: 100,
    modelType: 'box', modelColor: '#78350f',
    skills: [{ name: 'Charge', damageMultiplier: 2.0, cooldown: 2, effectType: 'slash' }]
  },
  {
    id: 'dragon_boss', name: 'Red Dragon', level: 10, maxHp: 5000, attack: 300, defense: 150, speed: 120,
    modelType: 'cone', modelColor: '#dc2626',
    skills: [
      { name: 'Claw', damageMultiplier: 1.0, cooldown: 0, effectType: 'slash' },
      { name: 'Fire Breath', damageMultiplier: 2.5, cooldown: 3, effectType: 'fire' }
    ]
  },
  {
    id: 'wraith', name: 'Void Wraith', level: 6, maxHp: 1405, attack: 200, defense: 70, speed: 110,
    modelType: 'cylinder', modelColor: '#a78bfa',
    skills: [{ name: 'Wraith Grip', damageMultiplier: 1.4, cooldown: 0, effectType: 'dark' }]
  },
  {
    id: 'water_elemental', name: 'Frost Elemental', level: 7, maxHp: 1850, attack: 180, defense: 90, speed: 115,
    modelType: 'sphere', modelColor: '#0284c7',
    skills: [{ name: 'Frost Nova', damageMultiplier: 1.5, cooldown: 1, effectType: 'ice' }]
  },
  {
    id: 'abyss_watcher', name: 'Abyss Watcher', level: 8, maxHp: 2200, attack: 240, defense: 110, speed: 100,
    modelType: 'box', modelColor: '#155e75',
    skills: [{ name: 'Gaze of Terror', damageMultiplier: 1.7, cooldown: 2, effectType: 'dark' }]
  },
  {
    id: 'archdemon_boss', name: 'Archdemon Malgath', level: 8, maxHp: 4100, attack: 320, defense: 120, speed: 95,
    modelType: 'cone', modelColor: '#b91c1c',
    skills: [
      { name: 'Hell Slasher', damageMultiplier: 1.4, cooldown: 0, effectType: 'slash' },
      { name: 'Magma Collapse', damageMultiplier: 2.8, cooldown: 4, effectType: 'fire' }
    ]
  },
  {
    id: 'kraken_boss', name: 'Ancient Kraken', level: 10, maxHp: 6500, attack: 360, defense: 160, speed: 90,
    modelType: 'cylinder', modelColor: '#0f766e',
    skills: [
      { name: 'Crushing Tentacle', damageMultiplier: 1.5, cooldown: 0, effectType: 'slash' },
      { name: 'Abyssal Chasm', damageMultiplier: 2.6, cooldown: 3, effectType: 'ice' }
    ]
  },
  {
    id: 'void_horror', name: 'Void Terror', level: 9, maxHp: 3000, attack: 290, defense: 130, speed: 120,
    modelType: 'sphere', modelColor: '#581c87',
    skills: [{ name: 'Void Pulse', damageMultiplier: 1.6, cooldown: 1, effectType: 'dark' }]
  },
  {
    id: 'cosmic_specter', name: 'Cosmic Specter', level: 10, maxHp: 3500, attack: 320, defense: 140, speed: 130,
    modelType: 'cone', modelColor: '#6d28d9',
    skills: [{ name: 'Stellar Flash', damageMultiplier: 1.8, cooldown: 2, effectType: 'fire' }]
  },
  {
    id: 'void_overlord_boss', name: 'Void Overlord Xul', level: 12, maxHp: 11000, attack: 450, defense: 200, speed: 110,
    modelType: 'box', modelColor: '#090514',
    skills: [
      { name: 'Overlord Strike', damageMultiplier: 1.8, cooldown: 0, effectType: 'slash' },
      { name: 'Cataclysmic Supernova', damageMultiplier: 3.5, cooldown: 5, effectType: 'dark' }
    ]
  },
  {
    id: 'golden_slime_king', name: 'Golden Slime Overlord', level: 1, maxHp: 1e30, attack: 1000, defense: 500, speed: 50,
    modelType: 'sphere', modelColor: '#f59e0b',
    skills: [{ name: 'Golden Sparkle', damageMultiplier: 0.1, cooldown: 0, effectType: 'slash' }]
  },
  {
    id: 'treasury_chest_mimic', name: 'Celestial Vault Guardian', level: 1, maxHp: 5e30, attack: 2000, defense: 1000, speed: 60,
    modelType: 'box', modelColor: '#fbbf24',
    skills: [{ name: 'Coin Toss', damageMultiplier: 0.2, cooldown: 0, effectType: 'slash' }]
  },
  {
    id: 'octo_wealth_dragon', name: 'Octovigintillion Dragon Lord', level: 1, maxHp: 1e31, attack: 5000, defense: 2000, speed: 70,
    modelType: 'cone', modelColor: '#f1f5f9',
    skills: [{ name: 'Golden Breath', damageMultiplier: 0.3, cooldown: 0, effectType: 'fire' }]
  },
  { 
    id: 'event_cyber_titan', name: 'Cyber Titan', rarity: 'Mythic', 
    level: 999, maxHp: 30000, attack: 150, defense: 50, speed: 120, 
    modelType: 'box', modelColor: '#0ea5e9',
    isBoss: true,
    skills: [
      { name: 'Laser Beam', damageMultiplier: 2.0, cooldown: 2, effectType: 'fire' },
      { name: 'Plasma Missiles', damageMultiplier: 4.5, cooldown: 5, effectType: 'fire' }
    ]
  },
  { 
    id: 'event_shadow_empress', name: 'Shadow Empress', rarity: 'Mythic', 
    level: 999, maxHp: 1e36, attack: 1e13, defense: 3500, speed: 250, 
    modelType: 'sphere', modelColor: '#4c1d95',
    isBoss: true,
    skills: [
      { name: 'Shadow Whip', damageMultiplier: 30.0, cooldown: 2, effectType: 'dark' },
      { name: 'Eclipse Event', damageMultiplier: 550.0, cooldown: 6, effectType: 'dark' }
    ]
  },
  { 
    id: 'event_omega_mech', name: 'Omega Mech', rarity: 'Mythic', 
    level: 999, maxHp: 1e38, attack: 1e14, defense: 4000, speed: 180, 
    modelType: 'cylinder', modelColor: '#64748b',
    isBoss: true,
    skills: [
      { name: 'Rocket Punch', damageMultiplier: 40.0, cooldown: 3, effectType: 'slash' },
      { name: 'Annihilator Beam', damageMultiplier: 700.0, cooldown: 7, effectType: 'fire' }
    ]
  },
  { 
    id: 'event_celestial_dragon', name: 'Celestial Dragon', rarity: 'Mythic', 
    level: 999, maxHp: 1e40, attack: 1e15, defense: 3000, speed: 280, 
    modelType: 'cone', modelColor: '#eab308',
    isBoss: true,
    skills: [
      { name: 'Starfire Breath', damageMultiplier: 50.0, cooldown: 3, effectType: 'fire' },
      { name: 'Meteor Shower', damageMultiplier: 800.0, cooldown: 8, effectType: 'meteor' }
    ]
  },
  { 
    id: 'event_abyss_leviathan', name: 'Abyss Leviathan', rarity: 'Mythic', 
    level: 999, maxHp: 1e42, attack: 1e16, defense: 4500, speed: 200, 
    modelType: 'cylinder', modelColor: '#1e3a8a',
    isBoss: true,
    skills: [
      { name: 'Tidal Wave', damageMultiplier: 60.0, cooldown: 4, effectType: 'ice' },
      { name: 'Crushing Depths', damageMultiplier: 900.0, cooldown: 8, effectType: 'dark' }
    ]
  },
  { 
    id: 'event_quantum_golem', name: 'Quantum Golem', rarity: 'Mythic', 
    level: 999, maxHp: 1e45, attack: 1e17, defense: 5000, speed: 150, 
    modelType: 'box', modelColor: '#10b981',
    isBoss: true,
    skills: [
      { name: 'Quantum Smash', damageMultiplier: 70.0, cooldown: 3, effectType: 'slash' },
      { name: 'Singularity', damageMultiplier: 1200.0, cooldown: 9, effectType: 'dark' }
    ]
  },
  { 
    id: 'event_star_devourer', name: 'Star Devourer', rarity: 'Mythic', 
    level: 999, maxHp: 1e47, attack: 1e18, defense: 6000, speed: 220, 
    modelType: 'sphere', modelColor: '#000000',
    isBoss: true,
    skills: [
      { name: 'Absorb Light', damageMultiplier: 80.0, cooldown: 2, effectType: 'dark' },
      { name: 'Supernova Explosion', damageMultiplier: 1500.0, cooldown: 10, effectType: 'meteor' }
    ]
  },
  { 
    id: 'event_inferno_lord', name: 'Inferno Lord', rarity: 'Mythic', 
    level: 999, maxHp: 1e50, attack: 1e19, defense: 4000, speed: 210, 
    modelType: 'cone', modelColor: '#dc2626',
    isBoss: true,
    skills: [
      { name: 'Hellfire Strike', damageMultiplier: 90.0, cooldown: 3, effectType: 'fire' },
      { name: 'Armageddon', damageMultiplier: 1800.0, cooldown: 8, effectType: 'fire' }
    ]
  },
  { 
    id: 'event_frost_ancient', name: 'Frost Ancient', rarity: 'Mythic', 
    level: 999, maxHp: 1e52, attack: 1e20, defense: 7000, speed: 120, 
    modelType: 'box', modelColor: '#38bdf8',
    isBoss: true,
    skills: [
      { name: 'Glacial Smash', damageMultiplier: 100.0, cooldown: 4, effectType: 'ice' },
      { name: 'Blizzard of Ages', damageMultiplier: 2000.0, cooldown: 9, effectType: 'ice' }
    ]
  },
  { 
    id: 'event_time_weaver', name: 'Time Weaver', rarity: 'Mythic', 
    level: 999, maxHp: 1e55, attack: 1e21, defense: 5000, speed: 300, 
    modelType: 'sphere', modelColor: '#d946ef',
    isBoss: true,
    skills: [
      { name: 'Temporal Disturbance', damageMultiplier: 120.0, cooldown: 2, effectType: 'slash' },
      { name: 'Chronoshift', damageMultiplier: 2500.0, cooldown: 8, effectType: 'dark' }
    ]
  },
  { 
    id: 'event_blood_moon_beast', name: 'Blood Moon Beast', rarity: 'Mythic', 
    level: 999, maxHp: 1e60, attack: 1e22, defense: 4500, speed: 260, 
    modelType: 'cylinder', modelColor: '#991b1b',
    isBoss: true,
    skills: [
      { name: 'Blood Rend', damageMultiplier: 150.0, cooldown: 3, effectType: 'slash' },
      { name: 'Lunar Eclipse', damageMultiplier: 3000.0, cooldown: 7, effectType: 'dark' }
    ]
  },
  { 
    id: 'event_chaos_serpent', name: 'Chaos Serpent', rarity: 'Mythic', 
    level: 999, maxHp: 1e65, attack: 1e24, defense: 5500, speed: 280, 
    modelType: 'cone', modelColor: '#c026d3',
    isBoss: true,
    skills: [
      { name: 'Venom Strike', damageMultiplier: 180.0, cooldown: 2, effectType: 'slash' },
      { name: 'Chaos Burst', damageMultiplier: 3500.0, cooldown: 8, effectType: 'fire' }
    ]
  },
  { 
    id: 'event_stellar_phoenix', name: 'Stellar Phoenix', rarity: 'Mythic', 
    level: 999, maxHp: 1e70, attack: 1e25, defense: 4000, speed: 310, 
    modelType: 'sphere', modelColor: '#fb923c',
    isBoss: true,
    skills: [
      { name: 'Solar Flare', damageMultiplier: 200.0, cooldown: 3, effectType: 'fire' },
      { name: 'Rebirth Flame', damageMultiplier: 4000.0, cooldown: 9, effectType: 'fire' }
    ]
  },
  { 
    id: 'event_void_architect', name: 'Void Architect', rarity: 'Mythic', 
    level: 999, maxHp: 1e75, attack: 1e27, defense: 6000, speed: 170, 
    modelType: 'box', modelColor: '#2e1065',
    isBoss: true,
    skills: [
      { name: 'Geometry Strike', damageMultiplier: 250.0, cooldown: 2, effectType: 'slash' },
      { name: 'Erase Existence', damageMultiplier: 5000.0, cooldown: 10, effectType: 'dark' }
    ]
  },
  { 
    id: 'event_neon_samurai', name: 'Neon Samurai', rarity: 'Mythic', 
    level: 999, maxHp: 1e80, attack: 1e29, defense: 5000, speed: 350, 
    modelType: 'cylinder', modelColor: '#14b8a6',
    isBoss: true,
    skills: [
      { name: 'Neon Blade', damageMultiplier: 300.0, cooldown: 1, effectType: 'slash' },
      { name: 'Cyberstorm Slash', damageMultiplier: 6000.0, cooldown: 6, effectType: 'slash' }
    ]
  },
  { 
    id: 'event_golden_emperor', name: 'Golden Emperor', rarity: 'Mythic', 
    level: 999, maxHp: 1e85, attack: 1e31, defense: 10000, speed: 200, 
    modelType: 'cone', modelColor: '#facc15',
    isBoss: true,
    skills: [
      { name: 'Imperial Decree', damageMultiplier: 400.0, cooldown: 3, effectType: 'fire' },
      { name: 'Golden Vault Wipe', damageMultiplier: 8000.0, cooldown: 8, effectType: 'fire' }
    ]
  },
  { 
    id: 'event_crystal_monarch', name: 'Crystal Monarch', rarity: 'Mythic', 
    level: 999, maxHp: 1e90, attack: 1e33, defense: 12000, speed: 150, 
    modelType: 'box', modelColor: '#c4b5fd',
    isBoss: true,
    skills: [
      { name: 'Crystal Shard', damageMultiplier: 500.0, cooldown: 2, effectType: 'ice' },
      { name: 'Prismatic Destruction', damageMultiplier: 10000.0, cooldown: 9, effectType: 'meteor' }
    ]
  },
  { 
    id: 'event_thunder_god', name: 'Thunder God', rarity: 'Mythic', 
    level: 999, maxHp: 1e100, attack: 1e36, defense: 8000, speed: 400, 
    modelType: 'sphere', modelColor: '#fbbf24',
    isBoss: true,
    skills: [
      { name: 'Lightning Bolt', damageMultiplier: 800.0, cooldown: 1, effectType: 'slash' },
      { name: 'Wrath of the Heavens', damageMultiplier: 15000.0, cooldown: 7, effectType: 'fire' }
    ]
  },
  { 
    id: 'event_plague_bringer', name: 'Plague Bringer', rarity: 'Mythic', 
    level: 999, maxHp: 1e110, attack: 1e40, defense: 7500, speed: 240, 
    modelType: 'cylinder', modelColor: '#4d7c0f',
    isBoss: true,
    skills: [
      { name: 'Toxic Claws', damageMultiplier: 1000.0, cooldown: 3, effectType: 'slash' },
      { name: 'Pandemic Wave', damageMultiplier: 20000.0, cooldown: 8, effectType: 'dark' }
    ]
  },
  { 
    id: 'event_astral_titan', name: 'Astral Titan', rarity: 'Mythic', 
    level: 999, maxHp: 1e130, attack: 1e45, defense: 20000, speed: 180, 
    modelType: 'box', modelColor: '#a78bfa',
    isBoss: true,
    skills: [
      { name: 'Astral Punch', damageMultiplier: 1500.0, cooldown: 4, effectType: 'slash' },
      { name: 'Galaxy Collapse', damageMultiplier: 35000.0, cooldown: 10, effectType: 'meteor' }
    ]
  },
  { 
    id: 'event_dark_matter_entity', name: 'Dark Matter Entity', rarity: 'Mythic', 
    level: 999, maxHp: 1e150, attack: 1e50, defense: 50000, speed: 300, 
    modelType: 'sphere', modelColor: '#020617',
    isBoss: true,
    skills: [
      { name: 'Dark Binding', damageMultiplier: 2500.0, cooldown: 2, effectType: 'dark' },
      { name: 'Antimatter Annihilation', damageMultiplier: 55000.0, cooldown: 8, effectType: 'dark' }
    ]
  },
  { 
    id: 'event_sun_eater', name: 'Sun Eater', rarity: 'Mythic', 
    level: 999, maxHp: 1e160, attack: 1e55, defense: 100000, speed: 250, 
    modelType: 'cone', modelColor: '#f87171',
    isBoss: true,
    skills: [
      { name: 'Coronal Mass', damageMultiplier: 5000.0, cooldown: 3, effectType: 'fire' },
      { name: 'Devour Star', damageMultiplier: 100000.0, cooldown: 12, effectType: 'meteor' }
    ]
  }
];

HERO_DATABASE.forEach((hero) => {
  const currentCount = hero.skills.length;
  if (currentCount >= 300) return;
  const targetCount = 300;
  const needed = targetCount - currentCount;
  for (let i = 1; i <= needed; i++) {
    let name = "";
    let mult = 2.0;
    let cd = i % 4;
    let effect = "slash";
    if (hero.id === "saitama_hero") {
      const prefixes = ["Normal", "Consecutive", "Serious", "Super Serious", "Death", "Extreme", "Omnidirectional", "Hyper", "Meteor", "Cosmic", "Galaxy", "Dimension-Breaking", "God-Slaying"];
      const types = ["Punch", "Chop", "Uppercut", "Strike", "Combo", "Hook", "Smash", "Table Flip", "Sneeze", "Headbutt", "Squirt Gun", "Side Hops", "Shockwave", "Ground Pound", "Kick", "Blow", "Impact"];
      const prefix = prefixes[(currentCount + i) % prefixes.length];
      const ptype = types[(currentCount + i * 3) % types.length];
      name = `${prefix} ${ptype} Level ${currentCount + i}`;
      mult = 50.0 + i * 5.0;
      effect = "saitama_300_punches";
    } else if (hero.id === "zeno_hero") {
      const zprefixes = ["Celestial", "Void", "Absolute", "Omni", "Null", "Singularity", "Infinite", "Dimensional", "Cosmic", "Divine", "Temporal", "Apex", "Primordial"];
      const ztypes = ["Erase", "Singularity", "Blast", "Disintegration", "Spark", "Judgment", "Collapse", "Obliteration", "Annihilation", "Emanation", "Rift", "Beaming", "Supernova"];
      const zprefix = zprefixes[(currentCount + i) % zprefixes.length];
      const ztype = ztypes[(currentCount + i * 3) % ztypes.length];
      name = `${zprefix} ${ztype} Level ${currentCount + i}`;
      mult = 80.0 + i * 3.5;
      effect = "zeno_300_erasures";
    } else {
      name = `Aether Slash Form ${currentCount + i}`;
      mult = 1.5 + i * 0.1;
      effect = "slash";
    }
    hero.skills.push({
      name,
      damageMultiplier: Number(mult.toFixed(1)),
      cooldown: cd,
      effectType: effect as any
    });
  }
});

export const STAGES_DATABASE: WorldStage[] = [
  { id: 'event-global-boss', worldName: 'Event', stageName: 'Global Boss', isBoss: true, enemies: ['global_boss_event'], rewards: { gold: 1e9, gems: 100000, xp: 5e6, gearChance: 1.0, ruby: 100 } },
  { id: 'event-cyber-titan', worldName: 'Event', stageName: 'Cyber Titan', isBoss: true, enemies: ['event_cyber_titan'], rewards: { gold: 2000000, gems: 15000, xp: 100000 } },
  { id: 'event-shadow-empress', worldName: 'Event', stageName: 'Shadow Empress', isBoss: true, enemies: ['event_shadow_empress'], rewards: { gold: 5000000, gems: 20000, xp: 150000 } },
  { id: 'event-omega-mech', worldName: 'Event', stageName: 'Omega Mech', isBoss: true, enemies: ['event_omega_mech'], rewards: { gold: 10000000, gems: 25000, xp: 200000 } },
  { id: 'event-celestial-dragon', worldName: 'Event', stageName: 'Celestial Dragon', isBoss: true, enemies: ['event_celestial_dragon'], rewards: { gold: 25000000, gems: 30000, xp: 250000 } },
  { id: 'event-abyss-leviathan', worldName: 'Event', stageName: 'Abyss Leviathan', isBoss: true, enemies: ['event_abyss_leviathan'], rewards: { gold: 50000000, gems: 35000, xp: 300000 } },
  { id: 'event-quantum-golem', worldName: 'Event', stageName: 'Quantum Golem', isBoss: true, enemies: ['event_quantum_golem'], rewards: { gold: 100000000, gems: 40000, xp: 400000 } },
  { id: 'event-star-devourer', worldName: 'Event', stageName: 'Star Devourer', isBoss: true, enemies: ['event_star_devourer'], rewards: { gold: 500000000, gems: 50000, xp: 500000 } },
  { id: 'event-inferno-lord', worldName: 'Event', stageName: 'Inferno Lord', isBoss: true, enemies: ['event_inferno_lord'], rewards: { gold: 1000000000, gems: 60000, xp: 600000 } },
  { id: 'event-frost-ancient', worldName: 'Event', stageName: 'Frost Ancient', isBoss: true, enemies: ['event_frost_ancient'], rewards: { gold: 2500000000, gems: 70000, xp: 700000 } },
  { id: 'event-time-weaver', worldName: 'Event', stageName: 'Time Weaver', isBoss: true, enemies: ['event_time_weaver'], rewards: { gold: 5000000000, gems: 80000, xp: 800000 } },
  { id: 'event-blood-moon-beast', worldName: 'Event', stageName: 'Blood Moon Beast', isBoss: true, enemies: ['event_blood_moon_beast'], rewards: { gold: 10000000000, gems: 90000, xp: 900000 } },
  { id: 'event-chaos-serpent', worldName: 'Event', stageName: 'Chaos Serpent', isBoss: true, enemies: ['event_chaos_serpent'], rewards: { gold: 25000000000, gems: 100000, xp: 1000000 } },
  { id: 'event-stellar-phoenix', worldName: 'Event', stageName: 'Stellar Phoenix', isBoss: true, enemies: ['event_stellar_phoenix'], rewards: { gold: 50000000000, gems: 150000, xp: 1500000 } },
  { id: 'event-void-architect', worldName: 'Event', stageName: 'Void Architect', isBoss: true, enemies: ['event_void_architect'], rewards: { gold: 100000000000, gems: 200000, xp: 2000000 } },
  { id: 'event-neon-samurai', worldName: 'Event', stageName: 'Neon Samurai', isBoss: true, enemies: ['event_neon_samurai'], rewards: { gold: 250000000000, gems: 250000, xp: 3000000 } },
  { id: 'event-golden-emperor', worldName: 'Event', stageName: 'Golden Emperor', isBoss: true, enemies: ['event_golden_emperor'], rewards: { gold: 500000000000, gems: 300000, xp: 4000000 } },
  { id: 'event-crystal-monarch', worldName: 'Event', stageName: 'Crystal Monarch', isBoss: true, enemies: ['event_crystal_monarch'], rewards: { gold: 1000000000000, gems: 400000, xp: 5000000 } },
  { id: 'event-thunder-god', worldName: 'Event', stageName: 'Thunder God', isBoss: true, enemies: ['event_thunder_god'], rewards: { gold: 5000000000000, gems: 500000, xp: 7500000 } },
  { id: 'event-plague-bringer', worldName: 'Event', stageName: 'Plague Bringer', isBoss: true, enemies: ['event_plague_bringer'], rewards: { gold: 10000000000000, gems: 600000, xp: 10000000 } },
  { id: 'event-astral-titan', worldName: 'Event', stageName: 'Astral Titan', isBoss: true, enemies: ['event_astral_titan'], rewards: { gold: 50000000000000, gems: 800000, xp: 15000000 } },
  { id: 'event-dark-matter-entity', worldName: 'Event', stageName: 'Dark Entity', isBoss: true, enemies: ['event_dark_matter_entity'], rewards: { gold: 100000000000000, gems: 1000000, xp: 20000000 } },
  { id: 'event-sun-eater', worldName: 'Event', stageName: 'Sun Eater', isBoss: true, enemies: ['event_sun_eater'], rewards: { gold: 500000000000000, gems: 2000000, xp: 50000000 } },
  { id: '6-1', worldName: 'Void Nebula', stageName: 'Stage 1', isBoss: false, enemies: ["fire_elemental","wolf"], rewards: { gold: 600, gems: 60, xp: 900 } },
  { id: '6-2', worldName: 'Void Nebula', stageName: 'Stage 2', isBoss: false, enemies: ["goblin","water_elemental"], rewards: { gold: 1200, gems: 120, xp: 1800 } },
  { id: '6-3', worldName: 'Void Nebula', stageName: 'Stage 3', isBoss: false, enemies: ["wraith","minotaur"], rewards: { gold: 1800, gems: 180, xp: 2700 } },
  { id: '6-4', worldName: 'Void Nebula', stageName: 'Stage 4', isBoss: false, enemies: ["slime","dark_mage"], rewards: { gold: 2400, gems: 240, xp: 3600 } },
  { id: '6-5', worldName: 'Void Nebula', stageName: 'Boss', isBoss: true, enemies: ["dragon_boss","orc"], rewards: { gold: 3000, gems: 300, xp: 4500 } },
  { id: '7-1', worldName: 'Celestial Peaks', stageName: 'Stage 1', isBoss: false, enemies: ["slime","water_elemental"], rewards: { gold: 700, gems: 70, xp: 1050 } },
  { id: '7-2', worldName: 'Celestial Peaks', stageName: 'Stage 2', isBoss: false, enemies: ["fire_elemental","gargoyle"], rewards: { gold: 1400, gems: 140, xp: 2100 } },
  { id: '7-3', worldName: 'Celestial Peaks', stageName: 'Stage 3', isBoss: false, enemies: ["fire_elemental","slime"], rewards: { gold: 2100, gems: 210, xp: 3150 } },
  { id: '7-4', worldName: 'Celestial Peaks', stageName: 'Stage 4', isBoss: false, enemies: ["fire_elemental","gargoyle"], rewards: { gold: 2800, gems: 280, xp: 4200 } },
  { id: '7-5', worldName: 'Celestial Peaks', stageName: 'Boss', isBoss: true, enemies: ["archdemon_boss","minotaur"], rewards: { gold: 3500, gems: 350, xp: 5250 } },
  { id: '8-1', worldName: 'Infernal Abyss', stageName: 'Stage 1', isBoss: false, enemies: ["skeleton","slime"], rewards: { gold: 800, gems: 80, xp: 1200 } },
  { id: '8-2', worldName: 'Infernal Abyss', stageName: 'Stage 2', isBoss: false, enemies: ["minotaur","dark_mage"], rewards: { gold: 1600, gems: 160, xp: 2400 } },
  { id: '8-3', worldName: 'Infernal Abyss', stageName: 'Stage 3', isBoss: false, enemies: ["skeleton","slime"], rewards: { gold: 2400, gems: 240, xp: 3600 } },
  { id: '8-4', worldName: 'Infernal Abyss', stageName: 'Stage 4', isBoss: false, enemies: ["minotaur","gargoyle"], rewards: { gold: 3200, gems: 320, xp: 4800 } },
  { id: '8-5', worldName: 'Infernal Abyss', stageName: 'Boss', isBoss: true, enemies: ["dragon_boss","dark_mage"], rewards: { gold: 4000, gems: 400, xp: 6000 } },
  { id: '9-1', worldName: 'Shadow Realm', stageName: 'Stage 1', isBoss: false, enemies: ["fire_elemental","water_elemental"], rewards: { gold: 900, gems: 90, xp: 1350 } },
  { id: '9-2', worldName: 'Shadow Realm', stageName: 'Stage 2', isBoss: false, enemies: ["fire_elemental","dark_mage"], rewards: { gold: 1800, gems: 180, xp: 2700 } },
  { id: '9-3', worldName: 'Shadow Realm', stageName: 'Stage 3', isBoss: false, enemies: ["minotaur","skeleton"], rewards: { gold: 2700, gems: 270, xp: 4050 } },
  { id: '9-4', worldName: 'Shadow Realm', stageName: 'Stage 4', isBoss: false, enemies: ["minotaur","wolf"], rewards: { gold: 3600, gems: 360, xp: 5400 } },
  { id: '9-5', worldName: 'Shadow Realm', stageName: 'Boss', isBoss: true, enemies: ["archdemon_boss","skeleton"], rewards: { gold: 4500, gems: 450, xp: 6750 } },
  { id: '10-1', worldName: 'Crystal Caverns', stageName: 'Stage 1', isBoss: false, enemies: ["wraith","orc"], rewards: { gold: 1000, gems: 100, xp: 1500 } },
  { id: '10-2', worldName: 'Crystal Caverns', stageName: 'Stage 2', isBoss: false, enemies: ["skeleton","wolf"], rewards: { gold: 2000, gems: 200, xp: 3000 } },
  { id: '10-3', worldName: 'Crystal Caverns', stageName: 'Stage 3', isBoss: false, enemies: ["water_elemental","dark_mage"], rewards: { gold: 3000, gems: 300, xp: 4500 } },
  { id: '10-4', worldName: 'Crystal Caverns', stageName: 'Stage 4', isBoss: false, enemies: ["wraith","minotaur"], rewards: { gold: 4000, gems: 400, xp: 6000 } },
  { id: '10-5', worldName: 'Crystal Caverns', stageName: 'Boss', isBoss: true, enemies: ["dragon_boss","gargoyle"], rewards: { gold: 5000, gems: 500, xp: 7500 } },
  { id: '11-1', worldName: 'Frozen Tundra', stageName: 'Stage 1', isBoss: false, enemies: ["wraith","skeleton"], rewards: { gold: 1100, gems: 110, xp: 1650 } },
  { id: '11-2', worldName: 'Frozen Tundra', stageName: 'Stage 2', isBoss: false, enemies: ["wolf","minotaur"], rewards: { gold: 2200, gems: 220, xp: 3300 } },
  { id: '11-3', worldName: 'Frozen Tundra', stageName: 'Stage 3', isBoss: false, enemies: ["slime","skeleton"], rewards: { gold: 3300, gems: 330, xp: 4950 } },
  { id: '11-4', worldName: 'Frozen Tundra', stageName: 'Stage 4', isBoss: false, enemies: ["water_elemental","orc"], rewards: { gold: 4400, gems: 440, xp: 6600 } },
  { id: '11-5', worldName: 'Frozen Tundra', stageName: 'Boss', isBoss: true, enemies: ["archdemon_boss","fire_elemental"], rewards: { gold: 5500, gems: 550, xp: 8250 } },
  { id: '12-1', worldName: 'Desert of Despair', stageName: 'Stage 1', isBoss: false, enemies: ["gargoyle","skeleton"], rewards: { gold: 1200, gems: 120, xp: 1800 } },
  { id: '12-2', worldName: 'Desert of Despair', stageName: 'Stage 2', isBoss: false, enemies: ["minotaur","orc"], rewards: { gold: 2400, gems: 240, xp: 3600 } },
  { id: '12-3', worldName: 'Desert of Despair', stageName: 'Stage 3', isBoss: false, enemies: ["minotaur","water_elemental"], rewards: { gold: 3600, gems: 360, xp: 5400 } },
  { id: '12-4', worldName: 'Desert of Despair', stageName: 'Stage 4', isBoss: false, enemies: ["minotaur","water_elemental"], rewards: { gold: 4800, gems: 480, xp: 7200 } },
  { id: '12-5', worldName: 'Desert of Despair', stageName: 'Boss', isBoss: true, enemies: ["dragon_boss","minotaur"], rewards: { gold: 6000, gems: 600, xp: 9000 } },
  { id: '13-1', worldName: 'Ethereal Plane', stageName: 'Stage 1', isBoss: false, enemies: ["minotaur","dark_mage"], rewards: { gold: 1300, gems: 130, xp: 1950 } },
  { id: '13-2', worldName: 'Ethereal Plane', stageName: 'Stage 2', isBoss: false, enemies: ["fire_elemental","gargoyle"], rewards: { gold: 2600, gems: 260, xp: 3900 } },
  { id: '13-3', worldName: 'Ethereal Plane', stageName: 'Stage 3', isBoss: false, enemies: ["minotaur","slime"], rewards: { gold: 3900, gems: 390, xp: 5850 } },
  { id: '13-4', worldName: 'Ethereal Plane', stageName: 'Stage 4', isBoss: false, enemies: ["goblin","gargoyle"], rewards: { gold: 5200, gems: 520, xp: 7800 } },
  { id: '13-5', worldName: 'Ethereal Plane', stageName: 'Boss', isBoss: true, enemies: ["archdemon_boss","minotaur"], rewards: { gold: 6500, gems: 650, xp: 9750 } },
  { id: '14-1', worldName: 'Cursed Marshes', stageName: 'Stage 1', isBoss: false, enemies: ["fire_elemental","minotaur"], rewards: { gold: 1400, gems: 140, xp: 2100 } },
  { id: '14-2', worldName: 'Cursed Marshes', stageName: 'Stage 2', isBoss: false, enemies: ["wolf","orc"], rewards: { gold: 2800, gems: 280, xp: 4200 } },
  { id: '14-3', worldName: 'Cursed Marshes', stageName: 'Stage 3', isBoss: false, enemies: ["water_elemental","orc"], rewards: { gold: 4200, gems: 420, xp: 6300 } },
  { id: '14-4', worldName: 'Cursed Marshes', stageName: 'Stage 4', isBoss: false, enemies: ["fire_elemental","slime"], rewards: { gold: 5600, gems: 560, xp: 8400 } },
  { id: '14-5', worldName: 'Cursed Marshes', stageName: 'Boss', isBoss: true, enemies: ["dragon_boss","wraith"], rewards: { gold: 7000, gems: 700, xp: 10500 } },
  { id: '15-1', worldName: 'Void Nebula', stageName: 'Stage 1', isBoss: false, enemies: ["orc","minotaur"], rewards: { gold: 1500, gems: 150, xp: 2250 } },
  { id: '15-2', worldName: 'Void Nebula', stageName: 'Stage 2', isBoss: false, enemies: ["fire_elemental","wolf"], rewards: { gold: 3000, gems: 300, xp: 4500 } },
  { id: '15-3', worldName: 'Void Nebula', stageName: 'Stage 3', isBoss: false, enemies: ["slime","wolf"], rewards: { gold: 4500, gems: 450, xp: 6750 } },
  { id: '15-4', worldName: 'Void Nebula', stageName: 'Stage 4', isBoss: false, enemies: ["minotaur","wolf"], rewards: { gold: 6000, gems: 600, xp: 9000 } },
  { id: '15-5', worldName: 'Void Nebula', stageName: 'Boss', isBoss: true, enemies: ["archdemon_boss","skeleton"], rewards: { gold: 7500, gems: 750, xp: 11250 } },
  { id: '16-1', worldName: 'Celestial Peaks', stageName: 'Stage 1', isBoss: false, enemies: ["orc","gargoyle"], rewards: { gold: 1600, gems: 160, xp: 2400 } },
  { id: '16-2', worldName: 'Celestial Peaks', stageName: 'Stage 2', isBoss: false, enemies: ["slime","skeleton"], rewards: { gold: 3200, gems: 320, xp: 4800 } },
  { id: '16-3', worldName: 'Celestial Peaks', stageName: 'Stage 3', isBoss: false, enemies: ["fire_elemental","skeleton"], rewards: { gold: 4800, gems: 480, xp: 7200 } },
  { id: '16-4', worldName: 'Celestial Peaks', stageName: 'Stage 4', isBoss: false, enemies: ["fire_elemental","fire_elemental"], rewards: { gold: 6400, gems: 640, xp: 9600 } },
  { id: '16-5', worldName: 'Celestial Peaks', stageName: 'Boss', isBoss: true, enemies: ["dragon_boss","goblin"], rewards: { gold: 8000, gems: 800, xp: 12000 } },
  { id: '17-1', worldName: 'Infernal Abyss', stageName: 'Stage 1', isBoss: false, enemies: ["dark_mage","gargoyle"], rewards: { gold: 1700, gems: 170, xp: 2550 } },
  { id: '17-2', worldName: 'Infernal Abyss', stageName: 'Stage 2', isBoss: false, enemies: ["fire_elemental","minotaur"], rewards: { gold: 3400, gems: 340, xp: 5100 } },
  { id: '17-3', worldName: 'Infernal Abyss', stageName: 'Stage 3', isBoss: false, enemies: ["fire_elemental","orc"], rewards: { gold: 5100, gems: 510, xp: 7650 } },
  { id: '17-4', worldName: 'Infernal Abyss', stageName: 'Stage 4', isBoss: false, enemies: ["water_elemental","minotaur"], rewards: { gold: 6800, gems: 680, xp: 10200 } },
  { id: '17-5', worldName: 'Infernal Abyss', stageName: 'Boss', isBoss: true, enemies: ["archdemon_boss","wolf"], rewards: { gold: 8500, gems: 850, xp: 12750 } },
  { id: '18-1', worldName: 'Shadow Realm', stageName: 'Stage 1', isBoss: false, enemies: ["orc","slime"], rewards: { gold: 1800, gems: 180, xp: 2700 } },
  { id: '18-2', worldName: 'Shadow Realm', stageName: 'Stage 2', isBoss: false, enemies: ["goblin","orc"], rewards: { gold: 3600, gems: 360, xp: 5400 } },
  { id: '18-3', worldName: 'Shadow Realm', stageName: 'Stage 3', isBoss: false, enemies: ["fire_elemental","gargoyle"], rewards: { gold: 5400, gems: 540, xp: 8100 } },
  { id: '18-4', worldName: 'Shadow Realm', stageName: 'Stage 4', isBoss: false, enemies: ["skeleton","gargoyle"], rewards: { gold: 7200, gems: 720, xp: 10800 } },
  { id: '18-5', worldName: 'Shadow Realm', stageName: 'Boss', isBoss: true, enemies: ["dragon_boss","minotaur"], rewards: { gold: 9000, gems: 900, xp: 13500 } },
  { id: '19-1', worldName: 'Crystal Caverns', stageName: 'Stage 1', isBoss: false, enemies: ["dark_mage","wolf"], rewards: { gold: 1900, gems: 190, xp: 2850 } },
  { id: '19-2', worldName: 'Crystal Caverns', stageName: 'Stage 2', isBoss: false, enemies: ["skeleton","gargoyle"], rewards: { gold: 3800, gems: 380, xp: 5700 } },
  { id: '19-3', worldName: 'Crystal Caverns', stageName: 'Stage 3', isBoss: false, enemies: ["slime","skeleton"], rewards: { gold: 5700, gems: 570, xp: 8550 } },
  { id: '19-4', worldName: 'Crystal Caverns', stageName: 'Stage 4', isBoss: false, enemies: ["orc","goblin"], rewards: { gold: 7600, gems: 760, xp: 11400 } },
  { id: '19-5', worldName: 'Crystal Caverns', stageName: 'Boss', isBoss: true, enemies: ["archdemon_boss","orc"], rewards: { gold: 9500, gems: 950, xp: 14250 } },
  { id: '20-1', worldName: 'Frozen Tundra', stageName: 'Stage 1', isBoss: false, enemies: ["slime","dark_mage"], rewards: { gold: 2000, gems: 200, xp: 3000 } },
  { id: '20-2', worldName: 'Frozen Tundra', stageName: 'Stage 2', isBoss: false, enemies: ["gargoyle","water_elemental"], rewards: { gold: 4000, gems: 400, xp: 6000 } },
  { id: '20-3', worldName: 'Frozen Tundra', stageName: 'Stage 3', isBoss: false, enemies: ["wraith","water_elemental"], rewards: { gold: 6000, gems: 600, xp: 9000 } },
  { id: '20-4', worldName: 'Frozen Tundra', stageName: 'Stage 4', isBoss: false, enemies: ["skeleton","dark_mage"], rewards: { gold: 8000, gems: 800, xp: 12000 } },
  { id: '20-5', worldName: 'Frozen Tundra', stageName: 'Boss', isBoss: true, enemies: ["dragon_boss","minotaur"], rewards: { gold: 10000, gems: 1000, xp: 15000 } },
  { id: '1-1', worldName: 'Green Plains', stageName: 'Stage 1', isBoss: false, enemies: ['slime', 'slime'], rewards: { gold: 100, gems: 0, xp: 50 } },
  { id: '1-2', worldName: 'Green Plains', stageName: 'Stage 2', isBoss: false, enemies: ['slime', 'goblin'], rewards: { gold: 150, gems: 10, xp: 80 } },
  { id: '1-3', worldName: 'Green Plains', stageName: 'Stage 3', isBoss: false, enemies: ['goblin', 'wolf'], rewards: { gold: 200, gems: 15, xp: 120 } },
  { id: '1-4', worldName: 'Green Plains', stageName: 'Boss: Orc', isBoss: true, enemies: ['orc', 'goblin', 'wolf'], rewards: { gold: 500, gems: 50, xp: 300 } },
  
  { id: '2-1', worldName: 'Dark Forest', stageName: 'Stage 1', isBoss: false, enemies: ['skeleton', 'skeleton'], rewards: { gold: 250, gems: 20, xp: 150 } },
  { id: '2-2', worldName: 'Dark Forest', stageName: 'Stage 2', isBoss: false, enemies: ['skeleton', 'dark_mage'], rewards: { gold: 300, gems: 25, xp: 200 } },
  { id: '2-3', worldName: 'Dark Forest', stageName: 'Stage 3', isBoss: false, enemies: ['gargoyle', 'dark_mage'], rewards: { gold: 350, gems: 30, xp: 250 } },
  { id: '2-4', worldName: 'Dark Forest', stageName: 'Boss: Minotaur', isBoss: true, enemies: ['minotaur', 'skeleton'], rewards: { gold: 800, gems: 80, xp: 600 } },
  
  { id: '3-1', worldName: 'Volcano Core', stageName: 'Stage 1', isBoss: false, enemies: ['fire_elemental', 'gargoyle'], rewards: { gold: 400, gems: 35, xp: 300 } },
  { id: '3-2', worldName: 'Volcano Core', stageName: 'Boss: Dragon', isBoss: true, enemies: ['dragon_boss', 'fire_elemental'], rewards: { gold: 1500, gems: 150, xp: 1000 } },

  { id: '4-1', worldName: 'Sky Citadel', stageName: 'Storm Approach', isBoss: false, enemies: ['gargoyle', 'wraith'], rewards: { gold: 550, gems: 40, xp: 450 } },
  { id: '4-2', worldName: 'Sky Citadel', stageName: 'High Sanctuary', isBoss: false, enemies: ['gargoyle', 'dark_mage'], rewards: { gold: 600, gems: 45, xp: 500 } },
  { id: '4-3', worldName: 'Sky Citadel', stageName: 'Citadel Gates', isBoss: false, enemies: ['wraith', 'fire_elemental'], rewards: { gold: 650, gems: 50, xp: 550 } },
  { id: '4-4', worldName: 'Sky Citadel', stageName: 'Boss: Archdemon', isBoss: true, enemies: ['archdemon_boss', 'wraith', 'gargoyle'], rewards: { gold: 2200, gems: 180, xp: 1200 } },

  { id: '5-1', worldName: 'Sunken Ruins', stageName: 'Ruined Shore', isBoss: false, enemies: ['water_elemental', 'water_elemental'], rewards: { gold: 750, gems: 55, xp: 655 } },
  { id: '5-2', worldName: 'Sunken Ruins', stageName: 'Deep Trenches', isBoss: false, enemies: ['water_elemental', 'abyss_watcher'], rewards: { gold: 800, gems: 60, xp: 750 } },
  { id: '5-3', worldName: 'Sunken Ruins', stageName: 'Sunken Temple', isBoss: false, enemies: ['abyss_watcher', 'abyss_watcher'], rewards: { gold: 850, gems: 65, xp: 850 } },
  { id: '5-4', worldName: 'Sunken Ruins', stageName: 'Boss: Ancient Kraken', isBoss: true, enemies: ['kraken_boss', 'abyss_watcher'], rewards: { gold: 3000, gems: 220, xp: 1800 } },

  { id: '21-1', worldName: 'Astral Void', stageName: 'Shattered Space', isBoss: false, enemies: ['void_horror', 'void_horror'], rewards: { gold: 1000, gems: 80, xp: 1100 } },
  { id: '21-2', worldName: 'Astral Void', stageName: 'Galactic Drift', isBoss: false, enemies: ['void_horror', 'cosmic_specter'], rewards: { gold: 1100, gems: 90, xp: 1300 } },
  { id: '21-3', worldName: 'Astral Void', stageName: 'Event Horizon', isBoss: false, enemies: ['cosmic_specter', 'cosmic_specter'], rewards: { gold: 1250, gems: 100, xp: 1500 } },
  { id: '21-4', worldName: 'Astral Void', stageName: 'Boss: Void Overlord', isBoss: true, enemies: ['void_overlord_boss', 'void_horror', 'cosmic_specter'], rewards: { gold: 5000, gems: 350, xp: 3000 } },

  { id: 'event-gold-slime', worldName: 'Bonus Gold', stageName: 'Golden Slime Rush', isBoss: true, enemies: ['golden_slime_king'], rewards: { gold: 1e87, gems: 100000, xp: 100000 } },
  { id: 'event-vault-guardian', worldName: 'Bonus Gold', stageName: 'Celestial Vault Guardian', isBoss: true, enemies: ['treasury_chest_mimic'], rewards: { gold: 5e87, gems: 250000, xp: 250000 } },
  { id: 'event-octo-dragon', worldName: 'Bonus Gold', stageName: 'Octovigintillion Dragon', isBoss: true, enemies: ['octo_wealth_dragon'], rewards: { gold: 1e88, gems: 500000, xp: 500000 } },

  { id: '22-1', worldName: 'Golden Empire', stageName: 'Sands of Ore', isBoss: false, enemies: ['slime', 'goblin'], rewards: { gold: 1e35, gems: 1000, xp: 10000 } },
  { id: '22-2', worldName: 'Golden Empire', stageName: 'Gilded Citadel', isBoss: false, enemies: ['skeleton', 'orc'], rewards: { gold: 1e45, gems: 2000, xp: 15000 } },
  { id: '22-3', worldName: 'Golden Empire', stageName: 'Treasure Chamber', isBoss: false, enemies: ['gargoyle', 'dark_mage'], rewards: { gold: 1e55, gems: 5000, xp: 20000 } },
  { id: '22-4', worldName: 'Golden Empire', stageName: 'Imperial Vaults', isBoss: false, enemies: ['wraith', 'minotaur'], rewards: { gold: 1e65, gems: 10000, xp: 30000 } },
  { id: '22-5', worldName: 'Golden Empire', stageName: 'Boss: Aurum Drake', isBoss: true, enemies: ['dragon_boss', 'golden_slime_king'], rewards: { gold: 1e75, gems: 50000, xp: 100000 } },

  { id: '23-1', worldName: 'Infinity Rift', stageName: 'Stat Distortion', isBoss: false, enemies: ['void_horror', 'skeleton'], rewards: { gold: 1e78, gems: 50000, xp: 100000 } },
  { id: '23-2', worldName: 'Infinity Rift', stageName: 'Wealth Fracture', isBoss: false, enemies: ['cosmic_specter', 'orc'], rewards: { gold: 1e80, gems: 100000, xp: 120000 } },
  { id: '23-3', worldName: 'Infinity Rift', stageName: 'Decimal Collapse', isBoss: false, enemies: ['void_horror', 'wraith'], rewards: { gold: 1e82, gems: 150000, xp: 150000 } },
  { id: '23-4', worldName: 'Infinity Rift', stageName: 'Shattered Bounds', isBoss: false, enemies: ['cosmic_specter', 'dark_mage'], rewards: { gold: 1e84, gems: 200000, xp: 200000 } },
  { id: '23-5', worldName: 'Infinity Rift', stageName: 'Boss: Rift Singularity', isBoss: true, enemies: ['void_overlord_boss', 'octo_wealth_dragon'], rewards: { gold: 2e87, gems: 500000, xp: 500000 } },

  { id: '24-1', worldName: 'Octovigintillion Sanctum', stageName: 'Scale Ascent', isBoss: false, enemies: ['void_horror', 'slime'], rewards: { gold: 1e88, gems: 1000000, xp: 300000 } },
  { id: '24-2', worldName: 'Octovigintillion Sanctum', stageName: 'Exponent Surge', isBoss: false, enemies: ['cosmic_specter', 'goblin'], rewards: { gold: 1e89, gems: 1200000, xp: 350000 } },
  { id: '24-3', worldName: 'Octovigintillion Sanctum', stageName: 'Abyssal Treasury', isBoss: false, enemies: ['void_horror', 'wolf'], rewards: { gold: 1e90, gems: 1500000, xp: 400000 } },
  { id: '24-4', worldName: 'Octovigintillion Sanctum', stageName: 'Heavenly Fortune', isBoss: false, enemies: ['cosmic_specter', 'skeleton'], rewards: { gold: 1e91, gems: 1800000, xp: 500000 } },
  { id: '24-5', worldName: 'Octovigintillion Sanctum', stageName: 'Boss: Sovereign of Gold', isBoss: true, enemies: ['void_overlord_boss', 'treasury_chest_mimic'], rewards: { gold: 1e95, gems: 5000000, xp: 1000000 } },

  { id: '25-1', worldName: 'Absolute Singularity', stageName: 'Dimensional Edge', isBoss: false, enemies: ['void_horror'], rewards: { gold: 1e100, gems: 10000000, xp: 1000000 } },
  { id: '25-2', worldName: 'Absolute Singularity', stageName: 'Void Reservoir', isBoss: false, enemies: ['cosmic_specter'], rewards: { gold: 1e105, gems: 12000000, xp: 1500000 } },
  { id: '25-3', worldName: 'Absolute Singularity', stageName: 'Endless Flow', isBoss: false, enemies: ['void_horror'], rewards: { gold: 1e110, gems: 15000000, xp: 2000000 } },
  { id: '25-4', worldName: 'Absolute Singularity', stageName: 'Cosmic Chest', isBoss: false, enemies: ['cosmic_specter'], rewards: { gold: 1e115, gems: 18000000, xp: 2500000 } },
  { id: '25-5', worldName: 'Absolute Singularity', stageName: 'Boss: Omega Creator', isBoss: true, enemies: ['void_overlord_boss'], rewards: { gold: 1e120, gems: 50000000, xp: 5000000 } },

  { id: '26-1', worldName: 'Void Treasury', stageName: 'The First Vault', isBoss: false, enemies: ['void_horror'], rewards: { gold: 1e125, gems: 100000000, xp: 10000000 } },
  { id: '26-2', worldName: 'Void Treasury', stageName: 'The Second Vault', isBoss: false, enemies: ['cosmic_specter'], rewards: { gold: 1e130, gems: 120000000, xp: 15000000 } },
  { id: '26-3', worldName: 'Void Treasury', stageName: 'The Third Vault', isBoss: false, enemies: ['void_horror'], rewards: { gold: 1e135, gems: 150000000, xp: 20000000 } },
  { id: '26-4', worldName: 'Void Treasury', stageName: 'The Final Gate', isBoss: false, enemies: ['cosmic_specter'], rewards: { gold: 1e140, gems: 180000000, xp: 25000000 } },
  { id: '26-5', worldName: 'Void Treasury', stageName: 'Boss: Treasury Overlord', isBoss: true, enemies: ['void_overlord_boss'], rewards: { gold: 1e150, gems: 500000000, xp: 50000000 } }
];
