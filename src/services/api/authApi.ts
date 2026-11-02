import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { User } from '../../features/auth/authSlice';
import { MOCK_USER } from '../../utils/mockData';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({baseUrl: '/'}),
  endpoints: (builder) => ({
    login: builder.mutation<User, { email: string; password: string }>({
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return { data: MOCK_USER }
        
      },
    }),
    logout: builder.mutation<null, void>({
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return { data: null };
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
