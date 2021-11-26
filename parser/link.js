const parseLinkMeta = (meta = {}) => {
  const {
    ogSiteName,
    twitterSite,
    ogTitle,
    twitterTitle,
    ogDescription,
    twitterDescription,
    requestUrl,
  } = meta;
  const { ogImage = {}, twitterImage = {} } = meta;
  const { url: ogImageUrl } = ogImage;
  const { url: twitterImageUrl } = twitterImage;

  const result = {
    siteName: ogSiteName || twitterSite,
    title: ogTitle || twitterTitle,
    description: ogDescription || twitterDescription,
    linkUrl: requestUrl,
    imageUrl: ogImageUrl || twitterImageUrl,
  };

  return result;
};

module.exports = parseLinkMeta;
