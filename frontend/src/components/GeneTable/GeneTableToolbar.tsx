import type { AppDispatch } from '@/store';
import { setFilters } from '@/store/genesSlice';
import type { FilterParams } from '@/types/gene';
import { ActionIcon, Flex, Select, Stack, TextInput } from '@mantine/core';
import IconSearch from '@tabler/icons-react/dist/esm/icons/IconSearch.mjs';
import IconX from '@tabler/icons-react/dist/esm/icons/IconX.mjs';

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
    <Stack gap="xs" p="sm">
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
      <Flex wrap="wrap" gap="xs" direction={{ base: 'column', sm: 'row' }}>
        <Select
          size="xs"
          placeholder="Biotype"
          clearable
          searchable
          data={biotypes}
          value={filters.biotype}
          onChange={(v) => dispatch(setFilters({ biotype: v }))}
          flex={1}
          style={{ minWidth: 0 }}
        />
        <Select
          size="xs"
          placeholder="Chromosome"
          clearable
          searchable
          flex={1}
          data={chromosomes}
          value={filters.chromosome}
          onChange={(v) => dispatch(setFilters({ chromosome: v }))}
          style={{ minWidth: 0 }}
        />
      </Flex>
    </Stack>
  );
}
