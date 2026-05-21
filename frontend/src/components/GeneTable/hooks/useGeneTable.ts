import {
  useGetBiotypesQuery,
  useGetChromosomesQuery,
} from '@/store/api/genomelens';
import { useAppSelector } from '@/store/hook';
import { useGeneRows } from './useGeneRows';
import { useGeneSearch } from './useGeneSearch';
import { useGeneSorting } from './useGeneSorting';

export function useGeneTable() {
  const { sorting, filters, selectedGene } = useAppSelector((s) => s.genes);

  const { rawSearch, setRawSearch } = useGeneSearch();
  const { onSortingChange } = useGeneSorting();
  const { rows, total, hasMore, isLoading, isFetching, onTableScroll } =
    useGeneRows();

  const { data: biotypes = [] } = useGetBiotypesQuery();
  const { data: chromosomes = [] } = useGetChromosomesQuery();

  return {
    rows,
    total,
    hasMore,
    isLoading,
    isFetching,
    sorting,
    onSortingChange,
    filters,
    rawSearch,
    setRawSearch,
    biotypes,
    chromosomes,
    selectedGene,
    onTableScroll,
  };
}
