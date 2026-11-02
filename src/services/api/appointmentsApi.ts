import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Patient } from './patientsApi';

import { MOCK_APPOINTMENTS } from '../../utils/mockData';

export interface Appointment {
  id: string;
  created_at?: string;
  patient_id: string;
  user_id?: string;
  start_time: string;
  end_time: string;
  title: string;
  type: string;
  mode: string;
  status: string;
  notes?: string;
  color?: string;
  patient?: Patient; 
}

export const appointmentsApi = createApi({
  reducerPath: 'appointmentsApi',
  baseQuery: fetchBaseQuery({baseUrl: '/'}),
  tagTypes: ['Appointment'],
  endpoints: (builder) => ({
    
    getAppointments: builder.query<Appointment[], { startDate?: string; endDate?: string } | void>({
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return { data: MOCK_APPOINTMENTS }
      },
      providesTags: ['Appointment'],
    }),

  }),
});

export const { 
  useGetAppointmentsQuery
} = appointmentsApi;