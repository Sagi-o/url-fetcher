import { useQueryStates, parseAsInteger, parseAsStringLiteral } from 'nuqs';
import { UrlSortField, SortOrder, UrlListQueryParams } from '@org/shared';

export function useUrlListParams() {
  const [params, setParams] = useQueryStates(
    {
      sortBy: parseAsStringLiteral(['createdAt', 'updatedAt'] as const).withDefault('updatedAt'),
      order: parseAsStringLiteral(['asc', 'desc'] as const).withDefault('desc'),
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(5),
    },
    {
      history: 'push',
    }
  );

  const handleSortChange = (sortBy: UrlSortField, order: SortOrder) => {
    setParams({ sortBy, order, page: 1 }); // Reset to page 1 when sorting changes
  };

  const handlePageChange = (page: number) => {
    // Only set page if it's > 1 (page 1 is default)
    if (page > 1) {
      setParams({ page });
    } else {
      // Remove page param if going back to page 1
      setParams({ page: null });
    }
  };

  return {
    params: params as Required<UrlListQueryParams>,
    handleSortChange,
    handlePageChange,
  };
}
