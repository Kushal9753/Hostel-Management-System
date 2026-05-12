import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiAlertCircle, FiClock, FiFileText, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState({
    activeLeaves: 0,
    openComplaints: 0,
    pendingDues: 0,
    roomId: user?.roomId
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/api/students/dashboard');
        setStatsData({
          activeLeaves: data.activeLeaves,
          openComplaints: data.openComplaints,
          pendingDues: data.pendingDues,
          roomId: data.roomId || user?.roomId
        });
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    fetchStats();
  }, [user]);

  const stats = [
    { 
      title: 'Room Status', 
      value: statsData.roomId ? 'Allocated' : 'Not Allocated', 
      icon: <FiHome className={`w-6 h-6 ${statsData.roomId ? 'text-emerald-600' : 'text-gray-500'}`} />, 
      bg: statsData.roomId ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gray-100 dark:bg-slate-700/50', 
      color: statsData.roomId ? 'text-emerald-800 dark:text-emerald-400' : 'text-gray-500 dark:text-slate-400' 
    },
    { title: 'Pending Dues', value: `₹${statsData.pendingDues.toFixed(2)}`, icon: <FiAlertCircle className="w-6 h-6 text-amber-600" />, bg: 'bg-amber-100 dark:bg-amber-900/30', color: 'text-amber-800 dark:text-amber-400' },
    { title: 'Active Leaves', value: statsData.activeLeaves, icon: <FiClock className="w-6 h-6 text-blue-600" />, bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-800 dark:text-blue-400' },
    { title: 'Open Complaints', value: statsData.openComplaints, icon: <FiFileText className="w-6 h-6 text-purple-600" />, bg: 'bg-purple-100 dark:bg-purple-900/30', color: 'text-purple-800 dark:text-purple-400' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm border border-slate-200/60 dark:border-slate-700 relative overflow-hidden transition-colors duration-300"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100">Welcome back, {user?.name}! 👋</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base lg:text-lg font-medium">Here is an overview of your hostel account.</p>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, staggerChildren: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx} 
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-700 flex items-center space-x-4 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 relative overflow-hidden group"
          >
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-current ${stat.color}`}></div>
            <div className={`p-4 rounded-2xl shadow-sm ${stat.bg} relative z-10`}>
              {stat.icon}
            </div>
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{stat.title}</p>
              <h3 className={`text-2xl font-black mt-1 tracking-tight ${stat.color} dark:brightness-125`}>{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700 overflow-hidden transition-colors duration-300"
        >
          <div className="px-7 py-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
            <h2 className="text-lg font-black tracking-tight text-slate-800 dark:text-slate-100">Recent Notices</h2>
          </div>
          <div className="p-7">
            <div className="space-y-5">
              <motion.div whileHover={{ x: 4 }} className="flex space-x-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-600">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0 shadow-sm shadow-blue-500/50"></div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Hostel Fee Submission Deadline</p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Please submit your upcoming semester hostel fees by 30th May.</p>
                </div>
              </motion.div>
              <motion.div whileHover={{ x: 4 }} className="flex space-x-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-600">
                <div className="w-2 h-2 mt-2 rounded-full bg-rose-500 flex-shrink-0 shadow-sm shadow-rose-500/50"></div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Maintenance Schedule</p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Water supply will be interrupted on Block A from 10 AM to 1 PM tomorrow.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700 overflow-hidden transition-colors duration-300"
        >
          <div className="px-7 py-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
            <h2 className="text-lg font-black tracking-tight text-slate-800 dark:text-slate-100">Quick Actions</h2>
          </div>
          <div className="p-7 grid grid-cols-2 gap-4">
            <Link to="/dashboard/complaints" className="group flex flex-col items-center justify-center p-6 bg-purple-50/50 dark:bg-purple-900/10 rounded-2xl hover:bg-purple-100/50 dark:hover:bg-purple-900/30 transition-colors border border-purple-100/50 dark:border-purple-900/30 hover:border-purple-200 dark:hover:border-purple-800/50">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <FiFileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm font-bold text-purple-900 dark:text-purple-300">Log Complaint</span>
            </Link>
            <Link to="/dashboard/leaves" className="group flex flex-col items-center justify-center p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-colors border border-blue-100/50 dark:border-blue-900/30 hover:border-blue-200 dark:hover:border-blue-800/50">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <FiClock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-bold text-blue-900 dark:text-blue-300">Apply Leave</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
