import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {MOCK_NOTES} from '../../utils/mockData';

export interface Prescription {
  id: string;
  created_at?: string;
  patient_id: string;
  note_id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration?: string;
}

export interface ClinicalNote {
  id: string;
  created_at?: string;
  patient_id: string;
  user_id?: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  blood_pressure?: string;
  heart_rate?: string;
  weight?: string;
  temperature?: string;
  prescriptions?: Prescription[]; 
}

// 2. Redux API creation
export const clinicalApi = createApi({
  reducerPath: 'clinicalApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['ClinicalNote'], 
  endpoints: (builder) => ({
    getClinicalNotesByPatient: builder.query<ClinicalNote[], string>({
      queryFn: async (patientId) => {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
       const notes = MOCK_NOTES.filter(note => note.patient_id === patientId);
        return { data: notes };
      },
      // We associate the cache to the patient ID
      providesTags: ['ClinicalNote'],
    }),

  }),
});

export const { 
  useGetClinicalNotesByPatientQuery } = clinicalApi;