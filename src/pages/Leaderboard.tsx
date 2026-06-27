import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Trophy, Clock, Swords, Gem, RefreshCw, Activity } from 'lucide-react';
import { formatNumber } from '../utils';

type LeaderboardTab = 'power' | 'wealth' | 'rebirths' | 'time';

interface LeaderboardEntry {
  uid: string;
  username: string;
  level: number;
  power: number;
  rubies: number;
  rebirths: number;
  timePlayed: number;
}

export function Leaderboard() {
  const [tab, setTab] = useState<LeaderboardTab>('power');
  const [users, setUsers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), limit(100));
      const snap = await getDocs(q);
      const allUsers: LeaderboardEntry[] = [];
      snap.forEach(doc => {
        const data = doc.data();
        if (data.profile) {
          allUsers.push({
            uid: doc.id,
            username: data.profile.username || 'Unknown',
            level: data.profile.level || 1,
            power: data.totalPower || 0,
            rubies: data.inventory?.rubies || 0, // wait, inventory isn't saved to users! Let me modify App.tsx to save inventory too, or just rubies.
            rebirths: data.profile.stats?.rebirths || 0,
            timePlayed: data.profile.stats?.timePlayed || 0
          });
        }
      });
      
      allUsers.sort((a, b) => {
        if (tab === 'power') return b.power - a.power;
        if (tab === 'wealth') return b.rubies - a.rubies;
        if (tab === 'rebirths') return b.rebirths - a.rebirths;
        if (tab === 'time') return b.timePlayed - a.timePlayed;
        return 0;
      });
      
      setUsers(allUsers.slice(0, 50));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [tab]);

  const formatTime = (seconds: number) => {
    if (!seconds) return '0h 0m';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-6 md:p-8 bg-[#060608] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534260164206-2a3a4a72891d?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-[0.03] pointer-events-none mix-blend-screen"></div>
      
      <div className="relative z-10 flex flex-col h-full max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest text-orange-400 drop-shadow-[0_0_15px_rgba(251,146,60,0.4)] flex items-center gap-3">
              <Trophy className="w-8 h-8" />
              Global Leaderboard
            </h1>
            <p className="text-zinc-400 text-sm mt-1 font-mono">Top 50 Heroes in the Realm</p>
          </div>
          <button 
            onClick={fetchLeaderboard}
            className="p-3 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/50 rounded-xl text-zinc-400 hover:text-white transition-all active:scale-95"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-orange-400' : ''}`} />
          </button>
        </div>

        <div className="flex gap-2 mb-6 bg-zinc-900/50 p-2 rounded-2xl border border-white/5 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setTab('power')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold tracking-wider uppercase text-sm transition-all whitespace-nowrap ${tab === 'power' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Swords className="w-4 h-4" /> Hero Power
          </button>
          <button
            onClick={() => setTab('wealth')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold tracking-wider uppercase text-sm transition-all whitespace-nowrap ${tab === 'wealth' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Gem className="w-4 h-4" /> Wealth (Rubies)
          </button>
          <button
            onClick={() => setTab('rebirths')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold tracking-wider uppercase text-sm transition-all whitespace-nowrap ${tab === 'rebirths' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Activity className="w-4 h-4" /> Rebirths
          </button>
          <button
            onClick={() => setTab('time')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold tracking-wider uppercase text-sm transition-all whitespace-nowrap ${tab === 'time' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Clock className="w-4 h-4" /> Time Played
          </button>
        </div>

        <div className="flex-1 bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md flex flex-col">
          <div className="grid grid-cols-[3rem_1fr_1fr] md:grid-cols-[4rem_2fr_1fr] gap-4 px-6 py-4 border-b border-white/5 bg-black/40 text-xs font-black uppercase tracking-widest text-zinc-500">
            <div className="text-center">Rank</div>
            <div>Player</div>
            <div className="text-right">
              {tab === 'power' && 'Team Power'}
              {tab === 'wealth' && 'Rubies'}
              {tab === 'rebirths' && 'Total Rebirths'}
              {tab === 'time' && 'Time Played'}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 text-zinc-500 gap-4">
                <RefreshCw className="w-8 h-8 animate-spin text-orange-400/50" />
                <span className="font-mono text-sm tracking-widest uppercase">Fetching Ranks...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center p-8 text-zinc-500 font-mono">No data found.</div>
            ) : (
              users.map((u, i) => (
                <div key={u.uid} 
                     onClick={() => {
                        import('../store/gameStore').then(mod => {
                          mod.useGameStore.getState().setViewingUserId(u.uid);
                        });
                     }}
                     className="grid grid-cols-[3rem_1fr_1fr] md:grid-cols-[4rem_2fr_1fr] gap-4 px-4 py-3 items-center hover:bg-white/5 rounded-2xl transition-colors group cursor-pointer"
                >
                  <div className="text-center">
                    {i === 0 ? <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 font-black border border-yellow-500/50">1</span> :
                     i === 1 ? <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-300/20 text-zinc-300 font-black border border-zinc-300/50">2</span> :
                     i === 2 ? <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-700/20 text-orange-600 font-black border border-orange-700/50">3</span> :
                     <span className="font-mono text-zinc-600 font-bold">{i + 1}</span>}
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-orange-300 transition-colors">{u.username}</div>
                    <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-0.5">Lv. {formatNumber(u.level)}</div>
                  </div>
                  <div className="text-right font-mono font-medium text-orange-100">
                    {tab === 'power' && <span className="text-indigo-300">{formatNumber(u.power)}</span>}
                    {tab === 'wealth' && <span className="text-red-400 flex items-center justify-end gap-1.5"><Gem className="w-3 h-3" /> {formatNumber(u.rubies)}</span>}
                    {tab === 'rebirths' && <span className="text-emerald-400">{formatNumber(u.rebirths)}</span>}
                    {tab === 'time' && <span className="text-cyan-400">{formatTime(u.timePlayed)}</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
