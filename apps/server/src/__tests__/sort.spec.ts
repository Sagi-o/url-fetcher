import { sortBy } from '../app/utils/sort';

describe('sort', () => {
  describe('sortBy', () => {
    it('should sort array in ascending order', () => {
      const items = [
        { name: 'Charlie', age: 30 },
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 35 },
      ];

      const result = sortBy(items, { field: 'name', order: 'asc' });

      expect(result[0].name).toBe('Alice');
      expect(result[1].name).toBe('Bob');
      expect(result[2].name).toBe('Charlie');
    });

    it('should sort array in descending order', () => {
      const items = [
        { name: 'Charlie', age: 30 },
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 35 },
      ];

      const result = sortBy(items, { field: 'age', order: 'desc' });

      expect(result[0].age).toBe(35);
      expect(result[1].age).toBe(30);
      expect(result[2].age).toBe(25);
    });

    it('should sort by numeric values', () => {
      const items = [
        { id: 3, value: 100 },
        { id: 1, value: 200 },
        { id: 2, value: 150 },
      ];

      const result = sortBy(items, { field: 'id', order: 'asc' });

      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
      expect(result[2].id).toBe(3);
    });

    it('should handle empty array', () => {
      const result = sortBy([], { field: 'name', order: 'asc' });
      expect(result).toEqual([]);
    });

    it('should handle single item array', () => {
      const items = [{ name: 'Alice', age: 25 }];
      const result = sortBy(items, { field: 'name', order: 'asc' });
      expect(result).toEqual(items);
    });

    it('should not mutate original array', () => {
      const items = [
        { name: 'Charlie' },
        { name: 'Alice' },
        { name: 'Bob' },
      ];
      const original = [...items];

      sortBy(items, { field: 'name', order: 'asc' });

      expect(items).toEqual(original);
    });
  });
});
