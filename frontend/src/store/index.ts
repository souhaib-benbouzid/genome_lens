import { configureStore } from '@reduxjs/toolkit';
import { genomeLensApi } from './api/genomelens';
import { mygeneApi } from './api/mygene';
import genesReducer from './genesSlice';

export const store = configureStore({
  reducer: {
    genes: genesReducer,
    [genomeLensApi.reducerPath]: genomeLensApi.reducer,
    [mygeneApi.reducerPath]: mygeneApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(genomeLensApi.middleware)
      .concat(mygeneApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
