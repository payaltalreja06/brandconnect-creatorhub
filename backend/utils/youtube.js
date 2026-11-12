const CHANNEL_ID_PATTERN = /^UC[a-zA-Z0-9_-]{22}$/;
const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com']);

function normalizeYoutubeChannelId(value) {
  if (typeof value !== 'string') {
    throw new Error('Enter a valid YouTube channel ID or channel URL.');
  }
  const input = value.trim();
  if (!input) return '';
  if (CHANNEL_ID_PATTERN.test(input)) return input;

  let url;
  try {
    url = new URL(input.includes('://') ? input : `https://${input}`);
  } catch {
    throw new Error('Enter a valid YouTube channel ID or channel URL.');
  }

  const channelId = url.pathname.split('/').filter(Boolean)[1];
  if (
    !YOUTUBE_HOSTS.has(url.hostname.toLowerCase()) ||
    !['http:', 'https:'].includes(url.protocol) ||
    url.pathname.split('/').filter(Boolean)[0] !== 'channel' ||
    !CHANNEL_ID_PATTERN.test(channelId || '')
  ) {
    throw new Error('Enter a YouTube channel ID (UC...) or a /channel/UC... URL. Handles cannot be used as unique IDs.');
  }

  return channelId;
}

module.exports = { normalizeYoutubeChannelId };
