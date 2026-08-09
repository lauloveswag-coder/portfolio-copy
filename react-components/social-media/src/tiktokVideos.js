// Real-data config for the TikTok feed — no mock/random data.
//
// PROFILE holds the fields TikTok's public oEmbed endpoint can't supply
// (follower/like/video counts, bio, verification badge). oEmbed only
// returns per-video metadata for a given video URL, so profile-level
// stats have to be entered by hand here and kept in sync manually.
//
export const PROFILE = {
  handle: '@_suchashame_0',
  displayName: 'Laura',
  avatarUrl: 'assets/profile/avatar.jpg',
  // NOTE(laura): totalLikes is approximated from the "2.9K" rounded
  // display value you gave me (2900) — tell me the exact number if you
  // want it precise; the UI re-formats whatever's here back into "K"
  // notation anyway.
  bio: 'vlogs • skincare • btsarmy • food • ugc • 🇫🇷\nYesstyle code: SUCHASHAME29\nsuchashamelessartiste@gmail.com',
  bioLink: 'https://linktr.ee/shamelessash',
  isVerified: false,
  followers: 550,
  following: 0,
  totalLikes: 2900,
  videoCount: 14,
};

// TODO(laura): replace these with real TikTok video URLs, e.g.
// 'https://www.tiktok.com/@your_handle/video/7123456789012345678'
// Each URL is resolved client-side via TikTok's public oEmbed endpoint
// (title, thumbnail, author, embeddable player) — nothing here is
// invented or randomly generated.
export const TIKTOK_VIDEO_URLS = [
  'https://www.tiktok.com/@_suchashame_0/video/7646012248413981984',
  'https://www.tiktok.com/@_suchashame_0/video/7663066300662549782',
  'https://www.tiktok.com/@_suchashame_0/video/7621147885790399766',
  'https://www.tiktok.com/@_suchashame_0/video/7663207567459388694',
  'https://www.tiktok.com/@_suchashame_0/video/7615230442836430102',
  'https://www.tiktok.com/@_suchashame_0/video/7618370158893092099',
  'https://www.tiktok.com/@_suchashame_0/video/7547772281334861078',
  'https://www.tiktok.com/@_suchashame_0/video/7665354890964667670',
  'https://www.tiktok.com/@_suchashame_0/video/7645754351687961878',
  'https://www.tiktok.com/@_suchashame_0/video/7616328402403953942',
  'https://www.tiktok.com/@_suchashame_0/video/7606363693940509974',
  'https://www.tiktok.com/@_suchashame_0/video/7601927084138679574',
  'https://www.tiktok.com/@_suchashame_0/video/7581587663891877142',
  'https://www.tiktok.com/@_suchashame_0/video/7539666582843165974',
];

const OEMBED_ENDPOINT = 'https://www.tiktok.com/oembed';

// TikTok's oEmbed response does not include engagement counts, duration,
// publish date, or sound info — those fields are left null/empty rather
// than fabricated. The like/bookmark/comment UI still works locally
// (see App.jsx), it just starts from zero instead of a fake number.
export async function fetchTikTokOEmbed(videoUrl) {
  const res = await fetch(`${OEMBED_ENDPOINT}?url=${encodeURIComponent(videoUrl)}`);
  if (!res.ok) {
    throw new Error(`TikTok oEmbed request failed (${res.status}) for ${videoUrl}`);
  }
  return res.json();
}

function extractHashtags(text) {
  const matches = text.match(/#[\w]+/g) || [];
  return matches.map((tag) => tag.slice(1).toLowerCase());
}

let videoIdCounter = 0;

export function oEmbedToVideo(videoUrl, data) {
  videoIdCounter += 1;
  const title = data.title || 'Untitled video';
  return {
    id: `oembed-${videoIdCounter}-${Date.now()}`,
    sourceUrl: videoUrl,
    title,
    caption: title,
    hashtags: extractHashtags(title),
    coverUrl: data.thumbnail_url || '',
    embedHtml: data.html || null,
    authorName: data.author_name || '',
    authorUrl: data.author_url || '',
    // Not available from oEmbed — left null so the UI can hide them
    // instead of showing a made-up value.
    duration: null,
    publishedAt: null,
    soundTitle: null,
    soundAuthor: null,
    // Local-only interaction state (see App.jsx handlers).
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    bookmarks: 0,
    isPinned: false,
    isLiked: false,
    isBookmarked: false,
    commentsList: [],
  };
}
