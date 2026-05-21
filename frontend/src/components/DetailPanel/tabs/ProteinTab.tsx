import type { GeneInfo, GoTerm } from '@/store/api/mygene';
import { useGetGeneInfoQuery } from '@/store/api/mygene';
import { useAppSelector } from '@/store/hook';
import {
  Anchor,
  Badge,
  Box,
  Center,
  Divider,
  Group,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconMicroscope } from '@tabler/icons-react';

/** Normalise mygene.info's CC field — can be a single object or an array. */
function toCCArray(cc: GoTerm | GoTerm[] | undefined): GoTerm[] {
  if (!cc) return [];
  return Array.isArray(cc) ? cc : [cc];
}

interface ProteinDetailsProps {
  data: GeneInfo;
  ccTerms: GoTerm[];
  uniprotIds: string[];
}

const ProteinDetails = ({ data, ccTerms, uniprotIds }: ProteinDetailsProps) => {
  return (
    <>
      <Divider />

      {/* Summary */}
      {data.summary && (
        <Box>
          <Text size="xs" fw={600} tt="uppercase" c="dimmed" mb={4}>
            Function
          </Text>
          <Text size="sm" style={{ lineHeight: 1.6 }}>
            {data.summary}
          </Text>
        </Box>
      )}

      {/* Subcellular localisation */}
      {ccTerms.length > 0 && (
        <Box>
          <Text size="xs" fw={600} tt="uppercase" c="dimmed" mb={6}>
            Subcellular Localisation
          </Text>
          <Group gap={6} wrap="wrap">
            {ccTerms.map((term) => (
              <Badge
                key={term.id}
                size="sm"
                variant="light"
                color="violet"
                radius="sm"
                component="a"
                href={`https://www.ebi.ac.uk/QuickGO/term/${term.id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ cursor: 'pointer', textDecoration: 'none' }}
              >
                {term.term}
              </Badge>
            ))}
          </Group>
        </Box>
      )}

      {/* UniProt links */}
      {uniprotIds.length > 0 && (
        <Box>
          <Text size="xs" fw={600} tt="uppercase" c="dimmed" mb={6}>
            UniProt
          </Text>
          <Group gap="xs">
            {uniprotIds.map((id) => (
              <Anchor
                key={id}
                href={`https://www.uniprot.org/uniprotkb/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
              >
                {id}
              </Anchor>
            ))}
          </Group>
        </Box>
      )}

      <Divider />
    </>
  );
};

export function ProteinTab() {
  const selectedGene = useAppSelector((s) => s.genes.selectedGene);
  const symbol = selectedGene?.gene_symbol ?? null;

  const { data, isLoading, isError } = useGetGeneInfoQuery(symbol!, {
    skip: !symbol,
  });

  if (!selectedGene) {
    return (
      <Center h={300}>
        <Stack align="center" gap="xs">
          <IconMicroscope
            size={36}
            stroke={1}
            color="var(--mantine-color-dimmed)"
          />
          <Text c="dimmed" size="sm">
            Select a gene to view protein information.
          </Text>
        </Stack>
      </Center>
    );
  }

  if (!symbol) {
    return (
      <Center h={300}>
        <Text c="dimmed" size="sm">
          No gene symbol — cannot fetch protein data.
        </Text>
      </Center>
    );
  }

  if (isLoading) {
    return (
      <Stack gap="sm" p="md">
        <Skeleton height={20} width="40%" />
        <Skeleton height={12} />
        <Skeleton height={12} />
        <Skeleton height={12} width="80%" />
        <Skeleton height={24} width="60%" mt="sm" />
      </Stack>
    );
  }

  if (isError || !data) {
    return (
      <Center h={200}>
        <Text c="dimmed" size="sm">
          Could not load protein data from mygene.info.
        </Text>
      </Center>
    );
  }

  const ccTerms = toCCArray(data.go?.CC);
  const uniprotId = data.uniprot?.['Swiss-Prot'];
  const uniprotIds = uniprotId
    ? Array.isArray(uniprotId)
      ? uniprotId
      : [uniprotId]
    : [];

  return (
    <ScrollArea h="100%" p="md">
      <Stack gap="md" p="md">
        <Box>
          <Title order={5}>{data.symbol}</Title>
          {data.name && (
            <Text size="xs" c="dimmed">
              {data.name}
            </Text>
          )}
        </Box>

        <ProteinDetails data={data} ccTerms={ccTerms} uniprotIds={uniprotIds} />

        <Text size="xs" c="dimmed">
          Data sourced from{' '}
          <Anchor href="https://mygene.info" target="_blank" size="xs">
            mygene.info
          </Anchor>{' '}
          · GO terms link to{' '}
          <Anchor
            href="https://www.ebi.ac.uk/QuickGO"
            target="_blank"
            size="xs"
          >
            QuickGO
          </Anchor>
        </Text>
      </Stack>
    </ScrollArea>
  );
}
