import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useGameStore } from '../store/gameStore';
import { User, X, Trophy, Swords, Gem, Activity } from 'lucide-react';
import { formatNumber } from '../utils';

export function ProfileViewModal() {
  const { viewingUserId, setViewingUserId } = useGameStore();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [viewingFullAvatar, setViewingFullAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (viewingUserId) {
      setLoading(true);
      getDoc(doc(db, 'users', viewingUserId)).then((snap) => {
        if (snap.exists()) {
          setUserData(snap.data());
        }
        setLoading(false);
      }).catch((err) => {
        console.error(err);
        setLoading(false);
      });
    } else {
      setUserData(null);
    }
  }, [viewingUserId]);

  if (!viewingUserId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl flex flex-col relative overflow-hidden h-[80vh]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full mix-blend-screen filter blur-[80px] opacity-20 pointer-events-none"></div>
        
        <div className="flex items-center justify-between p-4">
          <h2 className="text-white font-bold uppercase tracking-wider text-sm flex items-center gap-2">
            <User size={16} className="text-indigo-400" />
            Player Profile
          </h2>
          <button 
            onClick={() => setViewingUserId(null)}
            className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
          >
            <X size={18} />
          </button>
        </div>

               <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {loading ? (
            <div className="text-center py-10 text-zinc-500 animate-pulse">Loading profile...</div>
          ) : userData && userData.profile ? (
            <>
              <div className="flex items-center gap-4 bg-zinc-800/50 p-4 rounded-xl">
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center mr-2">
                  <div className="absolute -top-1.5 -left-1.5 w-6 h-6 bg-gradient-to-br from-orange-400 to-amber-200 rounded-tl-full rounded-br-full rotate-[15deg] z-20 shadow-[0_0_10px_rgba(251,146,60,0.5)]"></div>
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-gradient-to-bl from-orange-500 to-amber-300 rounded-tr-full rounded-bl-full -rotate-[15deg] z-20 shadow-[0_0_10px_rgba(251,146,60,0.5)]"></div>
                  
                  <div className="absolute inset-0 bg-gradient-to-b from-orange-300 via-white to-purple-600 rounded-xl p-[2px] z-10 shadow-[0_0_15px_rgba(147,51,234,0.4)]">
                    <div className="w-full h-full bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 to-purple-600/20 z-0"></div>
                      {userData.profile.avatarUrl ? (
                        <img 
                          src={userData.profile.avatarUrl} 
                          alt="Avatar" 
                          className="w-full h-full object-cover z-10 cursor-pointer" 
                          referrerPolicy="no-referrer" 
                          onClick={() => setViewingFullAvatar(userData.profile.avatarUrl)}
                        />
                      ) : (
                        <User size={24} className="text-white z-10" />
                      )}
                    </div>
                  </div>

                  {viewingFullAvatar && (
                    <div
                      className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
                      onClick={() => setViewingFullAvatar(null)}
                    >
                      <img
                        src={viewingFullAvatar}
                        alt="Full Avatar"
                        className="max-w-full max-h-full object-contain rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <div className="absolute -bottom-1.5 -left-1.5 w-8 h-4 bg-gradient-to-r from-purple-500 to-fuchsia-400 rounded-full blur-[2px] z-20 rotate-12"></div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-8 h-4 bg-gradient-to-l from-purple-600 to-fuchsia-500 rounded-full blur-[2px] z-20 -rotate-12"></div>
                  
                  <div className="absolute -bottom-1 -left-2 w-5 h-5 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full border border-yellow-200 z-30 flex items-center justify-center shadow-lg">
                    <div className="w-1.5 h-1.5 bg-purple-900 rotate-45"></div>
                  </div>
                  <div className="absolute -bottom-1 -right-2 w-5 h-5 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full border border-yellow-200 z-30 flex items-center justify-center shadow-lg">
                    <div className="w-1.5 h-1.5 bg-purple-900 rotate-45"></div>
                  </div>

                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-1.5 h-4 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full border border-purple-400 flex items-center justify-center text-[8px] font-black tracking-tighter text-white shadow-[0_0_8px_rgba(147,51,234,0.5)] z-40 whitespace-nowrap">
                    LVL {userData.profile.level || 1}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-wide">{userData.profile.username || 'Unknown'}</h3>
                  <div className="text-[10px] text-zinc-400 font-mono mt-1">UID: {userData.profile.userId}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-800 p-3 rounded-xl flex flex-col items-center justify-center gap-1">
                  <Swords size={20} className="text-rose-400" />
                  <div className="text-xs text-zinc-400 font-bold uppercase">Total Power</div>
                  <div className="text-sm text-white font-mono">{formatNumber(userData.totalPower || 0)}</div>
                </div>
                <div className="bg-zinc-800 p-3 rounded-xl flex flex-col items-center justify-center gap-1">
                  <Activity size={20} className="text-emerald-400" />
                  <div className="text-xs text-zinc-400 font-bold uppercase">Rebirths</div>
                  <div className="text-sm text-white font-mono">{userData.profile.stats?.rebirths || 0}</div>
                </div>
                <div className="bg-zinc-800 p-3 rounded-xl flex flex-col items-center justify-center gap-1">
                  <Gem size={20} className="text-blue-400" />
                  <div className="text-xs text-zinc-400 font-bold uppercase">Gems Earned</div>
                  <div className="text-sm text-white font-mono">{formatNumber(userData.profile.stats?.gemsEarned || 0)}</div>
                </div>
                <div className="bg-zinc-800 p-3 rounded-xl flex flex-col items-center justify-center gap-1">
                  <Trophy size={20} className="text-amber-400" />
                  <div className="text-xs text-zinc-400 font-bold uppercase">Battles Won</div>
                  <div className="text-sm text-white font-mono">{formatNumber(userData.profile.stats?.battlesWon || 0)}</div>
                </div>
              </div>

              {userData.profile.pinnedAchievements && userData.profile.pinnedAchievements.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Trophy size={14} className="text-amber-400" /> Pinned Achievements
                  </h4>
                  <div className="space-y-2">
                  {userData.profile.pinnedAchievements.map((achId: string) => (
                      <div key={achId} className="bg-zinc-800 p-3 rounded-xl flex items-center justify-between">
                        <span className="text-xs text-zinc-200 font-bold">{achId.split('-').join(' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10 text-zinc-500">Profile not found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
