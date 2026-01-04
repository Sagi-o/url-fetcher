import { describe, it, expect } from 'vitest';
import { buildSortQueryString } from '../query-params';

describe('query-params', () => {
  describe('buildSortQueryString', () => {
    it('should build query string with sortBy and order', () => {
      const result = buildSortQueryString({ sortBy: 'createdAt', order: 'desc' });
      expect(result).toBe('sortBy=createdAt&order=desc');
    });

    it('should build query string with only sortBy', () => {
      const result = buildSortQueryString({ sortBy: 'updatedAt' });
      expect(result).toBe('sortBy=updatedAt');
    });

    it('should return empty string when params is undefined', () => {
      const result = buildSortQueryString(undefined);
      expect(result).toBe('');
    });

    it('should handle different sort fields', () => {
      expect(buildSortQueryString({ sortBy: 'createdAt', order: 'asc' })).toBe('sortBy=createdAt&order=asc');
      expect(buildSortQueryString({ sortBy: 'updatedAt', order: 'desc' })).toBe('sortBy=updatedAt&order=desc');
    });

    it('should include pagination params', () => {
      const result = buildSortQueryString({ sortBy: 'createdAt', order: 'desc', page: 2, limit: 20 });
      expect(result).toBe('sortBy=createdAt&order=desc&page=2&limit=20');
    });
  });
});
