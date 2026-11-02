import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Activity, Mail, Lock, ArrowRight } from 'lucide-react';
import { useLoginMutation } from '../../../services/api/authApi';

import dashScreenshot from '../../../assets/medical-sass-dash.png';


// 1. Validation Schema Definition (Zod)
// This ensures the user enters correct data before touching the backend
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Email\'s format is invalid'),
  password: z.string().min(6, 'Password must contain at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginView() {
  
  const navigate = useNavigate();
  const [login, { isLoading, error: loginError }] = useLoginMutation();

  // 2. React Hook Form Initialization
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'demo@medbase.tech',
      password: 'demo1234',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // We use the RTK Query hook
      await login({ email: data.email, password: data.password }).unwrap();

      // If everything goes well, the Supabase session propagates and Redux is updated
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const isFormDisabled = isSubmitting || isLoading;

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-slate-900">
      
      {/* LEFT SIDE: Auth form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32">
        <div className="w-full max-w-sm mx-auto">
          
          {/* Branding */}
          <div className="flex items-center gap-2 text-primary-600 mb-10">
            <Activity className="h-8 w-8 stroke-[2.5]" />
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Med<span className="text-primary-500">Base</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Enter your credentials to access the dashboard.</p>

          {loginError ? (
            <div className="mb-4 p-3 bg-alert-critical/10 border border-alert-critical/20 rounded-lg text-sm text-alert-critical">
              {typeof loginError === 'string' 
                ? loginError 
                : String((loginError as any).data || 'Error al iniciar sesión. Verifica tus credenciales.')}
            </div>
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  className={`block w-full pl-10 pr-3 py-2.5 border bg-white dark:bg-slate-800 dark:text-white ${
                    errors.email ? 'border-alert-critical focus:ring-alert-critical' : 'border-slate-200 dark:border-slate-700 focus:ring-primary-500 focus:border-primary-500'
                  } rounded-lg text-sm transition-colors outline-none focus:ring-2 focus:ring-opacity-20`}
                  placeholder="demo@medbase.tech"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-alert-critical">{errors.email.message}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                  ¿Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  {...register('password')}
                  type="password"
                  className={`block w-full pl-10 pr-3 py-2.5 border bg-white dark:bg-slate-800 dark:text-white ${
                    errors.password ? 'border-alert-critical focus:ring-alert-critical' : 'border-slate-200 dark:border-slate-700 focus:ring-primary-500 focus:border-primary-500'
                  } rounded-lg text-sm transition-colors outline-none focus:ring-2 focus:ring-opacity-20`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-alert-critical">{errors.password.message}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isFormDisabled}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {isFormDisabled ? 'Verifying...' : 'Sign In'}
              {!isFormDisabled && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Note for buyers */}
          <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              <strong>Note for buyers:</strong> This is a demo login. You can use the pre-filled credentials to login or test a random account to check validation errors.
            </p>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE: Image / Pattern (only visible on large screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-50 dark:bg-slate-800/20 border-l border-slate-200 dark:border-slate-800 items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative dribbble circles background */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        
        <div className="relative z-10 max-w-lg text-center">
          <div className="w-full h-80 bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-center p-6 mb-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="w-full h-full border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl flex items-center justify-center">
               <img src={dashScreenshot} alt="Dashboard Screenshot" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">Simplified Clinical Management</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            A complete and modern dashboard designed to optimize the time of doctors and administrators.
          </p>
        </div>
      </div>
      
    </div>
  );
}