export const normalizeUrl = (url: string): string => {
  // Trim whitespace
  let normalized = url.trim();

  // If no protocol, add https://
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = `https://${normalized}`;
  }

  return normalized;
};

export const normalizeUrls = (urls: string[]): string[] => {
  return urls.map(normalizeUrl);
};
