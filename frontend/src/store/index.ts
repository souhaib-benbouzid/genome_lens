import { configureStore } from '@reduxjs/toolkit';
import { genomeLensApi } from './api/genomelens';
import genesReducer from './genesSlice';

export const store = configureStore({
  reducer: {
    genes: genesReducer,
    [genomeLensApi.reducerPath]: genomeLensApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(genomeLensApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
