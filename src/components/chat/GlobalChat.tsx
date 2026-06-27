import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useGameStore } from '../../store/gameStore';
import { MessageSquare, Send, X } from 'lucide-react';

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: any;
  level: number;
  avatarUrl?: string;
}

export function GlobalChat({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const { profile } = useGameStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'globalChat'), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[];
      setMessages(msgs.reverse());
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
    return unsubscribe;
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      await addDoc(collection(db, 'globalChat'), {
        userId: user.uid,
        username: profile.username,
        text: newMessage,
        createdAt: serverTimestamp(),
        level: profile.level,
        avatarUrl: profile.avatarUrl || null
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="absolute right-0 top-0 bottom-24 w-80 bg-zinc-950 border-l border-zinc-800 z-50 flex flex-col shadow-2xl">
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
        <h3 className="font-bold flex items-center gap-2"><MessageSquare size={16} /> Global Chat</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-white"><X size={16} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className="text-sm flex gap-2">
            {msg.avatarUrl ? (
              <img src={msg.avatarUrl} alt={msg.username} className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-zinc-700 shrink-0 mt-0.5 flex items-center justify-center text-[10px] text-white">
                {msg.username[0].toUpperCase()}
              </div>
            )}
             <div className="flex-1">
               <div className="flex items-baseline gap-2 mb-0.5">
                 <span 
                   onClick={() => {
                     if (msg.userId) {
                       import('../../store/gameStore').then(mod => {
                         mod.useGameStore.getState().setViewingUserId(msg.userId);
                       });
                     }
                   }}
                   className="font-bold text-emerald-400 text-xs cursor-pointer hover:underline"
                 >
                   Lv.{msg.level || 1} {msg.username || 'Unknown'}
                 </span>
               </div>
               <div className="text-zinc-300 break-words">{msg.text}</div>
             </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 border-t border-zinc-800 bg-zinc-900 flex gap-2">
        <input 
          type="text" 
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Say hello..."
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
          maxLength={100}
        />
        <button type="submit" disabled={!newMessage.trim()} className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded px-3 py-2 flex items-center justify-center">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
