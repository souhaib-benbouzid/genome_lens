import { setSorting } from '@/store/genesSlice';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { SortingState } from '@/types/gene';

export function useGeneSorting() {
  const dispatch = useAppDispatch();
  const sorting = useAppSelector((s) => s.genes.sorting);

  const onSortingChange = (
    updater: SortingState | ((prev: SortingState) => SortingState),
  ) => {
    const next = typeof updater === 'function' ? updater(sorting) : updater;
    dispatch(setSorting(next));
  };

  return { onSortingChange };
}
