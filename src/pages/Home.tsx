import React from 'react';
import { useGameStore } from '../store/gameStore';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, Settings, Swords, Gem, Orbit, Briefcase, ShoppingBag, X, RefreshCw, ShieldAlert, LogOut, Users, BookOpen, ShoppingCart, Activity, Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Home({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { team, profile, resetEverything } = useGameStore();
  const { user, isAdmin, logout } = useAuth();
  const [showSettings, setShowSettings] = React.useState(false);
  const [showConfirmReset, setShowConfirmReset] = React.useState(false);
  const [showRebirthUI, setShowRebirthUI] = React.useState(false);

  const handleReset = () => {
    resetEverything();
    setShowConfirmReset(false);
    setShowSettings(false);
  };

  const handleRebirth = (isMax: boolean = false) => {
    useGameStore.getState().doRebirth(isMax);
    setShowRebirthUI(false);
  };

  const navCards = [
    {
      id: 'campaign',
      name: 'Campaign',
      sub: 'Enter Combat',
      icon: <Swords size={32} className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)] group-hover:scale-110 transition-transform" />,
      glowColor: 'from-emerald-500/20',
      borderColor: 'group-hover:border-emerald-500/50'
    },
    {
      id: 'heroes',
      name: 'Heroes',
      sub: 'Manage Team',
      icon: <Users size={32} className="text-violet-400 drop-shadow-[0_0_15px_rgba(167,139,250,0.5)] group-hover:scale-110 transition-transform" />,
      glowColor: 'from-violet-500/20',
      borderColor: 'group-hover:border-violet-500/50'
    },
    {
      id: 'summon',
      name: 'Summon',
      sub: 'Recruit Heroes',
      icon: <Gem size={32} className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)] group-hover:scale-110 transition-transform" />,
      glowColor: 'from-blue-500/20',
      borderColor: 'group-hover:border-blue-500/50'
    },
    {
      id: 'skills',
      name: 'Skills',
      sub: 'Enhance Powers',
      icon: <BookOpen size={32} className="text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] group-hover:scale-110 transition-transform" />,
      glowColor: 'from-amber-500/20',
      borderColor: 'group-hover:border-amber-500/50'
    },
    {
      id: 'runes',
      name: 'Runes',
      sub: 'Affix Runes',
      icon: <Orbit size={32} className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] group-hover:scale-110 transition-transform" />,
      glowColor: 'from-cyan-500/20',
      borderColor: 'group-hover:border-cyan-500/50'
    },
    {
      id: 'guild',
      name: 'Guild',
      sub: 'Guild Portal',
      icon: <Users size={32} className="text-pink-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)] group-hover:scale-110 transition-transform" />,
      glowColor: 'from-pink-500/20',
      borderColor: 'group-hover:border-pink-500/50'
    },
    {
      id: 'leaderboard',
      name: 'Leaderboard',
      sub: 'Global Ranks',
      icon: <Users size={32} className="text-orange-400 drop-shadow-[0_0_15px_rgba(251,146,60,0.5)] group-hover:scale-110 transition-transform" />,
      glowColor: 'from-orange-500/20',
      borderColor: 'group-hover:border-orange-500/50'
    },
    {
      id: 'exchange',
      name: 'Exchange',
      sub: 'Kingdom Deals',
      icon: <ShoppingCart size={32} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] group-hover:scale-110 transition-transform" />,
      glowColor: 'from-yellow-500/20',
      borderColor: 'group-hover:border-yellow-500/50'
    },
    {
      id: 'achievements',
      name: 'Achievements',
      sub: 'Player Milestones',
      icon: <Trophy size={32} className="text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] group-hover:scale-110 transition-transform" />,
      glowColor: 'from-amber-500/20',
      borderColor: 'group-hover:border-amber-500/50'
    },
    {
      id: 'profile',
      name: 'Profile',
      sub: 'Manage Account',
      icon: <User size={32} className="text-zinc-400 drop-shadow-[0_0_15px_rgba(161,161,170,0.5)] group-hover:scale-110 transition-transform" />,
      glowColor: 'from-zinc-500/20',
      borderColor: 'group-hover:border-zinc-500/50'
    }
  ];

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden font-sans">
       
       <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 pointer-events-none mix-blend-luminosity"></div>
       <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-transparent to-[#060608] pointer-events-none"></div>

       <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 pt-6 pb-28 flex flex-col items-center gap-6 z-10 relative">
          <div className="w-full max-w-6xl flex items-center justify-between gap-4">
             <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-3 md:p-4 flex items-center gap-3 md:gap-4 shadow-xl hover:border-zinc-700 transition-all">
               <div className="relative w-14 h-14 md:w-16 md:h-16 shrink-0 flex items-center justify-center mr-1">
                  {/* Fox ear left */}
                  <div className="absolute -top-1.5 -left-1.5 w-6 h-6 bg-gradient-to-br from-orange-400 to-amber-200 rounded-tl-full rounded-br-full rotate-[15deg] z-20 shadow-[0_0_10px_rgba(251,146,60,0.5)]"></div>
                  {/* Fox ear right */}
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-gradient-to-bl from-orange-500 to-amber-300 rounded-tr-full rounded-bl-full -rotate-[15deg] z-20 shadow-[0_0_10px_rgba(251,146,60,0.5)]"></div>
                  
                  {/* Avatar Border Frame */}
                  <div className="absolute inset-0 bg-gradient-to-b from-orange-300 via-white to-purple-600 rounded-xl p-[2px] z-10 shadow-[0_0_15px_rgba(147,51,234,0.4)]">
                    <div className="w-full h-full bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 to-purple-600/20 z-0"></div>
                      {profile?.avatarUrl ? (
                        <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover z-10" referrerPolicy="no-referrer" />
                      ) : (
                        <User size={24} className="text-white z-10" />
                      )}
                    </div>
                  </div>

                  {/* Purple bottom flame left */}
                  <div className="absolute -bottom-1.5 -left-1.5 w-8 h-4 bg-gradient-to-r from-purple-500 to-fuchsia-400 rounded-full blur-[2px] z-20 rotate-12"></div>
                  {/* Purple bottom flame right */}
                  <div className="absolute -bottom-1.5 -right-1.5 w-8 h-4 bg-gradient-to-l from-purple-600 to-fuchsia-500 rounded-full blur-[2px] z-20 -rotate-12"></div>
                  
                  {/* Gold Coin Left */}
                  <div className="absolute -bottom-1 -left-2 w-5 h-5 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full border border-yellow-200 z-30 flex items-center justify-center shadow-lg">
                    <div className="w-1.5 h-1.5 bg-purple-900 rotate-45"></div>
                  </div>
                  {/* Gold Coin Right */}
                  <div className="absolute -bottom-1 -right-2 w-5 h-5 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full border border-yellow-200 z-30 flex items-center justify-center shadow-lg">
                    <div className="w-1.5 h-1.5 bg-purple-900 rotate-45"></div>
                  </div>

                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-1.5 h-4 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full border border-purple-400 flex items-center justify-center text-[8px] font-black tracking-tighter text-white shadow-[0_0_8px_rgba(147,51,234,0.5)] z-40 whitespace-nowrap">
                    LVL {profile?.level || 1}
                  </div>
               </div>
               <div>
                  <div className="text-white font-black tracking-widest text-xs md:text-sm uppercase">{profile?.username || user?.displayName || 'Player'}</div>
                  <div className="text-[10px] text-zinc-400 font-mono mt-0.5 max-w-[120px] sm:max-w-[200px] truncate">{user?.email || 'Guest User'}</div>
                  <div className="text-[8px] text-emerald-400 font-bold uppercase mt-1 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20 inline-block text-center">
                    Updates leaderboard every 1 min
                  </div>
               </div>
             </div>

              <div className="flex items-center gap-3">
               <div className="flex flex-col items-end hidden sm:flex">
                 <div className="text-[10px] text-emerald-400 font-black tracking-widest uppercase mb-1">
                   Rebirth {useGameStore.getState().profile.stats?.rebirths || 0}/{(useGameStore.getState().profile.stats?.rebirths || 0) + 1}
                 </div>
                 <div className="w-24 h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
                   <div 
                     className="h-full bg-emerald-500" 
                     style={{ width: `${Math.min(100, (profile.level / (10 + (useGameStore.getState().profile.stats?.rebirths || 0) * 10)) * 100)}%` }}
                   ></div>
                 </div>
                 <div className="text-[9px] text-zinc-500 font-mono mt-0.5">
                   Lv {profile.level}/{10 + (useGameStore.getState().profile.stats?.rebirths || 0) * 10}
                 </div>
               </div>
               <button 
                 onClick={() => {
                   if (profile.level >= 10 + (useGameStore.getState().profile.stats?.rebirths || 0) * 10) {
                     setShowRebirthUI(true);
                   }
                 }}
                 className={`px-4 py-2 font-black tracking-widest text-xs uppercase border rounded-xl transition-all shadow-lg active:scale-95 ${
                   profile.level >= 10 + (useGameStore.getState().profile.stats?.rebirths || 0) * 10 
                     ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20 cursor-pointer' 
                     : 'bg-zinc-800/50 text-zinc-500 border-zinc-700/50 cursor-not-allowed'
                 }`}
               >
                 Rebirth
               </button>
               <button 
                 onClick={() => setShowSettings(true)}
                 className="w-12 h-12 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-all shadow-lg active:scale-95 cursor-pointer"
               >
                 <Settings size={20} />
               </button>
             </div>
          </div>

          <div className="w-full max-w-6xl bg-gradient-to-r from-indigo-950/10 via-zinc-950/40 to-indigo-950/10 border border-indigo-500/10 rounded-3xl p-6 text-center relative overflow-hidden flex flex-col items-center justify-center gap-2">
            <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[60%] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="text-[10px] text-indigo-400 font-black tracking-widest uppercase">STAGES & ADVENTURE AWAIT</div>
            <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">Ascend to Immortality</h1>
            <p className="text-xs text-zinc-400 max-w-md">Manage your hero roster, unlock god-tier skills, fuse epic runes, and prepare for battle in the cosmos.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-5 w-full max-w-6xl mt-2">
             {navCards.map((card) => (
               <motion.button 
                  key={card.id}
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onNavigate(card.id)}
                  className="bg-zinc-900/40 hover:bg-zinc-900/60 backdrop-blur-md rounded-2xl md:rounded-3xl border border-zinc-850 hover:border-zinc-700/80 shadow-xl flex flex-col items-center justify-center p-6 min-h-[180px] md:min-h-[220px] relative overflow-hidden group text-center cursor-pointer transition-colors duration-200"
               >
                  <div className={`absolute inset-0 bg-gradient-to-t ${card.glowColor} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  <div className={`w-14 h-14 md:w-16 md:h-16 bg-zinc-950/80 rounded-2xl flex items-center justify-center border border-zinc-800 mb-3 group-hover:border-zinc-650 transition-colors shadow-inner relative z-10`}>
                    {card.icon}
                  </div>
                  <div className="text-white font-extrabold tracking-wider uppercase text-sm md:text-base relative z-10">{card.name}</div>
                  <div className="text-zinc-400 text-[9px] font-mono tracking-widest mt-2 uppercase relative z-10 border border-zinc-800 px-2.5 py-0.5 rounded-full bg-zinc-950/60 group-hover:text-white group-hover:border-zinc-700 transition-all">
                    {card.sub}
                  </div>
               </motion.button>
             ))}

             {isAdmin && (
               <motion.button 
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onNavigate('admin')}
                  className="bg-zinc-900/40 hover:bg-zinc-900/60 backdrop-blur-md rounded-2xl md:rounded-3xl border border-zinc-850 hover:border-zinc-700/80 shadow-xl flex flex-col items-center justify-center p-6 min-h-[180px] md:min-h-[220px] relative overflow-hidden group text-center cursor-pointer transition-colors duration-200"
               >
                  <div className="absolute inset-0 bg-gradient-to-t from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-zinc-950/80 rounded-2xl flex items-center justify-center border border-zinc-800 mb-3 group-hover:border-red-500/50 transition-colors shadow-inner relative z-10">
                    <ShieldAlert size={28} className="text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)] group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-white font-extrabold tracking-wider uppercase text-sm md:text-base relative z-10">Admin</div>
                  <div className="text-red-400 text-[9px] font-mono tracking-widest mt-2 uppercase relative z-10 border border-red-950/50 px-2.5 py-0.5 rounded-full bg-red-950/60">
                    Owner Panel
                  </div>
               </motion.button>
             )}
          </div>
       </div>

       <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center px-4 pointer-events-none">
            <div className="bg-zinc-900/80 backdrop-blur-2xl border border-zinc-800 p-1.5 rounded-2xl shadow-2xl flex items-center gap-1.5 w-full max-w-sm sm:max-w-fit justify-around sm:justify-start pointer-events-auto">
               {[
                 { icon: <User size={18} />, label: 'PROFILE', tab: 'profile' },
                 { icon: <Briefcase size={18} />, label: 'INVENTORY', tab: 'inventory' },
                 { icon: <ShoppingBag size={18} />, label: 'SHOP', tab: 'shop' },
                 { icon: <Gem size={18} />, label: 'PASS', tab: 'battlepass' },
               ].map((btn, i) => (
                  <button 
                    key={i} 
                    onClick={() => onNavigate(btn.tab)} 
                    className="flex flex-col items-center justify-center group w-14 h-14 sm:w-18 sm:h-18 rounded-xl hover:bg-zinc-800/85 transition-all relative overflow-hidden cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="text-zinc-400 group-hover:text-indigo-300 transition-colors group-hover:-translate-y-1 transform duration-300 relative z-10">
                      {btn.icon}
                    </div>
                    <span className="text-zinc-400 text-[8px] font-bold tracking-wider mt-1 uppercase relative z-10 group-hover:text-white transition-colors">
                      {btn.label}
                    </span>
                  </button>
               ))}
            </div>
       </div>

        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 relative"
              >
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2.5">
                     <Settings className="w-5 h-5 text-indigo-400" />
                     <h2 className="text-lg font-bold text-white tracking-wide">Settings Panel</h2>
                   </div>
                   <button 
                     onClick={() => setShowSettings(false)}
                     className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                   >
                     <X size={16} />
                   </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/55 flex flex-col gap-1">
                    <span className="text-xs text-zinc-500 font-mono">User Session</span>
                    <span className="text-sm font-semibold text-zinc-300 truncate">{user?.email || 'Guest account'}</span>
                  </div>

                  {isAdmin && (
                    <div className="bg-amber-500/10 rounded-2xl p-4 border border-amber-500/20 flex items-center gap-3">
                      <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Owner Authority Detected</div>
                        <div className="text-[10px] text-amber-300/80 mt-0.5">Admin capabilities enabled</div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setShowConfirmReset(true)}
                      className="w-full h-11 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 hover:border-red-500/40 text-red-400 font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs uppercase tracking-widest"
                    >
                      <RefreshCw size={14} />
                      Reset Everything
                    </button>
                    
                    <button 
                      onClick={() => { logout(); setShowSettings(false); }}
                      className="w-full h-11 bg-slate-800 hover:bg-slate-700 text-zinc-300 hover:text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs uppercase tracking-widest"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {showConfirmReset && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-[60] flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="w-full max-w-sm bg-slate-900 border border-red-500/30 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-500">
                  <RefreshCw size={20} className="animate-spin-slow" />
                </div>
                
                <div>
                  <h3 className="text-white font-bold text-lg">Are you absolutely sure?</h3>
                  <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                    This will delete all your unlocked heroes, gold, gems, materials, and campaign milestones back to level 0. This cannot be undone.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button 
                    onClick={() => setShowConfirmReset(false)}
                    className="h-10 bg-slate-800 hover:bg-slate-700 text-zinc-300 font-bold rounded-xl transition-all cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                     onClick={handleReset}
                     className="h-10 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all cursor-pointer text-xs"
                  >
                    Confirm Reset
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showRebirthUI && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-zinc-900 border border-emerald-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl flex flex-col gap-5 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-400">
                    <Activity size={24} />
                  </div>
                  <button 
                    onClick={() => setShowRebirthUI(false)}
                    className="p-2 text-zinc-500 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div>
                  <h3 className="text-white font-black text-xl uppercase tracking-wider text-emerald-400">Rebirth</h3>
                  <p className="text-zinc-300 text-sm mt-3 leading-relaxed">
                    Sacrifice your current heroes, gold, and progress to be reborn stronger!
                  </p>
                  <div className="mt-4 bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs text-red-400 font-bold uppercase tracking-wider">
                      <ShieldAlert size={14} /> You will lose:
                    </div>
                    <div className="text-xs text-zinc-400 ml-5 font-mono mb-2">
                      - All Heroes (except starter)<br/>
                      - Gold & Campaign Progress
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider">
                      <Gem size={14} /> You will gain:
                    </div>
                    <div className="text-xs text-emerald-200 ml-5 font-mono">
                      - 1,000 Gems instantly<br/>
                      - Permanent <span className="text-white font-black">5x Damage Multiplier</span><br/>
                      - Keeps Rubies & Artifacts
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-2">
                  <button 
                    onClick={() => setShowRebirthUI(false)}
                    className="h-12 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold tracking-widest uppercase rounded-xl transition-all cursor-pointer text-[10px]"
                  >
                    Cancel
                  </button>
                  <button 
                     onClick={() => handleRebirth(false)}
                     className="h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black tracking-widest uppercase rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95 cursor-pointer text-[10px]"
                  >
                    Ascend
                  </button>
                  <button 
                     onClick={() => handleRebirth(true)}
                     className="h-12 bg-yellow-500 hover:bg-yellow-400 text-black font-black tracking-widest uppercase rounded-xl transition-all shadow-[0_0_15px_rgba(234,179,8,0.4)] active:scale-95 cursor-pointer text-[10px]"
                  >
                    Max Ascend
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

    </div>
  );
}
