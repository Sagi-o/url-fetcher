import { Group, Select, ActionIcon } from '@mantine/core';
import { IconArrowUp, IconArrowDown } from '@tabler/icons-react';
import { UrlSortField, SortOrder } from '@org/shared';

interface SortControlProps {
  sortBy: UrlSortField;
  order: SortOrder;
  onSortChange: (sortBy: UrlSortField, order: SortOrder) => void;
}

const SORT_OPTIONS: { value: UrlSortField; label: string }[] = [
  { value: 'createdAt', label: 'Created At' },
  { value: 'updatedAt', label: 'Updated At' },
];

export const SortControl = ({ sortBy, order, onSortChange }: SortControlProps) => {
  const toggleOrder = () => {
    const newOrder: SortOrder = order === 'asc' ? 'desc' : 'asc';
    onSortChange(sortBy, newOrder);
  };

  const handleSortFieldChange = (value: string | null) => {
    if (value) {
      onSortChange(value as UrlSortField, order);
    }
  };

  return (
    <Group gap="xs">
      <Select
        label="Sort by"
        data={SORT_OPTIONS}
        value={sortBy}
        onChange={handleSortFieldChange}
        w={150}
      />
      <ActionIcon
        variant="light"
        size="lg"
        onClick={toggleOrder}
        mt={22}
        title={`Sort ${order === 'asc' ? 'ascending' : 'descending'}`}
      >
        {order === 'asc' ? <IconArrowUp size={18} /> : <IconArrowDown size={18} />}
      </ActionIcon>
    </Group>
  );
};
