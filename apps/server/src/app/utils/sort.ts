import { orderBy } from 'lodash';
import { SortConfig, SortOrder } from '@org/shared';

/**
 * Generic sorting utility using lodash's battle-tested orderBy
 */
export function sortBy<T, K extends keyof T>(
  items: T[],
  config: SortConfig<K & string>
): T[] {
  const { field, order } = config;
  return orderBy(items, [field], [order]);
}

/**
 * Creates a reusable sorter function for a specific type
 */
export function createSorter<T>() {
  return <K extends keyof T>(items: T[], field: K & string, order: SortOrder = 'desc'): T[] => {
    return sortBy(items, { field, order });
  };
}
