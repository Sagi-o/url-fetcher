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
    it('should return empty paginated response when no URLs exist', () => {
      const result = urlService.getUrlList();
      expect(result.data).toEqual([]);
      expect(result.meta).toMatchObject({
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });

    it('should return paginated list of submitted URLs', async () => {
      await urlService.fetchUrls(['http://example.com', 'http://google.com']);

      const result = urlService.getUrlList();
      expect(result.data).toHaveLength(2);
      expect(result.data.map((r) => r.url)).toContain('http://example.com');
      expect(result.data.map((r) => r.url)).toContain('http://google.com');
      expect(result.meta.totalItems).toBe(2);
    });

    it('should sort by createdAt descending by default', async () => {
      await urlService.fetchUrls(['http://example.com']);
      await new Promise((resolve) => setTimeout(resolve, 10));
      await urlService.fetchUrls(['http://google.com']);

      const result = urlService.getUrlList('createdAt', 'desc');
      expect(result.data[0].url).toBe('http://google.com');
      expect(result.data[1].url).toBe('http://example.com');
    });

    it('should sort by createdAt ascending', async () => {
      await urlService.fetchUrls(['http://example.com']);
      await new Promise((resolve) => setTimeout(resolve, 10));
      await urlService.fetchUrls(['http://google.com']);

      const result = urlService.getUrlList('createdAt', 'asc');
      expect(result.data[0].url).toBe('http://example.com');
      expect(result.data[1].url).toBe('http://google.com');
    });

    it('should paginate results correctly', async () => {
      const urls = Array.from({ length: 15 }, (_, i) => `http://example${i}.com`);
      await urlService.fetchUrls(urls);

      const page1 = urlService.getUrlList(undefined, 'desc', { page: 1, limit: 10 });
      expect(page1.data).toHaveLength(10);
      expect(page1.meta.currentPage).toBe(1);
      expect(page1.meta.totalPages).toBe(2);
      expect(page1.meta.hasNextPage).toBe(true);
      expect(page1.meta.hasPreviousPage).toBe(false);

      const page2 = urlService.getUrlList(undefined, 'desc', { page: 2, limit: 10 });
      expect(page2.data).toHaveLength(5);
      expect(page2.meta.currentPage).toBe(2);
      expect(page2.meta.hasNextPage).toBe(false);
      expect(page2.meta.hasPreviousPage).toBe(true);
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
