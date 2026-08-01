import React from 'react';
import {
  Grid3x3,
  LayoutGrid,
  List,
  Flame,
  Pin,
  Clock,
  Heart,
  Radio,
  Search,
  Hash,
} from 'lucide-react';

export const FeedControls = ({
  viewMode,
  onViewModeChange,
  category,
  onCategoryChange,
  syncConfig,
  onSyncConfigChange,
  searchQuery,
  onSearchChange,
  availableHashtags,
  selectedHashtag,
  onSelectHashtag,
  totalVideosCount,
}) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white/85 p-3 border border-[#75A1EE]/35 shadow-md shadow-[#75A1EE]/5 rounded-2xl backdrop-blur-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
          <button
            onClick={() => { onCategoryChange('all'); onSelectHashtag(undefined); }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-xl border transition-all whitespace-nowrap font-mono ${
              category === 'all' && !selectedHashtag
                ? 'bg-[#75A1EE] text-white border-[#75A1EE] shadow-sm'
                : 'bg-white/80 hover:bg-[#75A1EE]/10 text-[#131B2E] border-[#75A1EE]/25'
            }`}
          >
            <span>All Videos</span>
            <span className={`px-1.5 py-0.2 rounded font-mono text-[10px] ${category === 'all' && !selectedHashtag ? 'bg-white/20 text-white font-bold' : 'bg-[#75A1EE]/15 text-[#75A1EE]'}`}>{totalVideosCount}</span>
          </button>

          <button
            onClick={() => { onCategoryChange('pinned'); onSelectHashtag(undefined); }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-xl border transition-all whitespace-nowrap font-mono ${
              category === 'pinned'
                ? 'bg-[#75A1EE] text-white border-[#75A1EE] shadow-sm'
                : 'bg-white/80 hover:bg-[#75A1EE]/10 text-[#131B2E] border-[#75A1EE]/25'
            }`}
          >
            <Pin className="w-3.5 h-3.5 text-[#F890C5] fill-[#F890C5]" />
            <span>Pinned</span>
          </button>

          <button
            onClick={() => { onCategoryChange('trending'); onSelectHashtag(undefined); }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-xl border transition-all whitespace-nowrap font-mono ${
              category === 'trending'
                ? 'bg-[#75A1EE] text-white border-[#75A1EE] shadow-sm'
                : 'bg-white/80 hover:bg-[#75A1EE]/10 text-[#131B2E] border-[#75A1EE]/25'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#F890C5] fill-[#F890C5]" />
            <span>Trending</span>
          </button>

          <button
            onClick={() => { onCategoryChange('popular'); onSelectHashtag(undefined); }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-xl border transition-all whitespace-nowrap font-mono ${
              category === 'popular'
                ? 'bg-[#75A1EE] text-white border-[#75A1EE] shadow-sm'
                : 'bg-white/80 hover:bg-[#75A1EE]/10 text-[#131B2E] border-[#75A1EE]/25'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-[#F890C5] fill-[#F890C5]" />
            <span>Most Liked</span>
          </button>

          <button
            onClick={() => { onCategoryChange('latest'); onSelectHashtag(undefined); }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-xl border transition-all whitespace-nowrap font-mono ${
              category === 'latest'
                ? 'bg-[#75A1EE] text-white border-[#75A1EE] shadow-sm'
                : 'bg-white/80 hover:bg-[#75A1EE]/10 text-[#131B2E] border-[#75A1EE]/25'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#75A1EE]" />
            <span>Latest</span>
          </button>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-[#75A1EE]/10 px-3 py-1.5 rounded-xl border border-[#75A1EE]/30 text-xs font-mono">
            <Radio className={`w-3.5 h-3.5 ${syncConfig.autoUpdate ? 'text-[#75A1EE] animate-pulse' : 'text-[#131B2E]/40'}`} />
            <span className="text-[#131B2E] text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Auto Sync:</span>
            <select
              value={syncConfig.autoUpdate ? syncConfig.intervalSeconds : 0}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (val === 0) {
                  onSyncConfigChange({ autoUpdate: false });
                } else {
                  onSyncConfigChange({ autoUpdate: true, intervalSeconds: val });
                }
              }}
              className="bg-transparent text-xs font-bold text-[#75A1EE] focus:outline-none cursor-pointer uppercase tracking-wider font-mono"
            >
              <option value={30} className="bg-white text-[#131B2E]">Every 30s</option>
              <option value={60} className="bg-white text-[#131B2E]">Every 1m</option>
              <option value={300} className="bg-white text-[#131B2E]">Every 5m</option>
              <option value={0} className="bg-white text-[#131B2E]">Off (Manual)</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#75A1EE]/30">
            <button
              onClick={() => onViewModeChange('grid-3')}
              title="Standard 3-Column Grid"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid-3' ? 'bg-[#75A1EE] text-white shadow-xs' : 'text-[#131B2E]/50 hover:text-[#75A1EE]'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onViewModeChange('grid-4')}
              title="Density 4-Column Grid"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid-4' ? 'bg-[#75A1EE] text-white shadow-xs' : 'text-[#131B2E]/50 hover:text-[#75A1EE]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>

            <button
              onClick={() => onViewModeChange('feed-single')}
              title="Card Feed View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'feed-single' ? 'bg-[#75A1EE] text-white shadow-xs' : 'text-[#131B2E]/50 hover:text-[#75A1EE]'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden relative w-full mt-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#75A1EE]" />
        <input
          type="text"
          placeholder="Search videos & hashtags..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white border border-[#75A1EE]/30 rounded-xl text-xs text-[#131B2E] placeholder-[#131B2E]/40 focus:outline-none focus:border-[#75A1EE] font-sans"
        />
      </div>

      {availableHashtags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar font-mono">
          <span className="text-[10px] font-bold text-[#75A1EE] uppercase tracking-[0.2em] shrink-0 mr-1 flex items-center gap-1">
            <Hash className="w-3 h-3 text-[#F890C5]" /> Tags:
          </span>

          {selectedHashtag && (
            <button
              onClick={() => onSelectHashtag(undefined)}
              className="px-2.5 py-1 bg-[#F890C5] border border-[#F890C5] text-white text-[10px] font-bold uppercase tracking-wider hover:bg-[#f671b4] transition-colors rounded-xl shrink-0 shadow-xs"
            >
              Clear #{selectedHashtag} ✕
            </button>
          )}

          {availableHashtags.map((tag) => (
            <button
              key={tag}
              onClick={() => onSelectHashtag(selectedHashtag === tag ? undefined : tag)}
              className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all shrink-0 border ${
                selectedHashtag === tag
                  ? 'bg-[#75A1EE] text-white border-[#75A1EE] shadow-xs'
                  : 'bg-white/80 hover:bg-[#75A1EE]/10 text-[#131B2E] border-[#75A1EE]/30'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
