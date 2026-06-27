import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { formatNumber } from '../utils';
import { audio } from '../audio/sounds';
import { 
  Users, Shield, ShieldAlert, Award, LogOut, Edit3, Image, 
  Check, Flame, Zap, Compass, Star, Trophy, Search, PlusCircle, Globe
} from 'lucide-react';
import { 
  collection, doc, getDocs, setDoc, updateDoc, 
  deleteDoc, query, where, getDoc, onSnapshot 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

interface GuildMember {
  userId: string;
  username: string;
  level: number;
  power: number;
  isLeader: boolean;
}

interface Guild {
  id: string;
  name: string;
  logoType: 'fire' | 'thunder' | 'shadow' | 'light' | 'custom';
  customLogoUrl?: string | null;
  leaderId: string;
  members: GuildMember[];
  totalPower: number;
}

export function GuildPage() {
  const { profile, heroes, inventory } = useGameStore();
  const { user } = useAuth();
  
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [myGuild, setMyGuild] = useState<Guild | null>(null);
  const [loading, setLoading] = useState(true);

  const [createName, setCreateName] = useState('');
  const [createLogoType, setCreateLogoType] = useState<'fire' | 'thunder' | 'shadow' | 'light' | 'custom'>('fire');
  const [createCustomUrl, setCreateCustomUrl] = useState('');

  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');
  const [isEditingLogo, setIsEditingLogo] = useState(false);
  const [editLogoType, setEditLogoType] = useState<'fire' | 'thunder' | 'shadow' | 'light' | 'custom'>('fire');
  const [editCustomUrl, setEditCustomUrl] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const calculateMyPower = (): number => {
    let power = 0;
    heroes.forEach(h => {
      if (h.level >= 99999) {
        power += 1e20;
      } else {
        power += h.level * 15000000 + h.attack * 50000 + h.maxHp * 1000;
      }
    });
    return Math.max(5000, power);
  };

  const formatPower = (num: number): string => {
    if (num === Infinity || !Number.isFinite(num)) return 'Infinite';
    if (num >= 1e120) return (num / 1e120).toFixed(2) + ' Novemdocillion';
    if (num >= 1e90) return (num / 1e90).toFixed(2) + ' Novemvigintillion';
    if (num >= 1e87) return (num / 1e87).toFixed(2) + ' Octovigintillion';
    if (num >= 1e84) return (num / 1e84).toFixed(2) + ' Septenvigintillion';
    if (num >= 1e81) return (num / 1e81).toFixed(2) + ' Sexvigintillion';
    if (num >= 1e78) return (num / 1e78).toFixed(2) + ' Quinvigintillion';
    if (num >= 1e75) return (num / 1e75).toFixed(2) + ' Quattuorvigintillion';
    if (num >= 1e72) return (num / 1e72).toFixed(2) + ' Tresvigintillion';
    if (num >= 1e69) return (num / 1e69).toFixed(2) + ' Duovigintillion';
    if (num >= 1e66) return (num / 1e66).toFixed(2) + ' Unvigintillion';
    if (num >= 1e63) return (num / 1e63).toFixed(2) + ' Vigintillion';
    if (num >= 1e60) return (num / 1e60).toFixed(2) + ' Novemdecillion';
    if (num >= 1e57) return (num / 1e57).toFixed(2) + ' Octodecillion';
    if (num >= 1e54) return (num / 1e54).toFixed(2) + ' Septendecillion';
    if (num >= 1e51) return (num / 1e51).toFixed(2) + ' Sexdecillion';
    if (num >= 1e48) return (num / 1e48).toFixed(2) + ' Quindecillion';
    if (num >= 1e45) return (num / 1e45).toFixed(2) + ' Quattuordecillion';
    if (num >= 1e42) return (num / 1e42).toFixed(2) + ' Tredecillion';
    if (num >= 1e39) return (num / 1e39).toFixed(2) + ' Duodecillion';
    if (num >= 1e36) return (num / 1e36).toFixed(2) + ' Undecillion';
    if (num >= 1e33) return (num / 1e33).toFixed(2) + ' Decillion';
    if (num >= 1e30) return (num / 1e30).toFixed(2) + ' Nonillion';
    if (num >= 1e27) return (num / 1e27).toFixed(2) + ' Octillion';
    if (num >= 1e24) return (num / 1e24).toFixed(2) + ' Septillion';
    if (num >= 1e21) return (num / 1e21).toFixed(2) + ' Sextillion';
    if (num >= 1e18) return (num / 1e18).toFixed(2) + ' Quintillion';
    if (num >= 1e15) return (num / 1e15).toFixed(2) + ' Quadrillion';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + ' Trillion';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + ' Billion';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + ' Million';
    return num.toLocaleString();
  };

  const getLogoPreview = (type: string, customUrl?: string) => {
    if (type === 'custom' && customUrl) {
      return <img src={customUrl} alt="Squad Logo" className="w-12 h-12 rounded-xl object-cover border border-zinc-800" referrerPolicy="no-referrer" />;
    }
    const logos = {
      fire: <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500"><Flame size={24} /></div>,
      thunder: <div className="w-12 h-12 rounded-xl bg-yellow-600/20 border border-yellow-500/30 flex items-center justify-center text-yellow-500"><Zap size={24} /></div>,
      shadow: <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400"><Compass size={24} /></div>,
      light: <div className="w-12 h-12 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400"><Star size={24} /></div>,
    };
    return logos[type as keyof typeof logos] || logos.fire;
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'squads'), (snap) => {
      const allGuilds: Guild[] = [];
      let foundMyGuild: Guild | null = null;

      snap.forEach((doc) => {
        const data = doc.data() as Guild;
        allGuilds.push(data);
        if (data.members.some(m => m.userId === profile.userId)) {
          foundMyGuild = data;
        }
      });

      setGuilds(allGuilds.sort((a, b) => b.totalPower - a.totalPower));
      setMyGuild(foundMyGuild);
      setLoading(false);
    });

    return unsub;
  }, [profile.userId]);

  const handleCreateGuild = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!createName.trim()) {
      setErrorMsg('Guild name cannot be empty.');
      return;
    }

    if (myGuild) {
      setErrorMsg('You are already in a guild. Leave your current guild first.');
      return;
    }

    if (guilds.some(s => s.name.toLowerCase() === createName.trim().toLowerCase())) {
      setErrorMsg('A guild with this name already exists.');
      return;
    }

    audio.playClick();
    const guildId = 'guild_' + crypto.randomUUID();
    const myPower = calculateMyPower();

    const newGuild: Guild = {
      id: guildId,
      name: createName.trim(),
      logoType: createLogoType,
      customLogoUrl: createLogoType === 'custom' ? createCustomUrl.trim() : null,
      leaderId: profile.userId,
      members: [
        {
          userId: profile.userId,
          username: profile.username,
          level: profile.level,
          power: myPower,
          isLeader: true
        }
      ],
      totalPower: myPower
    };

    try {
      await setDoc(doc(db, 'squads', guildId), newGuild);
      setCreateName('');
      setCreateCustomUrl('');
      setSuccessMsg(`Guild "${newGuild.name}" successfully created!`);
    } catch (err) {
      console.error("Guild creation error:", err);
      setErrorMsg('Failed to create guild.');
    }
  };

  const handleJoinGuild = async (guildId: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (myGuild) {
      setErrorMsg('You must leave your current guild before joining a new one.');
      return;
    }

    audio.playClick();
    const guildRef = doc(db, 'squads', guildId);
    
    try {
      const snap = await getDoc(guildRef);
      if (!snap.exists()) {
        setErrorMsg('Guild does not exist.');
        return;
      }

      const guildData = snap.data() as Guild;
      const myPower = calculateMyPower();

      const updatedMembers = [
        ...guildData.members,
        {
          userId: profile.userId,
          username: profile.username,
          level: profile.level,
          power: myPower,
          isLeader: false
        }
      ];

      const newTotalPower = updatedMembers.reduce((sum, m) => sum + m.power, 0);

      await updateDoc(guildRef, {
        members: updatedMembers,
        totalPower: newTotalPower
      });

      setSuccessMsg(`Joined "${guildData.name}" successfully!`);
    } catch (err) {
      setErrorMsg('Failed to join guild.');
    }
  };

  const handleLeaveGuild = async () => {
    if (!myGuild) return;
    audio.playClick();
    setErrorMsg(null);
    setSuccessMsg(null);

    const guildRef = doc(db, 'squads', myGuild.id);
    const isLeader = myGuild.leaderId === profile.userId;

    try {
      if (isLeader && myGuild.members.length === 1) {
        await deleteDoc(guildRef);
        setSuccessMsg('You left and disbanded the guild.');
        return;
      }

      let updatedMembers = myGuild.members.filter(m => m.userId !== profile.userId);
      let newLeaderId = myGuild.leaderId;

      if (isLeader) {
        const nextLeader = updatedMembers[0];
        newLeaderId = nextLeader.userId;
        updatedMembers = updatedMembers.map((m, i) => i === 0 ? { ...m, isLeader: true } : m);
      }

      const newTotalPower = updatedMembers.reduce((sum, m) => sum + m.power, 0);

      await updateDoc(guildRef, {
        members: updatedMembers,
        leaderId: newLeaderId,
        totalPower: newTotalPower
      });

      setSuccessMsg(`Successfully left "${myGuild.name}".`);
    } catch (err) {
      setErrorMsg('Failed to leave guild.');
    }
  };

  const handleRenameGuild = async () => {
    if (!myGuild || myGuild.leaderId !== profile.userId) return;
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!editNameValue.trim()) {
      setErrorMsg('Guild name cannot be empty.');
      return;
    }

    if (guilds.some(s => s.id !== myGuild.id && s.name.toLowerCase() === editNameValue.trim().toLowerCase())) {
      setErrorMsg('A guild with this name already exists.');
      return;
    }

    audio.playClick();
    try {
      await updateDoc(doc(db, 'squads', myGuild.id), {
        name: editNameValue.trim()
      });
      setIsEditingName(false);
      setSuccessMsg('Guild successfully renamed!');
    } catch (err) {
      setErrorMsg('Failed to rename guild.');
    }
  };

  const handleSaveLogo = async () => {
    if (!myGuild || myGuild.leaderId !== profile.userId) return;
    audio.playClick();
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await updateDoc(doc(db, 'squads', myGuild.id), {
        logoType: editLogoType,
        customLogoUrl: editLogoType === 'custom' ? editCustomUrl.trim() : null
      });
      setIsEditingLogo(false);
      setSuccessMsg('Guild logo updated!');
    } catch (err) {
      setErrorMsg('Failed to update guild logo.');
    }
  };

  const handleSyncMyPower = async () => {
    if (!myGuild) return;
    audio.playClick();
    setErrorMsg(null);
    setSuccessMsg(null);

    const myPower = calculateMyPower();
    const guildRef = doc(db, 'squads', myGuild.id);

    try {
      const updatedMembers = myGuild.members.map(m => {
        if (m.userId === profile.userId) {
          return { ...m, power: myPower, level: profile.level, username: profile.username };
        }
        return m;
      });

      const newTotalPower = updatedMembers.reduce((sum, m) => sum + m.power, 0);

      await updateDoc(guildRef, {
        members: updatedMembers,
        totalPower: newTotalPower
      });

      setSuccessMsg('Your guild power updated and synchronized!');
    } catch (err) {
      setErrorMsg('Failed to synchronize power.');
    }
  };

  if (loading) {
    return <div className="h-full flex items-center justify-center bg-black text-white">Loading Squad systems...</div>;
  }

  const filteredGuilds = guilds.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="w-full h-full p-6 overflow-y-auto text-white bg-[#0A0A0B]">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-900 pb-4">
          <div>
            <h1 className="text-3xl font-black tracking-wider text-pink-500 flex items-center gap-2">
              <Users size={28} /> GUILD SECTOR
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Form the strongest alliances. Total combined member combat powers are calculated dynamically with no ceiling limits.</p>
          </div>
          {myGuild && (
            <button 
              onClick={handleSyncMyPower}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-md"
            >
              <Zap size={14} /> Synchronize My Power
            </button>
          )}
        </div>

        {successMsg && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {myGuild ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500 rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none"></div>
                
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  {getLogoPreview(myGuild.logoType, myGuild.customLogoUrl)}
                  
                  <div className="flex-1 text-center sm:text-left">
                    {isEditingName ? (
                      <div className="flex items-center gap-2 max-w-sm mx-auto sm:mx-0">
                        <input 
                          type="text"
                          value={editNameValue}
                          onChange={(e) => setEditNameValue(e.target.value)}
                          className="bg-black border border-zinc-700 rounded-lg px-3 py-1.5 text-white font-bold text-lg w-full"
                          maxLength={20}
                        />
                        <button onClick={handleRenameGuild} className="p-2 bg-emerald-600 rounded-lg hover:bg-emerald-500 text-white shrink-0">
                          <Check size={16} />
                        </button>
                        <button onClick={() => setIsEditingName(false)} className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 text-zinc-300 shrink-0">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <h2 className="text-2xl font-black tracking-wide text-white">{myGuild.name}</h2>
                        {myGuild.leaderId === profile.userId && (
                          <button 
                            onClick={() => { setEditNameValue(myGuild.name); setIsEditingName(true); }}
                            className="p-1 text-zinc-500 hover:text-white transition-colors"
                          >
                            <Edit3 size={14} />
                          </button>
                        )}
                      </div>
                    )}
                    
                    <p className="text-xs font-mono text-zinc-500 mt-1">ID: {myGuild.id}</p>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4 max-w-xs mx-auto sm:mx-0">
                      <div className="bg-black/40 border border-zinc-900 p-3 rounded-xl">
                        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Total Power</div>
                        <div className="font-mono text-sm font-bold text-pink-400 mt-1">{formatPower(myGuild.totalPower)}</div>
                      </div>
                      <div className="bg-black/40 border border-zinc-900 p-3 rounded-xl">
                        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Guild Size</div>
                        <div className="font-mono text-sm font-bold text-white mt-1">{myGuild.members.length} Members</div>
                      </div>
                    </div>
                  </div>
                </div>

                {myGuild.leaderId === profile.userId && (
                  <div className="mt-6 pt-5 border-t border-zinc-850/60">
                    <button 
                      onClick={() => {
                        setEditLogoType(myGuild.logoType);
                        setEditCustomUrl(myGuild.customLogoUrl || '');
                        setIsEditingLogo(!isEditingLogo);
                      }}
                      className="text-xs bg-zinc-950 border border-zinc-800 hover:border-zinc-750 hover:bg-zinc-900 py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all text-zinc-300 font-semibold"
                    >
                      <Image size={14} /> Customize Guild Emblem
                    </button>

                    {isEditingLogo && (
                      <div className="mt-4 bg-zinc-950 border border-zinc-850 p-4 rounded-xl space-y-4">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1.5">Guild Emblem</label>
                          <div className="grid grid-cols-5 gap-2">
                            {(['fire', 'thunder', 'shadow', 'light', 'custom'] as const).map(type => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => setEditLogoType(type)}
                                className={`py-1.5 text-xs font-bold rounded-lg border uppercase ${editLogoType === type ? 'bg-pink-950/20 border-pink-500 text-pink-300' : 'bg-black/50 border-zinc-800 text-zinc-400 hover:text-white'}`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>

                        {editLogoType === 'custom' && (
                          <div>
                            <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Custom Emblem URL</label>
                            <input 
                              type="text"
                              placeholder="Paste a direct image URL"
                              value={editCustomUrl}
                              onChange={(e) => setEditCustomUrl(e.target.value)}
                              className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-xs text-white"
                            />
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button onClick={handleSaveLogo} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-1.5 px-3 rounded-lg">
                            Apply Logo Change
                          </button>
                          <button onClick={() => setIsEditingLogo(false)} className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Users size={18} className="text-pink-500" /> Member Roster
                </h3>
                
                <div className="divide-y divide-zinc-850/60">
                  {myGuild.members.sort((a, b) => b.power - a.power).map((m) => (
                    <div key={m.userId} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${m.isLeader ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500' : 'bg-zinc-950 text-zinc-400'}`}>
                          {m.isLeader ? <Shield size={16} /> : <Users size={16} />}
                        </div>
                        <div>
                          <div className="font-bold text-sm flex items-center gap-1.5 cursor-pointer hover:underline"
                               onClick={() => {
                                 import('../store/gameStore').then(mod => {
                                   mod.useGameStore.getState().setViewingUserId(m.userId);
                                 });
                               }}>
                            {m.username}
                            {m.userId === profile.userId && <span className="text-[9px] bg-indigo-950 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded no-underline">You</span>}
                          </div>
                          <div className="text-[10px] text-zinc-500">Lvl {m.level}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm font-bold text-pink-400">{formatPower(m.power)}</div>
                        <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Power</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-zinc-850 flex justify-end">
                  <button 
                    onClick={handleLeaveGuild}
                    className="bg-red-950 border border-red-900/40 hover:bg-red-900/30 text-red-400 font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all"
                  >
                    <LogOut size={14} /> Leave Guild
                  </button>
                </div>
              </div>

            </div>

            <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-6 h-fit">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Trophy size={18} className="text-amber-500" /> Strongest Guilds
              </h3>
              
              <div className="space-y-3">
                {guilds.slice(0, 5).map((sq, index) => (
                  <div 
                    key={sq.id} 
                    className={`p-3 rounded-xl border flex items-center justify-between ${sq.id === myGuild.id ? 'bg-pink-950/20 border-pink-500/40' : 'bg-zinc-950 border-zinc-900'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono font-bold text-xs text-zinc-400">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white max-w-[120px] truncate">{sq.name}</div>
                        <div className="text-[10px] text-zinc-500">{sq.members.length} members</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-[11px] font-bold text-pink-400">{formatPower(sq.totalPower)}</div>
                      <div className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">Power</div>
                    </div>
                  </div>
                ))}

                {guilds.length === 0 && (
                  <div className="text-center py-4 text-xs text-zinc-500">No guilds created yet.</div>
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Search size={18} className="text-pink-500" /> Find a Guild
                </h3>
                
                <div className="relative mb-4">
                  <input 
                    type="text"
                    placeholder="Search guilds by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-3 pl-10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
                  />
                  <Search className="absolute left-3.5 top-3.5 text-zinc-500 w-4 h-4" />
                </div>

                <div className="space-y-3 max-h-[350px] overflow-y-auto">
                  {filteredGuilds.map((sq) => (
                    <div key={sq.id} className="bg-zinc-950 border border-zinc-900/80 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getLogoPreview(sq.logoType, sq.customLogoUrl)}
                        <div>
                          <div className="font-bold text-sm text-white">{sq.name}</div>
                          <div className="text-xs text-zinc-400 mt-0.5">{sq.members.length} Members | Power: <span className="font-semibold text-pink-400">{formatPower(sq.totalPower)}</span></div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleJoinGuild(sq.id)}
                        className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-1.5 px-4 rounded-lg text-xs transition-all active:scale-95 shadow-md shadow-pink-900/30"
                      >
                        Join Guild
                      </button>
                    </div>
                  ))}

                  {filteredGuilds.length === 0 && (
                    <div className="text-center py-6 text-xs text-zinc-500">No matching guilds found.</div>
                  )}
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <PlusCircle size={18} className="text-emerald-500" /> Establish Guild
                </h3>
                
                <form onSubmit={handleCreateGuild} className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Guild Name</label>
                    <input 
                      type="text"
                      placeholder="Enter a unique guild name"
                      value={createName}
                      onChange={(e) => setCreateName(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                      maxLength={20}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1.5">Emblem Type</label>
                    <div className="grid grid-cols-5 gap-2">
                      {(['fire', 'thunder', 'shadow', 'light', 'custom'] as const).map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setCreateLogoType(type)}
                          className={`py-2 text-xs font-bold rounded-lg border uppercase ${createLogoType === type ? 'bg-emerald-950/20 border-emerald-500 text-emerald-300' : 'bg-black/50 border-zinc-800 text-zinc-400 hover:text-white'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {createLogoType === 'custom' && (
                    <div>
                      <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Custom Emblem URL</label>
                      <input 
                        type="text"
                        placeholder="Paste direct image url (https://...)"
                        value={createCustomUrl}
                        onChange={(e) => setCreateCustomUrl(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-white"
                      />
                    </div>
                  )}

                  <button 
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition-all active:scale-95 shadow-md"
                  >
                    Found Guild (Cost: Free)
                  </button>
                </form>
              </div>

            </div>

            <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-6 h-fit">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Trophy size={18} className="text-amber-500" /> Leaderboard Guilds
              </h3>
              
              <div className="space-y-3">
                {guilds.slice(0, 5).map((sq, index) => (
                  <div key={sq.id} className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono font-bold text-xs text-zinc-400">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white max-w-[120px] truncate">{sq.name}</div>
                        <div className="text-[10px] text-zinc-500">{sq.members.length} members</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-[11px] font-bold text-pink-400">{formatPower(sq.totalPower)}</div>
                      <div className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">Power</div>
                    </div>
                  </div>
                ))}

                {guilds.length === 0 && (
                  <div className="text-center py-4 text-xs text-zinc-500">No guilds created yet.</div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
