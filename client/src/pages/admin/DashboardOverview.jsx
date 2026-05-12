import { useState, useEffect } from 'react';
import { 
  Users, DoorClosed, MessageSquareWarning, CalendarOff, 
  TrendingUp, Activity, ArrowUpRight, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { generateDashboardSummaryPDF } from '../../utils/pdfGenerator';
import { FiDownload } from 'react-icons/fi';

const DashboardOverview = () => {
  const [statsData, setStatsData] = useState({
    totalStudents: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    pendingComplaints: 0,
    leaveRequests: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/api/admin/dashboard');
        setStatsData(data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { name: 'Total Students', value: statsData.totalStudents, icon: Users, color: 'bg-blue-500', trend: 'Registered Students' },
    { name: 'Total Rooms', value: statsData.totalRooms, icon: DoorClosed, color: 'bg-indigo-500', trend: `${statsData.occupiedRooms} Occupied` },
    { name: 'Pending Complaints', value: statsData.pendingComplaints, icon: MessageSquareWarning, color: 'bg-rose-500', trend: 'Requires Attention' },
    { name: 'Pending Leaves', value: statsData.leaveRequests, icon: CalendarOff, color: 'bg-amber-500', trend: 'Pending Approvals' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <button 
          onClick={() => generateDashboardSummaryPDF(statsData)}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <FiDownload className="w-4 h-4" />
          <span>Export Summary PDF</span>
        </button>
      </div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, staggerChildren: 0.1 }}
      >
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 relative overflow-hidden group"
          >
            {/* Background Decoration */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-300 ${stat.color}`}></div>
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`p-3.5 rounded-2xl text-white ${stat.color} shadow-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-700/80 px-2.5 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                Live
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{stat.value}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">{stat.name}</p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 relative z-10">
              <div className="flex items-center gap-1.5 font-medium">
                <Activity className="w-4 h-4 text-slate-400" />
                {stat.trend}
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-7 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Recent Activity</h2>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-1">
            {/* Mock activity items */}
            {[1, 2, 3, 4].map((i) => (
              <motion.div 
                key={i} 
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-3 rounded-2xl transition-colors cursor-pointer border border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm ${
                  i === 1 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 
                  i === 2 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 
                  i === 3 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 
                  'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                }`}>
                  {['S', 'R', 'C', 'L'][i-1]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {['New student registered', 'Room 102 marked as occupied', 'Complaint #442 resolved', 'Leave approved for John Doe'][i-1]}
                  </p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                    {['John Doe joined the hostel.', 'Allocated to incoming fresher.', 'Electricity issue fixed in Block B.', 'Going home for weekend.'][i-1]}
                  </p>
                </div>
                <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700/50 px-3 py-1 rounded-lg">
                  {i * 2}h ago
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-7 shadow-sm border border-slate-100 dark:border-slate-700"
        >
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/admin-dashboard/students" className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors group border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800/50 hover:shadow-md hover:shadow-blue-500/10 block">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 text-slate-500 dark:text-slate-400">
                  <Users className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm">Manage Students</span>
              </div>
              <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-blue-500" />
            </Link>
            
            <Link to="/admin-dashboard/rooms" className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors group border border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800/50 hover:shadow-md hover:shadow-emerald-500/10 block">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 text-slate-500 dark:text-slate-400">
                  <DoorClosed className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm">Allocate Rooms</span>
              </div>
              <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-emerald-500" />
            </Link>
            
            <Link to="/admin-dashboard/leaves" className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400 transition-colors group border border-slate-100 dark:border-slate-700 hover:border-amber-200 dark:hover:border-amber-800/50 hover:shadow-md hover:shadow-amber-500/10 block">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm group-hover:text-amber-600 dark:group-hover:text-amber-400 text-slate-500 dark:text-slate-400">
                  <CalendarOff className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm">Review Leaves</span>
              </div>
              <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-amber-500" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardOverview;
