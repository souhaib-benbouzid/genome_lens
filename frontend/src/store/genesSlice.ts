import { ActiveTab, FilterParams, Gene, SortOrder } from '@/types/gene';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface initialState {
  selectedGene: Gene | null;
  page: number;
  pageSize: number;
  sortBy: Omit<keyof Gene, 'id'>;
  activeTab: ActiveTab;
  order: SortOrder;
  filters: FilterParams;
}

const initialState: initialState = {
  selectedGene: null,
  page: 1,
  pageSize: 20,
  sortBy: 'gene_symbol',
  activeTab: 'genomic',
  order: 'asc',
  filters: {
    search: '',
    biotype: null,
    chromosome: null,
  },
};

const genesSlice = createSlice({
  name: 'genes',
  initialState: initialState,
  reducers: {
    setSelectedGene(state, action: PayloadAction<Gene | null>) {
      state.selectedGene = action.payload;
      state.activeTab = 'genomic';
    },

    setActiveTab(state, action: PayloadAction<ActiveTab>) {
      state.activeTab = action.payload;
    },

    setFilters(state, action: PayloadAction<Partial<FilterParams>>) {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
    },

    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      state.page = 1;
    },

    setSort(
      state,
      action: PayloadAction<{
        sortBy: Omit<keyof Gene, 'id'>;
        order: SortOrder;
      }>,
    ) {
      state.sortBy = action.payload.sortBy;
      state.order = action.payload.order;
      state.page = 1;
    },
  },
});

export const {
  setActiveTab,
  setSelectedGene,
  setFilters,
  setPage,
  setPageSize,
  setSort,
} = genesSlice.actions;

export default genesSlice.reducer;
