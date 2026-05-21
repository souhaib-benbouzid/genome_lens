import { Badge } from '@mantine/core';
import * as React from 'react';

export type BiotypeTagProps = {
  biotype: string;
};

// Colors chosen for clear visual distinction and WCAG AA contrast on white text
const BIO_TYPE_COLORS: Record<string, string> = {
  // Coding
  'Protein Coding': '#1971c2', // deep blue

  // Pseudogenes — warm reds/oranges
  Pseudogene: '#c0392b',
  'Processed Pseudogene': '#e74c3c',
  'Unprocessed Pseudogene': '#e67e22',
  'Polymorphic Pseudogene': '#d35400',
  'Unitary Pseudogene': '#a93226',
  'Transcribed Processed Pseudogene': '#cb4335',
  'Transcribed Unitary Pseudogene': '#ba4a00',
  'Transcribed Unprocessed Pseudogene': '#af601a',

  // Long non-coding RNAs — purples
  'Linc R N A': '#7d3c98',
  Antisense: '#6c3483',
  'Bidirectional Promoter Lnc R N A': '#9b59b6',
  'Macro Lnc R N A': '#8e44ad',
  'Sense Intronic': '#76448a',
  'Sense Overlapping': '#5b2c6f',
  'Prime Overlapping Nc R N A': '#a569bd',

  // Small non-coding RNAs — teals/cyans
  'Mi R N A': '#0e6655',
  'Sn R N A': '#148f77',
  'Sno R N A': '#1a9874',
  'R R N A': '#117a65',
  'Mt R R N A': '#0d6b55',
  'Mt T R N A': '#0b5345',
  'Misc R N A': '#1abc9c',
  'Vault R N A': '#16a085',
  'S R N A': '#138d75',
  'Sc R N A': '#0a7d6a',
  'Sca R N A': '#0e8672',

  // IG genes — blues
  'I G C Gene': '#1a5276',
  'I G C Pseudogene': '#1f618d',
  'I G D Gene': '#2471a3',
  'I G J Gene': '#2980b9',
  'I G J Pseudogene': '#1f6fa8',
  'I G Pseudogene': '#1a6898',
  'I G V Gene': '#21618c',
  'I G V Pseudogene': '#154360',

  // TR genes — greens
  'T R C Gene': '#1d6a3a',
  'T R D Gene': '#1e8449',
  'T R J Gene': '#27ae60',
  'T R J Pseudogene': '#239b56',
  'T R V Gene': '#196f3d',
  'T R V Pseudogene': '#117a3e',

  // Other
  'Non Coding': '#5d6d7e',
  'Processed Transcript': '#2e86c1',
  Ribozyme: '#d4870a',
  'T E C': '#7b241c',
  'Macro Lnc R N A (duplicate)': '#8e44ad',

  default: '#5d6d7e',
};

const BiotypeTag: React.FC<BiotypeTagProps> = React.memo(({ biotype }) => {
  const backgroundColor = BIO_TYPE_COLORS[biotype] || BIO_TYPE_COLORS.default;

  return (
    <Badge
      color={backgroundColor}
      variant="filled"
      radius="sm"
      size="xs"
      style={{ color: 'white' }}
    >
      {biotype}
    </Badge>
  );
});

export default BiotypeTag;
