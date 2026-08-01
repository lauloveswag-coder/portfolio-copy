import React from 'react';
import { motion } from 'motion/react';
import { Radio, X, ArrowRight } from 'lucide-react';

export const RealTimeNotificationToast = ({ video, onDismiss, onViewVideo }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white/90 border border-[#75A1EE]/40 rounded-2xl p-4 shadow-2xl shadow-[#75A1EE]/20 backdrop-blur-xl"
    >
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <img
            src={video.coverUrl}
            alt={video.title}
            className="w-12 h-16 rounded-xl object-cover bg-[#0e1626] border border-[#75A1EE]/30"
            referrerPolicy="no-referrer"
          />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#75A1EE] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#75A1EE]"></span>
          </span>
        </div>

        <div className="flex-1 min-w-0 space-y-1 font-sans">
          <div className="flex items-center justify-between font-mono">
            <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-white bg-[#75A1EE] px-2 py-0.5 rounded-lg">
              <Radio className="w-3 h-3 animate-pulse text-[#FDE575]" /> New Video Added
            </span>
            <button onClick={onDismiss} className="text-[#131B2E]/50 hover:text-[#131B2E] p-0.5">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="font-serif font-bold text-xs text-[#131B2E] truncate">{video.title}</p>
          <p className="text-[11px] text-[#131B2E]/70 line-clamp-1">{video.caption}</p>

          <button
            onClick={() => onViewVideo(video)}
            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#75A1EE] hover:underline pt-1 font-mono"
          >
            <span>Watch</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
