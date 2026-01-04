/**
 * Generic pagination types for reusable pagination across the app
 */

export type PaginationParams = {
  page: number; // Current page (1-indexed)
  limit: number; // Items per page
};

export type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

export const DEFAULT_PAGINATION: PaginationParams = {
  page: 1,
  limit: 10,
};
