import { UrlService } from '../app/routes/url/url.service';
import { UrlServiceEvents } from '@org/shared';

describe('UrlService', () => {
  let urlService: UrlService;

  beforeEach(() => {
    urlService = new UrlService();
    const { urlTable } = require('../app/utils/db');
    urlTable.clear();
  });

  afterEach(() => {
    urlService.removeAllListeners();
  });

  describe('fetchUrls', () => {
    it('should create records with loading status', async () => {
      const results = await urlService.fetchUrls(['http://example.com']);

      expect(results).toHaveLength(1);
      expect(results[0]).toMatchObject({
        url: 'http://example.com',
        status: 'loading',
      });
      expect(results[0]).toHaveProperty('createdAt');
      expect(results[0]).toHaveProperty('updatedAt');
    });

    it('should preserve createdAt when re-fetching existing URL', async () => {
      const firstFetch = await urlService.fetchUrls(['http://example.com']);
      const firstCreatedAt = firstFetch[0].createdAt;

      // Wait a bit to ensure timestamp would be different
      await new Promise((resolve) => setTimeout(resolve, 10));

      const secondFetch = await urlService.fetchUrls(['http://example.com']);
      const secondCreatedAt = secondFetch[0].createdAt;

      expect(secondCreatedAt).toBe(firstCreatedAt);
      expect(secondFetch[0].updatedAt).toBeGreaterThan(firstCreatedAt);
    });

    it('should emit URL_UPDATED event on successful fetch', (done) => {
      const testUrl = 'https://httpbin.org/html';

      urlService.on(UrlServiceEvents.URL_UPDATED, (record) => {
        if (record.status === 'success') {
          expect(record.url).toBe(testUrl);
          expect(record).toHaveProperty('content');
          expect(record).toHaveProperty('fetchTime');
          done();
        }
      });

      urlService.fetchUrls([testUrl]);
    }, 10000);

    it('should emit URL_UPDATED event on failed fetch', (done) => {
      const testUrl = 'https://invalid-domain-that-does-not-exist-12345.com';

      urlService.on(UrlServiceEvents.URL_UPDATED, (record) => {
        if (record.status === 'failed') {
          expect(record.url).toBe(testUrl);
          expect(record).toHaveProperty('errorMessage');
          expect(record).toHaveProperty('fetchTime');
          done();
        }
      });

      urlService.fetchUrls([testUrl]);
    }, 10000);
  });

  describe('getUrlList', () => {
    it('should return empty array when no URLs exist', () => {
      const list = urlService.getUrlList();
      expect(list).toEqual([]);
    });

    it('should return all submitted URLs', async () => {
      await urlService.fetchUrls(['http://example.com', 'http://google.com']);

      const list = urlService.getUrlList();
      expect(list).toHaveLength(2);
      expect(list.map((r) => r.url)).toContain('http://example.com');
      expect(list.map((r) => r.url)).toContain('http://google.com');
    });
  });

  describe('getUrlContent', () => {
    it('should throw error for non-existent URL', () => {
      expect(() => {
        urlService.getUrlContent('http://nonexistent.com');
      }).toThrow('URL not found');
    });

    it('should throw error when URL is still loading', async () => {
      await urlService.fetchUrls(['http://example.com']);

      expect(() => {
        urlService.getUrlContent('http://example.com');
      }).toThrow('URL content not available yet');
    });
  });
});
