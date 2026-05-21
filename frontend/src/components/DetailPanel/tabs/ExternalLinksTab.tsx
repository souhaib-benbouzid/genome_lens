import { useAppSelector } from '@/store/hook';
import { Anchor, Box, Divider, Group, Stack, Text } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { useMemo } from 'react';

export function ExternalLinksTab() {
  const gene = useAppSelector((s) => s.genes.selectedGene)!;
  const id = gene.ensembl_id;
  const sym = gene.gene_symbol;

  const links: { label: string; href: string; desc: string }[] = useMemo(() => {
    return [
      {
        label: 'Ensembl',
        href: `https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=${id}`,
        desc: 'Gene summary, transcripts, regulation',
      },
      {
        label: 'NCBI Gene',
        href: `https://www.ncbi.nlm.nih.gov/gene?term=${sym ?? id}[sym]`,
        desc: 'NCBI gene page',
      },
      {
        label: 'UniProt',
        href: `https://www.uniprot.org/uniprotkb?query=${sym ?? id}+AND+organism_id:9606`,
        desc: 'Protein function, structure',
      },
      {
        label: 'GTEx',
        href: `https://gtexportal.org/home/gene/${sym ?? id}`,
        desc: 'Tissue-specific expression',
      },
      {
        label: 'GeneCards',
        href: `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${sym ?? id}`,
        desc: 'Comprehensive gene database',
      },
      {
        label: 'Open Targets',
        href: `https://platform.opentargets.org/target/${id}`,
        desc: 'Drug targets, disease associations',
      },
    ];
  }, [id, sym]);

  return (
    <Stack gap={0} p="md">
      {links.map((link, i) => (
        <Box key={link.label}>
          {i > 0 && <Divider />}
          <Group justify="space-between" py="sm" wrap="nowrap">
            <Anchor
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              size="xs"
            >
              <Box>
                <Text size="sm" fw={500}>
                  {link.label}
                </Text>
                <Text size="xs" c="dimmed">
                  {link.desc}
                </Text>
              </Box>

              <IconExternalLink size={14} />
            </Anchor>
          </Group>
        </Box>
      ))}
    </Stack>
  );
}
