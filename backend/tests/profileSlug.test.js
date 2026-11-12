const test = require('node:test');
const assert = require('node:assert/strict');
const { profileSlugPattern } = require('../utils/profileSlug');

test('matches handles normalized to URL slugs', () => {
  assert.match('@the.rebelkid', profileSlugPattern('the-rebelkid'));
  assert.match('MrBeast', profileSlugPattern('mrbeast'));
});

test('matches display names with spaces and punctuation', () => {
  assert.match('Zara Fashion', profileSlugPattern('zara-fashion'));
});

test('rejects malformed slugs', () => {
  assert.equal(profileSlugPattern('../users'), null);
});
