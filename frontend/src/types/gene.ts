export interface Gene {
  id: number;
  ensembl_id: string;
  gene_symbol: string | null;
  name: string | null;
  biotype: string | null;
  chromosome: string | null;
  seq_region_start: number | null;
  seq_region_end: number | null;
}

export type SortableColumn =
  | 'ensembl_id'
  | 'gene_symbol'
  | 'name'
  | 'biotype'
  | 'chromosome'
  | 'seq_region_start'
  | 'seq_region_end';

export interface FilterParams {
  search: string;
  biotype: string | null;
  chromosome: string | null;
}

export interface GeneQueryParams extends FilterParams {
  sortBy: SortableColumn;
  order: 'asc' | 'desc';
  offset: number;
  limit: number;
}

export type SortOrder = 'asc' | 'desc';

export type ActiveTab =
  | 'genomic'
  | 'expression'
  | 'protein'
  | 'differential'
  | 'external-links';

export interface ExpressionPoint {
  tissue: string;
  median_tpm: number;
}

/** The /genes/{id}/expression endpoint returns a list. */
export type ExpressionPointResponse = ExpressionPoint[];

export interface DifferentialQueryParams {
  genA: string;
  genB: string;
}

export interface DifferentialResultResponse {
  gene_a: string;
  gene_b: string;
  log2_fold_change: number;
  p_value: number;
  p_adj: number;
  significant: boolean;
}

export interface VirtualizedResponse<T> {
  items: T[];
  total: number;
  offset: number;
  limit: number;
  has_more: boolean;
}

export type BiotypesResponse = string[];

export type ChromosomesResponse = string[];
