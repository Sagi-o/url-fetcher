import { Group, Pagination as MantinePagination, Text } from '@mantine/core';
import { PaginationMeta } from '@org/shared';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ meta, onPageChange }: PaginationProps) => {
  const { currentPage, totalPages, totalItems, itemsPerPage } = meta;

  if (totalPages <= 1) {
    return null; // Don't show pagination if only 1 page
  }

  return (
    <Group justify="space-between" align="center" mt="md" data-testid="pagination-container">
      <Text size="sm" c="dimmed" data-testid="pagination-info">
        Showing {(currentPage - 1) * itemsPerPage + 1} -{' '}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
      </Text>

      <MantinePagination
        total={totalPages}
        value={currentPage}
        onChange={onPageChange}
        size="sm"
        withEdges
        data-testid="pagination-controls"
        nextIcon={() => <span data-testid="next-page-btn">›</span>}
        previousIcon={() => <span data-testid="prev-page-btn">‹</span>}
      />
    </Group>
  );
};
