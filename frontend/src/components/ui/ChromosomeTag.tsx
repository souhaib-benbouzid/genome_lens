import { Box, Text } from '@mantine/core';
import * as React from 'react';

export type ChromosomeTagProps = {
  chromosome: string;
};

// One distinct color per chromosome for quick visual identification
const CHROMOSOME_COLORS: Record<string, string> = {
  '1': '#e63946',
  '2': '#f4501c',
  '3': '#fb8500',
  '4': '#f4a300',
  '5': '#d4b000',
  '6': '#8cb800',
  '7': '#2dc653',
  '8': '#00b4a0',
  '9': '#0096c7',
  '10': '#0077b6',
  '11': '#023e8a',
  '12': '#3a0ca3',
  '13': '#7209b7',
  '14': '#b5179e',
  '15': '#d62876',
  '16': '#e05c5c',
  '17': '#c77d3a',
  '18': '#6d9e3f',
  '19': '#2a9d8f',
  '20': '#457b9d',
  '21': '#1d3557',
  '22': '#6a4c93',
  X: '#e76f51',
  Y: '#264653',
  MT: '#2f4858',
  default: '#868e96',
};

const ChromosomeTag: React.FC<ChromosomeTagProps> = React.memo(
  ({ chromosome }) => {
    const color = CHROMOSOME_COLORS[chromosome] ?? CHROMOSOME_COLORS.default;

    return (
      <Box
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: 'inherit',
        }}
      >
        {/* Colored rectangle swatch */}
        <Box
          style={{
            width: 8,
            height: 18,
            borderRadius: 2,
            backgroundColor: color,
            flexShrink: 0,
          }}
        />
        <Text fz="xs" fw={500}>
          chr{chromosome}
        </Text>
      </Box>
    );
  },
);

export default ChromosomeTag;
