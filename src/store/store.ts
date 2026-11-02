import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { authApi } from '../services/api/authApi';
import { patientsApi } from '../services/api/patientsApi';
import { clinicalApi } from '../services/api/clinicalApi';
import { appointmentsApi } from '../services/api/appointmentsApi';
import { settingsApi } from '../services/api/settingsApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [patientsApi.reducerPath]: patientsApi.reducer,
    [clinicalApi.reducerPath]: clinicalApi.reducer,
    [appointmentsApi.reducerPath]: appointmentsApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(authApi.middleware)
    .concat(patientsApi.middleware)
    .concat(clinicalApi.middleware)
    .concat(appointmentsApi.middleware)
    .concat(settingsApi.middleware),
    
});

// global types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;