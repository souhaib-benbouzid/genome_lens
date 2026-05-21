import type { GeneInfo, GoTerm } from '@/store/api/mygene';
import { useGetGeneInfoQuery } from '@/store/api/mygene';
import { useAppSelector } from '@/store/hook';
import {
  Anchor,
  Badge,
  Box,
  Center,
  Group,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import IconMicroscope from '@tabler/icons-react/dist/esm/icons/IconMicroscope.mjs';

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

const SectionCard = ({ children }: { children: React.ReactNode }) => (
  <Box
    p="sm"
    style={{
      background: 'var(--mantine-color-default)',
      borderRadius: 'var(--mantine-radius-md)',
      border: '1px solid var(--mantine-color-default-border)',
    }}
  >
    {children}
  </Box>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <Text
    size="xs"
    fw={700}
    tt="uppercase"
    c="dimmed"
    mb={6}
    style={{ letterSpacing: '0.06em' }}
  >
    {children}
  </Text>
);

const ProteinDetails = ({ data, ccTerms, uniprotIds }: ProteinDetailsProps) => {
  return (
    <>
      {/* Summary */}
      {data.summary && (
        <SectionCard>
          <SectionLabel>Function</SectionLabel>
          <Text size="sm" style={{ lineHeight: 1.7 }}>
            {data.summary}
          </Text>
        </SectionCard>
      )}

      {/* Subcellular localisation */}
      {ccTerms.length > 0 && (
        <SectionCard>
          <SectionLabel>Subcellular Localisation</SectionLabel>
          <Group gap={6} wrap="wrap">
            {ccTerms.map((term) => (
              <Badge
                key={term.id}
                size="sm"
                variant="dot"
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
        </SectionCard>
      )}

      {/* UniProt links */}
      {uniprotIds.length > 0 && (
        <SectionCard>
          <SectionLabel>UniProt</SectionLabel>
          <Group gap="xs">
            {uniprotIds.map((id) => (
              <Anchor
                key={id}
                href={`https://www.uniprot.org/uniprotkb/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                fw={600}
                c="violet.4"
              >
                {id}
              </Anchor>
            ))}
          </Group>
        </SectionCard>
      )}
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

  const hasAnyData =
    !!data.summary || ccTerms.length > 0 || uniprotIds.length > 0;

  return (
    <ScrollArea h="100%">
      <Stack gap="sm" p="md">
        {/* Gene header card */}
        <Box
          p="sm"
          style={{
            background: 'var(--mantine-color-default)',
            borderRadius: 'var(--mantine-radius-md)',
            border: '1px solid var(--mantine-color-default-border)',
          }}
        >
          <Title order={5}>{data.symbol}</Title>
          {data.name && (
            <Text size="xs" c="dimmed" mt={2}>
              {data.name}
            </Text>
          )}
        </Box>

        {hasAnyData ? (
          <ProteinDetails
            data={data}
            ccTerms={ccTerms}
            uniprotIds={uniprotIds}
          />
        ) : (
          <Box
            p="md"
            style={{
              background: 'var(--mantine-color-default)',
              borderRadius: 'var(--mantine-radius-md)',
              border: '1px solid var(--mantine-color-default-border)',
              textAlign: 'center',
            }}
          >
            <Text size="sm" c="dimmed">
              No protein data available — this may be a non-coding RNA or
              uncharacterised gene.
            </Text>
          </Box>
        )}

        <Text size="xs" c="dimmed" ta="right">
          <Anchor
            href="https://mygene.info"
            target="_blank"
            size="xs"
            c="dimmed"
          >
            mygene.info
          </Anchor>
          {' · '}
          <Anchor
            href="https://www.ebi.ac.uk/QuickGO"
            target="_blank"
            size="xs"
            c="dimmed"
          >
            QuickGO
          </Anchor>
        </Text>
      </Stack>
    </ScrollArea>
  );
}
