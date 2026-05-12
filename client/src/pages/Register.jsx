import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import showToast from '../utils/toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    course: '',
    year: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      showToast.error('Passwords do not match');
      return setError('Passwords do not match');
    }

    setLoading(true);
    
    try {
      const { confirmPassword, ...registerData } = formData;
      await register({ ...registerData, role: 'student' });
      showToast.success('Account created successfully');
      navigate('/dashboard');
    } catch (err) {
      setError(err);
      showToast.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-10">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden dark:border dark:border-slate-700">
        <div className="px-8 py-10">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-slate-100 mb-8">Student Registration</h2>
          
          {error && (
            <div className="bg-red-50 dark:bg-rose-900/30 border-l-4 border-red-500 dark:border-rose-500 p-4 mb-6 rounded-md">
              <p className="text-red-700 dark:text-rose-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Full Name</label>
                <input
                  type="text" name="name" required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                  placeholder="John Doe"
                  value={formData.name} onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Email Address</label>
                <input
                  type="email" name="email" required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                  placeholder="john@example.com"
                  value={formData.email} onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Password</label>
                <input
                  type="password" name="password" required minLength="6"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                  placeholder="••••••••"
                  value={formData.password} onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Confirm Password</label>
                <input
                  type="password" name="confirmPassword" required minLength="6"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                  placeholder="••••••••"
                  value={formData.confirmPassword} onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Phone Number</label>
                <input
                  type="tel" name="phone"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                  placeholder="+1 234 567 8900"
                  value={formData.phone} onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Course/Major</label>
                <input
                  type="text" name="course"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                  placeholder="Computer Science"
                  value={formData.course} onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className={`w-full mt-8 py-3 px-4 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-blue-600 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
