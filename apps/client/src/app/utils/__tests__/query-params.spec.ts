import { describe, it, expect } from 'vitest';
import { buildSortQueryString, buildQueryString } from '../query-params';

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

  describe('buildQueryString', () => {
    it('should build query string from params object', () => {
      const params = { sortBy: 'createdAt', order: 'desc' };
      const result = buildQueryString(params);
      expect(result).toBe('sortBy=createdAt&order=desc');
    });

    it('should include pagination params', () => {
      const params = { page: 2, limit: 20 };
      const result = buildQueryString(params);
      expect(result).toBe('page=2&limit=20');
    });

    it('should combine sort and pagination params', () => {
      const params = { sortBy: 'createdAt', order: 'asc', page: 3, limit: 5 };
      const result = buildQueryString(params);
      expect(result).toBe('sortBy=createdAt&order=asc&page=3&limit=5');
    });

    it('should filter out undefined values', () => {
      const params = { sortBy: 'createdAt', order: undefined, page: 1 };
      const result = buildQueryString(params);
      expect(result).toBe('sortBy=createdAt&page=1');
    });

    it('should return empty string for empty params', () => {
      const result = buildQueryString({});
      expect(result).toBe('');
    });

    it('should handle all undefined params', () => {
      const params = { sortBy: undefined, order: undefined };
      const result = buildQueryString(params);
      expect(result).toBe('');
    });
  });
});
