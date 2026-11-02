import { useEffect, useState } from 'react';
import { X, User, Calendar, Phone, Mail, Activity, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast'; // Importamos el toast
import type { Patient } from '../../../services/api/patientsApi';

// 1. Zod Schema
const patientSchema = z.object({
  first_name: z.string().min(2, 'First name is required (min. 2 characters)'),
  paternal_last_name: z.string().min(2, 'Paternal last name is required (min. 2 characters)'),
  maternal_last_name: z.string().optional(),
  date_of_birth: z.string().optional(),
  phone: z.string().optional(),
  email: z.email('Invalid email format').optional().or(z.literal('')),
  status: z.enum(['Active', 'In Review', 'Critical', 'Discharged'], {
    message: 'Status is required',
  }),
  main_condition: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

// 2. New Props accepting initialData
interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Patient | null; // Null or undefined = Creation mode; With data = Edit mode
}

export default function PatientModal({ isOpen, onClose, initialData }: PatientModalProps) {
  // 3. Simulated Loading State (For Freemium Hook)
  const [isSimulating, setIsSimulating] = useState(false);
  
  const isEditing = !!initialData;

  // 4. Configure the form with dynamic defaultValues
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: initialData || {status: 'Active'}, // Default status for new patients
  });

  // 5. Sync form values whenever the modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({});
      }
    }
  }, [isOpen, initialData, reset]);

  // 6. Unified handler (Create vs Update) - FREEMIUM HOOK
  const onSubmit = async (data: PatientFormValues) => {
    setIsSimulating(true);

    // Simulamos latencia de red para mostrar el spinner y enamorar con la UI
    setTimeout(() => {
      setIsSimulating(false);
      
      // EL GANCHO DE VENTA ELEGANTE CON TOAST CUSTOMIZADO
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white dark:bg-slate-800 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 dark:ring-white/10 p-4 border-l-4 border-primary-500`}>
          <div className="flex-1 w-0 p-2">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5 text-2xl">
                🚀
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Pro Feature
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Advanced database mutations, strict validation, and Supabase syncing are only available in <strong className="text-slate-700 dark:text-slate-200">MedBase Pro</strong>.
                </p>
                <div className="mt-4">
                  <a href="https://medbase.tech" target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors">
                    Upgrade today at medbase.tech &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="flex border-l border-slate-100 dark:border-slate-700/50 pl-4 ml-4">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full flex items-center justify-center text-sm font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      ), { duration: 6000 });
      
      onClose(); // Cerramos el modal después de mostrar el anuncio
    }, 700);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* DYNAMIC HEADER */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl">
                <User size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {isEditing ? 'Edit Record' : 'Create New Record'}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors outline-none"
            >
              <X size={20} />
            </button>
          </div>

          {/* FORM  */}
          <div className="p-6 overflow-y-auto">
            <form id="patient-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Section 1: Identity */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider">Identity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Names</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input 
                        {...register('first_name')}
                        type="text" 
                        placeholder="Ej. Elena María"
                        className={`w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border ${errors.first_name ? 'border-alert-critical' : 'border-slate-200 dark:border-slate-700'} rounded-lg text-sm outline-none transition-all dark:text-white`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Paternal Last Name</label>
                    <input 
                      {...register('paternal_last_name')}
                      type="text" 
                      className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border ${errors.paternal_last_name ? 'border-alert-critical' : 'border-slate-200 dark:border-slate-700'} rounded-lg text-sm outline-none transition-all dark:text-white`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Maternal Last Name</label>
                    <input 
                      {...register('maternal_last_name')}
                      type="text" 
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none transition-all dark:text-white"
                    />
                  </div>
                  <div className="md:col-span-2 mt-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input 
                        {...register('date_of_birth')}
                        type="date" 
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none transition-all text-slate-600 dark:text-slate-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

          
              
              <div className="h-px bg-slate-100 dark:bg-slate-800 w-full my-4"></div>
              
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider">Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input {...register('phone')} type="tel" className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input {...register('email')} type="email" className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white outline-none" />
                    </div>
                  </div>
                  {/* Status Field */}
                  <div className="flex flex-col space-y-1">
                    <label htmlFor="status" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Patient Status
                    </label>
                    <select
                      id="status"
                      {...register('status')}
                      className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm text-slate-700 dark:text-slate-200 appearance-none"
                    >
                      <option value="Active">Active</option>
                      <option value="In Review">In Review</option>
                      <option value="Critical">Critical</option>
                      <option value="Discharged">Discharged</option>
                    </select>
                    {/* Opcional: Icono de flecha para el select si quieres un look más custom */}
                    {errors.status && (
                      <span className="text-xs text-rose-500 mt-1">{errors.status.message?.toString()}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-800 w-full my-4"></div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Main Reason / Condition</label>
                <div className="relative">
                  <Activity className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <textarea {...register('main_condition')} rows={3} className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm resize-none dark:text-white outline-none" />
                </div>
              </div>

            </form>
          </div>

          {/* DYNAMIC FOOTER */}
          <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
            <button 
              type="button"
              onClick={onClose}
              disabled={isSimulating}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              form="patient-form" 
              disabled={isSimulating}
              className="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {isSimulating ? (
                <><Loader2 size={16} className="animate-spin" /> Saving...</>
              ) : (
                isEditing ? 'Save Changes' : 'Create File'
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}