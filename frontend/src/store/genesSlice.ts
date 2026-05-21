import { ActiveTab, FilterParams, Gene, SortingState } from '@/types/gene';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GenesState {
  selectedGene: Gene | null;
  offset: number;
  limit: number;
  sorting: SortingState;
  activeTab: ActiveTab;
  filters: FilterParams;
}

const initialState: GenesState = {
  selectedGene: null,
  offset: 0,
  limit: 50,
  sorting: [{ id: 'gene_symbol', desc: true }],
  activeTab: 'genomic',
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
      state.offset = 0;
    },

    setOffset(state, action: PayloadAction<number>) {
      state.offset = action.payload;
    },

    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
      state.offset = 0;
    },

    setSorting(state, action: PayloadAction<SortingState>) {
      state.sorting = action.payload;
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
  setSorting,
} = genesSlice.actions;

export default genesSlice.reducer;
