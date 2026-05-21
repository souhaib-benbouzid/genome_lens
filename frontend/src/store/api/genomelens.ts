import {
  BiotypesResponse,
  ChromosomesResponse,
  DifferentialQueryParams,
  DifferentialResultResponse,
  ExpressionPointResponse,
  Gene,
  GeneQueryParams,
  VirtualizedResponse,
} from '@/types/gene';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const genomeLensApi = createApi({
  reducerPath: 'genomeLensApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
  }),
  keepUnusedDataFor: 60,
  endpoints: (builder) => ({
    getGenes: builder.query<VirtualizedResponse<Gene>, GeneQueryParams>({
      query: ({ limit, offset, sorting, biotype, chromosome, search }) => {
        const sort = sorting[0];
        return {
          url: '/genes',
          params: {
            limit,
            offset,
            sort_by: sort?.id ?? 'gene_symbol',
            order: sort ? (sort.desc ? 'desc' : 'asc') : 'asc',
            ...(search && { search }),
            ...(biotype && { biotype }),
            ...(chromosome && { chromosome }),
          },
        };
      },
    }),
    getGeneByEnsemblId: builder.query<Gene, string>({
      query: (ensemblId) => `/genes/${ensemblId}`,
    }),

    getBiotypes: builder.query<BiotypesResponse, void>({
      query: () => '/genes/meta/biotypes',
      keepUnusedDataFor: 60 * 60,
    }),
    getChromosomes: builder.query<ChromosomesResponse, void>({
      query: () => '/genes/meta/chromosomes',
      keepUnusedDataFor: 60 * 60,
    }),

    getGeneExpression: builder.query<ExpressionPointResponse, string>({
      query: (ensemblId) => `/genes/${ensemblId}/expression`,
      keepUnusedDataFor: 5 * 60,
    }),

    getGeneDifferential: builder.query<
      DifferentialResultResponse,
      DifferentialQueryParams
    >({
      keepUnusedDataFor: 5 * 60,
      query: ({ genA, genB }) => ({
        url: `/genes/differential`,
        params: { gene_a: genA, gene_b: genB },
      }),
    }),
  }),
});

export const {
  useGetGenesQuery,
  useGetGeneByEnsemblIdQuery,
  useGetBiotypesQuery,
  useGetChromosomesQuery,
  useGetGeneExpressionQuery,
  useGetGeneDifferentialQuery,
} = genomeLensApi;
