import type { Gene } from '@/types/gene';
import { Badge, Text, Tooltip } from '@mantine/core';
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
        <Badge size="xs" variant="light" color="teal" radius="sm">
          {val}
        </Badge>
      ) : (
        <Text fz="xs" c="dimmed">
          N/A
        </Text>
      );
    },
  },
  {
    accessorKey: 'chromosome',
    header: 'Chromosome',
    size: 100,
    Cell: ({ cell }) => (
      <Text fz="xs" c="dimmed">
        {cell.getValue<string | null>() ?? 'N/A'}
      </Text>
    ),
  },
];
