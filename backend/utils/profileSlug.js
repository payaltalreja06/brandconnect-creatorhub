function profileSlugPattern(slug) {
  if (typeof slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug)) {
    return null;
  }

  const parts = slug.split('-').map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(`^@?${parts.join('[^a-z0-9]*')}$`, 'i');
}

module.exports = { profileSlugPattern };
