import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../services/api/authApi';

// 1. Type Definitions (TypeScript)
export type UserRole = 'admin' | 'doctor' | 'receptionist' | 'patient';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// 2. Initial State
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Starts as true to verify the session when the app loads
  error: null
};

// 3. Slice Creation
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous reducers (when session is recovered from App.tsx)
    setSession: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  },
  // Handling RTK Query states
  extraReducers: (builder) => {
    builder
      // When the RTK Query login is successful
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = payload;
      })
      // When the RTK Query logout is successful
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setSession, logout, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;