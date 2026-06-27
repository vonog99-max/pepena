import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';

import { useGameStore } from '../store/gameStore';
import { STAGES_DATABASE, ENEMY_DATABASE } from '../data/db';
import { Button } from '../components/ui/Button';
import { audio } from '../audio/sounds';
import { calculateDamage, formatNumber } from '../utils';
import { Battlefield3D } from '../components/battle/Battlefield3D';
import { PlayerHero, Enemy, Skill } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Snowflake, Swords, Sparkles, Moon, Heart, Shield, Skull, Zap } from 'lucide-react';

const getCastConfig = (skillName: string, effectType: string) => {
  const norm = skillName.toLowerCase();
  const eff = effectType.toLowerCase();

  if (norm.includes('bankai') || eff === 'bankai') {
    return {
      title: 'BANKAI ACTIVATED !!!',
      subtitle: 'KATE, SENBONZAKURA KAGEYOSHI / SHOCKWAVE MASSACRE',
      color: 'from-zinc-950 via-neutral-900 to-zinc-950',
      textColor: 'text-pink-500',
      glowColor: 'shadow-pink-500/50',
      borderColor: 'border-pink-500/40',
      iconType: 'dark',
    };
  }
  if (norm.includes('red kamehameha') || eff === 'red_kamehameha' || norm.includes('god kamehameha')) {
    return {
      title: 'RED KAMEHAMEHA !!!',
      subtitle: 'LIMIT BREAK SUPER SAIYAN GOD BURST ACTIVATED',
      color: 'from-red-950 via-rose-950 to-red-950',
      textColor: 'text-red-500',
      glowColor: 'shadow-red-500/50',
      borderColor: 'border-red-500/40',
      iconType: 'fire',
    };
  }
  if (norm.includes('zeno') || norm.includes('erase') || norm.includes('erasure') || eff.includes('zeno_')) {
    return {
      title: 'DIVINE ERASURE PROTOCOL !!!',
      subtitle: 'GRAND GRAND LORD ZENO DECREE OF NON-EXISTENCE',
      color: 'from-fuchsia-950 via-purple-950 to-indigo-950',
      textColor: 'text-purple-400',
      glowColor: 'shadow-purple-500/50',
      borderColor: 'border-purple-500/40',
      iconType: 'dark',
    };
  }
  if (norm.includes('serious') || norm.includes('saitama') || norm.includes('consecutive normal') || norm.includes('table flip') || eff === 'serious_punch' || eff === 'consecutive_punches') {
    return {
      title: 'SAITAMA SERIOUS DECREE !!!',
      subtitle: 'PHYSICAL ABSOLUTE INDESTRUCTIBILITY COMMENCING',
      color: 'from-yellow-600 via-amber-500 to-red-600',
      textColor: 'text-yellow-400',
      glowColor: 'shadow-yellow-500/50',
      borderColor: 'border-yellow-500/40',
      iconType: 'slash',
    };
  }

  if (norm.includes('meteor') || norm.includes('blaze') || norm.includes('inferno') || norm.includes('fire') || norm.includes('magma') || norm.includes('solar') || effectType === 'fire') {
    return {
      title: 'METEOR LOCK !!!',
      subtitle: 'ANCIENT PYROMANCY PROTOCOL ACTIVATED',
      color: 'from-amber-600 via-orange-500 to-red-600',
      textColor: 'text-orange-400',
      glowColor: 'shadow-orange-500/50',
      borderColor: 'border-orange-500/40',
      iconType: 'meteor',
    };
  }
  if (norm.includes('blizzard') || norm.includes('ice') || norm.includes('frost') || norm.includes('tsunami') || norm.includes('water') || norm.includes('ocean') || norm.includes('torrent') || effectType === 'ice') {
    return {
      title: 'BLIZZARD LOCK !!!',
      subtitle: 'ABSOLUTE CRYOSTASIS SYSTEM INITIATED',
      color: 'from-cyan-600 via-sky-500 to-blue-600',
      textColor: 'text-cyan-400',
      glowColor: 'shadow-cyan-400/50',
      borderColor: 'border-cyan-500/40',
      iconType: 'ice',
    };
  }
  if (norm.includes('slash') || norm.includes('blade') || norm.includes('backstab') || norm.includes('shattering') || norm.includes('tackle') || norm.includes('stab') || norm.includes('smash') || norm.includes('earthquake') || norm.includes('gale') || norm.includes('pierce') || norm.includes('arrow') || effectType === 'slash') {
    return {
      title: 'BLADE MATRIX LOCK !!!',
      subtitle: 'TACTICAL CLEAVE MANEUVER COMMENCING',
      color: 'from-slate-600 via-zinc-400 to-slate-500',
      textColor: 'text-slate-300',
      glowColor: 'shadow-slate-400/50',
      borderColor: 'border-slate-500/40',
      iconType: 'slash',
    };
  }
  if (norm.includes('dark') || norm.includes('void') || norm.includes('rift') || norm.includes('shadow') || norm.includes('abyss') || norm.includes('terror') || norm.includes('specter') || effectType === 'dark') {
    return {
      title: 'VOID COLLAPSE LOCK !!!',
      subtitle: 'COSMIC GRAVITATIONAL SINGULARITY CONVERGENCE',
      color: 'from-purple-900 via-violet-800 to-indigo-950',
      textColor: 'text-violet-400',
      glowColor: 'shadow-violet-500/50',
      borderColor: 'border-violet-500/40',
      iconType: 'dark',
    };
  }
  if (norm.includes('heal') || norm.includes('protect') || norm.includes('holy') || norm.includes('sanctuary') || norm.includes('gale guard') || norm.includes('runic') || effectType === 'heal') {
    return {
      title: 'REGENERATE MATRIX !!!',
      subtitle: 'DIVINE HEAVENLY SANCTUARY ENGAGED',
      color: 'from-emerald-600 via-teal-500 to-green-600',
      textColor: 'text-emerald-400',
      glowColor: 'shadow-emerald-500/50',
      borderColor: 'border-emerald-500/40',
      iconType: 'heal',
    };
  }
  return {
    title: 'STRIKE PROTOCOL !!!',
    subtitle: 'TACTICAL COMBAT ENGAGEMENT IN PROGRESS',
    color: 'from-blue-600 via-indigo-500 to-violet-600',
    textColor: 'text-blue-400',
    glowColor: 'shadow-blue-500/50',
    borderColor: 'border-blue-500/40',
    iconType: 'slash',
  };
};

