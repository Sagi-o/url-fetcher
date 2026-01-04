import { PaginationParams, PaginationMeta, PaginatedResponse } from '@org/shared';

/**
 * Generic pagination utility for arrays
 * Can be used with any data type
 */
export function paginate<T>(
  items: T[],
  params: PaginationParams
): PaginatedResponse<T> {
  const { page, limit } = params;

  // Validate pagination params
  const currentPage = Math.max(1, page);
  const itemsPerPage = Math.max(1, limit);

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate slice indices
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Slice the data
  const paginatedData = items.slice(startIndex, endIndex);

  // Build metadata
  const meta: PaginationMeta = {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };

  return {
    data: paginatedData,
    meta,
  };
}

/**
 * Validates pagination parameters
 */
export function validatePaginationParams(
  page?: number,
  limit?: number
): PaginationParams {
  const validPage = page && page > 0 ? page : 1;
  let validLimit = 10; // default

  if (limit && limit > 0) {
    validLimit = Math.min(limit, 100); // clamp to max 100
  }

  return {
    page: validPage,
    limit: validLimit,
  };
}
