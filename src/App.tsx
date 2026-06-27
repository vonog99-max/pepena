import React, { useState, useEffect } from 'react';
import { GameLayout } from './components/layout/GameLayout';
import { Home } from './pages/Home';
import { Heroes } from './pages/Heroes';
import { Summon } from './pages/Summon';
import { Inventory } from './pages/Inventory';
import { Campaign } from './pages/Campaign';
import { Battle } from './pages/Battle';
import { Skills } from './pages/Skills';
import { Runes } from './pages/Runes';
import { Shop } from './pages/Shop';
import { Exchange } from './pages/Exchange';
import { Admin } from './pages/Admin';
import { Profile } from './pages/Profile';
import { BattlePass } from './pages/BattlePass';
import { GuildPage } from './pages/GuildPage';
import { Leaderboard } from './pages/Leaderboard';
import { useGameStore } from './store/gameStore';
import { audio } from './audio/sounds';
import { useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './lib/firebase';

import { ProfileViewModal } from './components/ProfileViewModal';

import { AchievementsPage } from './pages/AchievementsPage';

export default function App() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('home');
  const [battleStageId, setBattleStageId] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  
  const { initialize, profile, heroes, team, inventory } = useGameStore();

  useEffect(() => {
    if (user) {
      initialize();
    }
  }, [user, initialize]);

  useEffect(() => {
    if (user) {
      // Save to Firestore every 15 seconds for the leaderboard/global presence
      const saveToFirestore = () => {
        const state = useGameStore.getState();
        let totalPower = 0;
        state.team.forEach(id => {
          if (id) {
            const hero = state.heroes.find(h => h.instanceId === id);
            if (hero) totalPower += (hero.attack + hero.defense + hero.maxHp);
          }
        });
        setDoc(doc(db, 'users', user.uid), {
          profile: state.profile,
          totalPower,
          inventory: { rubies: state.inventory.rubies || 0 },
          lastActive: new Date().toISOString()
        }, { merge: true }).catch(console.error);
      };
      
      saveToFirestore(); // initial save
      const interval = setInterval(saveToFirestore, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    if (started) {
      const interval = setInterval(() => {
        useGameStore.getState().incrementTimePlayed(1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [started]);

  if (!user) {
    return <Login />;
  }

  const handleStart = () => {
    audio.init();
    audio.resume();
    audio.playClick();
    setStarted(true);
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white relative overflow-hidden p-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950"></div>
        <div className="relative z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-8 shadow-2xl shadow-blue-500/30 flex items-center justify-center text-5xl font-black">H</div>
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight">Idle Legend Bang Bang RPG: Everybody Can Be A Pro</h1>
          <p className="text-xl text-slate-400 mb-12 max-w-md mx-auto">Step into the legend. Click anywhere to begin.</p>
          <button 
            onClick={handleStart}
            className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xl shadow-2xl shadow-indigo-600/50 transition-all active:scale-95"
          >
            Launch Journey
          </button>
        </div>
      </div>
    );
  }

  if (battleStageId) {
    return <Battle stageId={battleStageId} onExit={() => setBattleStageId(null)} />;
  }

  return (
    <>
      <audio src="/home_theme.mp3" autoPlay loop className="hidden" />
      <GameLayout currentTab={currentTab} onTabChange={(t) => { audio.playClick(); setCurrentTab(t); }}>
        {currentTab === 'home' && <Home onNavigate={(t) => { audio.playClick(); setCurrentTab(t); }} />}
        {currentTab === 'heroes' && <Heroes />}
        {currentTab === 'summon' && <Summon />}
        {currentTab === 'inventory' && <Inventory />}
        {currentTab === 'campaign' && <Campaign onStartBattle={setBattleStageId} />}
        {currentTab === 'skills' && <Skills />}
        {currentTab === 'runes' && <Runes />}
        {currentTab === 'shop' && <Shop />}
        {currentTab === 'exchange' && <Exchange />}
        {currentTab === 'admin' && <Admin />}
        {currentTab === 'profile' && <Profile />}
        {currentTab === 'battlepass' && <BattlePass />}
        {currentTab === 'guild' && <GuildPage />}
        {currentTab === 'leaderboard' && <Leaderboard />}
        {currentTab === 'achievements' && <AchievementsPage />}
      </GameLayout>
      <ProfileViewModal />
    </>
  );
}
