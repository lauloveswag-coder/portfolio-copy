import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Upload, Link } from 'lucide-react';

export const AddVideoModal = ({ currentHandle, onClose, onSubmit, onImportTikTokUrl }) => {
  const [tiktokUrlInput, setTiktokUrlInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState('');

  const handleImport = async (e) => {
    e.preventDefault();
    if (!tiktokUrlInput.trim()) return;

    setIsImporting(true);
    setImportError('');
    try {
      await onImportTikTokUrl(tiktokUrlInput.trim());
      onClose();
    } catch (err) {
      setImportError(err.message || 'Could not fetch that TikTok URL.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0e1626]/50 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
        className="relative w-full max-w-lg bg-white/90 border border-[#75A1EE]/40 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-5 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between border-b border-[#75A1EE]/20 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#75A1EE] text-white rounded-xl shadow-xs">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-[#131B2E]">Add Video</h2>
              <p className="text-xs text-[#131B2E]/60 font-sans">Posting to profile <span className="text-[#75A1EE] font-bold font-mono">{currentHandle}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#131B2E]/60 hover:text-[#131B2E] bg-[#75A1EE]/10 hover:bg-[#75A1EE]/20 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleImport} className="space-y-2 bg-[#75A1EE]/10 p-3.5 rounded-xl border border-[#75A1EE]/30">
          <label className="text-[10px] font-bold text-[#75A1EE] uppercase tracking-widest flex items-center gap-1.5 font-mono">
            <Link className="w-3.5 h-3.5 text-[#75A1EE]" />
            Paste a real TikTok video URL
          </label>
          <p className="text-[11px] text-[#131B2E]/60 font-sans">
            Title, thumbnail, and playback are pulled live from TikTok's public oEmbed endpoint — no data is invented.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://www.tiktok.com/@handle/video/1234567890"
              value={tiktokUrlInput}
              onChange={(e) => setTiktokUrlInput(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-white border border-[#75A1EE]/30 rounded-xl text-xs text-[#131B2E] placeholder-[#131B2E]/40 focus:outline-none focus:border-[#75A1EE] font-sans"
            />
            <button
              type="submit"
              disabled={isImporting || !tiktokUrlInput.trim()}
              className="px-3 py-1.5 bg-[#75A1EE] hover:bg-[#5b8de6] disabled:opacity-50 text-white text-[10px] font-bold uppercase tracking-widest transition-colors shrink-0 rounded-xl shadow-xs font-mono"
            >
              {isImporting ? 'Fetching...' : 'Add Video'}
            </button>
          </div>
          {importError && (
            <p className="text-[11px] text-[#F890C5] font-sans">{importError}</p>
          )}
        </form>
      </motion.div>
    </div>
  );
};
