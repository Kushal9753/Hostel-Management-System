import { useState, useEffect } from 'react';
import { FiCheckCircle, FiClock, FiXCircle, FiMessageSquare, FiCalendar, FiFilter, FiSearch, FiChevronLeft, FiChevronRight, FiRefreshCw } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import showToast from '../../utils/toast';
import { getAllLeaves, updateLeaveStatus } from '../../services/leaveService';

const ManageLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('createdAt:desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [adminComment, setAdminComment] = useState('');

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
  }, [filter, sortOrder]);

  useEffect(() => {
    fetchLeaves();
  }, [debouncedSearch, filter, sortOrder, page]);

  const fetchLeaves = async () => {
    try {
      setIsLoading(true);
      const data = await getAllLeaves({
        page,
        limit: 10,
        search: debouncedSearch,
        status: filter,
        sort: sortOrder
      });
      setLeaves(data.leaves);
      setTotalPages(data.totalPages);
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to fetch leaves');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateLeaveStatus(id, { status: newStatus, adminComment });
      showToast.success(`Leave request ${newStatus.toLowerCase()}`);
      setSelectedLeave(null);
      setAdminComment('');
      fetchLeaves();
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">Manage Leaves</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Review and approve student leave applications</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={fetchLeaves}
          className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-slate-600 dark:text-slate-300 text-sm font-semibold"
        >
          <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-500' : ''}`} />
          <span>Refresh List</span>
        </motion.button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700">
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by reason..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm dark:text-slate-200"
            />
          </div>
          
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium text-gray-700 dark:text-slate-200"
          >
            <option value="createdAt:desc">Newest First</option>
            <option value="createdAt:asc">Oldest First</option>
          </select>

          <div className="flex items-center space-x-1 bg-gray-50 dark:bg-slate-900 p-1 rounded-xl border border-gray-200 dark:border-slate-700 w-full sm:w-auto overflow-x-auto">
            {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${filter === f ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200 dark:border-slate-700' : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaves List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700 flex flex-col overflow-hidden h-[70vh]">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          ) : leaves.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-slate-500 p-8">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="w-10 h-10 text-slate-300 dark:text-slate-400" />
              </div>
              <p className="text-lg font-bold text-slate-700 dark:text-slate-200">No {filter !== 'All' ? filter.toLowerCase() : ''} leave requests found.</p>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">You are all caught up.</p>
            </motion.div>
          ) : (
            <>
              <div className="divide-y divide-slate-100 dark:divide-slate-700/50 flex-1 overflow-y-auto">
                {leaves.map((leave, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={leave._id} 
                    onClick={() => setSelectedLeave(leave)}
                    className={`p-5 cursor-pointer transition-colors ${selectedLeave?._id === leave._id ? 'bg-blue-50/50 dark:bg-blue-900/30' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 tracking-tight">{leave.student?.name || 'Unknown Student'}</h3>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{leave.student?.email} • {leave.student?.course}</p>
                      </div>
                      <span className={`px-3 py-1 text-[11px] font-bold rounded-full border tracking-wide uppercase ${
                        leave.status === 'Approved' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50' : 
                        leave.status === 'Rejected' ? 'bg-red-50 dark:bg-rose-900/30 text-red-700 dark:text-rose-400 border-red-200 dark:border-rose-800/50' : 
                        'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50'
                      }`}>
                        {leave.status}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 space-x-4 mt-3">
                      <div className="flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-700/50 px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-700 font-medium">
                        <FiCalendar className="w-4 h-4 text-slate-400" />
                        <span>{new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Pagination UI */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between bg-gray-50 dark:bg-slate-800/50">
                  <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Page {page} of {totalPages}</p>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Leave Detail Panel */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
          {selectedLeave ? (
            <motion.div 
              key="detail-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700 overflow-hidden sticky top-24"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <h2 className="text-lg font-black tracking-tight text-slate-800 dark:text-slate-100">Request Details</h2>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Submitted on {new Date(selectedLeave.createdAt).toLocaleString()}</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Student Info</h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                      {selectedLeave.student?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 tracking-tight">{selectedLeave.student?.name}</p>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{selectedLeave.student?.phone || 'No phone'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Reason</h4>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">{selectedLeave.reason}</p>
                </div>

                {selectedLeave.destination && (
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Destination</h4>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">{selectedLeave.destination}</p>
                  </div>
                )}

                {selectedLeave.status === 'Pending' && (
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center"><FiMessageSquare className="mr-1.5" /> Optional Comment</h4>
                    <textarea
                      value={adminComment}
                      onChange={(e) => setAdminComment(e.target.value)}
                      placeholder="Add a note for the student..."
                      className="w-full p-4 text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all"
                      rows="3"
                    ></textarea>
                    
                    <div className="flex space-x-3 mt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStatusUpdate(selectedLeave._id, 'Approved')}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-emerald-600/20"
                      >
                        Approve
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStatusUpdate(selectedLeave._id, 'Rejected')}
                        className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-rose-600/20"
                      >
                        Reject
                      </motion.button>
                    </div>
                  </div>
                )}
                
                {selectedLeave.status !== 'Pending' && selectedLeave.adminComment && (
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Your Previous Comment</h4>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/50">{selectedLeave.adminComment}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 border-dashed p-12 text-center h-[70vh] flex flex-col items-center justify-center text-slate-500 sticky top-24"
            >
              <div className="w-20 h-20 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 rounded-full flex items-center justify-center mb-4">
                <FiCalendar className="w-8 h-8 text-slate-300 dark:text-slate-500" />
              </div>
              <p className="font-bold text-slate-700 dark:text-slate-200">Select a request</p>
              <p className="text-sm font-medium mt-1 text-slate-500 dark:text-slate-400">Choose a leave request from the list to view details and take action.</p>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ManageLeaves;
