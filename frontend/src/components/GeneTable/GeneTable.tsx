import { setSelectedGene } from '@/store/genesSlice';
import { useAppDispatch } from '@/store/hook';
import { Box, Divider, Group, Loader, Text } from '@mantine/core';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_RowVirtualizer,
} from 'mantine-react-table';
import { useRef } from 'react';
import { geneColumns } from './columns';
import { selectedRow } from './GeneTable.module.css';
import { GeneTableToolbar } from './GeneTableToolbar';
import { useGeneTable } from './hooks/useGeneTable';

export function GeneTable() {
  const dispatch = useAppDispatch();
  const {
    rows,
    total,
    isLoading,
    isFetching,
    hasMore,
    sorting,
    onSortingChange,
    filters,
    rawSearch,
    setRawSearch,
    biotypes,
    chromosomes,
    selectedGene,
    onTableScroll,
  } = useGeneTable();

  const rowVirtualizerRef = useRef<MRT_RowVirtualizer>(null);

  const table = useMantineReactTable({
    data: rows,
    columns: geneColumns,
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    enablePagination: false,
    onSortingChange,
    state: { sorting, isLoading, density: 'xs' },
    enableRowVirtualization: true,
    rowVirtualizerInstanceRef: rowVirtualizerRef,
    rowVirtualizerOptions: { overscan: 12 },
    mantineTableContainerProps: {
      onScroll: onTableScroll,
      style: { maxHeight: 'calc(100vh - 170px)' },
    },
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: () => dispatch(setSelectedGene(row.original)),
      className: selectedGene?.id === row.original.id ? selectedRow : undefined,
      style: { cursor: 'pointer' },
    }),
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableColumnActions: false,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    enableFilters: false,
    getRowId: (row) => String(row.id),
  });

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <GeneTableToolbar
        rawSearch={rawSearch}
        onSearchChange={setRawSearch}
        filters={filters}
        biotypes={biotypes}
        chromosomes={chromosomes}
        dispatch={dispatch}
      />
      <Group px="sm" pb={4} gap={6}>
        {isLoading ? (
          <Loader size={10} />
        ) : (
          <Text size="xs" c="dimmed">
            <Text span fw={600} c="dark">
              {total.toLocaleString()}
            </Text>{' '}
            genes
            {rows.length < total && (
              <Text span> · {rows.length.toLocaleString()} loaded</Text>
            )}
          </Text>
        )}
      </Group>
      <Divider />
      <MantineReactTable table={table} />
      <Box py={4} style={{ textAlign: 'center', flexShrink: 0 }}>
        {isFetching && !isLoading && <Loader size="xs" />}
        {!isFetching && !hasMore && rows.length > 0 && (
          <Text size="xs" c="dimmed">
            All {total.toLocaleString()} matching genes loaded
          </Text>
        )}
      </Box>
    </Box>
  );
}
