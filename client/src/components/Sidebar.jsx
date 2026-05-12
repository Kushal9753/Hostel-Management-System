import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiUser, FiHome as FiRoom, FiMessageSquare, FiCalendar, FiLogOut, FiChevronLeft, FiChevronRight, FiX, FiDownload } from 'react-icons/fi';
import showToast from '../utils/toast';
import { motion } from 'framer-motion';

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobile, mobileClose }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <FiHome className="w-5 h-5" /> },
    { path: '/dashboard/profile', name: 'My Profile', icon: <FiUser className="w-5 h-5" /> },
    { path: '/dashboard/room', name: 'Room Details', icon: <FiRoom className="w-5 h-5" /> },
    { path: '/dashboard/complaints', name: 'Complaints', icon: <FiMessageSquare className="w-5 h-5" /> },
    { path: '/dashboard/leaves', name: 'Leave Requests', icon: <FiCalendar className="w-5 h-5" /> },
    { path: '/dashboard/downloads', name: 'Downloads', icon: <FiDownload className="w-5 h-5" /> },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    showToast.success('Successfully logged out');
  };

  return (
    <aside 
      className={`${isCollapsed && !isMobile ? 'w-20' : 'w-64'} ${isMobile ? 'h-full w-full' : 'hidden md:flex h-screen'} bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 flex-col border-r border-slate-200 dark:border-slate-800 transition-all duration-300 relative z-20`}
    >
      <div className={`p-6 border-b border-slate-100 dark:border-slate-800 flex items-center ${isCollapsed && !isMobile ? 'justify-center px-4' : 'justify-between'} h-20`}>
        {(!isCollapsed || isMobile) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1">
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
                Sid
              </span>
              Lab
            </h1>
          </motion.div>
        )}
        
        {isCollapsed && !isMobile && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg">
            S
          </div>
        )}

        {isMobile && (
          <button onClick={mobileClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
        <div className="space-y-1.5">
          {(!isCollapsed || isMobile) && <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-3">Menu</p>}
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (location.pathname === '/dashboard/' && item.path === '/dashboard');
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={isMobile ? mobileClose : undefined}
                className={`group relative flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold shadow-sm border border-blue-100/50 dark:border-blue-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <div className={`${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}>
                  {item.icon}
                </div>
                {(!isCollapsed || isMobile) && (
                  <span className="font-medium text-sm">{item.name}</span>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && !isMobile && (
                  <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-800 dark:bg-slate-700 text-white text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-slate-700 dark:border-slate-600">
                    {item.name}
                    <div className="absolute top-1/2 -left-1 -mt-1 w-2 h-2 bg-slate-800 dark:bg-slate-700 transform rotate-45 border-l border-b border-slate-700 dark:border-slate-600"></div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className={`group flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'space-x-3'} w-full p-3 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all duration-200`}
        >
          <div className="text-slate-400 dark:text-slate-500 group-hover:text-rose-600 dark:group-hover:text-rose-400">
            <FiLogOut className="w-5 h-5 flex-shrink-0" />
          </div>
          {(!isCollapsed || isMobile) && <span className="font-medium text-sm">Sign Out</span>}
        </button>
      </div>

      {/* Collapse Toggle Button */}
      {!isMobile && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3.5 top-24 w-7 h-7 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors z-30 shadow-sm"
        >
          {isCollapsed ? <FiChevronRight className="w-4 h-4" /> : <FiChevronLeft className="w-4 h-4" />}
        </button>
      )}
    </aside>
  );
};

export default Sidebar;
