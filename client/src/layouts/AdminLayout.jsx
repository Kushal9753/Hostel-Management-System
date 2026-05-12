import { Outlet, useLocation, Link } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Bell, Menu, Search, ChevronDown, Sun, Moon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const AdminLayout = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const [stats, setStats] = useState({ pendingComplaints: 0, leaveRequests: 0 });
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/api/admin/dashboard');
        setStats({
          pendingComplaints: data.pendingComplaints || 0,
          leaveRequests: data.leaveRequests || 0
        });
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      }
    };
    fetchStats();
  }, [location.pathname]); // refetch on navigation

  // Handle clicking outside of notification dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-slate-900 font-sans overflow-hidden selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100 transition-colors duration-300">
      {/* Desktop Sidebar */}
      <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      {/* Mobile Sidebar overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden" 
              onClick={() => setMobileMenuOpen(false)} 
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 z-50 w-72 md:hidden shadow-2xl" 
              onClick={e => e.stopPropagation()}
            >
              <AdminSidebar isMobile mobileClose={() => setMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 lg:h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 z-10 sticky top-0 transition-all duration-300">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 -ml-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="hidden lg:flex items-center relative group">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Quick search..." 
                className="pl-9 pr-4 py-2 bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-transparent dark:border-slate-700 focus:border-blue-200 dark:focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all outline-none w-64 focus:w-80 dark:text-slate-200 dark:placeholder-slate-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-6">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 dark:hover:text-blue-400 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800"
              >
                <Bell className="w-5 h-5" />
                {(stats.pendingComplaints > 0 || stats.leaveRequests > 0) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 origin-top-right"
                  >
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100">Notifications</h3>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {stats.pendingComplaints === 0 && stats.leaveRequests === 0 ? (
                        <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                          You're all caught up!
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                          {stats.pendingComplaints > 0 && (
                            <Link 
                              to="/admin-dashboard/complaints"
                              className="flex flex-col p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                              onClick={() => setShowNotifications(false)}
                            >
                              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {stats.pendingComplaints} Pending Complaints
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Requires admin resolution
                              </span>
                            </Link>
                          )}
                          {stats.leaveRequests > 0 && (
                            <Link 
                              to="/admin-dashboard/leaves"
                              className="flex flex-col p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                              onClick={() => setShowNotifications(false)}
                            >
                              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {stats.leaveRequests} Leave Requests
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Pending approval
                              </span>
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-3 pl-3 sm:pl-6 border-l border-slate-200 dark:border-slate-700">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user?.name || 'Admin User'}</p>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase">{user?.role || 'Administrator'}</p>
              </div>
              <button className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold ring-2 ring-white dark:ring-slate-800">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
