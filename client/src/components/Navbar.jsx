import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-extrabold text-blue-600 dark:text-blue-500 tracking-tight">HostelSys</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
            {user ? (
              <>
                <Link 
                  to={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'} 
                  className="text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-3 ml-4 border-l pl-4 border-slate-200 dark:border-slate-700">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Hello, {user.name}</span>
                  <button 
                    onClick={handleLogout}
                    className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 px-4 py-2 rounded-md font-medium transition-colors text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pb-4 px-4 space-y-2 animate-in">
          {user ? (
            <>
              <p className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">Hello, {user.name}</p>
              <Link 
                to={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'} 
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
              >
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-3 py-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-medium transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors">
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl bg-blue-600 text-white text-center font-medium transition-colors">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
