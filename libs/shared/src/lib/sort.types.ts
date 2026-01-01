export type SortOrder = 'asc' | 'desc';

export type SortConfig<T extends string = string> = {
  field: T;
  order: SortOrder;
};

// Only fields that exist on all UrlRecord variants
export type UrlSortField = 'createdAt' | 'updatedAt';

export type UrlListQueryParams = {
  sortBy?: UrlSortField;
  order?: SortOrder;
};
