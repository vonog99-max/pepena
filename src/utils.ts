import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(val: number | string | bigint | null | undefined): string {
  if (val === null || val === undefined) return '0';
  const numStr = String(val).replace(/,/g, '');
  const lowerStr = numStr.trim().toLowerCase();
  if (lowerStr === 'nan' || lowerStr === 'null' || lowerStr === 'undefined') {
    return '0';
  }
  const num = Number(numStr);
  if (num === Infinity || lowerStr.includes('inf')) return 'Infinite';
  if (isNaN(num)) return '0';

  if (num >= 1e123) return num.toExponential(2);
  if (num >= 1e120) return (num / 1e120).toFixed(2) + ' NOV';
  if (num >= 1e117) return (num / 1e117).toFixed(2) + ' OTV';
  if (num >= 1e114) return (num / 1e114).toFixed(2) + ' STV';
  if (num >= 1e111) return (num / 1e111).toFixed(2) + ' SXTV';
  if (num >= 1e108) return (num / 1e108).toFixed(2) + ' QNTV';
  if (num >= 1e105) return (num / 1e105).toFixed(2) + ' QDTV';
  if (num >= 1e102) return (num / 1e102).toFixed(2) + ' TTV';
  if (num >= 1e99) return (num / 1e99).toFixed(2) + ' DTV';
  if (num >= 1e96) return (num / 1e96).toFixed(2) + ' UTV';
  if (num >= 1e93) return (num / 1e93).toFixed(2) + ' TV';
  if (num >= 1e90) return (num / 1e90).toFixed(2) + ' NV';
  if (num >= 1e87) return (num / 1e87).toFixed(2) + ' OV';
  if (num >= 1e84) return (num / 1e84).toFixed(2) + ' SV';
  if (num >= 1e81) return (num / 1e81).toFixed(2) + ' SXV';
  if (num >= 1e78) return (num / 1e78).toFixed(2) + ' QNV';
  if (num >= 1e75) return (num / 1e75).toFixed(2) + ' QDV';
  if (num >= 1e72) return (num / 1e72).toFixed(2) + ' TV';
  if (num >= 1e69) return (num / 1e69).toFixed(2) + ' DV';
  if (num >= 1e66) return (num / 1e66).toFixed(2) + ' UV';
  if (num >= 1e63) return (num / 1e63).toFixed(2) + ' V';
  if (num >= 1e60) return (num / 1e60).toFixed(2) + ' ND';
  if (num >= 1e57) return (num / 1e57).toFixed(2) + ' OD';
  if (num >= 1e54) return (num / 1e54).toFixed(2) + ' SD';
  if (num >= 1e51) return (num / 1e51).toFixed(2) + ' SXD';
  if (num >= 1e48) return (num / 1e48).toFixed(2) + ' QND';
  if (num >= 1e45) return (num / 1e45).toFixed(2) + ' QTD';
  if (num >= 1e42) return (num / 1e42).toFixed(2) + ' TD';
  if (num >= 1e39) return (num / 1e39).toFixed(2) + ' DD';
  if (num >= 1e36) return (num / 1e36).toFixed(2) + ' UD';
  if (num >= 1e33) return (num / 1e33).toFixed(2) + ' DC';
  if (num >= 1e30) return (num / 1e30).toFixed(2) + ' NO';
  if (num >= 1e27) return (num / 1e27).toFixed(2) + ' OC';
  if (num >= 1e24) return (num / 1e24).toFixed(2) + ' SP';
  if (num >= 1e21) return (num / 1e21).toFixed(2) + ' SX';
  if (num >= 1e18) return (num / 1e18).toFixed(2) + ' QT';
  if (num >= 1e15) return (num / 1e15).toFixed(2) + ' QD';
  if (num >= 1e12) return (num / 1e12).toFixed(2) + ' T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + ' B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + ' M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function calculateDamage(attackerAtk: number | null | undefined, skillMult: number | null | undefined, defenderDef: number | null | undefined): number {
  const atk = (attackerAtk === null || attackerAtk === undefined || isNaN(attackerAtk)) ? 1 : attackerAtk;
  const mult = (skillMult === null || skillMult === undefined || isNaN(skillMult)) ? 1 : skillMult;
  const def = (defenderDef === null || defenderDef === undefined || isNaN(defenderDef)) ? 0 : defenderDef;

  if (atk === Infinity || !Number.isFinite(atk)) {
    if (mult < 0) {
      return -Infinity;
    }
    return Infinity;
  }

  if (mult < 0) {
     const heal = Math.floor(atk * Math.abs(mult));
     if (heal === Infinity || !Number.isFinite(heal) || isNaN(heal)) {
       return -Infinity;
     }
     const variance = heal * 0.1;
     const result = -Math.floor(heal - variance + Math.random() * variance * 2);
     if (isNaN(result) || !Number.isFinite(result)) {
       return -Infinity;
     }
     return result;
  }

  const baseDmg = atk * mult;
  const reduction = def * 0.5;
  const final = Math.floor(Math.max(1, baseDmg - reduction));
  if (final === Infinity || !Number.isFinite(final) || isNaN(final)) {
    return Infinity;
  }
  const variance = final * 0.1;
  const result = Math.floor(final - variance + Math.random() * variance * 2);
  if (isNaN(result) || !Number.isFinite(result)) {
    return Infinity;
  }
  return result;
}
