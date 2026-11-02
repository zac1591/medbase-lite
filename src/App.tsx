import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

// Layout, Auth and Routes
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import AuthListener from './features/auth/components/AuthListener';

// Pages - Entry points
import LoginView from './features/auth/components/LoginView';
import DashboardPage from './pages/DashboardPage';
import AppointmentsPage from './pages/AppointmentsPage';
import PatientsPage from './pages/PatientsPage';
import ClinicalPage from './pages/ClinicalPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Provider store={store}>
      <AuthListener>
        <ThemeProvider>
        <>
          <BrowserRouter>
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/login" element={<LoginView />} />

              {/* PRIVATE ROUTES */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<DashboardLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="appointments" element={<AppointmentsPage />} />
                  <Route path="patients" element={<PatientsPage />} />
                  <Route path="clinic" element={<ClinicalPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
          <Toaster 
              position="top-right"
              toastOptions={{
                className: 'text-sm font-medium text-slate-900 dark:text-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl rounded-xl',
                duration: 4000,
              }} 
            />
          </>
        </ThemeProvider>
      </AuthListener>
    </Provider>
  );
}

export default App;