import { useState } from 'react';
import { FileText, Download, Users, DoorClosed, MessageSquareWarning, CalendarOff, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import showToast from '../../utils/toast';
import { 
  generateDashboardSummaryPDF, 
  generateRoomOccupancyReportPDF,
  generateAllStudentsReportPDF,
  generateAllComplaintsReportPDF,
  generateAllLeavesReportPDF
} from '../../utils/pdfGenerator';

const Reports = () => {
  const [loadingType, setLoadingType] = useState(null);

  const handleDownload = async (type) => {
    setLoadingType(type);
    try {
      if (type === 'dashboard') {
        const { data } = await api.get('/api/admin/dashboard');
        generateDashboardSummaryPDF(data);
        showToast.success('Dashboard Summary generated');
      } else if (type === 'rooms') {
        const { data } = await api.get('/api/rooms?limit=1000'); // get all rooms
        generateRoomOccupancyReportPDF(data.rooms);
        showToast.success('Room Occupancy Report generated');
      } else if (type === 'students') {
        const { data } = await api.get('/api/students?limit=1000');
        generateAllStudentsReportPDF(data.students);
        showToast.success('Student Roster Report generated');
      } else if (type === 'complaints') {
        const { data } = await api.get('/api/complaints?limit=1000');
        generateAllComplaintsReportPDF(data.complaints);
        showToast.success('Complaints Report generated');
      } else if (type === 'leaves') {
        const { data } = await api.get('/api/leaves?limit=1000');
        generateAllLeavesReportPDF(data.leaves);
        showToast.success('Leaves Report generated');
      }
    } catch (error) {
      showToast.error(`Failed to generate ${type} report`);
      console.error(error);
    } finally {
      setLoadingType(null);
    }
  };

  const reportTypes = [
    {
      id: 'dashboard',
      title: 'Dashboard Summary',
      description: 'A high-level statistical overview of the hostel, including total counts and statuses.',
      icon: Activity,
      color: 'bg-emerald-500'
    },
    {
      id: 'students',
      title: 'Student Roster',
      description: 'A complete list of all registered students, their contact details, and assigned rooms.',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      id: 'rooms',
      title: 'Room Occupancy',
      description: 'Detailed report of all hostel rooms, capacities, and current occupancy status.',
      icon: DoorClosed,
      color: 'bg-indigo-500'
    },
    {
      id: 'complaints',
      title: 'Complaints Log',
      description: 'A full log of all student complaints, issue categories, and resolution statuses.',
      icon: MessageSquareWarning,
      color: 'bg-rose-500'
    },
    {
      id: 'leaves',
      title: 'Leave Requests',
      description: 'A complete history of all student leave applications, dates, and approval statuses.',
      icon: CalendarOff,
      color: 'bg-amber-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">Reports & Downloads</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Generate and download comprehensive PDF reports for offline viewing.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report, idx) => (
          <motion.div 
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200/60 dark:border-slate-700 hover:shadow-xl transition-all relative overflow-hidden group flex flex-col h-full"
          >
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-300 ${report.color}`}></div>
            
            <div className="flex items-start space-x-4 mb-4">
              <div className={`p-4 rounded-2xl text-white shadow-sm ${report.color}`}>
                <report.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{report.title}</h3>
              </div>
            </div>
            
            <p className="text-slate-500 dark:text-slate-400 text-sm flex-1 mb-6 leading-relaxed">
              {report.description}
            </p>

            <button
              onClick={() => handleDownload(report.id)}
              disabled={loadingType === report.id}
              className="w-full flex items-center justify-center space-x-2 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
            >
              {loadingType === report.id ? (
                <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Generate PDF</span>
                </>
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
