import logo from '@/assets/favicon-512x512.png';
import { setActiveTab } from '@/store/genesSlice';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { ActiveTab, Gene } from '@/types/gene';
import {
  Badge,
  Box,
  Center,
  Group,
  Stack,
  Tabs,
  Text,
  Title,
} from '@mantine/core';
import {
  IconActivity,
  IconDna,
  IconExternalLink,
  IconFlask,
  IconMicroscope,
} from '@tabler/icons-react';
import { useMemo } from 'react';
import { DifferentialTab } from './tabs/DifferentialTab';
import { ExpressionTab } from './tabs/ExpressionTab';
import { ExternalLinksTab } from './tabs/ExternalLinksTab';
import { GenomicTab } from './tabs/GenomicTab';
import { ProteinTab } from './tabs/ProteinTab';
interface TabHeader {
  value: ActiveTab;
  label: string;
  icon: React.ReactNode;
}

interface TabItem {
  value: ActiveTab;
  Component: React.ReactNode;
}

function EmptyState() {
  return (
    <Center h="100%" p="xl">
      <Stack align="center" gap="xs">
        <img src={logo} alt="Empty state" width={48} />
        <Text ta="center" size="sm">
          Select a gene from the list
          <br />
          to view details
        </Text>
      </Stack>
    </Center>
  );
}

export function Header({ selectedGene }: { selectedGene: Gene }) {
  return (
    <Box
      px="md"
      pt="md"
      pb="sm"
      style={{
        borderBottom: '1px solid var(--mantine-color-dark-6)',
        borderLeft: '3px solid var(--mantine-color-violet-5)',
      }}
    >
      <Group gap="xs" align="center" wrap="nowrap">
        <Title order={4} lineClamp={1} style={{ flex: 1 }}>
          {selectedGene.gene_symbol ?? selectedGene.ensembl_id}
        </Title>
        {selectedGene.biotype && (
          <Badge
            size="xs"
            variant="light"
            color="violet"
            radius="sm"
            style={{ flexShrink: 0 }}
          >
            {selectedGene.biotype}
          </Badge>
        )}
      </Group>
      <Text size="xs" c="dimmed" truncate mt={2}>
        {selectedGene.ensembl_id}
        {selectedGene.chromosome && (
          <Text span c="dark.3">
            {' '}
            · chr{selectedGene.chromosome}
          </Text>
        )}
        {selectedGene.name && <Text span> · {selectedGene.name}</Text>}
      </Text>
    </Box>
  );
}

export function DetailPanel() {
  const selectedGene = useAppSelector((s) => s.genes.selectedGene);
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((s) => s.genes.activeTab);

  const tabHeaders: TabHeader[] = useMemo(
    () => [
      { value: 'genomic', label: 'Genomic', icon: <IconDna size={14} /> },
      {
        value: 'expression',
        label: 'Expression',
        icon: <IconActivity size={14} />,
      },
      {
        value: 'protein',
        label: 'Protein',
        icon: <IconMicroscope size={14} />,
      },
      {
        value: 'differential',
        label: 'Differential',
        icon: <IconFlask size={14} />,
      },
      {
        value: 'external-links',
        label: 'Links',
        icon: <IconExternalLink size={14} />,
      },
    ],
    [],
  );

  const tabItems: TabItem[] = useMemo(
    () => [
      { value: 'genomic', Component: <GenomicTab /> },
      { value: 'expression', Component: <ExpressionTab /> },
      { value: 'protein', Component: <ProteinTab /> },
      { value: 'differential', Component: <DifferentialTab /> },
      { value: 'external-links', Component: <ExternalLinksTab /> },
    ],
    [],
  );

  if (!selectedGene) {
    return <EmptyState />;
  }

  return (
    <Stack gap={0} h="100%" style={{ overflow: 'hidden' }}>
      <Header selectedGene={selectedGene} />

      <Tabs
        value={activeTab}
        onChange={(val) => val && dispatch(setActiveTab(val as ActiveTab))}
        style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Tabs.List px="md">
          {tabHeaders.map((t) => (
            <Tabs.Tab
              key={t.value}
              value={t.value}
              leftSection={t.icon}
              fz="xs"
              px="xs"
            >
              {t.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        <Box style={{ flex: 1, overflow: 'auto' }}>
          {tabItems.map((item) => (
            <Tabs.Panel key={item.value} value={item.value}>
              {item.Component}
            </Tabs.Panel>
          ))}
        </Box>
      </Tabs>
    </Stack>
  );
}
