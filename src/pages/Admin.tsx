import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ShieldAlert, Gem, Coins, Unlock, AlertTriangle, Key, Users, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { HERO_DATABASE } from '../data/db';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function Admin() {
  const { adminAddCurrency, adminUnlockAllHeroes, addHero, adminAddXp, adminUnlockAllAchievements } = useGameStore();
  const { isAdmin } = useAuth();
  
  const [selectedHero, setSelectedHero] = useState(HERO_DATABASE[0].id);
  const [spawnTarget, setSpawnTarget] = useState<'self' | 'other'>('self');
  const [otherPlayerName, setOtherPlayerName] = useState('');
  
  const [goldAmount, setGoldAmount] = useState<string>('1000');
  const [gemAmount, setGemAmount] = useState<string>('100');

  const [xpAmount, setXpAmount] = useState<string>('10000');
  const [xpTarget, setXpTarget] = useState<'self' | 'other'>('self');
  const [xpOtherPlayerId, setXpOtherPlayerId] = useState('');

  const [achTarget, setAchTarget] = useState('');
  const [ghToken, setGhToken] = useState('');
  const [ghRepoName, setGhRepoName] = useState('');

  if (!isAdmin) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500 font-mono">
        UNAUTHORIZED ACCESS DETECTED
      </div>
    );
  }

  const handleSpawn = async () => {
    if (spawnTarget === 'self') {
      addHero(selectedHero);
      alert(`Spawned ${HERO_DATABASE.find(h => h.id === selectedHero)?.name} for self`);
    } else {
      if (!otherPlayerName) {
        alert('Please enter a player ID');
        return;
      }
      try {
        const userRef = doc(db, 'users', otherPlayerName);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const currentHeroes = userData.heroes || [];
          const baseHero = HERO_DATABASE.find(h => h.id === selectedHero);
          if (!baseHero) return;
          
          const newHero = {
            instanceId: crypto.randomUUID(),
            baseId: baseHero.id,
            level: 1,
            maxHp: baseHero.maxHp,
            attack: baseHero.attack,
            defense: baseHero.defense,
            skills: baseHero.skills.map(s => ({...s})),
            isOmega: false,
            obtainedAt: new Date().toISOString()
          };

          await updateDoc(userRef, {
            heroes: [...currentHeroes, newHero]
          });
          alert(`Successfully spawned ${baseHero.name} for User ID: ${otherPlayerName}`);
        } else {
          alert('User not found in database.');
        }
      } catch (error) {
        console.error("Error spawning hero:", error);
        alert("Failed to spawn hero.");
      }
    }
  };

  const handleAddXp = async (amount: number) => {
    if (xpTarget === 'self') {
      adminAddXp(amount);
      alert(`Added ${amount === Infinity ? 'Infinite' : amount} XP to self`);
    } else {
      if (!xpOtherPlayerId) {
        alert('Please enter a target User ID');
        return;
      }
      try {
        const userRef = doc(db, 'users', xpOtherPlayerId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          let currentXp = userData.profile?.xp || 0;
          let currentLevel = userData.profile?.level || 1;
          
          let newXp = currentXp + amount;
          let newLevel = currentLevel;
          
          if (amount === Infinity || newXp === Infinity) {
             newXp = 0;
             newLevel = 1000;
          } else {
            let xpRequired = newLevel * 150;
            while (newXp >= xpRequired && newLevel < 1000) {
              newXp -= xpRequired;
              newLevel++;
              xpRequired = newLevel * 150;
            }
            if (newLevel >= 1000) {
              newLevel = 1000;
              newXp = 0;
            }
          }

          await updateDoc(userRef, {
            'profile.xp': newXp,
            'profile.level': newLevel
          });
          alert(`Successfully added ${amount === Infinity ? 'Infinite' : amount} XP to User ID: ${xpOtherPlayerId}`);
        } else {
          alert('User not found in database.');
        }
      } catch (error) {
        console.error("Error adding XP to user:", error);
        alert("Failed to add XP to user.");
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-6 z-10 relative overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
        
        <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6 text-red-500">
           <ShieldAlert size={40} className="drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
           <div>
             <h1 className="text-3xl font-black uppercase tracking-widest text-white">System Override</h1>
             <p className="text-red-400 text-xs uppercase tracking-widest mt-1 opacity-80 flex items-center gap-2">
                <AlertTriangle size={12} />
                Admin console active
             </p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="flex flex-col gap-6">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="text-blue-400" /> Hero Spawner
              </h2>
              
              <div className="flex flex-col gap-4">
                <select 
                  value={selectedHero}
                  onChange={(e) => setSelectedHero(e.target.value)}
                  className="w-full bg-black/50 border border-zinc-700 rounded-lg p-3 text-white"
                >
                  {HERO_DATABASE.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setSpawnTarget('self')}
                    className={`flex-1 p-3 rounded-lg border text-sm font-bold ${spawnTarget === 'self' ? 'bg-blue-600 border-blue-400' : 'bg-black/50 border-zinc-700'}`}
                  >
                    Self
                  </button>
                  <button 
                    onClick={() => setSpawnTarget('other')}
                    className={`flex-1 p-3 rounded-lg border text-sm font-bold ${spawnTarget === 'other' ? 'bg-blue-600 border-blue-400' : 'bg-black/50 border-zinc-700'}`}
                  >
                    Other
                  </button>
                </div>

                {spawnTarget === 'other' && (
                  <input 
                    type="text"
                    placeholder="Target Player ID"
                    value={otherPlayerName}
                    onChange={(e) => setOtherPlayerName(e.target.value)}
                    className="w-full bg-black/50 border border-zinc-700 rounded-lg p-3 text-white"
                  />
                )}

                <button 
                  onClick={handleSpawn}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-all"
                >
                  Spawn Hero
                </button>
              </div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Star className="text-yellow-400" /> XP Spawner
              </h2>
              
              <div className="flex flex-col gap-4">
                <input 
                  type="number"
                  value={xpAmount}
                  onChange={(e) => setXpAmount(e.target.value)}
                  className="w-full bg-black/50 border border-zinc-700 rounded-lg p-3 text-white"
                  placeholder="XP Amount"
                />

                <div className="flex gap-4">
                  <button 
                    onClick={() => setXpTarget('self')}
                    className={`flex-1 p-3 rounded-lg border text-sm font-bold ${xpTarget === 'self' ? 'bg-yellow-600 border-yellow-400' : 'bg-black/50 border-zinc-700'}`}
                  >
                    Self
                  </button>
                  <button 
                    onClick={() => setXpTarget('other')}
                    className={`flex-1 p-3 rounded-lg border text-sm font-bold ${xpTarget === 'other' ? 'bg-yellow-600 border-yellow-400' : 'bg-black/50 border-zinc-700'}`}
                  >
                    Other
                  </button>
                </div>

                {xpTarget === 'other' && (
                  <input 
                    type="text"
                    placeholder="Target Player ID (UID)"
                    value={xpOtherPlayerId}
                    onChange={(e) => setXpOtherPlayerId(e.target.value)}
                    className="w-full bg-black/50 border border-zinc-700 rounded-lg p-3 text-white"
                  />
                )}

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAddXp(parseInt(xpAmount) || 0)}
                    className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 rounded-lg transition-all"
                  >
                    Add XP
                  </button>
                  <button 
                    onClick={() => handleAddXp(Infinity)}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Star size={16} /> ∞ INFINITE 
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Coins className="text-emerald-400" /> Currency Mixer
              </h2>
              <input 
                type="number"
                value={goldAmount}
                onChange={(e) => setGoldAmount(e.target.value)}
                className="w-full bg-black/50 border border-zinc-700 rounded-lg p-3 text-white"
                placeholder="Gold Amount"
              />
              <input 
                type="number"
                value={gemAmount}
                onChange={(e) => setGemAmount(e.target.value)}
                className="w-full bg-black/50 border border-zinc-700 rounded-lg p-3 text-white"
                placeholder="Gem Amount"
              />
              <div className="flex gap-2">
                <button 
                  onClick={() => adminAddCurrency(parseInt(goldAmount) || 0, parseInt(gemAmount) || 0, 1000)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-all"
                >
                  Add Currency
                </button>
                <button 
                  onClick={() => adminAddCurrency(Infinity, Infinity, Infinity)}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Gem size={16} /> ∞ INFINITE 
                </button>
              </div>
            </div>

            <button 
              onClick={() => adminUnlockAllHeroes()}
              className="bg-blue-950/40 border border-blue-500/30 rounded-2xl p-6 text-left hover:bg-blue-900/40 hover:border-blue-400 transition-all group relative"
            >
              <Unlock className="w-8 h-8 text-blue-400 mb-4" />
              <div className="font-bold text-white text-lg">Unlock All Heroes</div>
            </button>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Star className="text-pink-400" /> Achievements Authority
              </h2>
              <button 
                onClick={() => {
                  adminUnlockAllAchievements();
                  alert('Unlocked all achievements for Self successfully!');
                }}
                className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded-lg transition-all"
              >
                Unlock All Achievements (Self)
              </button>

              <div className="border-t border-zinc-800/60 pt-4 flex flex-col gap-3">
                <label className="text-xs text-zinc-400 font-bold">Give Achievements to Target User</label>
                <input 
                  type="text"
                  placeholder="Target Username or UID"
                  value={achTarget}
                  onChange={(e) => setAchTarget(e.target.value)}
                  className="w-full bg-black/50 border border-zinc-700 rounded-lg p-3 text-white text-xs"
                />
                <button 
                  onClick={async () => {
                    if (!achTarget.trim()) {
                      alert('Please enter a target Username or UID');
                      return;
                    }
                    try {
                      let targetRef = doc(db, 'users', achTarget.trim());
                      let targetSnap = await getDoc(targetRef);

                      if (!targetSnap.exists()) {
                        const { collection, query, where, getDocs } = await import('firebase/firestore');
                        const q = query(collection(db, 'users'), where('profile.username', '==', achTarget.trim()));
                        const qSnap = await getDocs(q);
                        if (!qSnap.empty) {
                          targetRef = doc(db, 'users', qSnap.docs[0].id);
                          targetSnap = qSnap.docs[0];
                        } else {
                          alert('User not found in database.');
                          return;
                        }
                      }

                      const allAch: Record<string, boolean> = {};
                      const { ACHIEVEMENTS } = await import('../data/achievements');
                      ACHIEVEMENTS.forEach(ach => {
                        allAch[ach.id] = true;
                      });

                      const currentProfile = targetSnap.data().profile || {};
                      await updateDoc(targetRef, {
                        'profile.achievements': allAch
                      });
                      alert(`Successfully unlocked all achievements for: ${currentProfile.username || 'target user'}`);
                      setAchTarget('');
                    } catch (e) {
                      console.error(e);
                      alert('Failed to unlock target achievements.');
                    }
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-lg transition-all text-xs"
                >
                  Unlock Achievements (Target)
                </button>
              </div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Project Management</h2>
              <div className="space-y-4">
                <input type="password" placeholder="GitHub Token" className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white text-xs" onChange={(e) => setGhToken(e.target.value)} />
                <input type="text" placeholder="Repo Name (e.g. owner/repo)" className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white text-xs" onChange={(e) => setGhRepoName(e.target.value)} />
                <button 
                  onClick={async () => {
                    const [owner, repo] = ghRepoName.split('/');
                    if (!owner || !repo) {
                        alert('Invalid Repo Name. Please use format: owner/repo');
                        return;
                    }
                    const res = await fetch('/api/github-upload', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ token: ghToken, owner, repo, branch: 'main' })
                    });
                    if (res.ok) alert('Successfully uploaded to GitHub!');
                    else alert('Failed to upload.');
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-all"
                >
                  Upload Source Code to GitHub
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
