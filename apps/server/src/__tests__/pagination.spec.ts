import { paginate, validatePaginationParams } from '../app/utils/pagination';

describe('pagination', () => {
  describe('paginate', () => {
    it('should paginate items correctly', () => {
      const items = Array.from({ length: 25 }, (_, i) => ({ id: i }));
      const result = paginate(items, { page: 1, limit: 10 });

      expect(result.data).toHaveLength(10);
      expect(result.data[0].id).toBe(0);
      expect(result.data[9].id).toBe(9);
      expect(result.meta).toMatchObject({
        currentPage: 1,
        totalPages: 3,
        totalItems: 25,
        itemsPerPage: 10,
        hasNextPage: true,
        hasPreviousPage: false,
      });
    });

    it('should return correct second page', () => {
      const items = Array.from({ length: 25 }, (_, i) => ({ id: i }));
      const result = paginate(items, { page: 2, limit: 10 });

      expect(result.data).toHaveLength(10);
      expect(result.data[0].id).toBe(10);
      expect(result.data[9].id).toBe(19);
      expect(result.meta.currentPage).toBe(2);
      expect(result.meta.hasNextPage).toBe(true);
      expect(result.meta.hasPreviousPage).toBe(true);
    });

    it('should return last page with remaining items', () => {
      const items = Array.from({ length: 25 }, (_, i) => ({ id: i }));
      const result = paginate(items, { page: 3, limit: 10 });

      expect(result.data).toHaveLength(5);
      expect(result.data[0].id).toBe(20);
      expect(result.meta.currentPage).toBe(3);
      expect(result.meta.hasNextPage).toBe(false);
      expect(result.meta.hasPreviousPage).toBe(true);
    });

    it('should handle empty array', () => {
      const result = paginate([], { page: 1, limit: 10 });

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

    it('should handle page beyond total pages', () => {
      const items = Array.from({ length: 5 }, (_, i) => ({ id: i }));
      const result = paginate(items, { page: 10, limit: 10 });

      expect(result.data).toEqual([]);
      expect(result.meta.currentPage).toBe(10);
      expect(result.meta.totalPages).toBe(1);
    });

    it('should handle negative page number by treating as 1', () => {
      const items = Array.from({ length: 5 }, (_, i) => ({ id: i }));
      const result = paginate(items, { page: -1, limit: 10 });

      expect(result.meta.currentPage).toBe(1);
      expect(result.data).toHaveLength(5);
    });

    it('should handle zero or negative limit by treating as 1', () => {
      const items = Array.from({ length: 5 }, (_, i) => ({ id: i }));
      const result = paginate(items, { page: 1, limit: 0 });

      expect(result.meta.itemsPerPage).toBe(1);
      expect(result.data).toHaveLength(1);
    });
  });

  describe('validatePaginationParams', () => {
    it('should return valid params unchanged', () => {
      const result = validatePaginationParams(2, 20);
      expect(result).toEqual({ page: 2, limit: 20 });
    });

    it('should clamp page to minimum 1', () => {
      const result = validatePaginationParams(0, 10);
      expect(result.page).toBe(1);
    });

    it('should use default limit when invalid', () => {
      const result = validatePaginationParams(1, 0);
      expect(result.limit).toBe(10); // defaults to 10
    });

    it('should clamp limit to maximum 100', () => {
      const result = validatePaginationParams(1, 200);
      expect(result.limit).toBe(100);
    });

    it('should handle undefined params with defaults', () => {
      const result = validatePaginationParams(undefined, undefined);
      expect(result).toEqual({ page: 1, limit: 10 });
    });

    it('should handle negative page number', () => {
      const result = validatePaginationParams(-5, 10);
      expect(result.page).toBe(1);
    });

    it('should handle negative limit', () => {
      const result = validatePaginationParams(1, -10);
      expect(result.limit).toBe(10);
    });
  });
});
