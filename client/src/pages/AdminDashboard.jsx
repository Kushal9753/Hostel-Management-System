import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden mb-8">
        <div className="bg-gray-900 px-8 py-6 border-b border-gray-800 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400 mt-1">Hostel Management Control Panel</p>
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-300">Logged in as: <span className="font-semibold text-secondary">{user?.email}</span></p>
            </div>
          </div>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 p-6 rounded-xl hover:shadow-md transition-all transform hover:-translate-y-1 cursor-pointer">
            <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-400 mb-2">Manage Students</h3>
            <p className="text-emerald-600 dark:text-emerald-300 text-sm">View, edit, or remove student accounts and allocations.</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 p-6 rounded-xl hover:shadow-md transition-all transform hover:-translate-y-1 cursor-pointer">
            <h3 className="text-xl font-bold text-blue-800 dark:text-blue-400 mb-2">Room Allocations</h3>
            <p className="text-blue-600 dark:text-blue-300 text-sm">Manage hostel buildings, floors, and room assignments.</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800/50 p-6 rounded-xl hover:shadow-md transition-all transform hover:-translate-y-1 cursor-pointer">
            <h3 className="text-xl font-bold text-purple-800 dark:text-purple-400 mb-2">System Reports</h3>
            <p className="text-purple-600 dark:text-purple-300 text-sm">View occupancy metrics and generate administrative reports.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
