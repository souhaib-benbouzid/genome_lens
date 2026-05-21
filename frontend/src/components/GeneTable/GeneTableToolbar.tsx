import type { AppDispatch } from '@/store';
import { setFilters } from '@/store/genesSlice';
import type { FilterParams } from '@/types/gene';
import { ActionIcon, Group, Select, Stack, TextInput } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';

interface GeneTableToolbarProps {
  rawSearch: string;
  onSearchChange: (value: string) => void;
  filters: FilterParams;
  biotypes: string[];
  chromosomes: string[];
  dispatch: AppDispatch;
}

export function GeneTableToolbar({
  rawSearch,
  onSearchChange,
  filters,
  biotypes,
  chromosomes,
  dispatch,
}: GeneTableToolbarProps) {
  return (
    <Stack gap="xs" px="sm" pt="sm" pb="xs">
      <TextInput
        size="xs"
        leftSection={<IconSearch size={14} />}
        rightSection={
          rawSearch ? (
            <ActionIcon
              size="xs"
              variant="subtle"
              aria-label="Clear search"
              onClick={() => onSearchChange('')}
            >
              <IconX size={12} />
            </ActionIcon>
          ) : null
        }
        placeholder="Search symbol or name…"
        value={rawSearch}
        onChange={(e) => onSearchChange(e.currentTarget.value)}
      />
      <Group gap="xs">
        <Select
          size="xs"
          placeholder="Biotype"
          clearable
          searchable
          data={biotypes}
          value={filters.biotype}
          onChange={(v) => dispatch(setFilters({ biotype: v }))}
          style={{ flex: 1 }}
        />
        <Select
          size="xs"
          placeholder="Chr"
          clearable
          searchable
          data={chromosomes}
          value={filters.chromosome}
          onChange={(v) => dispatch(setFilters({ chromosome: v }))}
          style={{ flex: 1 }}
        />
      </Group>
    </Stack>
  );
}
