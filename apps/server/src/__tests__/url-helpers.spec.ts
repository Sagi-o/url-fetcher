import { normalizeUrl, removeDuplicates } from '../app/utils/url-helpers';

describe('url-helpers', () => {
  describe('normalizeUrl', () => {
    it('should add https:// prefix if missing', () => {
      expect(normalizeUrl('example.com')).toBe('https://example.com');
    });

    it('should preserve http:// prefix', () => {
      expect(normalizeUrl('http://example.com')).toBe('http://example.com');
    });

    it('should preserve https:// prefix', () => {
      expect(normalizeUrl('https://example.com')).toBe('https://example.com');
    });

    it('should trim whitespace', () => {
      expect(normalizeUrl('  example.com  ')).toBe('https://example.com');
    });

    it('should convert to lowercase', () => {
      expect(normalizeUrl('EXAMPLE.COM')).toBe('https://example.com');
      expect(normalizeUrl('Example.Com')).toBe('https://example.com');
    });

    it('should normalize URLs with paths', () => {
      expect(normalizeUrl('example.com/path')).toBe('https://example.com/path');
    });

    it('should handle complex URLs', () => {
      expect(normalizeUrl('  EXAMPLE.COM/Path/To/Page?query=1  ')).toBe(
        'https://example.com/path/to/page?query=1'
      );
    });
  });

  describe('removeDuplicates', () => {
    it('should remove duplicate URLs', () => {
      const urls = ['http://example.com', 'http://google.com', 'http://example.com'];
      const result = removeDuplicates(urls);

      expect(result).toEqual(['http://example.com', 'http://google.com']);
    });

    it('should handle empty array', () => {
      expect(removeDuplicates([])).toEqual([]);
    });

    it('should handle array with no duplicates', () => {
      const urls = ['http://example.com', 'http://google.com', 'http://github.com'];
      expect(removeDuplicates(urls)).toEqual(urls);
    });

    it('should preserve order of first occurrence', () => {
      const urls = ['http://a.com', 'http://b.com', 'http://a.com', 'http://c.com', 'http://b.com'];
      const result = removeDuplicates(urls);

      expect(result).toEqual(['http://a.com', 'http://b.com', 'http://c.com']);
    });

    it('should handle all duplicates', () => {
      const urls = ['http://example.com', 'http://example.com', 'http://example.com'];
      const result = removeDuplicates(urls);

      expect(result).toEqual(['http://example.com']);
    });
  });
});
