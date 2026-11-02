import { useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, User, FileText, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAddAppointmentMutation } from '../../../services/api/appointmentsApi';
import { useGetPatientsQuery } from '../../../services/api/patientsApi';

// 1. Validation Schema
const appointmentSchema = z.object({
  patient_id: z.string().min(1, 'Select a patient'),
  title: z.string().min(3, 'Reason is required'),
  date: z.string().min(1, 'Select a date'),
  time: z.string().min(1, 'Select a time'),
  duration: z.number().min(15), 
  type: z.enum(['Consultation', 'Procedure', 'Emergency']),
  mode: z.enum(['In-Person', 'Video Call']),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewAppointmentModal({ isOpen, onClose }: NewAppointmentModalProps) {
  // 2. Connect APIs
  const { data: patients, isLoading: isLoadingPatients } = useGetPatientsQuery();
  const [addAppointment, { isLoading: isAdding }] = useAddAppointmentMutation();

  // 3. Configure Form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      duration: 30, // 30 minutes by default
      type: 'Consultation',
      mode: 'In-Person'
    }
  });

  useEffect(() => {
    if (!isOpen) {
      reset()
    };
    
  }, [isOpen, reset]);

  // 4. Transform data and submit
  const onSubmit = async (data: AppointmentFormValues) => {
    try {
      // UX Magic: Calculate exact start_time and end_time from date, time, and duration
      const startDateTime = new Date(`${data.date}T${data.time}`);
      const endDateTime = new Date(startDateTime.getTime() + data.duration * 60000);

      // Assign dynamic color based on type
      const colorMap = {
        'Consultation': 'bg-emerald-500',
        'Procedure': 'bg-primary-500',
        'Emergency': 'bg-rose-500'
      };

      await addAppointment({
        patient_id: data.patient_id,
        title: data.title,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        type: data.type,
        mode: data.mode,
        status: 'Scheduled',
        color: colorMap[data.type]
      }).unwrap();
      onClose(); // Close modal on success

    } catch (err) {
      console.error('Error scheduling appointment:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Schedule New Appointment</h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors outline-none">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto">
            <form id="appointment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Patient */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Patient</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select {...register('patient_id')} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none dark:text-white appearance-none">
                    <option value="">Select a patient...</option>
                    {!isLoadingPatients && patients?.map(p => (
                      <option key={p.id} value={p.id}>{p.paternal_last_name}, {p.first_name}</option>
                    ))}
                  </select>
                </div>
                {errors.patient_id && <p className="text-xs text-rose-500 mt-1">{errors.patient_id.message}</p>}
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reason (Title)</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input {...register('title')} type="text" placeholder="e.g. Annual Checkup" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none dark:text-white" />
                </div>
                {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>}
              </div>

              {/* Date, Time and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input {...register('date')} type="date" className="w-full pl-10 pr-2 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none text-slate-600 dark:text-slate-300" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input {...register('time')} type="time" className="w-full pl-10 pr-2 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none text-slate-600 dark:text-slate-300" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duration</label>
                  <select {...register('duration', { valueAsNumber: true })} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none dark:text-white">
                    <option value="15">15 min</option>
                    <option value="30">30 min</option>
                    <option value="45">45 min</option>
                    <option value="60">1 hour</option>
                  </select>
                </div>
              </div>

              {/* Type and Mode */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Appointment Type</label>
                  <select {...register('type')} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none dark:text-white">
                    <option value="Consultation">General Consultation</option>
                    <option value="Procedure">Procedure</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mode</label>
                  <select {...register('mode')} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none dark:text-white">
                    <option value="In-Person">In-Person</option>
                    <option value="Video Call">Video Call</option>
                  </select>
                </div>
              </div>

            </form>
          </div>

          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
            <button type="button" onClick={onClose} disabled={isAdding} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" form="appointment-form" disabled={isAdding} className="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
              {isAdding ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Confirm Appointment'}
            </button>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}