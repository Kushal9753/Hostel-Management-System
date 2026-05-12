import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import showToast from '../utils/toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password, false);
      showToast.success('Successfully logged in');
      navigate('/dashboard');
    } catch (err) {
      setError(err);
      showToast.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden dark:border dark:border-slate-700">
        <div className="px-8 py-10">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-slate-100 mb-8">Student Login</h2>
          
          {error && (
            <div className="bg-red-50 dark:bg-rose-900/30 border-l-4 border-red-500 dark:border-rose-500 p-4 mb-6 rounded-md">
              <p className="text-red-700 dark:text-rose-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:text-blue-600 transition-colors">
              Register here
            </Link>
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-slate-700/50 px-8 py-4 border-t border-gray-100 dark:border-slate-700 text-center">
          <Link to="/admin-login" className="text-sm text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 font-medium transition-colors">
            Admin Portal Login &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
