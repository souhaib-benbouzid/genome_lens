import { useAppSelector } from '@/store/hook';
import { Center, Text, useMantineColorScheme } from '@mantine/core';
import type { GoslingRef, GoslingSpec } from 'gosling.js';
import { GoslingComponent } from 'gosling.js';
import { useEffect, useRef } from 'react';
import { GoslingErrorBoundary } from './GoslingErrorBoundary';

function normalizeChromosome(input: string | undefined): string | undefined {
  if (!input) return input;
  if (input === 'M T') return 'MT';
  return input.trim();
}

const SPEC: GoslingSpec = {
  assembly: 'hg38',
  layout: 'linear',
  // Start with a broad chr1 view so the track is visible before any selection.
  xDomain: { chromosome: 'chr1' },
  tracks: [
    {
      id: 'gene-track',
      alignment: 'overlay',
      data: {
        url: 'https://server.gosling-lang.org/api/v1/tileset_info/?d=gene-annotation',
        type: 'beddb',
        genomicFields: [
          { index: 1, name: 'start' },
          { index: 2, name: 'end' },
        ],
        valueFields: [
          { index: 5, name: 'strand', type: 'nominal' },
          { index: 3, name: 'name', type: 'nominal' },
        ],
        exonIntervalFields: [
          { index: 12, name: 'start' },
          { index: 13, name: 'end' },
        ],
      },
      tracks: [
        {
          dataTransform: [
            { type: 'filter', field: 'type', oneOf: ['gene'] },
            { type: 'filter', field: 'strand', oneOf: ['+'] },
          ],
          mark: 'triangleRight',
          x: { field: 'end', type: 'genomic', axis: 'top' },
          size: { value: 15 },
        },
        {
          dataTransform: [{ type: 'filter', field: 'type', oneOf: ['gene'] }],
          mark: 'text',
          text: { field: 'name', type: 'nominal' },
          x: { field: 'start', type: 'genomic' },
          xe: { field: 'end', type: 'genomic' },
          style: { dy: -15 },
        },
        {
          dataTransform: [
            { type: 'filter', field: 'type', oneOf: ['gene'] },
            { type: 'filter', field: 'strand', oneOf: ['-'] },
          ],
          mark: 'triangleLeft',
          x: { field: 'start', type: 'genomic' },
          size: { value: 15 },
          style: { align: 'right' },
        },
        {
          dataTransform: [{ type: 'filter', field: 'type', oneOf: ['exon'] }],
          mark: 'rect',
          x: { field: 'start', type: 'genomic' },
          xe: { field: 'end', type: 'genomic' },
          size: { value: 15 },
        },
        {
          dataTransform: [
            { type: 'filter', field: 'type', oneOf: ['gene'] },
            { type: 'filter', field: 'strand', oneOf: ['+'] },
          ],
          mark: 'rule',
          x: { field: 'start', type: 'genomic' },
          xe: { field: 'end', type: 'genomic' },
          strokeWidth: { value: 3 },
          style: { linePattern: { type: 'triangleRight', size: 5 } },
        },
        {
          dataTransform: [
            { type: 'filter', field: 'type', oneOf: ['gene'] },
            { type: 'filter', field: 'strand', oneOf: ['-'] },
          ],
          mark: 'rule',
          x: { field: 'start', type: 'genomic' },
          xe: { field: 'end', type: 'genomic' },
          strokeWidth: { value: 3 },
          style: { linePattern: { type: 'triangleLeft', size: 5 } },
        },
      ],
      row: { field: 'strand', type: 'nominal', domain: ['+', '-'] },
      color: {
        field: 'strand',
        type: 'nominal',
        domain: ['+', '-'],
        range: ['#7585FF', '#FF8A85'],
      },
      visibility: [
        {
          operation: 'less-than',
          measure: 'width',
          threshold: '|xe-x|',
          transitionPadding: 10,
          target: 'mark',
        },
      ],
      opacity: { value: 0.8 },
      width: 800,
      height: 140,
    },
  ],
};

export function GenomicTab() {
  const selectedGene = useAppSelector((s) => s.genes.selectedGene);
  const gosRef = useRef<GoslingRef>(null);
  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    const { chromosome, seq_region_start, seq_region_end } = selectedGene ?? {};
    if (!chromosome || seq_region_start == null || seq_region_end == null)
      return;

    // Gosling expects 'chrN:start-end'. The DB stores chromosome as '1', 'X', etc.
    const position = `chr${normalizeChromosome(chromosome)}:${seq_region_start}-${seq_region_end}`;

    const timer = setTimeout(() => {
      gosRef.current?.api.zoomTo('gene-track', position, 2000, 800);
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedGene]);

  return (
    <div style={{ padding: '18px', height: '100%', overflow: 'auto' }}>
      <GoslingErrorBoundary>
        <GoslingComponent
          ref={gosRef}
          spec={SPEC}
          padding={0}
          margin={0}
          theme={colorScheme === 'dark' ? 'dark' : 'light'}
        />
      </GoslingErrorBoundary>
      {!selectedGene && (
        <Center mt="xs">
          <Text size="xs">
            Select a gene in the table to zoom to its locus.
          </Text>
        </Center>
      )}
    </div>
  );
}
