import {
  ActiveTab,
  FilterParams,
  Gene,
  SortableColumn,
  SortOrder,
} from '@/types/gene';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GenesState {
  selectedGene: Gene | null;
  offset: number;
  limit: number;
  sortBy: SortableColumn;
  activeTab: ActiveTab;
  order: SortOrder;
  filters: FilterParams;
}

const initialState: GenesState = {
  selectedGene: null,
  offset: 0,
  limit: 50,
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
  initialState,
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
      // Reset to the first window whenever filters change
      state.offset = 0;
    },

    setOffset(state, action: PayloadAction<number>) {
      state.offset = action.payload;
    },

    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
      state.offset = 0;
    },

    setSort(
      state,
      action: PayloadAction<{
        sortBy: SortableColumn;
        order: SortOrder;
      }>,
    ) {
      state.sortBy = action.payload.sortBy;
      state.order = action.payload.order;
      // Reset to the first window whenever sort changes
      state.offset = 0;
    },
  },
});

export const {
  setActiveTab,
  setSelectedGene,
  setFilters,
  setOffset,
  setLimit,
  setSort,
} = genesSlice.actions;

export default genesSlice.reducer;
