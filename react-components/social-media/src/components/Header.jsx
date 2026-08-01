import React from 'react';
import { Plus, RefreshCw, Search, Radio, Sparkles, Video } from 'lucide-react';

// Single-profile mode: this portfolio shows one creator's real feed, so
// the reference app's multi-account switcher (backed by mock preset
// profiles) was dropped rather than ported — see App.jsx.
export const Header = ({
  profile,
  syncConfig,
  onManualSync,
  onOpenAddVideo,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-[#75A1EE]/30 text-[#131B2E] transition-all shadow-sm">
      <div className="bg-[#75A1EE] text-white text-[10px] font-mono px-4 py-1 flex items-center justify-between tracking-widest uppercase shadow-inner">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F890C5] border border-white/40 shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FDE575] border border-white/40 shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-white border border-white/40 shadow-xs" />
          </div>
          <span className="font-bold ml-1 tracking-wider text-white flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#FDE575]" /> AURA OS v2.4 — Portfolio Window
          </span>
          <span className="hidden md:inline text-white/80 lowercase font-sans text-[11px] font-medium">/ {profile.handle}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/90 font-bold hidden sm:inline">LIVE PREVIEW</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#75A1EE] via-[#F890C5] to-[#FDE575] p-[2px] shadow-sm">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Video className="w-4 h-4 text-[#75A1EE]" />
            </div>
          </div>
          <span className="font-serif font-black text-lg tracking-tight hidden sm:inline-block text-[#131B2E]">
            TikTok Portfolio
          </span>
        </div>

        <div className="hidden md:flex flex-1 max-w-sm mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#75A1EE]" />
            <input
              type="text"
              placeholder="Search aesthetics, hashtags, captions..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/90 border border-[#75A1EE]/30 text-xs text-[#131B2E] placeholder-[#131B2E]/40 focus:outline-none focus:border-[#75A1EE] transition-all shadow-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={onManualSync}
            title="Click to re-check TikTok for updates"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              syncConfig.isSyncing
                ? 'bg-[#FDE575] border-[#FDE575] text-[#131B2E] shadow-sm'
                : syncConfig.autoUpdate
                ? 'bg-[#75A1EE]/15 border-[#75A1EE]/40 text-[#75A1EE]'
                : 'bg-white border-[#75A1EE]/30 text-[#131B2E]/70 hover:text-[#131B2E]'
            }`}
          >
            {syncConfig.autoUpdate ? (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#75A1EE] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#75A1EE]"></span>
              </span>
            ) : (
              <Radio className="w-3.5 h-3.5 text-[#75A1EE]" />
            )}
            <RefreshCw className={`w-3.5 h-3.5 ${syncConfig.isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline uppercase tracking-wider text-[10px] font-mono">
              {syncConfig.isSyncing ? 'Syncing...' : syncConfig.autoUpdate ? 'Real-Time' : 'Sync'}
            </span>
          </button>

          <button
            onClick={onOpenAddVideo}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#75A1EE] hover:bg-[#5e90e6] text-white border border-[#75A1EE] text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="font-mono">Upload</span>
          </button>
        </div>
      </div>
    </header>
  );
};
