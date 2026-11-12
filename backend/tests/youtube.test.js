const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeYoutubeChannelId } = require('../utils/youtube');

const channelId = 'UCX6OQ3DkcsbYNE6H8uQQuVA';

test('accepts a YouTube channel ID and a channel URL', () => {
  assert.equal(normalizeYoutubeChannelId(channelId), channelId);
  assert.equal(
    normalizeYoutubeChannelId(`https://www.youtube.com/channel/${channelId}`),
    channelId
  );
});

test('rejects handles and non-channel URLs', () => {
  assert.throws(() => normalizeYoutubeChannelId('@MrBeast'), /Handles cannot be used/);
  assert.throws(() => normalizeYoutubeChannelId('https://youtu.be/video-id'), /Handles cannot be used/);
});

test('allows an empty value to unlink a channel', () => {
  assert.equal(normalizeYoutubeChannelId('  '), '');
});
