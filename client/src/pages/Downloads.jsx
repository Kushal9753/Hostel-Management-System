import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiDownload, FiUser, FiFileText, FiCalendar } from 'react-icons/fi';
import api from '../services/api';
import showToast from '../utils/toast';
import { 
  generateStudentProfileReportPDF,
  generateAllComplaintsReportPDF,
  generateAllLeavesReportPDF
} from '../utils/pdfGenerator';

const Downloads = () => {
  const { user } = useAuth();
  const [loadingType, setLoadingType] = useState(null);

  const handleDownload = async (type) => {
    setLoadingType(type);
    try {
      if (type === 'profile') {
        let stats = null;
        try {
          const { data } = await api.get('/api/students/dashboard');
          stats = data;
        } catch (e) {
          console.error("Could not fetch dashboard stats", e);
        }
        generateStudentProfileReportPDF(user, stats);
        showToast.success('Profile Report generated');
      } else if (type === 'complaints') {
        const { data } = await api.get('/api/complaints/my-complaints');
        generateAllComplaintsReportPDF(data);
        showToast.success('Complaints Log generated');
      } else if (type === 'leaves') {
        const { data } = await api.get('/api/leaves/my-leaves');
        generateAllLeavesReportPDF(data);
        showToast.success('Leaves Record generated');
      }
    } catch (error) {
      showToast.error(`Failed to generate ${type} document`);
      console.error(error);
    } finally {
      setLoadingType(null);
    }
  };

  const downloadOptions = [
    {
      id: 'profile',
      title: 'Full Profile Report',
      description: 'Download a complete record of your personal and academic details, including your room allocation status.',
      icon: FiUser,
      color: 'bg-blue-500'
    },
    {
      id: 'complaints',
      title: 'My Complaints Log',
      description: 'Generate a PDF containing the full history of all complaints you have raised and their current statuses.',
      icon: FiFileText,
      color: 'bg-purple-500'
    },
    {
      id: 'leaves',
      title: 'My Leave Records',
      description: 'Get a formal record of all your submitted leave requests, dates, and administrative approvals.',
      icon: FiCalendar,
      color: 'bg-amber-500'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">Downloads Center</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Generate official PDF records for your hostel activity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {downloadOptions.map((option, idx) => (
          <motion.div 
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-700 hover:shadow-xl transition-all relative overflow-hidden group flex flex-col h-full"
          >
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-300 ${option.color}`}></div>
            
            <div className="flex items-start space-x-4 mb-4">
              <div className={`p-4 rounded-2xl text-white shadow-sm ${option.color}`}>
                <option.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{option.title}</h3>
              </div>
            </div>
            
            <p className="text-slate-500 dark:text-slate-400 text-sm flex-1 mb-6 leading-relaxed">
              {option.description}
            </p>

            <button
              onClick={() => handleDownload(option.id)}
              disabled={loadingType === option.id}
              className="w-full flex items-center justify-center space-x-2 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
            >
              {loadingType === option.id ? (
                <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <FiDownload className="w-5 h-5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Downloads;
