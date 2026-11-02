import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, FileText, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Fake Data for the Lite Version
const MOCK_APPOINTMENTS = [
  { id: '1', time: '09:00 AM', patient: 'Helena Doe', type: 'First Consultation', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', duration: 2 },
  { id: '2', time: '11:30 AM', patient: 'Marcus Aurelius', type: 'Follow up', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', duration: 1 },
  { id: '3', time: '02:00 PM', patient: 'Sarah Connor', type: 'Therapy', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', duration: 3 },
];

const TIME_SLOTS = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', 
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', 
  '04:00 PM', '05:00 PM'
];

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleFreemiumHook = () => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white dark:bg-slate-800 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 dark:ring-white/10 p-4 border-l-4 border-primary-500`}>
        <div className="flex-1 w-0 p-2">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5 text-2xl">🚀</div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Pro Feature: Interactive Calendar
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Advanced Drag & Drop scheduling, conflict resolution, and real-time database syncing are only available in <strong className="text-slate-700 dark:text-slate-200">MedBase Pro</strong>.
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
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
      
      {/* HEADER */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-xl">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Daily Schedule</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 shadow-sm">
            <button onClick={handleFreemiumHook} className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"><ChevronLeft size={20} /></button>
            <span className="px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Today</span>
            <button onClick={handleFreemiumHook} className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"><ChevronRight size={20} /></button>
          </div>
          <button onClick={handleFreemiumHook} className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all flex items-center gap-2">
            <Lock size={16} /> New Appointment
          </button>
        </div>
      </div>

      {/* STATIC CALENDAR GRID */}
      <div className="flex-1 overflow-y-auto bg-slate-50/30 dark:bg-slate-900/10 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-800 overflow-hidden shadow-sm">
            
            {/* Grid Lines & Time Slots */}
            {TIME_SLOTS.map((time, index) => (
              <div key={time} className="flex border-b border-slate-100 dark:border-slate-700/50 last:border-none min-h-[80px]">
                <div className="w-24 shrink-0 flex items-start justify-end pr-4 py-3 border-r border-slate-100 dark:border-slate-700/50">
                  <span className="text-xs font-medium text-slate-400">{time}</span>
                </div>
                <div 
                  className="flex-1 relative cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors"
                  onClick={handleFreemiumHook}
                >
                  {/* Render Fake Appointments matching the time slot */}
                  {MOCK_APPOINTMENTS.map((apt) => {
                    if (apt.time === time) {
                      return (
                        <motion.div 
                          key={apt.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`absolute top-2 left-2 right-2 rounded-xl p-3 shadow-sm border border-white/20 dark:border-slate-800/50 ${apt.color}`}
                          style={{ height: `calc(${apt.duration * 80}px - 16px)`, zIndex: 10 }}
                          onClick={(e) => { e.stopPropagation(); handleFreemiumHook(); }}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-bold text-sm line-clamp-1">{apt.patient}</h4>
                              <p className="text-xs opacity-80 mt-0.5 flex items-center gap-1">
                                <FileText size={12} /> {apt.type}
                              </p>
                            </div>
                            <span className="text-[10px] font-semibold opacity-75 bg-black/5 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Clock size={10} /> {apt.time}
                            </span>
                          </div>
                        </motion.div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}