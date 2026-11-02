import { useState, useEffect } from 'react';
import { 
  User, Building, Save, Mail, Phone, MapPin, 
  Award, Loader2, Globe, Shield
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast'; // Importamos el toast para el Freemium Hook
import { useGetSettingsQuery } from '../../../services/api/settingsApi';

// 1. Validation schemas separated by tabs
const profileSchema = z.object({
  doctor_name: z.string().min(3, 'Name must be at least 3 characters'),
  specialty: z.string().min(2, 'Specialty is required'),
  medical_license: z.string().min(3, 'License/registration number is required'),
});

const clinicSchema = z.object({
  clinic_name: z.string().min(2, 'Clinic name is required'),
  clinic_email: z.string().email('Invalid email format').or(z.literal('')),
  clinic_phone: z.string().min(6, 'Invalid phone number').or(z.literal('')),
  clinic_address: z.string().min(5, 'Address must be more specific').or(z.literal('')),
  logo_url: z.string().url('Must be a valid URL').or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type ClinicFormValues = z.infer<typeof clinicSchema>;

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState<'profile' | 'clinic' | 'security'>('profile');
  
  // Simulated Loading State for Freemium Hook
  const [isSimulating, setIsSimulating] = useState(false);

  // 2. Connect Redux/Supabase Endpoints (Only GET in Lite Version)
  const { data: settings, isLoading: isLoadingSettings } = useGetSettingsQuery();

  // 3. Initialize independent forms
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { doctor_name: '', specialty: '', medical_license: '' }
  });

  const clinicForm = useForm<ClinicFormValues>({
    resolver: zodResolver(clinicSchema),
    defaultValues: { clinic_name: '', clinic_email: '', clinic_phone: '', clinic_address: '', logo_url: '' }
  });

  // 4. Sync database data when the query responds
  useEffect(() => {
    if (settings) {
      profileForm.reset({
        doctor_name: settings.doctor_name || '',
        specialty: settings.specialty || '',
        medical_license: settings.medical_license || '',
      });
      clinicForm.reset({
        clinic_name: settings.clinic_name || '',
        clinic_email: settings.clinic_email || '',
        clinic_phone: settings.clinic_phone || '',
        clinic_address: settings.clinic_address || '',
        logo_url: settings.logo_url || '',
      });
    }
  }, [settings, profileForm, clinicForm]);

  // 5. Unified submit handler (Freemium Hook instead of Mutate)
  const handleFreemiumSubmit = () => {
    setIsSimulating(true);

    setTimeout(() => {
      setIsSimulating(false);
      
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white dark:bg-slate-800 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 dark:ring-white/10 p-4 border-l-4 border-primary-500`}>
          <div className="flex-1 w-0 p-2">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5 text-2xl">🚀</div>
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
            <button onClick={() => toast.dismiss(t.id)} className="w-full flex items-center justify-center text-sm font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Close
            </button>
          </div>
        </div>
      ), { duration: 6000 });
      
    }, 700);
  };

  if (isLoadingSettings) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="animate-spin h-8 w-8 mb-4 text-primary-500" />
        Loading global settings...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto relative">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage the details of your professional account and the visual identity of the clinic.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        
        {/* LATERAL NAVIGATION MENU */}
        <div className="w-full md:w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3 flex flex-col gap-1 shrink-0 shadow-sm">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
          >
            <User size={18} />
            Professional Profile
          </button>
          <button
            onClick={() => setActiveTab('clinic')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'clinic' ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
          >
            <Building size={18} />
            Clinic Information
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
          >
            <Shield size={18} />
            Security and Access
          </button>
        </div>

        {/* DYNAMIC CONTENT AREA */}
        <div className="flex-1 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          
          {/* TAB: PROFESSIONAL PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={profileForm.handleSubmit(handleFreemiumSubmit)} className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Professional Profile</h3>
                <p className="text-sm text-slate-400">This information will appear at the bottom of your digital signatures and clinical documents.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input {...profileForm.register('doctor_name')} type="text" placeholder="Eg. Dr. Isaac Alexander" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none dark:text-white" />
                  </div>
                  {profileForm.formState.errors.doctor_name && <p className="text-xs text-rose-500 mt-1">{profileForm.formState.errors.doctor_name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Medical Specialty</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input {...profileForm.register('specialty')} type="text" placeholder="Eg. General Medicine / Holistic" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none dark:text-white" />
                  </div>
                  {profileForm.formState.errors.specialty && <p className="text-xs text-rose-500 mt-1">{profileForm.formState.errors.specialty.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Medical License Number / Board Registration</label>
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input {...profileForm.register('medical_license')} type="text" placeholder="Eg. JVPM 14325" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none dark:text-white" />
                  </div>
                  {profileForm.formState.errors.medical_license && <p className="text-xs text-rose-500 mt-1">{profileForm.formState.errors.medical_license.message}</p>}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="submit" disabled={isSimulating} className="px-6 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70">
                  {isSimulating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Save Profile
                </button>
              </div>
            </form>
          )}

          {/* TAB: CLINIC INFORMATION */}
          {activeTab === 'clinic' && (
            <form onSubmit={clinicForm.handleSubmit(handleFreemiumSubmit)} className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Clinic Information</h3>
                <p className="text-sm text-slate-400">Configure the identity of the center for members and issuance of printed prescriptions.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Clinic Name</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input {...clinicForm.register('clinic_name')} type="text" placeholder="Eg. Medical Clinic San Salvador" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none dark:text-white" />
                  </div>
                  {clinicForm.formState.errors.clinic_name && <p className="text-xs text-rose-500 mt-1">{clinicForm.formState.errors.clinic_name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input {...clinicForm.register('clinic_email')} type="email" placeholder="contacto@tuclinica.com" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none dark:text-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fixed Phone / Appointment Center</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input {...clinicForm.register('clinic_phone')} type="tel" placeholder="+503 2200-0000" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none dark:text-white" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Physical Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <textarea {...clinicForm.register('clinic_address')} rows={2} placeholder="Colonia Escalón, Paseo General Escalón..." className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none resize-none dark:text-white" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Logo URL (White Label)</label>
                  <input {...clinicForm.register('logo_url')} type="text" placeholder="https://your-storage.com/logo.png" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none dark:text-white" />
                  <p className="text-[11px] text-slate-400 mt-1">Insert a direct link to your logo (transparent PNG recommended). It will be automatically embedded in the print formats.</p>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="submit" disabled={isSimulating} className="px-6 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70">
                  {isSimulating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Save Details
                </button>
              </div>
            </form>
          )}

          {/* TAB: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Security and Access</h3>
                <p className="text-sm text-slate-400">Standard security options and credential control.</p>
              </div>

              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                  <input type="password" disabled className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm opacity-60 dark:text-white cursor-not-allowed" placeholder="••••••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                  <input type="password" disabled className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm opacity-60 dark:text-white cursor-not-allowed" placeholder="••••••••••••" />
                </div>
                <p className="text-xs text-slate-400 border-l-2 border-primary-500 pl-2">The direct credential change is reserved for the production SaaS version integrated with Supabase Auth UI.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}