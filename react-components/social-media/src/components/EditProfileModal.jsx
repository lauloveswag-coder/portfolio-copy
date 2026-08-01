import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Edit3 } from 'lucide-react';

export const EditProfileModal = ({ profile, onClose, onSave }) => {
  const [handle, setHandle] = useState(profile.handle);
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio);
  const [bioLink, setBioLink] = useState(profile.bioLink || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [followers, setFollowers] = useState(profile.followers);
  const [totalLikes, setTotalLikes] = useState(profile.totalLikes);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      handle,
      displayName,
      bio,
      bioLink,
      avatarUrl,
      followers: Number(followers) || 0,
      totalLikes: Number(totalLikes) || 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0e1626]/50 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
        className="relative w-full max-w-md bg-white/90 border border-[#75A1EE]/40 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between border-b border-[#75A1EE]/20 pb-3">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-[#75A1EE]" />
            <h2 className="font-serif font-bold text-lg text-[#131B2E]">Edit Profile</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#131B2E]/60 hover:text-[#131B2E] bg-[#75A1EE]/10 hover:bg-[#75A1EE]/20 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 font-sans max-h-[70vh] overflow-y-auto pr-1">
          <div>
            <label className="text-[10px] font-bold text-[#131B2E]/70 uppercase tracking-widest mb-1 block font-mono">TikTok @Handle</label>
            <input
              type="text"
              required
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#75A1EE]/30 rounded-xl text-xs text-[#131B2E] focus:outline-none focus:border-[#75A1EE] font-mono"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#131B2E]/70 uppercase tracking-widest mb-1 block font-mono">Display Name</label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#75A1EE]/30 rounded-xl text-xs text-[#131B2E] focus:outline-none focus:border-[#75A1EE]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#131B2E]/70 uppercase tracking-widest mb-1 block font-mono">Avatar Image URL</label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#75A1EE]/30 rounded-xl text-xs text-[#131B2E] focus:outline-none focus:border-[#75A1EE]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#131B2E]/70 uppercase tracking-widest mb-1 block font-mono">Bio Description</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#75A1EE]/30 rounded-xl text-xs text-[#131B2E] focus:outline-none focus:border-[#75A1EE]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#131B2E]/70 uppercase tracking-widest mb-1 block font-mono">Bio Website Link</label>
            <input
              type="text"
              value={bioLink}
              onChange={(e) => setBioLink(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-white border border-[#75A1EE]/30 rounded-xl text-xs text-[#131B2E] focus:outline-none focus:border-[#75A1EE]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-[#131B2E]/70 uppercase tracking-widest mb-1 block font-mono">Followers</label>
              <input
                type="number"
                min="0"
                value={followers}
                onChange={(e) => setFollowers(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#75A1EE]/30 rounded-xl text-xs text-[#131B2E] focus:outline-none focus:border-[#75A1EE] font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#131B2E]/70 uppercase tracking-widest mb-1 block font-mono">Total Likes</label>
              <input
                type="number"
                min="0"
                value={totalLikes}
                onChange={(e) => setTotalLikes(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#75A1EE]/30 rounded-xl text-xs text-[#131B2E] focus:outline-none focus:border-[#75A1EE] font-mono"
              />
            </div>
          </div>
          <p className="text-[10px] text-[#131B2E]/50 font-sans -mt-1">
            Follower/like counts aren't available from TikTok's public oEmbed endpoint — update them here by hand.
          </p>

          <div className="pt-2 flex justify-end gap-2 font-mono">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-transparent hover:bg-[#75A1EE]/10 text-[#131B2E] border border-[#75A1EE]/30 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#75A1EE] hover:bg-[#5b8de6] text-white text-[10px] font-bold uppercase tracking-widest shadow-md transition-all rounded-xl"
            >
              Save Profile
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
