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

export interface FilterParams {
  search: string;
  biotype: string | null;
  chromosome: string | null;
}

export interface GeneQueryParams extends FilterParams {
  sortBy: Omit<keyof Gene, 'id'>;
  order: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

export type SortOrder = 'asc' | 'desc';

export type ActiveTab =
  | 'genomic'
  | 'expression'
  | 'protein'
  | 'differential'
  | 'external-links';

export interface ExpressionPointResponse {
  tissue: string;
  median_tpm: number;
}

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

export interface PagedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export type BiotypesResponse = string[];

export type ChromosomesResponse = string[];
