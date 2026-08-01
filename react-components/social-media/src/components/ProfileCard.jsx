import React, { useState } from 'react';
import { formatNumber } from '../utils/formatters.js';
import {
  CheckCircle2,
  ExternalLink,
  Edit3,
  Users,
  Heart,
  Film,
  Copy,
  Check,
} from 'lucide-react';

export const ProfileCard = ({ profile, onEditProfile }) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyProfileLink = () => {
    navigator.clipboard.writeText(`https://tiktok.com/${profile.handle}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="relative rounded-2xl bg-white/85 border border-[#75A1EE]/40 overflow-hidden shadow-xl shadow-[#75A1EE]/10 my-6 backdrop-blur-xl">
      <div className="bg-[#75A1EE] text-white px-4 py-2 border-b border-[#75A1EE]/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F890C5] border border-white/50 inline-block shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FDE575] border border-white/50 inline-block shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-white border border-white/50 inline-block shadow-xs" />
          </div>
          <span className="text-xs font-mono font-bold tracking-wider uppercase ml-2 text-white">
            Creator_Portfolio.app — {profile.handle}
          </span>
        </div>
        <div className="text-[10px] font-mono text-[#FDE575] font-bold uppercase tracking-widest hidden sm:flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FDE575] animate-pulse" />
          <span>FASHION PORTFOLIO</span>
        </div>
      </div>

      <div className="p-6 md:p-8 relative bg-gradient-to-br from-[#75A1EE]/10 via-white/80 to-[#F890C5]/10">
        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-[#75A1EE] via-[#F890C5] to-[#FDE575] border-2 border-[#75A1EE]/40 shadow-lg shadow-[#75A1EE]/20">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  className="w-full h-full rounded-full object-cover bg-white"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[10px] font-mono text-[#131B2E]/40 text-center px-2">
                  Add avatar
                </div>
              )}
            </div>
            {profile.isVerified && (
              <div className="absolute bottom-1 right-1 bg-[#75A1EE] text-white rounded-full p-1 shadow-md border border-white" title="Verified Creator">
                <CheckCircle2 className="w-4 h-4 fill-[#75A1EE] text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-3 min-w-0">
            <div className="flex flex-col sm:flex-row items-center md:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#131B2E] tracking-tight">{profile.displayName}</h1>
                  {profile.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#75A1EE]/20 border border-[#75A1EE]/40 text-[#75A1EE]">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono font-bold text-[#75A1EE] mt-0.5">{profile.handle}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={onEditProfile}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#75A1EE]/10 text-[#131B2E] text-xs font-bold border border-[#75A1EE]/30 transition-all shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#75A1EE]" />
                  <span>Edit Profile</span>
                </button>

                <button
                  onClick={handleCopyProfileLink}
                  className="p-2 rounded-xl bg-white hover:bg-[#75A1EE]/10 text-[#131B2E] border border-[#75A1EE]/30 transition-colors shadow-xs"
                  title="Copy Profile Link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-[#75A1EE]" /> : <Copy className="w-4 h-4 text-[#75A1EE]" />}
                </button>

                <a
                  href={`https://tiktok.com/${profile.handle}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#75A1EE] hover:bg-[#5b8de6] text-white text-xs font-bold border border-[#75A1EE] shadow-sm transition-all"
                >
                  <span>TikTok</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-3.5 pt-1">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#75A1EE]/15 border border-[#75A1EE]/35 text-[#131B2E]">
                <Users className="w-4 h-4 text-[#75A1EE]" />
                <span className="font-bold font-mono text-sm">{formatNumber(profile.followers)}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#131B2E]/70 font-mono">Followers</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F890C5]/20 border border-[#F890C5]/40 text-[#131B2E]">
                <Heart className="w-4 h-4 text-[#F890C5] fill-[#F890C5]" />
                <span className="font-bold font-mono text-sm">{formatNumber(profile.totalLikes)}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#131B2E]/70 font-mono">Likes</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FDE575]/35 border border-[#FDE575]/60 text-[#131B2E]">
                <Film className="w-4 h-4 text-[#75A1EE]" />
                <span className="font-bold font-mono text-sm">{formatNumber(profile.videoCount)}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#131B2E]/70 font-mono">Videos</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#131B2E]/85 whitespace-pre-line leading-relaxed max-w-2xl font-sans pt-1">
              {profile.bio}
            </p>

            {profile.bioLink && (
              <a
                href={profile.bioLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#75A1EE] font-bold hover:underline bg-[#75A1EE]/10 px-3 py-1 rounded-lg border border-[#75A1EE]/20 font-mono"
              >
                <ExternalLink className="w-3 h-3" />
                <span>{profile.bioLink.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
