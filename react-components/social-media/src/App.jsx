import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PROFILE, TIKTOK_VIDEO_URLS, fetchTikTokOEmbed, oEmbedToVideo } from './tiktokVideos.js';

import { Header } from './components/Header.jsx';
import { ProfileCard } from './components/ProfileCard.jsx';
import { FeedControls } from './components/FeedControls.jsx';
import { VideoGridCard } from './components/VideoGridCard.jsx';
import { VideoPlayerModal } from './components/VideoPlayerModal.jsx';
import { AddVideoModal } from './components/AddVideoModal.jsx';
import { EditProfileModal } from './components/EditProfileModal.jsx';
import { RealTimeNotificationToast } from './components/RealTimeNotificationToast.jsx';

import { Film, RefreshCw } from 'lucide-react';

// Adapted from the Google AI Studio reference app: no backend exists on
// this static portfolio site, so every /api/tiktok/* call was replaced
// with direct client-side calls to TikTok's public oEmbed endpoint (see
// tiktokVideos.js). AI Analytics and the multi-account profile switcher
// were dropped — both depended on the mock backend/mock data this pass
// explicitly excludes. See README notes in tiktokVideos.js for where to
// plug in real video URLs and profile info.
export default function App() {
  const [profile, setProfile] = useState(PROFILE);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadErrors, setLoadErrors] = useState([]);

  const [viewMode, setViewMode] = useState('grid-3');
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHashtag, setSelectedHashtag] = useState(undefined);

  const [syncConfig, setSyncConfig] = useState({
    autoUpdate: false,
    intervalSeconds: 60,
    lastSyncedAt: new Date().toISOString(),
    isSyncing: false,
  });

  const [selectedVideoModal, setSelectedVideoModal] = useState(null);
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [addedVideoToast, setAddedVideoToast] = useState(null);

  // Fetch real oEmbed data for every configured URL. Placeholder/broken
  // URLs fail individually and are just left out of the feed (with the
  // error surfaced below) instead of crashing the whole page.
  const loadAllVideos = useCallback(async (preserveInteractions = true) => {
    const results = await Promise.allSettled(
      TIKTOK_VIDEO_URLS.map((url) => fetchTikTokOEmbed(url).then((data) => oEmbedToVideo(url, data)))
    );

    const nextVideos = [];
    const errors = [];
    results.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        nextVideos.push(result.value);
      } else {
        errors.push({ url: TIKTOK_VIDEO_URLS[i], message: result.reason?.message || 'Failed to load' });
      }
    });

    if (preserveInteractions) {
      setVideos((prev) => {
        const prevByUrl = new Map(prev.map((v) => [v.sourceUrl, v]));
        return nextVideos.map((v) => {
          const existing = prevByUrl.get(v.sourceUrl);
          return existing
            ? { ...v, likes: existing.likes, isLiked: existing.isLiked, bookmarks: existing.bookmarks, isBookmarked: existing.isBookmarked, comments: existing.comments, commentsList: existing.commentsList, isPinned: existing.isPinned }
            : v;
        });
      });
    } else {
      setVideos(nextVideos);
    }
    setLoadErrors(errors);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    loadAllVideos(false).finally(() => setIsLoading(false));
  }, [loadAllVideos]);

  const triggerSync = useCallback(async () => {
    setSyncConfig((prev) => ({ ...prev, isSyncing: true }));
    await loadAllVideos(true);
    setSyncConfig((prev) => ({ ...prev, isSyncing: false, lastSyncedAt: new Date().toISOString() }));
  }, [loadAllVideos]);

  useEffect(() => {
    if (!syncConfig.autoUpdate) return;
    const interval = setInterval(() => {
      triggerSync();
    }, syncConfig.intervalSeconds * 1000);
    return () => clearInterval(interval);
  }, [syncConfig.autoUpdate, syncConfig.intervalSeconds, triggerSync]);

  const handleToggleLike = (videoId, e) => {
    if (e) e.stopPropagation();
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id !== videoId) return v;
        const nextLiked = !v.isLiked;
        return { ...v, isLiked: nextLiked, likes: nextLiked ? v.likes + 1 : Math.max(0, v.likes - 1) };
      })
    );
    setSelectedVideoModal((prev) =>
      prev && prev.id === videoId
        ? { ...prev, isLiked: !prev.isLiked, likes: !prev.isLiked ? prev.likes + 1 : Math.max(0, prev.likes - 1) }
        : prev
    );
  };

  const handleToggleBookmark = (videoId, e) => {
    if (e) e.stopPropagation();
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id !== videoId) return v;
        const nextMarked = !v.isBookmarked;
        return { ...v, isBookmarked: nextMarked, bookmarks: nextMarked ? v.bookmarks + 1 : Math.max(0, v.bookmarks - 1) };
      })
    );
    setSelectedVideoModal((prev) =>
      prev && prev.id === videoId
        ? { ...prev, isBookmarked: !prev.isBookmarked, bookmarks: !prev.isBookmarked ? prev.bookmarks + 1 : Math.max(0, prev.bookmarks - 1) }
        : prev
    );
  };

  const handleAddComment = (videoId, text) => {
    const newComment = {
      id: `c-${Date.now()}`,
      username: 'you',
      avatar: profile.avatarUrl,
      text,
      likes: 0,
      createdAt: 'Just now',
    };
    setVideos((prev) =>
      prev.map((v) =>
        v.id === videoId
          ? { ...v, comments: v.comments + 1, commentsList: [newComment, ...(v.commentsList || [])] }
          : v
      )
    );
    setSelectedVideoModal((prev) =>
      prev && prev.id === videoId
        ? { ...prev, comments: prev.comments + 1, commentsList: [newComment, ...(prev.commentsList || [])] }
        : prev
    );
  };

  const handleImportTikTokUrl = async (url) => {
    const data = await fetchTikTokOEmbed(url);
    const video = oEmbedToVideo(url, data);
    setVideos((prev) => [video, ...prev]);
    setProfile((prev) => ({ ...prev, videoCount: prev.videoCount + 1 }));
    setAddedVideoToast(video);
  };

  const handleSaveProfile = (updated) => {
    setProfile((prev) => ({ ...prev, ...updated }));
    setIsEditProfileOpen(false);
  };

  const availableHashtags = useMemo(() => {
    const tagsSet = new Set();
    videos.forEach((v) => v.hashtags.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet).slice(0, 12);
  }, [videos]);

  const filteredVideos = useMemo(() => {
    return videos
      .filter((v) => {
        if (category === 'pinned' && !v.isPinned) return false;

        if (selectedHashtag) {
          const hasTag = v.hashtags.some((t) => t.toLowerCase().includes(selectedHashtag.toLowerCase()));
          if (!hasTag) return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const inTitle = v.title.toLowerCase().includes(q);
          const inCaption = v.caption.toLowerCase().includes(q);
          const inTag = v.hashtags.some((t) => t.toLowerCase().includes(q));
          if (!inTitle && !inCaption && !inTag) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (category === 'popular') return b.likes - a.likes;
        if (category === 'trending') return b.views - a.views;
        if (category === 'latest' && a.publishedAt && b.publishedAt) {
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        }
        return 0;
      });
  }, [videos, category, selectedHashtag, searchQuery]);

  return (
    <div className="min-h-screen bg-aura-gradient text-[#131B2E] selection:bg-[#75A1EE] selection:text-white font-sans relative overflow-x-hidden">
      <Header
        profile={profile}
        syncConfig={syncConfig}
        onManualSync={triggerSync}
        onOpenAddVideo={() => setIsAddVideoOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <ProfileCard profile={profile} onEditProfile={() => setIsEditProfileOpen(true)} />

        <FeedControls
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          category={category}
          onCategoryChange={setCategory}
          syncConfig={syncConfig}
          onSyncConfigChange={(updates) => setSyncConfig((prev) => ({ ...prev, ...updates }))}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          availableHashtags={availableHashtags}
          selectedHashtag={selectedHashtag}
          onSelectHashtag={setSelectedHashtag}
          totalVideosCount={filteredVideos.length}
        />

        {isLoading ? (
          <div className="py-20 text-center space-y-4">
            <RefreshCw className="w-8 h-8 text-[#75A1EE] animate-spin mx-auto" />
            <p className="text-sm text-[#131B2E]/60 font-serif italic">Fetching real TikTok video data...</p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white/80 border border-[#75A1EE]/30 rounded-2xl backdrop-blur-xl shadow-lg my-8 px-6">
            <Film className="w-10 h-10 text-[#75A1EE]/50 mx-auto" />
            <h3 className="text-lg font-serif font-bold text-[#131B2E]">No videos found</h3>
            <p className="text-xs text-[#131B2E]/60 max-w-sm mx-auto font-sans">
              {searchQuery || selectedHashtag
                ? 'Try clearing your search filters or hashtags to view more uploads.'
                : 'No real TikTok video URLs are configured yet. Edit src/tiktokVideos.js and replace the placeholder URLs with real ones.'}
            </p>
            {loadErrors.length > 0 && (
              <p className="text-[10px] text-[#F890C5] font-mono max-w-md mx-auto">
                {loadErrors.length} video URL(s) failed to load — check they're valid, public TikTok video links.
              </p>
            )}
            {(searchQuery || selectedHashtag) && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedHashtag(undefined); setCategory('all'); }}
                className="mt-2 px-4 py-2 bg-[#75A1EE] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#5b8de6] transition-colors rounded-xl font-mono shadow-xs"
              >
                Reset Search Filters
              </button>
            )}
          </div>
        ) : viewMode === 'feed-single' ? (
          <div className="space-y-6">
            {filteredVideos.map((video) => (
              <VideoGridCard
                key={video.id}
                video={video}
                viewMode={viewMode}
                onSelectVideo={setSelectedVideoModal}
                onToggleLike={handleToggleLike}
                onToggleBookmark={handleToggleBookmark}
              />
            ))}
          </div>
        ) : (
          <div
            className={`grid gap-4 sm:gap-6 ${
              viewMode === 'grid-4' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3'
            }`}
          >
            {filteredVideos.map((video) => (
              <VideoGridCard
                key={video.id}
                video={video}
                viewMode={viewMode}
                onSelectVideo={setSelectedVideoModal}
                onToggleLike={handleToggleLike}
                onToggleBookmark={handleToggleBookmark}
              />
            ))}
          </div>
        )}
      </main>

      {selectedVideoModal && (
        <VideoPlayerModal
          video={selectedVideoModal}
          profile={profile}
          onClose={() => setSelectedVideoModal(null)}
          onToggleLike={handleToggleLike}
          onToggleBookmark={handleToggleBookmark}
          onAddComment={handleAddComment}
        />
      )}

      {isAddVideoOpen && (
        <AddVideoModal
          currentHandle={profile.handle}
          onClose={() => setIsAddVideoOpen(false)}
          onImportTikTokUrl={handleImportTikTokUrl}
        />
      )}

      {isEditProfileOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditProfileOpen(false)}
          onSave={handleSaveProfile}
        />
      )}

      {addedVideoToast && (
        <RealTimeNotificationToast
          video={addedVideoToast}
          onDismiss={() => setAddedVideoToast(null)}
          onViewVideo={(vid) => {
            setSelectedVideoModal(vid);
            setAddedVideoToast(null);
          }}
        />
      )}
    </div>
  );
}
