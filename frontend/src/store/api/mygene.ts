import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────

export interface GoTerm {
  id: string; // e.g. "GO:0005886"
  term: string; // e.g. "plasma membrane"
}

export interface GeneInfo {
  _id: string;
  symbol: string;
  name: string | null;
  summary: string | null;
  /** Cellular component GO terms — subcellular localisation */
  go?: {
    CC?: GoTerm | GoTerm[];
  };
  uniprot?: {
    'Swiss-Prot'?: string | string[];
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// API slice
// ──────────────────────────────────────────────────────────────────────────────

export const mygeneApi = createApi({
  reducerPath: 'mygeneApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://mygene.info/v3' }),
  keepUnusedDataFor: 5 * 60,
  endpoints: (builder) => ({
    getGeneInfo: builder.query<GeneInfo | null, string>({
      query: (symbol) => ({
        url: '/query',
        params: {
          q: `symbol:${symbol}`,
          species: 'human',
          fields: 'symbol,name,summary,go.CC,uniprot',
          size: 1,
        },
      }),
      // mygene.info wraps results in { hits: [...] }
      transformResponse: (raw: { hits: GeneInfo[] }) => raw.hits[0] ?? null,
    }),
  }),
});

export const { useGetGeneInfoQuery } = mygeneApi;
