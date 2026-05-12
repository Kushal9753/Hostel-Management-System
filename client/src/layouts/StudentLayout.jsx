import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiBell, FiMenu, FiSearch, FiChevronDown, FiSun, FiMoon } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentLayout = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-slate-900 font-sans overflow-hidden selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100 transition-colors duration-300">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
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
              <Sidebar isMobile mobileClose={() => setMobileMenuOpen(false)} />
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
              <FiMenu className="w-5 h-5" />
            </button>
            
            <div className="hidden lg:flex items-center relative group">
              <FiSearch className="w-4 h-4 text-slate-400 absolute left-3 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2 bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-transparent dark:border-slate-700 focus:border-blue-200 dark:focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all outline-none w-64 focus:w-80 dark:text-slate-200 dark:placeholder-slate-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-6">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 dark:hover:text-blue-400 transition-colors"
            >
              {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
            <button className="relative p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800">
              <FiBell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
            </button>
            <div className="flex items-center gap-3 pl-3 sm:pl-6 border-l border-slate-200 dark:border-slate-700">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user?.name || 'Student'}</p>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase">{user?.role || 'Student'}</p>
              </div>
              <button className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold ring-2 ring-white dark:ring-slate-800">
                  {user?.name?.charAt(0).toUpperCase() || 'S'}
                </div>
                <FiChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
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

export default StudentLayout;
