import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  Activity, 
  Settings, 
  Bell, 
  Search,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useSelector } from 'react-redux'; 
import type { RootState } from '../../store/store'; 
import {  useLogoutMutation } from '../../services/api/authApi';

import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function DashboardLayout() {
  //state to control mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  
  //Extract authenticated user from Redux store
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Helper functions to format the UI
  const getInitial = (name?: string) => name ? name.charAt(0).toUpperCase() : 'U';
  
  const formatRole = (role?: string) => {
    if (role === 'admin') return 'Administrator';
    if (role === 'doctor') return 'Doctor';
    if (role === 'receptionist') return 'Receptionist';
    return 'Medical Staff';
  };

  // Automatically close the mobile menu when the user navigates to a different route
  //close mobile menu when  user navigates to a different route
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="bg-white dark:bg-slate-800 flex h-screen w-full overflow-hidden bg-slate-50 relative">
      
      {/* OVERLAY (Dark Overlay for Mobile) */}
      {/* Only shown if the menu is open on small screens */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR (Navigation Sidebar) */}
      {/* We use fixed and transform to slide it in mobile, and relative to keep it fixed in desktop (lg) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700/50 flex flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        
        {/* Branding / Logo Area */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center gap-2 text-primary-600">
            <Activity className="h-6 w-6 stroke-[2.5]" />
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Med<span className="text-primary-500">Base</span>
            </span>
          </div>
          {/* Close button for closing the menu only visible on mobile */}
          <button 
            className="lg:hidden p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" to="/" />
          <NavItem icon={<Users size={20} />} label="Patients" to="/patients" />
          <NavItem icon={<CalendarDays size={20} />} label="Appointments" to="/appointments" />
          <NavItem icon={<Activity size={20} />} label="Clinic" to="/clinic" />
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700/50">
          <NavItem icon={<Settings size={20} />} label="Settings" to="/settings" />
          <button onClick={handleLogout} disabled={isLoggingOut} className="w-full flex items-center gap-3 px-3 py-2 mt-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors outline-none focus:ring-2 focus:ring-rose-100">
            <LogOut size={20} />
            {isLoggingOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* MAIN AREA (Topbar + Content) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOPBAR  */}
        <header className="h-16 flex-shrink-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between px-4 sm:px-6 z-10">
          
          <div className="flex items-center gap-4 flex-1">
            {/* Hamburger Button (Mobile Only) */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg lg:hidden transition-colors outline-none focus:ring-2 focus:ring-primary-100"
            >
              <Menu size={24} />
            </button>

            {/* Search (Hidden on very small mobile screens, visible on sm and larger) */}
            <div className="hidden sm:block flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search patients, appointments..." 
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-transparent rounded-lg text-sm focus:bg-white dark:bg-slate-800 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2 sm:gap-4 ml-4">
            {/* Mobile Search Icon */}
            <button className="sm:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
              <Search size={20} />
            </button>

            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-50">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-alert-critical border-2 border-white"></span>
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700/50 mx-1 sm:mx-2"></div>
            
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{user?.fullName || 'Medical User'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{formatRole(user?.role)}</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-600 font-bold group-hover:bg-primary-200 transition-colors">
                {getInitial(user?.fullName)}
              </div>
            </div>
          </div>
        </header>

        {/* DYNAMIC CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet /> 
          </div>
        </main>

      </div>
    </div>
  );
}

// Micro-component for the navigation links
function NavItem({ icon, label, to }: { icon: React.ReactNode, label: string, to: string }) {
  return (
    <NavLink 
      to={to}
      className={({ isActive }) => 
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all outline-none focus:ring-2 focus:ring-primary-200 ${
          isActive 
            ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-sm' 
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100'
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}