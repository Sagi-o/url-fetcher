import { UrlListQueryParams } from '@org/shared';

/**
 * Builds URL query string from URL list query parameters
 * Includes sorting and pagination params
 */
export function buildSortQueryString(params?: UrlListQueryParams): string {
  if (!params) return '';

  const queryParams = new URLSearchParams();
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.order) queryParams.append('order', params.order);
  if (params.page !== undefined) queryParams.append('page', String(params.page));
  if (params.limit !== undefined) queryParams.append('limit', String(params.limit));

  return queryParams.toString();
}

/**
 * Generic utility to build query strings from any params object
 */
export function buildQueryString(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return '';

  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });

  return queryParams.toString();
}
