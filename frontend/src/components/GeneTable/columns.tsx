import BiotypeTag from '@/components/ui/BiotypeTag';
import ChromosomeTag from '@/components/ui/ChromosomeTag';
import type { Gene } from '@/types/gene';
import { Text, Tooltip } from '@mantine/core';
import type { MRT_ColumnDef } from 'mantine-react-table';

export const geneColumns: MRT_ColumnDef<Gene>[] = [
  {
    accessorKey: 'ensembl_id',
    header: 'Ensembl ID',
    enableSorting: true,
    size: 150,
  },
  {
    accessorKey: 'gene_symbol',
    header: 'Symbol',
    size: 100,
    Cell: ({ cell }) => (
      <Text fw={600} fz="xs" truncate>
        {cell.getValue<string | null>() ?? 'N/A'}
      </Text>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Name',
    size: 150,
    Cell: ({ cell }) => {
      const val = cell.getValue<string | null>();
      return (
        <Tooltip
          label={val ?? ''}
          disabled={!val}
          position="right"
          withArrow
          multiline
          maw={300}
        >
          <Text fz="xs" truncate maw={200}>
            {val ?? 'N/A'}
          </Text>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: 'biotype',
    header: 'Biotype',
    size: 130,
    Cell: ({ cell }) => {
      const val = cell.getValue<string | null>();
      return val ? (
        <BiotypeTag biotype={val} />
      ) : (
        <Text fz="xs" c="dimmed italic">
          N/A
        </Text>
      );
    },
  },
  {
    accessorKey: 'chromosome',
    header: 'Chromosome',
    size: 100,
    Cell: ({ cell }) => {
      const val = cell.getValue<string | null>();
      return val ? (
        <ChromosomeTag chromosome={val} />
      ) : (
        <Text fz="xs" c="dimmed italic">
          N/A
        </Text>
      );
    },
  },
  {
    accessorKey: 'seq_region_start',
    header: 'Start',
    size: 100,
    Cell: ({ cell }) => (
      <Text fz="xs">
        {cell.getValue<number | null>()?.toLocaleString() ?? 'N/A'}
      </Text>
    ),
  },
  {
    accessorKey: 'seq_region_end',
    header: 'End',
    size: 100,
    Cell: ({ cell }) => (
      <Text fz="xs">
        {cell.getValue<number | null>()?.toLocaleString() ?? 'N/A'}
      </Text>
    ),
  },
  {
    id: 'gene_length',
    header: 'Length (bp)',
    size: 120,
    enableSorting: false,
    accessorFn: (row) =>
      row.seq_region_start != null && row.seq_region_end != null
        ? row.seq_region_end - row.seq_region_start
        : null,
    Cell: ({ cell }) => {
      const val = cell.getValue<number | null>();
      if (val == null)
        return (
          <Text fz="xs" c="dimmed italic">
            N/A
          </Text>
        );
      return (
        <Text fz="xs" ff="monospace">
          {val.toLocaleString()}
        </Text>
      );
    },
  },
];
