import React from 'react';
import { formatNumber, formatDuration, formatRelativeTime } from '../utils/formatters.js';
import { Play, Heart, MessageCircle, Bookmark, Music, Pin } from 'lucide-react';

// Reference app previewed a raw <video> on hover using a direct mp4 URL.
// TikTok's public oEmbed endpoint doesn't expose a raw video file, only
// a thumbnail + embeddable player — so hover-preview was dropped in
// favor of a static cover with a play icon; actual playback happens in
// VideoPlayerModal via TikTok's real embed. Duration/sound fields are
// hidden rather than faked since oEmbed doesn't provide them either.
export const VideoGridCard = ({ video, viewMode, onSelectVideo, onToggleLike, onToggleBookmark }) => {
  if (viewMode === 'feed-single') {
    return (
      <div className="max-w-xl mx-auto mb-8 bg-white/90 border border-[#75A1EE]/40 rounded-2xl overflow-hidden shadow-xl shadow-[#75A1EE]/10 transition-all hover:border-[#75A1EE] backdrop-blur-xl">
        <div className="bg-[#75A1EE] text-white px-3.5 py-2 flex items-center justify-between text-[11px] font-mono border-b border-[#75A1EE]/40">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F890C5] border border-white/40 shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FDE575] border border-white/40 shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-white border border-white/40 shadow-xs" />
            <span className="font-bold ml-1.5 truncate max-w-[200px] text-white">{video.title}</span>
          </div>
          {video.duration != null && (
            <span className="text-[10px] text-[#FDE575] font-bold uppercase tracking-wider">{formatDuration(video.duration)}</span>
          )}
        </div>

        <div
          className="relative aspect-[9/16] bg-[#0e1626] group cursor-pointer overflow-hidden max-h-[640px]"
          onClick={() => onSelectVideo(video)}
        >
          <img
            src={video.coverUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
            <div className="w-14 h-14 bg-white/90 backdrop-blur-md border border-[#75A1EE]/50 rounded-full flex items-center justify-center text-[#75A1EE] shadow-xl">
              <Play className="w-6 h-6 fill-[#75A1EE] ml-1" />
            </div>
          </div>

          {video.isPinned && (
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 bg-[#F890C5] text-white text-[10px] font-bold uppercase tracking-widest border border-white/40 rounded-xl shadow-md font-mono">
              <Pin className="w-3 h-3 fill-white" />
              <span>Pinned</span>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 space-y-2 pointer-events-none">
            {video.soundTitle && (
              <div className="flex items-center gap-2 text-xs text-[#FDE575] font-mono uppercase tracking-wider">
                <Music className="w-3.5 h-3.5 text-[#F890C5] animate-spin" style={{ animationDuration: '4s' }} />
                <span className="truncate">{video.soundTitle}{video.soundAuthor ? ` - ${video.soundAuthor}` : ''}</span>
              </div>
            )}

            <h3 className="font-serif text-white text-lg leading-snug line-clamp-2 italic">
              {video.title}
            </h3>

            <p className="text-xs text-white/90 line-clamp-2 leading-relaxed font-sans">
              {video.caption}
            </p>
          </div>
        </div>

        <div className="p-4 bg-white/90 border-t border-[#75A1EE]/30 flex items-center justify-between text-[#131B2E] font-sans">
          <div className="flex items-center gap-5">
            <button
              onClick={(e) => onToggleLike(video.id, e)}
              className="flex items-center gap-1.5 hover:text-[#75A1EE] transition-colors group"
            >
              <Heart className={`w-4 h-4 ${video.isLiked ? 'fill-[#F890C5] text-[#F890C5]' : 'text-[#75A1EE]'}`} />
              <span className="text-xs font-bold font-mono">{formatNumber(video.likes)}</span>
            </button>

            <button
              onClick={() => onSelectVideo(video)}
              className="flex items-center gap-1.5 hover:text-[#75A1EE] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#75A1EE]" />
              <span className="text-xs font-bold font-mono">{formatNumber(video.comments)}</span>
            </button>

            <button
              onClick={(e) => onToggleBookmark(video.id, e)}
              className="flex items-center gap-1.5 hover:text-[#75A1EE] transition-colors"
            >
              <Bookmark className={`w-4 h-4 ${video.isBookmarked ? 'fill-[#FDE575] text-[#FDE575]' : 'text-[#75A1EE]'}`} />
              <span className="text-xs font-bold font-mono">{formatNumber(video.bookmarks)}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-bold font-mono text-[#131B2E]/70 uppercase tracking-wider">
            {video.publishedAt && <span>{formatRelativeTime(video.publishedAt)}</span>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelectVideo(video)}
      className="group relative aspect-[9/16] rounded-2xl bg-white overflow-hidden cursor-pointer border border-[#75A1EE]/30 hover:border-[#75A1EE] transition-all shadow-sm hover:shadow-xl hover:shadow-[#75A1EE]/20"
    >
      <img
        src={video.coverUrl}
        alt={video.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        referrerPolicy="no-referrer"
      />

      {video.isPinned && (
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2 py-0.5 bg-[#F890C5] text-white text-[9px] font-mono font-bold uppercase tracking-widest border border-white/40 rounded-lg shadow-sm">
          <Pin className="w-2.5 h-2.5 fill-white" />
          <span>Pinned</span>
        </div>
      )}

      {video.duration != null && (
        <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 bg-[#75A1EE] text-white text-[10px] font-mono font-bold rounded-lg border border-white/30 shadow-xs">
          {formatDuration(video.duration)}
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#0e1626]/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-11 h-11 bg-white/90 backdrop-blur-md border border-[#75A1EE]/50 rounded-full flex items-center justify-center text-[#75A1EE] transform scale-90 group-hover:scale-100 transition-transform shadow-lg">
            <Play className="w-5 h-5 fill-[#75A1EE] ml-0.5" />
          </div>
        </div>

        <div className="space-y-1">
          <p className="font-serif text-xs sm:text-sm font-bold text-white line-clamp-2 leading-tight group-hover:text-[#FDE575] transition-colors">
            {video.title}
          </p>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#FDE575] pt-1.5 border-t border-white/20">
            <span className="flex items-center gap-1 text-[#FDE575] font-bold">
              <Play className="w-3 h-3 fill-[#FDE575]" />
              {formatNumber(video.views)}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => onToggleLike(video.id, e)}
                className="hover:scale-125 transition-transform p-0.5"
                title="Like"
              >
                <Heart className={`w-3.5 h-3.5 ${video.isLiked ? 'fill-[#F890C5] text-[#F890C5]' : 'text-white'}`} />
              </button>

              <button
                onClick={(e) => onToggleBookmark(video.id, e)}
                className="hover:scale-125 transition-transform p-0.5"
                title="Bookmark"
              >
                <Bookmark className={`w-3.5 h-3.5 ${video.isBookmarked ? 'fill-[#FDE575] text-[#FDE575]' : 'text-white'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
