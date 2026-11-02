import { 
  Users, Calendar, TrendingUp, Activity, 
  MoreHorizontal, ArrowUpRight, ArrowDownRight, Clock, Loader2 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { useNavigate } from 'react-router-dom';

// importing apis
import { useGetAppointmentsQuery } from '../../../services/api/appointmentsApi';
import { useGetPatientsQuery } from '../../../services/api/patientsApi';

// --- Mock data for graphic ---
const chartData = [
  { name: 'Mon', appointments: 12, incomes: 850 },
  { name: 'Tue', appointments: 19, incomes: 1200 },
  { name: 'Wed', appointments: 15, incomes: 980 },
  { name: 'Thu', appointments: 22, incomes: 1500 },
  { name: 'Fri', appointments: 28, incomes: 1900 },
  { name: 'Sat', appointments: 14, incomes: 950 },
  { name: 'Sun', appointments: 8, incomes: 400 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-xl shadow-xl">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">{label}</p>
        <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
          {payload[0].value} Appointments
        </p>
      </div>
    );
  }
  return null;
};

// Diccionario de colores seguros para Tailwind
const colorStyles: Record<string, string> = {
  'bg-emerald-500': 'bg-emerald-500',
  'bg-primary-500': 'bg-primary-500',
  'bg-rose-500': 'bg-rose-500',
  'bg-amber-500': 'bg-amber-500',
};

export default function DashboardView() {
  const navigate = useNavigate();

  // 1. Obtener datos reales del store de Redux
  const { data: patients, isLoading: isLoadingPatients } = useGetPatientsQuery();
  const { data: appointments, isLoading: isLoadingAppointments } = useGetAppointmentsQuery();

  // 2. Calcular métricas dinámicas
  const totalPatients = patients?.length || 0;
  
  const today = new Date();
  const todayAppointments = appointments?.filter(apt => {
    return new Date(apt.start_time).toDateString() === today.toDateString();
  }) || [];

  return (
    <div className="space-y-6">
      
      {/* HEADER DEL DASHBOARD */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Control Panel</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Clinic activity and metrics overview</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Period:</span>
          <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm rounded-lg px-3 py-2 outline-none dark:text-white cursor-pointer hover:border-primary-400 transition-colors">
            <option>Last 7 days</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* FILA 1: TARJETAS DE MÉTRICAS (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Pacientes (Real) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
              {isLoadingPatients ? <Loader2 size={24} className="animate-spin text-slate-300" /> : totalPatients}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Patients</p>
          </div>
        </div>

        {/* KPI 2: Citas de Hoy (Real) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition-transform">
              <Calendar size={24} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
              {isLoadingAppointments ? <Loader2 size={24} className="animate-spin text-slate-300" /> : todayAppointments.length}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Today's Appointments</p>
          </div>
        </div>

        {/* KPI 3: Casos Críticos (Simulado) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl group-hover:scale-110 transition-transform">
              <Activity size={24} />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-md">
              <ArrowDownRight size={14} /> -2%
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">14</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Critical Cases</p>
          </div>
        </div>

        {/* KPI 4: Ingresos (Simulado) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl group-hover:scale-110 transition-transform">
              <TrendingUp size={24} />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">
              <ArrowUpRight size={14} /> +18%
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">$8,450</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Monthly Revenue</p>
          </div>
        </div>

      </div>

      {/* FILA 2: GRÁFICO PRINCIPAL Y AGENDA */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* GRÁFICO */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Consultation Flow</h2>
            <button className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConsultas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '5 5' }} />
                <Area type="monotone" dataKey="appointments" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#colorConsultas)" activeDot={{ r: 6, strokeWidth: 0, fill: '#0ea5e9' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AGENDA DE HOY (Real) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock size={20} className="text-primary-500" /> Today's Schedule
            </h2>
            <span className="bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold min-w-[24px] h-6 px-2 flex items-center justify-center rounded-full">
              {todayAppointments.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {isLoadingAppointments ? (
               <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-400" /></div>
            ) : todayAppointments.length === 0 ? (
               <div className="text-center py-10 text-slate-500 text-sm border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl">
                 No appointments scheduled for today.
               </div>
            ) : (
              <div className="space-y-4">
                {todayAppointments.map((appointment) => {
                  const patientName = appointment.patient ? `${appointment.patient.first_name} ${appointment.patient.paternal_last_name}` : 'Unknown Patient';
                  const initials = appointment.patient ? `${appointment.patient.first_name[0]}${appointment.patient.paternal_last_name[0]}` : 'P';
                  const timeStr = new Date(appointment.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const badgeColor = colorStyles[appointment.color || 'bg-primary-500'] || 'bg-primary-500';

                  return (
                    <div key={appointment.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-100 dark:hover:border-slate-700/50 transition-all cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-sm border border-slate-200 dark:border-slate-700 uppercase">
                          {initials}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {patientName}
                          </h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Clock size={12} /> {timeStr}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-2">
                          {appointment.type}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${badgeColor}`}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button 
            onClick={() => navigate('/appointments')}
            className="w-full mt-4 py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-primary-600 hover:border-primary-200 dark:hover:border-primary-800 dark:hover:text-primary-400 rounded-xl text-sm font-medium transition-colors outline-none cursor-pointer"
          >
           View Full Calendar
          </button>
        </div>

      </div>
    </div>
  );
}