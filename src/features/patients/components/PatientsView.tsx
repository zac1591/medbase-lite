import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  UserPlus,
  Loader2,
  AlertCircle,
  Edit2,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import PatientModal from './PatientModal';
import { useGetPatientsQuery } from '../../../services/api/patientsApi';
import type { Patient } from '../../../services/api/patientsApi';

export default function PatientsView() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);
  
  // 3. Simulated Loading State (For Freemium Hook)
  const [isSimulating, setIsSimulating] = useState(false);

  // Closes dropdown when scrolling or background is clicked
  useEffect(() => {
    const closeDropdown = () => setActiveDropdown(null);
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  // 1. Fetching real data from RTK Query (Simulated via Mock Data in Lite version)
  const { data: patients, isLoading, isError, refetch } = useGetPatientsQuery();

  // 2. Auxiliary function to render status badges with colors
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">Active</span>;
      case 'In Review':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">In Review</span>;
      case 'Critical':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800">Critical</span>;
      case 'Discharged':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">Discharged</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  const calculateAge = (dob?: string) => {
    if (!dob) return '--';
    const diff_ms = Date.now() - new Date(dob).getTime();
    const age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  };

  const formatShortId = (uuid: string) => {
    return `P-${uuid.substring(0, 6).toUpperCase()}`;
  };

  // 3. Filtering logic (Local in Memory)
  const filteredPatients = patients?.filter(patient => {
    const matchesSearch = 
      patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      patient.paternal_last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = activeFilter === 'All' || patient.status === activeFilter;

    return matchesSearch && matchesStatus;
  }) || [];

  // Freemium Hook for Delete Action
  const handleDeleteAttempt = () => {
    setIsSimulating(true);
    
    // Simulate network delay
    setTimeout(() => {
      setIsSimulating(false);
      setPatientToDelete(null); // Close the modal
      
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
                  Database mutations (Delete, Create, Update) and Row Level Security are only available in <strong className="text-slate-700 dark:text-slate-200">MedBase Pro</strong>.
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

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Patient Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage patient histories and current status.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedPatient(null); // Reset the data
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm outline-none"
        >
          <UserPlus size={18} />
          New Patient
        </button>
      </div>

      {/* card table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        
        {/* tool bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, last name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:border-primary-400 outline-none dark:text-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar">
            <button className="p-2 text-slate-500 hover:bg-white dark:hover:bg-slate-800 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors shrink-0">
              <Filter size={18} />
            </button>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg shrink-0">
              {['All', 'Active', 'Critical', 'Discharged'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeFilter === filter 
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading state / Error */}
        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary-500" />
            <p>Loading patients...</p>
          </div>
        )}

        {isError && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-alert-critical">
            <AlertCircle className="h-8 w-8 mb-4 opacity-50" />
            <p className="font-medium">Error connecting to the database.</p>
            <button onClick={() => refetch()} className="mt-4 text-sm underline hover:text-alert-critical/80">Retry</button>
          </div>
        )}

        {/* Table container */}
        {!isLoading && !isError && (
          <div className="overflow-x-auto min-h-[250px] pb-32">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">Patient</th>
                  <th scope="col" className="px-6 py-4 font-medium">Record ID</th>
                  <th scope="col" className="px-6 py-4 font-medium">Primary Condition</th>
                  <th scope="col" className="px-6 py-4 font-medium">Status</th>
                  <th scope="col" className="px-6 py-4 font-medium">Registration</th>
                  <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      No patients found matching the criteria.
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      
                      {/* Avatar and Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 rounded-full bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold text-sm">
                            {patient.first_name.charAt(0)}{patient.paternal_last_name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors cursor-pointer">
                              {patient.paternal_last_name} {patient.maternal_last_name || ''}, {patient.first_name}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {calculateAge(patient.date_of_birth)} years • {patient.phone || 'No phone number'}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                        {formatShortId(patient.id)}
                      </td>
                      
                      <td className="px-6 py-4 truncate max-w-[200px]">
                        {patient.main_condition || 'Not specified'}
                      </td>
                      
                      <td className="px-6 py-4">
                        {getStatusBadge(patient.status)}
                      </td>
                      
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                         {new Date(patient.created_at || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      
                      {/* Action Menu */}
                      <td className={`px-6 py-4 text-right relative ${activeDropdown === patient.id ? 'z-50' : 'z-0'}`} >
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); // Prevents the click from closing the menu immediately
                            setActiveDropdown(activeDropdown === patient.id ? null : patient.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors outline-none"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {/* Dropdown Menu */}
                        {activeDropdown === patient.id && (
                          <div 
                            onClick={(e) => e.stopPropagation()} 
                            className="absolute right-8 top-10 z-10 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                          >
                            <button 
                              onClick={() => {
                                setActiveDropdown(null);
                                setSelectedPatient(patient); // Save the selected patient data
                                setIsModalOpen(true); // Open the modal
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
                            >
                              <Edit2 size={16} className="text-primary-500" />
                              Edit Record
                            </button>
                            <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                            <button 
                              onClick={() => {
                                setActiveDropdown(null);
                                setPatientToDelete(patient.id); // Calls confirmation modal
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 flex items-center gap-2 transition-colors"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination (Visual) */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto bg-slate-50/50 dark:bg-slate-900/50">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-medium text-slate-900 dark:text-white">{filteredPatients.length}</span> results
          </span>
          
          <div className="flex items-center gap-1">
            <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50">
              <ChevronLeft size={16} />
            </button>
            <button className="px-3 py-1.5 border border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-lg text-sm font-medium">1</button>
            <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:bg-white dark:hover:bg-slate-800">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>

      <PatientModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPatient(null); // Clear on close
        }} 
        initialData={selectedPatient}
      />
      {/* Confirmation Modal for Deletion */}
      {patientToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Patient?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                This action will permanently delete the patient record and cannot be undone. Are you sure you want to continue?
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setPatientToDelete(null)}
                  disabled={isSimulating}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteAttempt}
                  disabled={isSimulating}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSimulating ? <Loader2 size={16} className="animate-spin" /> : 'Yes, delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}