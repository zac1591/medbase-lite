import type { Patient } from '../services/api/patientsApi';
import type { ClinicalNote } from '../services/api/clinicalApi';
import type { Appointment } from '../services/api/appointmentsApi';
import type { ClinicSettings } from '../services/api/settingsApi';
import type { User } from '../features/auth/authSlice';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'pat_01H9Y4X2A',
    created_at: '2025-10-01T10:00:00Z',
    first_name: 'Helena',
    paternal_last_name: 'Doe',
    maternal_last_name: 'Smith',
    date_of_birth: '2000-06-15',
    phone: '+1 (555) 019-2834',
    email: 'helena.doe@example.com',
    main_condition: 'Chronic Migraines',
    status: 'Active',
    user_id: 'user_admin_01'
  },
  {
    id: 'pat_02H9Y5X3B',
    created_at: '2025-10-15T14:30:00Z',
    first_name: 'Marcus',
    paternal_last_name: 'Aurelius',
    date_of_birth: '1975-04-26',
    phone: '+1 (555) 928-1122',
    main_condition: 'Hypertension',
    status: 'In Review',
    user_id: 'user_admin_01'
  },
  {
    id: 'pat_03H9Y6X4C',
    created_at: '2025-10-20T09:15:00Z',
    first_name: 'Sarah',
    paternal_last_name: 'Connor',
    maternal_last_name: 'Reese',
    date_of_birth: '1984-08-29',
    phone: '+1 (555) 334-9988',
    email: 's.connor@example.com',
    main_condition: 'Lower Back Pain',
    status: 'Active',
    user_id: 'user_admin_01'
  }
];

export const MOCK_NOTES: ClinicalNote[] = [
  {
    id: 'note_01',
    patient_id: 'pat_01H9Y4X2A',
    created_at: new Date().toISOString(),
    user_id: 'user_admin_01',
    blood_pressure: '118/75',
    heart_rate: '72',
    weight: '62.5',
    temperature: '36.8',
    subjective: 'Patient reports severe headaches persisting for 3 days. Sensitivity to light and nausea.',
    objective: 'Neurological exam normal. No neck stiffness.',
    assessment: 'Acute Migraine Episode',
    plan: 'Prescribed Sumatriptan. Recommended dark room rest and increased hydration.',
    prescriptions: [
      {
        id: 'rx_01',
        patient_id: 'pat_01H9Y4X2A',
        note_id: 'note_01',
        medication: 'Sumatriptan',
        dosage: '50mg',
        frequency: 'As needed (Max 200mg/day)',
        duration: '3 days'
      }
    ]
  },
  {
    id: 'note_02',
    patient_id: 'pat_02H9Y5X3B',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(), // Hace 5 días
    user_id: 'user_admin_01',
    blood_pressure: '145/90',
    heart_rate: '88',
    weight: '85.0',
    temperature: '37.1',
    subjective: 'Routine checkup. Occasional dizziness in the mornings.',
    objective: 'BP elevated. Heart rhythm regular.',
    assessment: 'Uncontrolled Hypertension',
    plan: 'Adjusted Lisinopril dosage. Requested follow-up in 2 weeks.',
    prescriptions: [
      {
        id: 'rx_02',
        patient_id: 'pat_02H9Y5X3B',
        note_id: 'note_02',
        medication: 'Lisinopril',
        dosage: '20mg',
        frequency: 'Once daily',
        duration: '30 days'
      }
    ]
  }
];


export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-001",
    created_at: "2026-10-28T09:15:00Z",
    patient_id: "patient-101",
    user_id: "user-1",
    start_time: "2026-11-03T09:00:00Z",
    end_time: "2026-11-03T09:30:00Z",
    title: "Initial consultation",
    type: "consultation",
    mode: "in-person",
    status: "scheduled",
    notes: "Review patient history.",
    color: "#4F46E5",
  },
  {
    id: "apt-002",
    patient_id: "patient-102",
    start_time: "2026-11-03T10:00:00Z",
    end_time: "2026-11-03T10:45:00Z",
    title: "Follow-up appointment",
    type: "follow-up",
    mode: "video",
    status: "confirmed",
    notes: "Discuss progress and next steps.",
    color: "#059669",
  },
  {
    id: "apt-003",
    created_at: "2026-10-29T14:30:00Z",
    patient_id: "patient-103",
    start_time: "2026-11-04T13:30:00Z",
    end_time: "2026-11-04T14:00:00Z",
    title: "Routine check-up",
    type: "check-up",
    mode: "in-person",
    status: "scheduled",
    color: "#D97706",
  },
];

export const MOCK_CLINIC_SETTINGS: ClinicSettings = {
    id: "clinic-settings-001",
    created_at: "2026-10-28T09:00:00Z",
    updated_at: "2026-10-30T15:30:00Z",
    user_id: "user-1",
    doctor_name: "Dr. Maya Chen",
    specialty: "Family Medicine",
    medical_license: "MD-123456",
    clinic_name: "Willow Creek Family Clinic",
    clinic_email: "hello@willowcreekclinic.example",
    clinic_phone: "+1-555-014-2030",
    clinic_address: "245 Willow Creek Road, Suite 3, Portland, OR 97205",
    logo_url: "/images/willow-creek-logo.png",
  }

  export const MOCK_USER: User = {
    id: 'USER-ID-YMPUTH',
    email: 'mockuser@example.com',
    fullName: 'John Doe',
    role: 'doctor',
    avatarUrl: '/public/user.png', 
  }

