import { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, Clock, AlertCircle, RefreshCw, ChevronLeft, ChevronRight, MessageSquareWarning } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAllComplaints, updateComplaintStatus } from '../../services/complaintService';
import showToast from '../../utils/toast';

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState('createdAt:desc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [filterStatus, sortOrder]);

  useEffect(() => {
    fetchComplaints();
  }, [debouncedSearch, filterStatus, page, sortOrder]);

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await getAllComplaints({
        page,
        limit: 10,
        search: debouncedSearch,
        status: filterStatus,
        sort: sortOrder
      });
      setComplaints(data.complaints);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Failed to load complaints');
      showToast.error('Failed to load complaints');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      const updatedComplaint = await updateComplaintStatus(id, { status: newStatus });
      setComplaints(complaints.map(comp => 
        comp._id === id ? { ...comp, status: updatedComplaint.status } : comp
      ));
      showToast.success(`Complaint marked as ${newStatus}`);
    } catch (err) {
      console.error('Failed to update status', err);
      showToast.error('Failed to update complaint status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Resolved': return <CheckCircle className="w-4 h-4 mr-1.5" />;
      case 'In Progress': return <Clock className="w-4 h-4 mr-1.5" />;
      default: return <AlertCircle className="w-4 h-4 mr-1.5" />;
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Resolved': return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
      case 'In Progress': return 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50';
      default: return 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">Manage Complaints</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Track and resolve student issues and maintenance requests.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={fetchComplaints}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-slate-600 dark:text-slate-300 text-sm font-semibold disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-rose-500' : ''}`} />
          <span>Refresh List</span>
        </motion.button>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center font-medium">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </motion.div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between gap-4 bg-slate-50/30 dark:bg-slate-800/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by ID, title, or type..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-sm font-medium dark:text-slate-200"
            />
          </div>
          <div className="flex space-x-2 items-center flex-wrap gap-2">
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <option value="createdAt:desc">Newest First</option>
              <option value="createdAt:asc">Oldest First</option>
            </select>
            
            <div className="flex items-center space-x-2">
              <div className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </div>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-rose-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        ) : complaints.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 text-slate-500">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquareWarning className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-lg font-bold text-slate-700">No complaints found</p>
            <p className="text-sm font-medium text-slate-500 mt-1">Try adjusting your search or filters.</p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-700/50 border-b border-slate-200/80 dark:border-slate-700">
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date & ID</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student Info</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Issue Details</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {complaints.map((complaint, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={complaint._id}
                    className="hover:bg-rose-50/30 dark:hover:bg-slate-700/30 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 truncate w-24" title={complaint._id}>{complaint._id.substring(0, 8)}...</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{complaint.student?.name || 'Unknown User'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Room: {complaint.room?.number || complaint.student?.roomNumber || 'N/A'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="inline-block px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] rounded font-semibold w-max mb-1 uppercase tracking-wide">
                          {complaint.type}
                        </span>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{complaint.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]" title={complaint.description}>{complaint.description}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(complaint.status)}`}>
                        {getStatusIcon(complaint.status)}
                        {complaint.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <select 
                        className={`px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 cursor-pointer ${updatingId === complaint._id ? 'opacity-50' : ''}`}
                        value={complaint.status}
                        onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                        disabled={updatingId === complaint._id}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination UI */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Page {page} of {totalPages}</p>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageComplaints;
