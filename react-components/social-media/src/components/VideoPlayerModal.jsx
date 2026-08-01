import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { formatNumber, formatRelativeTime } from '../utils/formatters.js';
import { loadTikTokEmbedScript } from '../utils/loadTikTokEmbedScript.js';
import { X, Heart, MessageCircle, Bookmark, Send, Copy, Check, ExternalLink } from 'lucide-react';

// Reference app played a raw mp4 with custom play/pause/mute controls.
// TikTok's oEmbed endpoint doesn't hand out a raw video file — only an
// embeddable player fragment (video.embedHtml) — so playback here goes
// through TikTok's real embed.js instead of a <video> element. That
// player has its own built-in controls, which is why the custom
// play/pause/mute buttons from the reference were dropped.
export const VideoPlayerModal = ({ video, profile, onClose, onToggleLike, onToggleBookmark, onAddComment }) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [copied, setCopied] = useState(false);
  const embedContainerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    if (video.embedHtml) {
      loadTikTokEmbedScript().then(() => {
        if (!cancelled && embedContainerRef.current) {
          embedContainerRef.current.innerHTML = video.embedHtml;
        }
      });
    }
    return () => {
      cancelled = true;
    };
  }, [video.embedHtml]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newCommentText.trim()) {
      onAddComment(video.id, newCommentText.trim());
      setNewCommentText('');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(video.sourceUrl || `https://tiktok.com/${profile.handle}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#0e1626]/50 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-5xl h-[92vh] max-h-[850px] bg-white/90 border border-[#75A1EE]/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col backdrop-blur-xl"
      >
        <div className="bg-[#75A1EE] text-white px-4 py-2 flex items-center justify-between shrink-0 font-mono text-xs select-none">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#F890C5] hover:opacity-80 transition-opacity" title="Close" />
            <span className="w-3 h-3 rounded-full bg-[#FDE575]" />
            <span className="w-3 h-3 rounded-full bg-white" />
            <span className="font-bold ml-2 tracking-wide text-white">MediaViewer.app — {video.title}</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 text-white rounded transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
          <div className="relative flex-1 bg-[#0e1626] flex items-center justify-center overflow-hidden">
            {video.embedHtml ? (
              <div ref={embedContainerRef} className="w-full h-full flex items-center justify-center overflow-auto" />
            ) : (
              <img src={video.coverUrl} alt={video.title} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            )}
          </div>

          <div className="w-full lg:w-[420px] bg-white/95 flex flex-col border-t lg:border-t-0 lg:border-l border-[#75A1EE]/30 min-h-0">
            <div className="p-4 border-b border-[#75A1EE]/20 flex items-center justify-between bg-[#75A1EE]/10">
              <div className="flex items-center gap-3">
                {profile.avatarUrl && (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.displayName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#75A1EE]"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div>
                  <p className="font-serif font-bold text-sm text-[#131B2E]">{profile.displayName}</p>
                  <p className="text-xs text-[#75A1EE] font-mono">{profile.handle}</p>
                </div>
              </div>

              <a
                href={`https://tiktok.com/${profile.handle}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-4 py-1.5 bg-[#75A1EE] hover:bg-[#5b8de6] text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-colors shadow-xs font-mono"
              >
                <span>Follow</span>
              </a>
            </div>

            <div className="p-4 border-b border-[#75A1EE]/20 space-y-2 max-h-40 overflow-y-auto">
              <h2 className="font-serif font-bold text-base text-[#131B2E] leading-snug">{video.title}</h2>
              <p className="text-xs text-[#131B2E]/90 leading-relaxed whitespace-pre-line font-sans">
                {video.caption}
              </p>

              <div className="flex flex-wrap gap-1 pt-1 font-mono">
                {video.hashtags.map((tag) => (
                  <span key={tag} className="text-xs font-bold uppercase tracking-wider text-[#75A1EE] hover:underline cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>

              {video.publishedAt && (
                <p className="text-[10px] font-bold font-mono text-[#131B2E]/50 uppercase tracking-wider pt-1">
                  Published {formatRelativeTime(video.publishedAt)}
                </p>
              )}
            </div>

            <div className="px-4 py-3 border-b border-[#75A1EE]/20 bg-white/80 flex items-center justify-between text-[#131B2E]">
              <button onClick={() => onToggleLike(video.id)} className="flex items-center gap-1.5 hover:text-[#75A1EE] transition-colors">
                <Heart className={`w-4 h-4 ${video.isLiked ? 'fill-[#F890C5] text-[#F890C5]' : 'text-[#75A1EE]'}`} />
                <span className="text-xs font-bold font-mono">{formatNumber(video.likes)}</span>
              </button>

              <div className="flex items-center gap-1.5 text-[#131B2E]">
                <MessageCircle className="w-4 h-4 text-[#75A1EE]" />
                <span className="text-xs font-bold font-mono text-[#131B2E]">{formatNumber(video.comments)}</span>
              </div>

              <button onClick={() => onToggleBookmark(video.id)} className="flex items-center gap-1.5 hover:text-[#75A1EE] transition-colors">
                <Bookmark className={`w-4 h-4 ${video.isBookmarked ? 'fill-[#FDE575] text-[#FDE575]' : 'text-[#75A1EE]'}`} />
                <span className="text-xs font-bold font-mono">{formatNumber(video.bookmarks)}</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="p-1.5 bg-white border border-[#75A1EE]/30 hover:bg-[#75A1EE]/10 text-[#75A1EE] rounded-xl transition-colors shadow-2xs"
                title="Copy Video Link"
              >
                {copied ? <Check className="w-4 h-4 text-[#75A1EE]" /> : <Copy className="w-4 h-4" />}
              </button>

              {video.sourceUrl && (
                <a
                  href={video.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 bg-white border border-[#75A1EE]/30 hover:bg-[#75A1EE]/10 text-[#75A1EE] rounded-xl transition-colors shadow-2xs"
                  title="Open on TikTok"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-0 bg-[#75A1EE]/5">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#131B2E]/70 pb-1 border-b border-[#75A1EE]/20 font-mono">
                <span>Comments ({video.commentsList?.length || 0})</span>
              </div>

              {(!video.commentsList || video.commentsList.length === 0) ? (
                <p className="text-xs text-[#131B2E]/50 text-center py-6 font-serif italic">No comments yet. Be the first to comment!</p>
              ) : (
                video.commentsList.map((c) => (
                  <div key={c.id} className="flex gap-2.5 text-xs">
                    <img
                      src={c.avatar}
                      alt={c.username}
                      className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border border-[#75A1EE]/30"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 bg-white p-2.5 rounded-xl border border-[#75A1EE]/20 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-[#131B2E]">{c.username}</span>
                        <span className="text-[10px] text-[#131B2E]/50 uppercase tracking-wider font-mono">{c.createdAt}</span>
                      </div>
                      <p className="text-[#131B2E]/90 mt-1 font-sans">{c.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-white border-t border-[#75A1EE]/20">
              <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-[#75A1EE]/30 rounded-xl text-xs text-[#131B2E] placeholder-[#131B2E]/40 focus:outline-none focus:border-[#75A1EE] font-sans"
                />
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="px-3 py-2 bg-[#75A1EE] hover:bg-[#5b8de6] disabled:opacity-40 text-white transition-colors shrink-0 rounded-xl uppercase text-[10px] font-bold tracking-wider shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
