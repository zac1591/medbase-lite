import { useState } from 'react';
import { Activity, ArrowLeft, Clock, Plus, Printer, Save, 
  FileText, Pill, ChevronDown, Loader2, Search, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import { 
  useGetClinicalNotesByPatientQuery 
} from '../../../services/api/clinicalApi';
import { useGetPatientsQuery } from '../../../services/api/patientsApi';

// New appointments form fields interface
interface ConsultationForm {
  blood_pressure: string;
  heart_rate: string;
  weight: string;
  temperature: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  prescriptions: {
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
}

export default function ClinicalView() {
  const [activeTab, setActiveTab] = useState<'history' | 'new'>('history');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // 1. Fetch patients (initial selector)
  const { data: patients, isLoading: isLoadingPatients } = useGetPatientsQuery();
  
  // 2. Fetch the selected patient's history
  const { 
    data: notes, 
    isLoading: isLoadingNotes 
  } = useGetClinicalNotesByPatientQuery(selectedPatientId || '', {
    skip: !selectedPatientId, // does not execute the query if no patient is selected
  });

  // 3. Simulated Loading State
  const [isSimulating, setIsSimulating] = useState(false);

  // 4. Form (React Hook Form)
  const { register, control, handleSubmit, reset } = useForm<ConsultationForm>({
    defaultValues: {
      blood_pressure: '', heart_rate: '', weight: '', temperature: '',
      subjective: '', objective: '', assessment: '', plan: '',
      prescriptions: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prescriptions"
  });

  // Auxiliary functions
  const selectedPatient = patients?.find(p => p.id === selectedPatientId);
  const calculateAge = (dob?: string) => {
    if (!dob) return '--';
    const age_dt = new Date(Date.now() - new Date(dob).getTime());
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  };

 // Handler for saving the consultation
  const onSubmit = async (data: ConsultationForm) => {
    if (!selectedPatientId) return;

    setIsSimulating(true);

    // simulating latency/delay
    setTimeout(() => {
      setIsSimulating(false);
      
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
      
    }, 700);
  };

  const handlePrint = () => {
    window.print();
  };

  // --- View: patient selection ---
  if (!selectedPatientId) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
          <Search size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Select a patient</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md text-center">
          To start a consultation or view the clinical record, please select a patient from the directory.
        </p>
        
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden">
          {isLoadingPatients ? (
            <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary-500" /></div>
          ) : (
            <div className="max-h-75 overflow-y-auto">
              {patients?.map(patient => (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatientId(patient.id)}
                  className="w-full text-left px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center justify-between transition-colors group"
                >
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{patient.paternal_last_name}, {patient.first_name}</p>
                    <p className="text-xs text-slate-500">{calculateAge(patient.date_of_birth)} years • {patient.id.substring(0,8)}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-300 group-hover:text-primary-500 -rotate-90 transition-colors" />
                </button>
              ))}
              {(!patients || patients.length === 0) && (
                <div className="p-6 text-center text-slate-500 text-sm">
                  No patient found. Go to the Patients module to create one.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  const latestNote = notes?.[0];

  // --- VISTA: EXPEDIENTE CLÍNICO ---
  return (
    // modified: original = flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]
    <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-8rem)] pb-24 lg:pb-0">
      
      {/* PANEL IZQUIERDO */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6 hide-on-print">
        <button 
          onClick={() => setSelectedPatientId(null)}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors w-fit outline-none"
        >
          <ArrowLeft size={16} />
          Back to patient selection
        </button>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden shrink-0">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary-500 to-primary-600 opacity-10"></div>
          
          {/* <button 
            className="absolute top-4 right-4 text-xs font-medium text-slate-500 hover:text-primary-600 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded-md backdrop-blur-sm transition-colors"
          >
            Change
          </button> */}

          <div className="relative z-10 flex flex-col items-center text-center mt-4">
            <div className="h-20 w-20 rounded-full bg-primary-100 dark:bg-primary-900/50 border-4 border-white dark:border-slate-900 flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold text-2xl shadow-sm mb-3 uppercase">
              {selectedPatient?.first_name.charAt(0)}{selectedPatient?.paternal_last_name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {selectedPatient?.first_name} {selectedPatient?.paternal_last_name}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {calculateAge(selectedPatient?.date_of_birth)} years • {selectedPatient?.main_condition || 'No main condition'}
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Phone</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedPatient?.phone || '--'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Allergies</span>
              <span className="font-medium text-slate-400 text-xs">Not registered</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Activity size={16} className="text-primary-500" /> Vital Signs
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
              <p className="text-xs text-slate-500 mb-1">Blood Pressure</p>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{latestNote?.blood_pressure || '--/--'} <span className="text-xs font-normal text-slate-400">mmHg</span></p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
              <p className="text-xs text-slate-500 mb-1">Heart Rate</p>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{latestNote?.heart_rate || '--'} <span className="text-xs font-normal text-slate-400">bpm</span></p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
              <p className="text-xs text-slate-500 mb-1">Weight</p>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{latestNote?.weight || '--'} <span className="text-xs font-normal text-slate-400">kg</span></p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
              <p className="text-xs text-slate-500 mb-1">Temperature</p>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{latestNote?.temperature || '--'} <span className="text-xs font-normal text-slate-400">°C</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* PANEL DERECHO */}
      {/* original: w-full lg:w-2/3 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden print:w-full print:border-none print:shadow-none */}
      <div className="w-full lg:w-2/3 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm lg:overflow-hidden print:w-full print:border-none print:shadow-none">
        
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-4 shrink-0 hide-on-print">
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-4 px-4 text-sm font-medium transition-colors relative ${activeTab === 'history' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <div className="flex items-center gap-2"><Clock size={16} /> Clinical History</div>
            {activeTab === 'history' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`pb-4 px-4 text-sm font-medium transition-colors relative ${activeTab === 'new' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <div className="flex items-center gap-2"><Plus size={16} /> New Consultation</div>
            {activeTab === 'new' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-500" />
            )}
          </button>
        </div>
        {/* original: flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-900/20 print:p-0 print:bg-white print:text-black */}
        <div className="flex-1 lg:overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-900/20 print:p-0 print:bg-white print:text-black">
          <AnimatePresence mode="wait">
            
            {activeTab === 'history' && (
              <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-3xl mx-auto">
                {isLoadingNotes ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Loader2 className="animate-spin h-8 w-8 mb-4 text-primary-500" />
                    Loading file...
                  </div>
                ) : !notes || notes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
                      <FileText size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">No previous consultations</h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-sm">This patient has no registered history. Go to "New Consultation".</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {notes.map((note) => (
                      <div key={note.id} className="relative pl-8 pb-4 group">
                        <div className="absolute left-[11px] top-2 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 group-last:hidden"></div>
                        <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full border-4 border-slate-50 dark:border-slate-900 bg-primary-500 shadow-sm transition-transform group-hover:scale-110"></div>
                        
                        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <Clock size={14} />
                              {new Date(note.created_at || '').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                            </div>
                            <button onClick={handlePrint} className="text-primary-600 hover:bg-primary-50 p-1.5 rounded-lg transition-colors hide-on-print">
                              <Printer size={16} />
                            </button>
                          </div>
                          
                          <h4 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
                            Assessment: {note.assessment || 'No diagnosis registered'}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                            <span className="font-medium block text-xs text-slate-400 uppercase mb-1">Subjective (Referee)</span>
                            {note.subjective || '--'}
                          </p>

                          {note.prescriptions && note.prescriptions.length > 0 && (
                            <div className="mt-4 border-t border-slate-100 dark:border-slate-700 pt-4">
                              <p className="text-xs font-semibold text-slate-400 uppercase mb-3 flex items-center gap-2">
                                <Pill size={12} /> Prescribed Treatment
                              </p>
                              <div className="grid gap-2">
                                {note.prescriptions.map(rx => (
                                  <div key={rx.id} className="flex justify-between items-center text-sm bg-primary-50/50 dark:bg-primary-900/10 p-2.5 rounded-lg border border-primary-100 dark:border-primary-900/30">
                                    <span className="font-medium text-slate-800 dark:text-slate-200">{rx.medication} <span className="text-slate-500 font-normal">({rx.dosage})</span></span>
                                    <span className="text-slate-600 dark:text-slate-400 text-xs">{rx.frequency} for {rx.duration}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'new' && (
              <motion.div key="nueva" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <form id="soap-form" onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-8">
                  
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                      <FileText size={20} className="text-primary-500" /> Clinical Evaluation (SOAP)
                    </h3>

                    {/* Campos de Signos Vitales */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700/60">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Blood Pressure (TA)</label>
                        <input {...register('blood_pressure')} placeholder="120/80" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none dark:text-white" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Heart Rate (bpm)</label>
                        <input {...register('heart_rate')} placeholder="72" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none dark:text-white" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Weight (kg)</label>
                        <input {...register('weight')} placeholder="75.5" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none dark:text-white" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Temperature (°C)</label>
                        <input {...register('temperature')} placeholder="36.5" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none dark:text-white" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                          Subjective <span className="font-normal text-slate-400 text-xs">(Symptoms)</span>
                        </label>
                        <textarea {...register('subjective')} rows={4} className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none resize-none dark:text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                          Objective <span className="font-normal text-slate-400 text-xs">(Physical Exam)</span>
                        </label>
                        <textarea {...register('objective')} rows={4} className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none resize-none dark:text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                          Assessment <span className="font-normal text-slate-400 text-xs">(Diagnosis)</span>
                        </label>
                        <textarea {...register('assessment')} rows={3} className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none resize-none dark:text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                          Plan <span className="font-normal text-slate-400 text-xs">(Actions)</span>
                        </label>
                        <textarea {...register('plan')} rows={3} className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none resize-none dark:text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Pill size={20} className="text-primary-500" /> Prescripción
                      </h3>
                      <button type="button" onClick={() => append({ medication: '', dosage: '', frequency: '', duration: '' })} className="text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                        <Plus size={16} /> Add Medication
                      </button>
                    </div>

                    {fields.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-xl">
                        No medication prescribed yet.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {fields.map((field, index) => (
                          <div key={field.id} className="flex flex-wrap md:flex-nowrap gap-3 items-start bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 relative group">
                            <div className="flex-1 min-w-[200px]">
                              <input {...register(`prescriptions.${index}.medication`)} placeholder="Medication (eg. Paracetamol)" className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none dark:text-white" />
                            </div>
                            <div className="w-[120px]">
                              <input {...register(`prescriptions.${index}.dosage`)} placeholder="Dosage (500mg)" className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none dark:text-white" />
                            </div>
                            <div className="flex-1 min-w-[150px]">
                              <input {...register(`prescriptions.${index}.frequency`)} placeholder="Each (8 hours)" className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none dark:text-white" />
                            </div>
                            <div className="w-[120px]">
                              <input {...register(`prescriptions.${index}.duration`)} placeholder="For (5 days)" className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none dark:text-white" />
                            </div>
                            <button type="button" onClick={() => remove(index)} className="p-2.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors">
                              <X size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={() => setActiveTab('history')} className="px-6 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                      Discard
                    </button>
                    <button type="submit" disabled={isSimulating} className="px-6 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70">
                      {isSimulating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      Save Consultation
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
      
      {/* Estilos CSS Específicos para Impresión (Print-friendly CSS) */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white !important; color: black !important; }
          .hide-on-print { display: none !important; }
          .print\\:w-full { width: 100% !important; }
          .print\\:border-none { border: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:bg-white { background-color: white !important; }
          .print\\:text-black { color: black !important; }
          * { background-color: transparent !important; color: black !important; }
        }
      `}} />
    </div>
  );
}