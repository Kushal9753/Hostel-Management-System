import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import showToast from '../utils/toast';

const AdminLogin = () => {
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
      await login(email, password, true); // true indicates admin login attempt
      showToast.success('Admin authentication successful');
      navigate('/admin-dashboard');
    } catch (err) {
      setError(err);
      showToast.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
        <div className="px-8 py-10">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gray-800 rounded-full border border-gray-700">
              <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center text-white mb-2">Admin Portal</h2>
          <p className="text-gray-400 text-center mb-8 text-sm">Secure Access Only</p>
          
          {error && (
            <div className="bg-red-900/50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Admin Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors outline-none placeholder-gray-500"
                placeholder="admin@hostelsys.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors outline-none placeholder-gray-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </button>
          </form>
        </div>
        <div className="bg-gray-800/50 px-8 py-4 border-t border-gray-800 text-center">
          <Link to="/login" className="text-sm text-gray-400 hover:text-gray-200 font-medium transition-colors">
            &larr; Student Portal Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
