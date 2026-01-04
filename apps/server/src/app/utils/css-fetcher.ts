import { JSDOM } from 'jsdom';

/**
 * Extracts and fetches CSS from HTML content
 * Returns combined inline and external CSS as a string
 */
export async function extractAndFetchCss(html: string, baseUrl: string): Promise<string> {
  const cssBlocks: string[] = [];

  try {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Extract inline <style> tags
    const styleTags = document.querySelectorAll('style');
    styleTags.forEach((style) => {
      if (style.textContent) {
        cssBlocks.push(style.textContent);
      }
    });

    // Extract and fetch external stylesheets
    const linkTags = document.querySelectorAll('link[rel="stylesheet"]');
    const cssPromises: Promise<string>[] = [];

    linkTags.forEach((link) => {
      const href = link.getAttribute('href');
      if (href) {
        const absoluteUrl = new URL(href, baseUrl).href;
        cssPromises.push(fetchCssFile(absoluteUrl));
      }
    });

    // Fetch all external CSS files
    const externalCss = await Promise.allSettled(cssPromises);
    externalCss.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        cssBlocks.push(result.value);
      }
    });

    return cssBlocks.join('\n\n');
  } catch (error) {
    console.error('Error extracting CSS:', error);
    return '';
  }
}

/**
 * Fetches a CSS file from a URL
 */
async function fetchCssFile(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; URL-Fetcher/1.0)',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      console.warn(`Failed to fetch CSS from ${url}: ${response.status}`);
      return '';
    }

    return await response.text();
  } catch (error) {
    console.warn(`Error fetching CSS from ${url}:`, error);
    return '';
  }
}
