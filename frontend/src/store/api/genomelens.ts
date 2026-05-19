import {
  BiotypesResponse,
  ChromosomesResponse,
  DifferentialQueryParams,
  DifferentialResultResponse,
  ExpressionPointResponse,
  Gene,
  GeneQueryParams,
  PagedResponse,
} from '@/types/gene';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const genomeLensApi = createApi({
  reducerPath: 'genomeLensApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
  }),
  keepUnusedDataFor: 60,
  endpoints: (builder) => ({
    getGenes: builder.query<PagedResponse<Gene>, GeneQueryParams>({
      query: ({
        page,
        pageSize,
        sortBy,
        order,
        biotype,
        chromosome,
        search,
      }) => ({
        url: '/genes',
        params: {
          page,
          page_size: pageSize,
          sort_by: sortBy,
          order,
          ...(search && { search }),
          ...(biotype && { biotype }),
          ...(chromosome && { chromosome }),
        },
      }),
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
