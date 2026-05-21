import { useGetGenesQuery } from '@/store/api/genomelens';
import { setOffset } from '@/store/genesSlice';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import type { Gene } from '@/types/gene';
import { useCallback, useEffect, useRef, useState } from 'react';

const PAGE_SIZE = 50;

export function useGeneRows() {
  const dispatch = useAppDispatch();
  const { offset, sorting, filters } = useAppSelector((s) => s.genes);
  const [rows, setRows] = useState<Gene[]>([]);

  const sort = sorting[0];
  // Identifies the current query shape (everything except offset).
  // When this changes, the accumulated rows must be reset.
  const pageKey = `${filters.search}|${filters.biotype}|${filters.chromosome}|${sort?.id}|${sort?.desc}`;
  const prevPageKey = useRef(pageKey);
  const lastAppendedOffset = useRef(-1);

  const { data, isFetching, isLoading } = useGetGenesQuery({
    offset,
    limit: PAGE_SIZE,
    sorting,
    search: filters.search,
    biotype: filters.biotype,
    chromosome: filters.chromosome,
  });

  // Accumulate pages; reset when query shape changes
  useEffect(() => {
    if (!data?.items || isFetching) return;

    if (prevPageKey.current !== pageKey) {
      // Filter or sort changed — start fresh
      prevPageKey.current = pageKey;
      lastAppendedOffset.current = offset;
      setRows(data.items);
    } else if (lastAppendedOffset.current !== offset) {
      // Same query, new page — append (deduplicate by id)
      lastAppendedOffset.current = offset;
      setRows((prev) => {
        const seen = new Set(prev.map((g) => g.id));
        return [...prev, ...data.items.filter((g) => !seen.has(g.id))];
      });
    }
  }, [data, isFetching, offset, pageKey]);

  // Mutex: prevents multiple setOffset dispatches per scroll burst
  const loadingMoreRef = useRef(false);
  useEffect(() => {
    if (!isFetching) loadingMoreRef.current = false;
  }, [isFetching]);

  const onTableScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 250;
      const hasMore = data?.has_more ?? false;
      if (nearBottom && hasMore && !isFetching && !loadingMoreRef.current) {
        loadingMoreRef.current = true;
        dispatch(setOffset(offset + PAGE_SIZE));
      }
    },
    [data?.has_more, isFetching, offset, dispatch],
  );

  return {
    rows,
    total: data?.total ?? 0,
    hasMore: data?.has_more ?? false,
    isLoading,
    isFetching,
    onTableScroll,
  };
}
