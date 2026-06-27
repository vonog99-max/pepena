import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { ACHIEVEMENTS } from '../data/achievements';
import { 
  User, Trophy, Shield, Image as ImageIcon, Edit2, Check, Plus, 
  Trash2, Search, Sparkles, X, Target, UserPlus, Heart, Camera
} from 'lucide-react';
import { 
  collection, doc, getDocs, getDoc, query, where, updateDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { audio } from '../audio/sounds';

interface FriendInfo {
  userId: string;
  username: string;
  level: number;
}

export function Profile() {
  const { profile, heroes, updateProfile } = useGameStore();
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(profile.username);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const bestHero = heroes.sort((a, b) => b.attack - a.attack)[0];

  const [friendSearch, setFriendSearch] = useState('');
  const [friendList, setFriendList] = useState<FriendInfo[]>([]);
  const [friendError, setFriendError] = useState<string | null>(null);
  const [friendSuccess, setFriendSuccess] = useState<string | null>(null);

  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [inputUrl, setInputUrl] = useState('');

  const [showPinSelector, setShowPinSelector] = useState(false);

  const maxSlots = profile.hasBattlePass ? 5 : 2;

  useEffect(() => {
    const fetchFriends = async () => {
      const uids = profile.friends || [];
      const list: FriendInfo[] = [];

      for (const uid of uids) {
        try {
          const userDoc = await getDoc(doc(db, 'users', uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            list.push({
              userId: uid,
              username: data.profile?.username || 'Unknown Guest',
              level: data.profile?.level || 1
            });
          } else {
            list.push({
              userId: uid,
              username: 'Offline Adventurer',
              level: 1
            });
          }
        } catch (e) {
          list.push({
            userId: uid,
            username: 'Offline Adventurer',
            level: 1
          });
        }
      }
      setFriendList(list);
    };

    fetchFriends();
  }, [profile.friends]);

  const handleSaveUsername = () => {
    if (newUsername.trim()) {
      audio.playClick();
      updateProfile({ username: newUsername.trim() });
      setIsEditing(false);
    }
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleSaveAvatar = async () => {
    if (!selectedAvatarFile) return;
    setIsUploading(true);
    audio.playClick();
    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedAvatarFile);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        updateProfile({ avatarUrl: base64data });
        setSelectedAvatarFile(null);
        setIsEditingAvatar(false);
        setIsUploading(false);
      };
    } catch (error) {
      console.error("Avatar upload failed:", error);
      alert("Failed to upload avatar. Please try again.");
      setIsUploading(false);
    }
  };

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    setFriendError(null);
    setFriendSuccess(null);
    const searchVal = friendSearch.trim();

    if (!searchVal) {
      setFriendError('Please enter a username or a user ID.');
      return;
    }

    if (searchVal === profile.userId || searchVal.toLowerCase() === profile.username.toLowerCase()) {
      setFriendError('You cannot add yourself as a friend.');
      return;
    }

    if (profile.friends?.includes(searchVal)) {
      setFriendError('This adventurer is already in your friend list.');
      return;
    }

    audio.playClick();

    try {
      let targetDoc = await getDoc(doc(db, 'users', searchVal));
      
      if (!targetDoc.exists()) {
        const q = query(collection(db, 'users'), where('profile.username', '==', searchVal));
        const qSnap = await getDocs(q);
        if (!qSnap.empty) {
          targetDoc = qSnap.docs[0];
        }
      }

      if (targetDoc.exists()) {
        const targetData = targetDoc.data();
        const targetId = targetDoc.id;

        if (profile.friends?.includes(targetId)) {
          setFriendError('This adventurer is already in your friend list.');
          return;
        }

        const updatedFriends = [...(profile.friends || []), targetId];
        updateProfile({ friends: updatedFriends });
        setFriendSuccess(`Successfully added ${targetData.profile?.username || 'adventurer'} as a friend!`);
        setFriendSearch('');
      } else {
        setFriendError('No adventurer found matching that ID or Username.');
      }
    } catch (err) {
      setFriendError('Error connecting to the celestial contacts database.');
    }
  };

  const handleRemoveFriend = (friendId: string) => {
    audio.playClick();
    const updated = (profile.friends || []).filter(id => id !== friendId);
    updateProfile({ friends: updated });
    setFriendSuccess('Friend removed from your alliance list.');
    setTimeout(() => setFriendSuccess(null), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeSlot === null) return;
    const file = e.target.files?.[0];
    if (!file) return;

    audio.playClick();
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const currentAlbum = [...(profile.album || [])];
      currentAlbum[activeSlot] = base64;
      updateProfile({ album: currentAlbum });
      setActiveSlot(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveUrlImage = () => {
    if (activeSlot === null || !inputUrl.trim()) return;
    audio.playClick();
    const currentAlbum = [...(profile.album || [])];
    currentAlbum[activeSlot] = inputUrl.trim();
    updateProfile({ album: currentAlbum });
    setInputUrl('');
    setActiveSlot(null);
  };

  const handleClearSlot = (slotIdx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    audio.playClick();
    const currentAlbum = [...(profile.album || [])];
    currentAlbum[slotIdx] = '';
    updateProfile({ album: currentAlbum });
  };

  const unlockedAchievements = ACHIEVEMENTS.filter(ach => profile.achievements[ach.id]);

  const togglePinAchievement = (achId: string) => {
    audio.playClick();
    const currentPins = profile.pinnedAchievements || [];
    if (currentPins.includes(achId)) {
      updateProfile({ pinnedAchievements: currentPins.filter(id => id !== achId) });
    } else {
      if (currentPins.length >= 3) {
        return;
      }
      updateProfile({ pinnedAchievements: [...currentPins, achId] });
    }
  };

  return (
    <div className="w-full h-full p-6 overflow-y-auto text-white bg-[#0A0A0B]">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="bg-zinc-900/80 border border-zinc-850 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500 rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 flex items-center justify-center mr-2">
              <div className="absolute -top-1.5 -left-1.5 w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-200 rounded-tl-full rounded-br-full rotate-[15deg] z-20 shadow-[0_0_10px_rgba(251,146,60,0.5)]"></div>
              <div className="absolute -top-1.5 -right-1.5 w-8 h-8 bg-gradient-to-bl from-orange-500 to-amber-300 rounded-tr-full rounded-bl-full -rotate-[15deg] z-20 shadow-[0_0_10px_rgba(251,146,60,0.5)]"></div>
              
              <div className="absolute inset-0 bg-gradient-to-b from-orange-300 via-white to-purple-600 rounded-xl p-[2px] z-10 shadow-[0_0_15px_rgba(147,51,234,0.4)]">
                <div className="w-full h-full bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 to-purple-600/20 z-0"></div>
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover z-10" referrerPolicy="no-referrer" />
                  ) : (
                    <User size={32} className="text-white z-10" />
                  )}
                  <button onClick={() => setIsEditingAvatar(true)} className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 z-20 transition-opacity">
                    <Camera size={20} />
                  </button>
                </div>
              </div>

              <div className="absolute -bottom-1.5 -left-1.5 w-10 h-5 bg-gradient-to-r from-purple-500 to-fuchsia-400 rounded-full blur-[2px] z-20 rotate-12"></div>
              <div className="absolute -bottom-1.5 -right-1.5 w-10 h-5 bg-gradient-to-l from-purple-600 to-fuchsia-500 rounded-full blur-[2px] z-20 -rotate-12"></div>
              
              <div className="absolute -bottom-1 -left-2 w-6 h-6 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full border border-yellow-200 z-30 flex items-center justify-center shadow-lg">
                <div className="w-2 h-2 bg-purple-900 rotate-45"></div>
              </div>
              <div className="absolute -bottom-1 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full border border-yellow-200 z-30 flex items-center justify-center shadow-lg">
                <div className="w-2 h-2 bg-purple-900 rotate-45"></div>
              </div>

              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 h-5 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full border border-purple-400 flex items-center justify-center text-[10px] font-black tracking-tighter text-white shadow-[0_0_8px_rgba(147,51,234,0.5)] z-40 whitespace-nowrap">
                LVL {profile.level}
              </div>
            </div>
            
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="bg-black border border-zinc-700 rounded-lg px-3 py-1 text-emerald-400 font-black text-xl focus:outline-none focus:border-emerald-500 w-44"
                      maxLength={15}
                    />
                    <button onClick={handleSaveUsername} className="p-1.5 bg-emerald-600 rounded-lg text-white">
                      <Check size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-black tracking-wide text-white">{profile.username}</h1>
                    <button onClick={() => setIsEditing(true)} className="p-1 text-zinc-500 hover:text-white transition-colors">
                      <Edit2 size={14} />
                    </button>
                  </>
                )}
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-1">UID: {profile.userId}</p>
              <p className="text-xs text-zinc-500 font-mono">Server ID: {profile.serverId}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-zinc-900/60 border border-zinc-850 p-6 rounded-2xl">
              <h2 className="text-md font-bold flex items-center gap-2 mb-4 text-emerald-400 uppercase tracking-wider">
                <Target size={18} /> Locked Achievement Showcase (Max 3)
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, i) => {
                  const pinnedId = profile.pinnedAchievements?.[i];
                  const ach = ACHIEVEMENTS.find(a => a.id === pinnedId);

                  return (
                    <div 
                      key={i} 
                      onClick={() => { audio.playClick(); setShowPinSelector(true); }}
                      className="border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer min-h-[110px] transition-all hover:bg-zinc-950"
                    >
                      {ach ? (
                        <div className="space-y-1">
                          <div className="text-xs font-black text-rose-400 flex items-center justify-center gap-1">
                            <Target size={12} /> Goal
                          </div>
                          <div className="font-bold text-xs text-zinc-200 line-clamp-1">{ach.name}</div>
                          <div className="text-[10px] text-zinc-500 leading-snug line-clamp-2">{ach.description}</div>
                        </div>
                      ) : (
                        <div className="text-zinc-500 space-y-1">
                          <Plus size={16} className="mx-auto" />
                          <div className="text-[10px] font-bold uppercase tracking-wider">Set Goal</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-zinc-500 mt-2">Display accomplishments you are actively striving toward. Locked achievements only.</p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-850 p-6 rounded-2xl">
              <h2 className="text-md font-bold flex items-center gap-2 mb-4 text-purple-400 uppercase tracking-wider">
                <ImageIcon size={18} /> Adventurer's Gallery (Max {maxSlots})
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {Array.from({ length: maxSlots }).map((_, i) => {
                  const hasImg = !!profile.album?.[i];

                  return (
                    <div 
                      key={i} 
                      onClick={() => { audio.playClick(); setActiveSlot(i); }}
                      className="aspect-square bg-zinc-950 border border-zinc-850 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-zinc-900 overflow-hidden relative group"
                    >
                      {hasImg ? (
                        <>
                          <img src={profile.album[i]} alt="Album pic" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <button 
                            onClick={(e) => handleClearSlot(i, e)}
                            className="absolute top-1 right-1 p-1 bg-black/80 rounded-lg text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={12} />
                          </button>
                        </>
                      ) : (
                        <div className="text-center p-2 text-zinc-600 group-hover:text-zinc-400">
                          <Camera size={20} className="mx-auto mb-1.5" />
                          <div className="text-[9px] font-bold uppercase tracking-widest">Upload</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-zinc-500 mt-3">Upload your custom images to display inside your character slots.</p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-850 p-6 rounded-2xl">
              <h2 className="text-md font-bold flex items-center gap-2 mb-4 text-amber-500 uppercase tracking-wider">
                <Trophy size={18} /> General Milestones
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                {ACHIEVEMENTS.slice(0, 40).map(ach => {
                  const unlocked = !!profile.achievements[ach.id];
                  return (
                    <div key={ach.id} className={`p-3 rounded-xl border flex items-center gap-2.5 ${unlocked ? 'bg-amber-950/20 border-amber-500/30' : 'bg-zinc-950/60 border-zinc-900 opacity-60'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${unlocked ? 'bg-amber-500/10 text-amber-500' : 'bg-zinc-900 text-zinc-600'}`}>
                        <Trophy size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs truncate text-zinc-200">{ach.name}</div>
                        <div className="text-[10px] text-zinc-500 truncate mt-0.5">{ach.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          <div className="space-y-6">
            
            <div className="bg-zinc-900/60 border border-zinc-850 p-6 rounded-2xl">
              <h2 className="text-md font-bold flex items-center gap-2 mb-4 text-blue-400 uppercase tracking-wider">
                <UserPlus size={18} /> Adventurer Contacts
              </h2>

              <form onSubmit={handleAddFriend} className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  placeholder="Enter Username or UID..."
                  value={friendSearch}
                  onChange={(e) => setFriendSearch(e.target.value)}
                  className="bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 flex-1"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-2.5 rounded-xl text-xs shrink-0 flex items-center justify-center">
                  <UserPlus size={14} />
                </button>
              </form>

              {friendError && (
                <div className="p-2.5 bg-red-950/40 border border-red-500/20 rounded-lg text-red-400 text-[10px] font-semibold mb-3">
                  {friendError}
                </div>
              )}

              {friendSuccess && (
                <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/20 rounded-lg text-emerald-400 text-[10px] font-semibold mb-3">
                  {friendSuccess}
                </div>
              )}

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
                {friendList.map(f => (
                  <div key={f.userId} className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-white">{f.username}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">Lvl {f.level} | UID: {f.userId}</div>
                    </div>
                    <button 
                      onClick={() => handleRemoveFriend(f.userId)}
                      className="text-zinc-600 hover:text-red-400 p-1.5 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}

                {friendList.length === 0 && (
                  <div className="text-center py-6 text-xs text-zinc-600">No adventurers added yet. Enter a username or UID to begin an alliance.</div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {activeSlot !== null && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Upload slot {activeSlot + 1}</h3>
              <button onClick={() => setActiveSlot(null)} className="text-zinc-500 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Method A: Upload File</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white file:cursor-pointer"
                />
              </div>

              <div className="border-t border-zinc-800 pt-3">
                <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Method B: Paste Image URL</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="https://images.com/pic.png"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="bg-black border border-zinc-800 rounded-lg p-2 text-xs text-white flex-1"
                  />
                  <button onClick={handleSaveUrlImage} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-lg">
                    Save URL
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPinSelector && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-lg space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">Goal Achievement Showcase</h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Select up to 3 achievements you wish to display as future goals.</p>
              </div>
              <button onClick={() => setShowPinSelector(false)} className="text-zinc-500 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {unlockedAchievements.slice(0, 30).map(ach => {
                const isPinned = profile.pinnedAchievements?.includes(ach.id);
                return (
                  <div 
                    key={ach.id} 
                    onClick={() => togglePinAchievement(ach.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${isPinned ? 'bg-pink-950/20 border-pink-500' : 'bg-black border-zinc-850 hover:border-zinc-700'}`}
                  >
                    <div>
                      <div className="font-bold text-xs text-zinc-200">{ach.name}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{ach.description}</div>
                    </div>
                    {isPinned ? (
                      <span className="text-[10px] bg-pink-950 text-pink-400 border border-pink-500/20 px-2 py-0.5 rounded-full font-bold">Pinned</span>
                    ) : (
                      <span className="text-[10px] text-zinc-500">Unpinned</span>
                    )}
                  </div>
                );
              })}

              {unlockedAchievements.length === 0 && (
                <div className="text-center py-6 text-xs text-zinc-500">You haven't unlocked any achievements yet.</div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-zinc-800">
              <button 
                onClick={() => setShowPinSelector(false)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold py-1.5 px-4 rounded-lg"
              >
                Close Showcase
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditingAvatar && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm space-y-4">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Choose Avatar Image</h3>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setSelectedAvatarFile(file);
              }}
              className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500"
            />
            {selectedAvatarFile && <p className="text-xs text-emerald-400">Selected: {selectedAvatarFile.name}</p>}
            <div className="flex justify-end gap-2">
              <button onClick={() => { setIsEditingAvatar(false); setSelectedAvatarFile(null); }} className="px-3 py-1.5 text-xs text-zinc-500 hover:text-white">Cancel</button>
              <button onClick={handleSaveAvatar} disabled={!selectedAvatarFile || isUploading} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50">
                {isUploading ? 'Uploading...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
