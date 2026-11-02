import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import {MOCK_PATIENTS} from '../../utils/mockData';

export interface Patient {
  id: string;
  created_at?: string;
  first_name: string;           
  paternal_last_name: string;  
  maternal_last_name?: string;
  date_of_birth?: string;
  phone?: string;
  email?: string;
  main_condition?: string;
  status: 'Active' | 'In Review' | 'Critical' | 'Discharged';
  user_id?: string;
}

// 2. Create the API
export const patientsApi = createApi({
  reducerPath: 'patientsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['Patient'], 
  endpoints: (builder) => ({    
    // READ: Get all patients
    getPatients: builder.query<Patient[], void>({
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
        return { data: MOCK_PATIENTS }; // Uses mock data
      },
      providesTags: ['Patient'],
    }),

  }),
});

export const { useGetPatientsQuery } = patientsApi;