function SkillCastOverlay({ activeCast }: { activeCast: { skillName: string, attackerName: string, isPlayer: boolean, effectType: string } }) {
  const config = getCastConfig(activeCast.skillName, activeCast.effectType);
  const iconsArray = Array.from({ length: 3 });

  return (
    <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden flex flex-col justify-center bg-black/35 backdrop-blur-[2px]">
      <motion.div 
        initial={{ x: '-100vw', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100vw', opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 120 }}
        className="w-full relative py-6 md:py-8 bg-gradient-to-r from-black/90 via-slate-950/95 to-black/90 border-y-2 border-slate-800/80 shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        <div className="absolute top-0 bottom-0 left-0 right-0 opacity-10 bg-[linear-gradient(45deg,#fff_12.5%,transparent_12.5%,transparent_50%,#fff_50%,#fff_62.5%,transparent_62.5%,transparent_100%)] bg-[size:16px_16px] animate-[pulse_1.5s_infinite]" />
        
        <div className="relative text-center flex flex-col items-center justify-center px-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className={`text-[10px] md:text-xs uppercase font-extrabold tracking-[0.25em] ${activeCast.isPlayer ? 'text-blue-400' : 'text-red-400'} drop-shadow`}
          >
            {activeCast.attackerName} {activeCast.isPlayer ? 'VANGUARD' : 'THREAT'} CASTS
          </motion.div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className={`text-2xl md:text-5xl font-black italic tracking-wider mt-1.5 uppercase bg-gradient-to-r ${config.color} bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]`}
          >
            {activeCast.skillName}: {config.title}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.4 }}
            className="text-[9px] md:text-[10px] uppercase font-mono tracking-widest text-zinc-400 mt-2 flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            {config.subtitle}
          </motion.div>
        </div>
      </motion.div>

      {config.iconType === 'meteor' && (
        <div className="absolute inset-0 pointer-events-none">
          {iconsArray.map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ x: '110vw', y: '-30vh', scale: 0.6, rotate: 130, opacity: 0 }}
              animate={{
                x: '-20vw',
                y: '115vh',
                scale: [1, 2.2, 1.4],
                rotate: [130, 210, 270],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 1.1,
                delay: idx * 0.18,
                ease: 'easeInOut',
              }}
              className="absolute"
              style={{
                top: `${14 + idx * 22}%`,
              }}
            >
              <div className="relative">
                <Flame className="w-16 h-16 text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.85)] fill-red-600" />
                <div className="absolute -inset-1 bg-yellow-400 rounded-full blur-sm opacity-30 animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {config.iconType === 'ice' && (
        <div className="absolute inset-0 pointer-events-none">
          {iconsArray.map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ y: '-10vh', x: `${20 + idx * 30}%`, scale: 0.4, rotate: 0, opacity: 0 }}
              animate={{
                y: '110vh',
                x: `${15 + idx * 35}%`,
                scale: [1, 1.8, 1.2],
                rotate: [0, 180, 360],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 1.25,
                delay: idx * 0.15,
                ease: 'easeOut',
              }}
              className="absolute"
            >
              <Snowflake className="w-14 h-14 text-cyan-300 drop-shadow-[0_0_15px_rgba(103,232,249,0.9)]" />
            </motion.div>
          ))}
        </div>
      )}

      {config.iconType === 'slash' && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -45 }}
            animate={{
              scale: [0, 1.8, 1],
              opacity: [0, 1, 1, 0],
              rotate: [-45, 10, -5],
            }}
            transition={{
              duration: 1.0,
              ease: 'circOut',
            }}
            className="flex items-center gap-6"
          >
            <Swords className="w-24 h-24 text-slate-100 drop-shadow-[0_0_25px_rgba(255,255,255,0.9)]" />
          </motion.div>
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: ['0%', '130%', '130%', '0%'], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="absolute h-1.5 bg-gradient-to-r from-transparent via-white to-transparent rotate-[20deg]"
          />
        </div>
      )}

      {config.iconType === 'dark' && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.4, rotate: 0, opacity: 0 }}
            animate={{
              scale: [0.4, 2.5, 0],
              rotate: [0, 360, 720],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 1.15,
              ease: 'easeInOut',
            }}
            className="relative"
          >
            <Moon className="w-16 h-16 text-indigo-400 drop-shadow-[0_0_20px_rgba(139,92,246,0.85)] fill-purple-950" />
            <Skull className="w-10 h-10 text-violet-500 absolute inset-0 m-auto opacity-70" />
          </motion.div>
        </div>
      )}

      {config.iconType === 'heal' && (
        <div className="absolute inset-0 pointer-events-none">
          {iconsArray.map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ y: '110vh', x: `${25 + idx * 25}%`, scale: 0.5, opacity: 0 }}
              animate={{
                y: '-10vh',
                x: `${30 + idx * 20}%`,
                scale: [1, 1.8, 1.2],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 1.3,
                delay: idx * 0.15,
                ease: 'easeIn',
              }}
              className="absolute"
            >
              <Heart className="w-12 h-12 text-emerald-400 fill-teal-950 drop-shadow-[0_0_15px_rgba(52,211,153,0.9)]" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

interface CombatUnit {
  uid: string;
  isPlayer: boolean;
  base: PlayerHero | Enemy;
  currentHp: number;
  maxHp: number;
  isDead: boolean;
  cooldowns: number[];
}

export function Battle({ stageId, onExit }: { stageId: string, onExit: () => void }) {
  const { team, heroes, awardRewards, profile } = useGameStore();
  const stage = STAGES_DATABASE.find(s => s.id === stageId)!;
  
  const [units, setUnits] = useState<CombatUnit[]>([]);
  const [turnState, setTurnState] = useState<'intro' | 'playerSelect' | 'playerAction' | 'enemyAction' | 'victory' | 'defeat'>('intro');
  const [log, setLog] = useState<string[]>([]);
  const [selectedHeroUid, setSelectedHeroUid] = useState<string | null>(null);
  const [autoAttack, setAutoAttack] = useState(true);
  const [activeCast, setActiveCast] = useState<{ skillName: string, attackerName: string, isPlayer: boolean, effectType: string } | null>(null);
  const [damagePopups, setDamagePopups] = useState<{ id: string; unitUid: string; text: string; styleType: string }[]>([]);

  const latestUnits = useRef<CombatUnit[]>([]);
  
  useEffect(() => {
    latestUnits.current = units;
  }, [units]);

  const unitsRef = useRef<CombatUnit[]>([]);
  
  useEffect(() => {
    unitsRef.current = units;
  }, [units]);

  useEffect(() => {
    const initUnits: CombatUnit[] = [];
    
    team.forEach((instId, i) => {
      if (instId) {
        const hero = heroes.find(h => h.instanceId === instId);
        if (hero) {
           const maxEquipped = profile.hasBattlePass ? 10 : 5;
           const equippedNames = hero.equippedSkills || [];
           let activeSkills = hero.skills.filter(s => equippedNames.includes(s.name));
           if (activeSkills.length === 0) {
             activeSkills = hero.skills.slice(0, maxEquipped);
           } else if (activeSkills.length > maxEquipped) {
             activeSkills = activeSkills.slice(0, maxEquipped);
           }

           const baseHeroWithEquippedSkills = {
             ...hero,
             skills: activeSkills
           };

           initUnits.push({
             uid: `player-${instId}`,
             isPlayer: true,
             base: baseHeroWithEquippedSkills,
             currentHp: hero.maxHp,
             maxHp: hero.maxHp,
             isDead: false,
             cooldowns: activeSkills.map(() => 0)
           });
        }
      }
    });

    stage.enemies.forEach((enId, i) => {
       const baseEnemy = ENEMY_DATABASE.find(e => e.id === enId);
       if (baseEnemy) {
         const enemyBase = { ...baseEnemy };
         const parts = stage.id.split('-');
         const chapterNum = parseInt(parts[0]);
         const stageNum = parts[1] ? parseInt(parts[1]) : 1;
         if (!isNaN(chapterNum)) {
           let hpMult = 1;
           let atkMult = 1;
           let defMult = 1;
           if (chapterNum >= 22) {
             if (chapterNum === 22) {
               hpMult = 1e16;
               atkMult = 1e11;
               defMult = 1e11;
             } else if (chapterNum === 23) {
               hpMult = 1e25;
               atkMult = 1e17;
               defMult = 1e17;
             } else if (chapterNum === 24) {
               hpMult = 1e28;
               atkMult = 1e20;
               defMult = 1e20;
             } else if (chapterNum === 25) {
               hpMult = 1e34;
               atkMult = 1e24;
               defMult = 1e24;
             } else if (chapterNum >= 26) {
               hpMult = 1e46;
               atkMult = 1e29;
               defMult = 1e29;
             }
           } else {
             const expectedLevel = (chapterNum - 1) * 30 + stageNum * 6;
             hpMult = Math.pow(1.055, expectedLevel) * (stage.isBoss ? 3.0 : 1.0);
             atkMult = Math.pow(1.050, expectedLevel) * (stage.isBoss ? 1.5 : 1.0);
             defMult = Math.pow(1.045, expectedLevel) * (stage.isBoss ? 1.3 : 1.0);
           }
           if (enemyBase.maxHp !== Infinity) {
             enemyBase.maxHp = enemyBase.maxHp * hpMult;
           }
           if (enemyBase.attack !== Infinity) {
             enemyBase.attack = enemyBase.attack * atkMult;
           }
           if (enemyBase.defense !== Infinity) {
             enemyBase.defense = enemyBase.defense * defMult;
           }
         }
         initUnits.push({
           uid: `enemy-${i}-${enId}`,
           isPlayer: false,
           base: enemyBase,
           currentHp: enemyBase.maxHp,
           maxHp: enemyBase.maxHp,
           isDead: false,
           cooldowns: enemyBase.skills.map(() => 0)
         });
       }
    });

    setUnits(initUnits);
    
    audio.playCrit();
    setTimeout(() => {
      setTurnState('playerSelect');
      addLog(`Battle started: ${stage.stageName}`);
    }, 1500);
  }, []);

  const addLog = (msg: string) => {
    setLog(prev => [msg, ...prev].slice(0, 5));
  };

  const handleHeroAction = (skill: Skill, skillIdx: number) => {
    if (turnState !== 'playerSelect' || !selectedHeroUid) return;
    
    const currentUnits = latestUnits.current;
    const heroUnit = currentUnits.find(u => u.uid === selectedHeroUid);
    if (!heroUnit || heroUnit.isDead) return;

    if (heroUnit.cooldowns[skillIdx] > 0) return;

    const aliveEnemies = currentUnits.filter(u => !u.isPlayer && !u.isDead);
    const alivePlayers = currentUnits.filter(u => u.isPlayer && !u.isDead);
    
    let targetUid = '';
    if (skill.damageMultiplier < 0) {
      if (alivePlayers.length === 0) return;
      targetUid = alivePlayers[Math.floor(Math.random() * alivePlayers.length)].uid;
    } else {
      if (aliveEnemies.length === 0) return;
      targetUid = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)].uid;
    }

    executeAttack(heroUnit.uid, targetUid, skill, skillIdx, () => {
         setTurnState('enemyAction');
         setTimeout(executeEnemyTurn, 1000);
    });
  };

  useEffect(() => {
    if (autoAttack && turnState === 'playerSelect') {
       const timer = setTimeout(() => {
          const currentUnits = latestUnits.current;
          const alivePlayers = currentUnits.filter(u => u.isPlayer && !u.isDead);
          if (alivePlayers.length === 0) return;
          
          const hero = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
          const availableSkills = hero.base.skills.map((s, i) => ({skill: s, idx: i})).filter(s => hero.cooldowns[s.idx] === 0);
          const skillObj = availableSkills.length > 0 ? availableSkills[Math.floor(Math.random() * availableSkills.length)] : {skill: hero.base.skills[0], idx: 0};
          
          setSelectedHeroUid(hero.uid);
          
          let targetUid = '';
          if (skillObj.skill.damageMultiplier < 0) {
            targetUid = alivePlayers[Math.floor(Math.random() * alivePlayers.length)].uid;
          } else {
            const aliveEnemies = currentUnits.filter(u => !u.isPlayer && !u.isDead);
            if (aliveEnemies.length > 0) {
               targetUid = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)].uid;
            }
          }
  
          if (targetUid) {
             executeAttack(hero.uid, targetUid, skillObj.skill, skillObj.idx, () => {
                 setTurnState('enemyAction');
                 setTimeout(executeEnemyTurn, 1000);
             });
          }
       }, 800);
       return () => clearTimeout(timer);
    }
  }, [autoAttack, turnState]);

  const executeEnemyTurn = () => {
    const currentUnits = latestUnits.current;
    const aliveEnemies = currentUnits.filter(u => !u.isPlayer && !u.isDead);
    const alivePlayers = currentUnits.filter(u => u.isPlayer && !u.isDead);
    
    if (aliveEnemies.length === 0 || alivePlayers.length === 0) {
      checkWinLoss(currentUnits, () => {
        setTurnState('playerSelect');
        setSelectedHeroUid(null);
      });
      return;
    }

    const attacker = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
    const availableSkills = attacker.base.skills.map((s, i) => ({skill: s, idx: i})).filter(s => attacker.cooldowns[s.idx] === 0);
    const skillObj = availableSkills.length > 0 ? availableSkills[Math.floor(Math.random() * availableSkills.length)] : {skill: attacker.base.skills[0], idx: 0};
    const skill = skillObj.skill;

    let targetUid = '';
    if (skill.damageMultiplier < 0) {
       targetUid = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)].uid;
    } else {
       targetUid = alivePlayers[Math.floor(Math.random() * alivePlayers.length)].uid;
    }

    executeAttack(attacker.uid, targetUid, skill, skillObj.idx, () => {
       setTurnState('playerSelect');
       setSelectedHeroUid(null);
    });
  };

  const [activeEffects, setActiveEffects] = useState<{ id: string, type: string, targetUids: string[] }[]>([]);
  const [attackingUid, setAttackingUid] = useState<string | null>(null);
  const [activeSkillName, setActiveSkillName] = useState<string | null>(null);

  const executeAttack = (attackerUid: string, initialTargetUid: string, skill: Skill, skillIdx: number, onComplete: () => void) => {
    const currentUnits = latestUnits.current;
    const attacker = currentUnits.find(u => u.uid === attackerUid);
    const initialTarget = currentUnits.find(u => u.uid === initialTargetUid);
    
    if (!attacker || !initialTarget) return;

    let targetUids = [initialTarget.uid];
    const { artifacts } = useGameStore.getState().inventory;
    const baseAoeChance = skill.effectType === 'fire' ? 0.3 : 0.0;
    const aoeChance = baseAoeChance + 0.4;
    
    if (Math.random() < aoeChance && skill.damageMultiplier > 0) {
        const aliveTargets = currentUnits.filter(u => u.isPlayer === initialTarget.isPlayer && !u.isDead);
        targetUids = aliveTargets.map(u => u.uid);
        addLog(`${attacker.base.name}'s attack triggered an AOE!`);
    }

    setTurnState(attacker.isPlayer ? 'playerAction' : 'enemyAction');
    setAttackingUid(attackerUid);
    setActiveSkillName(skill.name);

    const isUltimate = attacker.base.skills.length > 1 && 
      skill.cooldown === Math.max(...attacker.base.skills.map(s => s.cooldown)) && 
      skill.cooldown > 2;

    const isKamehamehaRed = skill.effectType === 'red_kamehameha' || skill.name.toLowerCase().includes('red kamehameha');
    const isKamehameha = (skill.effectType === 'kamehameha' || skill.name.toLowerCase().includes('kamehameha')) && !isKamehamehaRed;
    const isZenoErase = skill.effectType === 'zeno_erase' || skill.name.toLowerCase().includes('erase') || skill.name.toLowerCase().includes('erasure') || skill.effectType === 'zeno_300_erasures';
    const isSeriousPunch = skill.effectType === 'serious_punch' || skill.name.toLowerCase().includes('serious punch') || skill.effectType === 'saitama_300_punches';
    const isMeteor = isUltimate && (skill.effectType === 'fire' || skill.name.toLowerCase().includes('meteor')) && !isKamehameha && !isKamehamehaRed;
    const isPremiumLong = skill.effectType === 'saitama_300_punches' || skill.effectType === 'zeno_300_erasures' || skill.effectType === 'supernova_collapse';
    const finalEffectType = isKamehamehaRed ? 'red_kamehameha' : (isKamehameha ? 'kamehameha' : (isMeteor ? 'meteor' : skill.effectType));
    const effectDuration = isPremiumLong ? 5000 : ((isKamehameha || isKamehamehaRed) ? 3500 : (isMeteor ? 5000 : (isZenoErase || isSeriousPunch) ? 3500 : 1500));
    const castDelay = isUltimate ? 1150 : 300;

    if (isUltimate) {
      setActiveCast({
        skillName: skill.name,
        attackerName: attacker.base.name,
        isPlayer: attacker.isPlayer,
        effectType: skill.effectType
      });

      setTimeout(() => {
        setActiveCast(null);
      }, 1150);
    }

    setTimeout(() => {
        if (skill.damageMultiplier < 0) {
           audio.playVictory();
        } else {
           if (skill.effectType === 'slash') audio.playSlash();
           else if (skill.effectType === 'fire') audio.playFire();
           else audio.playCrit();
        }

        const effectId = Math.random().toString();
        setActiveEffects(prev => [...prev, { id: effectId, type: finalEffectType, targetUids }]);

        const dmgPerTarget = targetUids.map(tUid => {
           const t = latestUnits.current.find(u => u.uid === tUid)!;
           const rebirthMultiplier = attacker.isPlayer ? Math.pow(5, useGameStore.getState().profile.stats?.rebirths || 0) : 1;
           return {
             uid: tUid,
             dmg: calculateDamage(attacker.base.attack * rebirthMultiplier, skill.damageMultiplier, t.base.defense)
           };
        });

        const newPopups = dmgPerTarget.map(d => {
          let styleType = 'damage';
          let text = formatNumber(d.dmg);
          if (d.dmg < 0) {
            styleType = 'heal';
            text = `+${formatNumber(Math.abs(d.dmg))}`;
          } else if (d.dmg === Infinity) {
            styleType = 'infinite';
            text = '∞ INFINITE';
          } else if (skill.effectType === 'dark') {
            styleType = 'dark';
            text = `闇 ${text}`;
          } else if (skill.effectType === 'ice') {
            styleType = 'light';
            text = `❄ ${text}`;
          } else if (skill.effectType === 'fire') {
            styleType = 'crit';
            text = `🔥 CRIT ${text}`;
          } else if (skill.effectType === 'zeno_erase' || skill.effectType === 'zeno_300_erasures' || skill.effectType === 'supernova_collapse') {
            styleType = 'cosmic';
            text = `✨ COSMIC ${text}`;
          } else if (skill.effectType === 'saitama_300_punches' || d.dmg > 1e12) {
            styleType = 'infinite';
            text = `💥 INFINITE ${text}`;
          } else if (Math.random() < 0.25) {
            styleType = 'crit';
            text = `CRIT! ${text}`;
          }
          return {
            id: Math.random().toString(),
            unitUid: d.uid,
            text,
            styleType
          };
        });

        setDamagePopups(prev => [...prev, ...newPopups]);
        setTimeout(() => {
          setDamagePopups(prev => prev.filter(p => !newPopups.some(np => np.id === p.id)));
        }, 2500);

        if (dmgPerTarget[0].dmg < 0) {
           addLog(`${attacker.base.name} uses ${skill.name} healing targets!`);
        } else {
           addLog(`${attacker.base.name} uses ${skill.name} on ${targetUids.length} targets!`);
        }

        const newUnits = latestUnits.current.map(u => {
          let nextU = { ...u };
          const dmgInfo = dmgPerTarget.find(d => d.uid === u.uid);
          if (dmgInfo) {
            let nextHp = nextU.currentHp - dmgInfo.dmg;
            if (dmgInfo.dmg === Infinity) {
              nextHp = 0;
            } else if (dmgInfo.dmg === -Infinity) {
              nextHp = Infinity;
            } else if (Number.isNaN(nextHp) || nextHp === null || nextHp === undefined) {
              if (nextU.currentHp === Infinity) {
                nextHp = Infinity;
              } else {
                nextHp = 0;
              }
            }
            const maxHp = (nextU.maxHp === null || nextU.maxHp === undefined || isNaN(nextU.maxHp)) ? 100 : nextU.maxHp;
            const hp = Math.max(0, Math.min(maxHp, nextHp));
            nextU.currentHp = hp;
            nextU.isDead = isNaN(hp) || hp <= 0;
          }
          if (nextU.isPlayer === attacker.isPlayer) {
            nextU.cooldowns = nextU.cooldowns.map(c => Math.max(0, c - 1));
          }
          if (nextU.uid === attackerUid) {
            if (skill.cooldown > 0) {
              nextU.cooldowns[skillIdx] = skill.cooldown;
            }
          }
          return nextU;
        });
        
        setUnits(newUnits);
        setAttackingUid(null);
        setActiveSkillName(null);

        setTimeout(() => {
          setActiveEffects(prev => prev.filter(e => e.id !== effectId));
          checkWinLoss(newUnits, onComplete);
        }, effectDuration);

    }, castDelay);
  };

  const checkWinLoss = (currentUnits: CombatUnit[], continueCb: () => void) => {
    const alivePlayers = currentUnits.filter(u => u.isPlayer && !u.isDead);
    const aliveEnemies = currentUnits.filter(u => !u.isPlayer && !u.isDead);

    if (aliveEnemies.length === 0) {
      setTurnState('victory');
      audio.playVictory();
      awardRewards(stage.rewards.gold, stage.rewards.gems, 300, stage.rewards.ruby || 0);
      useGameStore.getState().progressCampaign();
    } else if (alivePlayers.length === 0) {
      setTurnState('defeat');
      audio.playDefeat();
    } else {
      continueCb();
    }
  };

  const activeHero = selectedHeroUid ? units.find(u => u.uid === selectedHeroUid) : null;

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 absolute inset-0 z-50">
      
      <div className="h-16 shrink-0 border-b border-slate-800 flex items-center justify-between px-4">
        <div>
           <div className="text-blue-500 text-xs font-bold uppercase tracking-widest">{stage.worldName}</div>
           <div className="text-xl font-bold">{stage.stageName}</div>
        </div>
        <Button variant="ghost" size="sm" onClick={onExit}>Flee</Button>
      </div>

      <div className="flex-1 relative bg-slate-900 border-b border-slate-800 shadow-inner overflow-hidden">
        <div className="absolute inset-0">
           <Battlefield3D units={units} effects={activeEffects} attackingUid={attackingUid} activeSkillName={activeSkillName} damagePopups={damagePopups} />
           {turnState !== 'victory' && turnState !== 'defeat' && (
              <audio src={stage?.isBoss ? "/boss_and_event_boss_fight_theme.mp3" : "/normal_game_theme.mp3"} autoPlay loop className="hidden" />
           )}
           {turnState === 'defeat' && (
              <audio src="/game_over_theme.mp3" autoPlay loop className="hidden" />
           )}
        </div>

        <AnimatePresence>
          {activeCast && (
            <SkillCastOverlay activeCast={activeCast} />
          )}
        </AnimatePresence>

        <div className="absolute left-2.5 top-2.5 z-10 w-44 pointer-events-none select-none flex flex-col gap-1">
          <div className="text-[9px] font-black tracking-wider text-blue-400 uppercase drop-shadow">Allied Vanguard</div>
          {units.filter(u => u.isPlayer).map(u => (
            <div 
              key={u.uid}
              onClick={() => { if(!u.isDead && turnState === 'playerSelect') setSelectedHeroUid(u.uid); audio.playClick(); }}
              className={`p-1.5 bg-slate-950/80 backdrop-blur-sm border rounded flex flex-col gap-0.5 transition-all pointer-events-auto cursor-pointer ${
                selectedHeroUid === u.uid ? 'border-amber-400 shadow-[0_0_8px_rgba(250,204,21,0.25)]' : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-center text-[11px]">
                <span className={`font-bold truncate max-w-[100px] ${u.isDead ? 'text-zinc-500 line-through' : 'text-white'}`}>{u.base.name}</span>
                <span className="text-[8px] text-[#ca8a04] font-bold">Lv.{u.base.level}</span>
              </div>
              <div className="flex justify-between items-center text-[8px] text-zinc-400 font-mono leading-none">
                <span>HP</span>
                <span>{formatNumber(u.currentHp)}/{formatNumber(u.maxHp)}</span>
              </div>
              <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/20">
                <div className={`h-full transition-all duration-300 ${u.isDead ? 'bg-zinc-700' : 'bg-gradient-to-r from-emerald-500 to-green-400'}`} style={{ width: `${u.isDead ? 0 : (!u.maxHp || u.maxHp === Infinity || !Number.isFinite(u.maxHp) ? 100 : Math.max(0, Math.min(100, (u.currentHp / u.maxHp) * 100)))}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute right-2.5 top-2.5 z-10 w-44 pointer-events-none select-none flex flex-col gap-1">
          <div className="text-[9px] font-black tracking-wider text-red-400 uppercase text-right drop-shadow">Enemy Threat</div>
          {units.filter(u => !u.isPlayer).map(u => (
            <div 
              key={u.uid}
              className="p-1.5 bg-slate-950/80 backdrop-blur-sm border border-slate-800/85 rounded flex flex-col gap-0.5 pointer-events-auto"
            >
              <div className="flex justify-between items-center text-[11px]">
                <span className={`font-bold truncate max-w-[100px] ${u.isDead ? 'text-zinc-500 line-through' : 'text-slate-100'}`}>{u.base.name}</span>
                <span className="text-[8px] text-zinc-500 font-bold">Lv.{u.base.level}</span>
              </div>
              <div className="flex justify-between items-center text-[8px] text-zinc-400 font-mono leading-none">
                <span>HP</span>
                <span>{formatNumber(u.currentHp)}/{formatNumber(u.maxHp)}</span>
              </div>
              <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/20">
                <div className={`h-full transition-all duration-300 ${u.isDead ? 'bg-zinc-700' : 'bg-gradient-to-r from-red-600 to-rose-500'}`} style={{ width: `${u.isDead ? 0 : (!u.maxHp || u.maxHp === Infinity || !Number.isFinite(u.maxHp) ? 100 : Math.max(0, Math.min(100, (u.currentHp / u.maxHp) * 100)))}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        {turnState === 'intro' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10">
             <h2 className="text-6xl font-black tracking-widest text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-pulse">BATTLE START</h2>
          </div>
        )}
        
        {turnState === 'victory' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-900/60 backdrop-blur-md z-10">
             <h2 className="text-6xl font-black text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)] mb-6">VICTORY</h2>
             <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-700 flex gap-6">
                <div><span className="text-slate-400">Gold</span> <span className="text-xl font-bold text-yellow-400 ml-2">+{stage.rewards.gold}</span></div>
                <div><span className="text-slate-400">Gems</span> <span className="text-xl font-bold text-purple-400 ml-2">+{stage.rewards.gems}</span></div>
                <div><span className="text-slate-400">XP</span> <span className="text-xl font-bold text-blue-400 ml-2">+{stage.rewards.xp}</span></div>
             </div>
             <Button size="lg" className="mt-8" onClick={onExit}>Return to Map</Button>
          </div>
        )}

        {turnState === 'defeat' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/80 backdrop-blur-md z-10">
             <h2 className="text-6xl font-black text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)] mb-8">DEFEAT</h2>
             <Button size="lg" onClick={onExit}>Retreat</Button>
          </div>
        )}
      </div>

      <div className="h-64 shrink-0 flex w-full">
        <div className="w-1/3 border-r border-slate-800 p-4 overflow-y-auto bg-slate-900">
           <div className="text-xs font-bold text-slate-500 uppercase mb-2">Team Status</div>
           <div className="flex flex-col gap-2">
             {units.filter(u => u.isPlayer).map(u => (
               <div 
                 key={u.uid} 
                 onClick={() => { if(!u.isDead && turnState === 'playerSelect') setSelectedHeroUid(u.uid); audio.playClick(); }}
                 className={`p-2 rounded border ${
                   u.isDead ? 'opacity-30 border-red-900 bg-red-950/30' : 
                   selectedHeroUid === u.uid ? 'border-blue-500 bg-blue-900/20' : 'border-slate-800 bg-slate-800 hover:bg-slate-700 cursor-pointer'
                 }`}
               >
                 <div className="flex justify-between items-center mb-1">
                   <div className="text-sm font-bold truncate">{u.base.name}</div>
                   <div className="text-xs font-mono">{formatNumber(u.currentHp)}/{formatNumber(u.maxHp)}</div>
                 </div>
                 <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                   <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${u.isDead ? 0 : (!u.maxHp || u.maxHp === Infinity || !Number.isFinite(u.maxHp) ? 100 : Math.max(0, Math.min(100, (u.currentHp / u.maxHp) * 100)))}%` }}></div>
                 </div>
               </div>
             ))}
           </div>
        </div>

        <div className="flex-1 p-4 flex flex-col bg-slate-950 border-r border-slate-800">
           <div className="text-xs font-bold text-slate-500 uppercase mb-2 flex justify-between items-center">
             <span>{turnState === 'playerSelect' ? 'Choose Action' : turnState === 'enemyAction' ? 'Enemy Turn...' : 'Processing Action...'}</span>
             <label className="flex items-center gap-2 cursor-pointer text-white">
               <input type="checkbox" checked={autoAttack} onChange={(e) => setAutoAttack(e.target.checked)} className="rounded border-slate-700 text-blue-500 focus:ring-blue-500 bg-slate-800" />
               Auto Attack
             </label>
           </div>
           
           <div className="flex-1 flex flex-col justify-center gap-4">
              {!activeHero && turnState === 'playerSelect' && (
                <div className="text-center text-slate-500 p-8">Select a hero to attack</div>
              )}
              {activeHero && turnState === 'playerSelect' && (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 overflow-y-auto max-h-48 pr-1">
                  {activeHero.base.skills.map((skill, i) => {
                    const isOnCooldown = activeHero.cooldowns[i] > 0;
                    return (
                    <Button 
                      key={i} 
                      className={`h-20 flex flex-col items-center justify-center border-b-4 ${isOnCooldown ? 'opacity-50 cursor-not-allowed border-b-0' : 'active:border-b-0 active:translate-y-1'}`}
                      onClick={() => { if (!isOnCooldown) handleHeroAction(skill, i); }}
                      variant={isOnCooldown ? 'secondary' : 'primary'}
                    >
                      <span className="font-bold text-sm lg:text-base">{skill.name}</span>
                      <span className="text-xs text-blue-200 mt-1 opacity-80 backdrop-blur px-2 py-0.5 rounded bg-black/20">
                        {isOnCooldown ? `Cooldown: ${activeHero.cooldowns[i]}` : `DMG: x${skill.damageMultiplier}`}
                      </span>
                    </Button>
                    );
                  })}
                </div>
              )}
           </div>
        </div>

        <div className="w-1/4 p-4 bg-slate-900 overflow-hidden flex flex-col text-sm">
           <div className="text-xs font-bold text-slate-500 uppercase mb-2 shrink-0">Combat Log</div>
           <div className="flex-1 flex flex-col-reverse overflow-y-auto gap-1 text-slate-300 font-mono text-xs">
             {log.map((entry, idx) => (
               <div key={idx} className={`${idx === 0 ? 'text-white' : 'opacity-70'} pb-1 border-b border-slate-800/50`}>
                 <span className="text-slate-600 mr-2">&gt;</span>{entry}
               </div>
             ))}
           </div>
        </div>
      </div>

    </div>
  );
}
