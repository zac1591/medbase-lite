import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { MOCK_CLINIC_SETTINGS } from '../../utils/mockData';

export interface ClinicSettings {
  id?: string;
  created_at?: string;
  updated_at?: string;
  user_id: string;
  doctor_name: string;
  specialty: string;
  medical_license: string;
  clinic_name: string;
  clinic_email: string;
  clinic_phone: string;
  clinic_address: string;
  logo_url?: string;
}

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['Settings'],
  endpoints: (builder) => ({
    
    // READ: Get the current user's settings
    getSettings: builder.query<ClinicSettings | null, void>({
      queryFn: async () => {
        await new Promise(response => setTimeout(response, 800));
        return {data: MOCK_CLINIC_SETTINGS}
      },
      providesTags: ['Settings'],
    }),
  }),
});

export const { useGetSettingsQuery } = settingsApi;