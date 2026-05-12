import { useState, useEffect } from 'react';
import { FiPlus, FiCalendar, FiClock, FiXCircle, FiCheckCircle, FiX, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getMyLeaves, createLeaveRequest } from '../services/leaveService';
import { generateLeaveReceiptPDF } from '../utils/pdfGenerator';
import { useAuth } from '../context/AuthContext';

const LeaveRequests = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    reason: '',
    destination: ''
  });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setIsLoading(true);
      const data = await getMyLeaves();
      setLeaves(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch leave requests');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved': return <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 rounded-full text-xs font-semibold flex items-center space-x-1 w-fit"><FiCheckCircle /><span>Approved</span></span>;
      case 'Pending': return <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 rounded-full text-xs font-semibold flex items-center space-x-1 w-fit"><FiClock /><span>Pending</span></span>;
      case 'Rejected': return <span className="px-3 py-1 bg-red-100 dark:bg-rose-900/30 text-red-800 dark:text-rose-400 rounded-full text-xs font-semibold flex items-center space-x-1 w-fit"><FiXCircle /><span>Rejected</span></span>;
      default: return null;
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLeaveRequest(formData);
      toast.success('Leave request submitted successfully');
      setIsModalOpen(false);
      setFormData({ fromDate: '', toDate: '', reason: '', destination: '' });
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit leave request');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Leave Requests</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage and track your hostel leaves</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-colors font-medium shadow-sm shadow-blue-600/20 w-full sm:w-auto justify-center"
        >
          <FiPlus className="w-5 h-5" />
          <span>Apply Leave</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center space-x-3 sm:space-x-4">
          <div className="p-2 sm:p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg"><FiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6" /></div>
          <div><p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Approved</p><p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-slate-100">{leaves.filter(l => l.status === 'Approved').length}</p></div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center space-x-3 sm:space-x-4">
          <div className="p-2 sm:p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg"><FiClock className="w-5 h-5 sm:w-6 sm:h-6" /></div>
          <div><p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Pending</p><p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-slate-100">{leaves.filter(l => l.status === 'Pending').length}</p></div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center space-x-3 sm:space-x-4">
          <div className="p-2 sm:p-3 bg-red-100 dark:bg-rose-900/30 text-red-600 dark:text-rose-400 rounded-lg"><FiXCircle className="w-5 h-5 sm:w-6 sm:h-6" /></div>
          <div><p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Rejected</p><p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-slate-100">{leaves.filter(l => l.status === 'Rejected').length}</p></div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : leaves.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-12 text-center shadow-sm">
          <div className="mx-auto w-16 h-16 bg-gray-50 dark:bg-slate-700/50 text-gray-400 dark:text-slate-500 rounded-full flex items-center justify-center mb-4">
            <FiCalendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">No Leave History</h3>
          <p className="text-gray-500 dark:text-slate-400 mt-1">You haven't requested any leaves yet.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-100 dark:border-slate-700 text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold">Applied On</th>
                    <th className="p-4 font-semibold">Duration</th>
                    <th className="p-4 font-semibold">Reason</th>
                    <th className="p-4 font-semibold text-right">Status</th>
                    <th className="p-4 font-semibold text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50">
                  {leaves.map((leave) => (
                    <tr key={leave._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="p-4 text-sm font-medium text-gray-900 dark:text-slate-100 whitespace-nowrap">
                        {new Date(leave.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm text-gray-600 dark:text-slate-300 flex items-center space-x-2 whitespace-nowrap">
                        <FiCalendar className="text-gray-400 dark:text-slate-500" />
                        <span>{new Date(leave.fromDate).toLocaleDateString()} to {new Date(leave.toDate).toLocaleDateString()}</span>
                      </td>
                      <td className="p-4 text-sm text-gray-700 dark:text-slate-300 min-w-[200px]">
                        {leave.reason}
                        {leave.adminComment && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 bg-blue-50 dark:bg-blue-900/30 p-1 rounded inline-block w-fit">
                            Note: {leave.adminComment}
                          </p>
                        )}
                      </td>
                      <td className="p-4 flex justify-end">{getStatusBadge(leave.status)}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => generateLeaveReceiptPDF({ ...leave, student: { name: user.name } })}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          title="Download Receipt"
                        >
                          <FiDownload className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-4">
            {leaves.map((leave) => (
              <div key={leave._id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-slate-200">{leave.destination || 'Leave Request'}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                      {new Date(leave.fromDate).toLocaleDateString()} → {new Date(leave.toDate).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(leave.status)}
                </div>
                <p className="text-xs text-gray-600 dark:text-slate-400 line-clamp-2">{leave.reason}</p>
                {leave.adminComment && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg">
                    Admin: {leave.adminComment}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 dark:text-slate-500">Applied {new Date(leave.createdAt).toLocaleDateString()}</span>
                  <button 
                    onClick={() => generateLeaveReceiptPDF({ ...leave, student: { name: user.name } })}
                    className="flex items-center space-x-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 p-2 rounded-lg transition-colors"
                  >
                    <FiDownload className="w-3.5 h-3.5" />
                    <span>Receipt</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Apply for Leave</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors p-1">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Start Date</label>
                    <input 
                      type="date" 
                      name="fromDate"
                      value={formData.fromDate}
                      onChange={handleChange}
                      required 
                      className="w-full border-gray-200 dark:border-slate-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 p-2.5 border outline-none bg-gray-50 dark:bg-slate-900 transition-all text-sm dark:text-slate-200" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">End Date</label>
                    <input 
                      type="date" 
                      name="toDate"
                      value={formData.toDate}
                      onChange={handleChange}
                      required 
                      className="w-full border-gray-200 dark:border-slate-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 p-2.5 border outline-none bg-gray-50 dark:bg-slate-900 transition-all text-sm dark:text-slate-200" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Destination</label>
                  <input 
                    type="text" 
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    required 
                    className="w-full border-gray-200 dark:border-slate-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 p-2.5 border outline-none bg-gray-50 dark:bg-slate-900 transition-all text-sm dark:text-slate-200" 
                    placeholder="Where are you going?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Reason for Leave</label>
                  <textarea 
                    rows="3" 
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required 
                    className="w-full border-gray-200 dark:border-slate-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 p-2.5 border outline-none bg-gray-50 dark:bg-slate-900 transition-all text-sm resize-none dark:text-slate-200" 
                    placeholder="Provide a detailed reason..."
                  ></textarea>
                </div>
              </div>
              <div className="mt-6 flex space-x-3 justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl font-medium transition-colors text-sm">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors shadow-sm shadow-blue-600/20 text-sm">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequests;
