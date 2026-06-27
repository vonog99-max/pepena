import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Flame, Shield, Sparkles } from 'lucide-react';

export function Login() {
  const { login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      register(email, pass);
    } else {
      login(email, pass);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1e1b4b_0%,_#050505_100%)]"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      
      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_40px_rgba(79,70,229,0.4)] rotate-3">
             <Sparkles className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Idle Legend</h1>
          <p className="text-indigo-300/60 font-mono text-xs uppercase tracking-widest mt-1">Bang Bang RPG</p>
        </div>
        
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Email Access</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-700"
                placeholder="hero@realm.com"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Secret Key</label>
              <input 
                type="password" 
                value={pass}
                onChange={e => setPass(e.target.value)}
                required
                minLength={6}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-700"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black uppercase tracking-widest rounded-xl text-sm shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all active:scale-95"
            >
              {isRegistering ? 'Forge Account' : 'Enter Realm'}
            </button>

            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="w-full text-[10px] font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-widest transition-colors"
            >
              {isRegistering ? 'Already have an account?' : 'Create new legend?'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
