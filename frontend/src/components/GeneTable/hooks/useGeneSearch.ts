import { setFilters } from '@/store/genesSlice';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { useDebouncedValue } from '@mantine/hooks';
import { useEffect, useState } from 'react';

export function useGeneSearch() {
  const dispatch = useAppDispatch();
  const initialSearch = useAppSelector((s) => s.genes.filters.search);
  const [rawSearch, setRawSearch] = useState(initialSearch);
  const [debouncedSearch] = useDebouncedValue(rawSearch, 300);

  useEffect(() => {
    dispatch(setFilters({ search: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  return { rawSearch, setRawSearch };
}
