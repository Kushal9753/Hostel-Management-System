import { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Edit2, Trash2, X, User as UserIcon, AlertCircle, RefreshCw, ChevronLeft, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import showToast from '../../utils/toast';
import { getStudents, getStudentDetails, updateStudent, deleteStudent } from '../../services/studentService';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination & Filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [sortOrder, setSortOrder] = useState('createdAt:desc');

  // Modals state
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  // Used for typing debounce on search
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch students when filters or page changes
  useEffect(() => {
    fetchStudents();
  }, [debouncedSearch, courseFilter, currentPage, sortOrder]);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const data = await getStudents({
        page: currentPage,
        limit: 10,
        search: debouncedSearch,
        course: courseFilter,
        sort: sortOrder
      });
      setStudents(data.students);
      setTotalPages(data.totalPages || 1);
      setTotalStudents(data.totalStudents || 0);
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Failed to fetch students');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewStudent = async (id) => {
    setSelectedStudentId(id);
    setIsViewModalOpen(true);
    setIsEditMode(false);
    try {
      setIsDetailsLoading(true);
      const data = await getStudentDetails(id);
      setStudentDetails(data);
      setEditFormData({
        name: data.student.name,
        email: data.student.email,
        phone: data.student.phone || '',
        course: data.student.course || '',
        year: data.student.year || ''
      });
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Failed to fetch student details');
      setIsViewModalOpen(false);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateStudent(selectedStudentId, editFormData);
      showToast.success('Student updated successfully');
      setStudentDetails(prev => ({ ...prev, student: { ...prev.student, ...updated } }));
      setIsEditMode(false);
      // Update list silently
      setStudents(students.map(s => s._id === selectedStudentId ? { ...s, ...updated } : s));
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Failed to update student');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteStudent(selectedStudentId);
      showToast.success('Student removed successfully');
      setIsDeleteModalOpen(false);
      setIsViewModalOpen(false);
      fetchStudents();
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Failed to delete student');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">Manage Students</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">View and manage all student accounts and allocations.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={fetchStudents}
          className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-slate-600 dark:text-slate-300 text-sm font-semibold"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-500' : ''}`} />
          <span>Refresh List</span>
        </motion.button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between gap-4 bg-slate-50/30 dark:bg-slate-800/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search students by name, email or course..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset page on search
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm dark:text-slate-200"
            />
          </div>
          <div className="flex space-x-2 items-center flex-wrap gap-2">
            <select 
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 bg-white border border-slate-200 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold text-slate-700 cursor-pointer"
            >
              <option value="createdAt:desc">Newest First</option>
              <option value="createdAt:asc">Oldest First</option>
              <option value="name:asc">Name (A-Z)</option>
              <option value="name:desc">Name (Z-A)</option>
            </select>
            <div className="flex items-center space-x-2">
              <div className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </div>
            <select 
              value={courseFilter}
              onChange={(e) => {
                setCourseFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <option value="All">All Courses</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Engineering">Engineering</option>
              <option value="Business">Business</option>
              <option value="Arts">Arts</option>
            </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        ) : students.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 text-slate-500">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-lg font-bold text-slate-700">No students found</p>
            <p className="text-sm font-medium text-slate-500 mt-1">Try adjusting your search or filters.</p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-700/50 border-b border-slate-200/80 dark:border-slate-700">
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contact</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Course Info</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Room</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {students.map((student, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={student._id} 
                    className="hover:bg-blue-50/30 dark:hover:bg-slate-700/30 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{student.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">ID: {student._id.substring(0, 6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-slate-600 dark:text-slate-300">{student.email}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{student.phone || 'N/A'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-slate-600 dark:text-slate-300">{student.course || 'N/A'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{student.year ? `Year ${student.year}` : ''}</p>
                    </td>
                    <td className="py-4 px-6">
                      {student.roomId ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          Room {student.roomId.number}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleViewStudent(student._id)}
                          className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
                        >
                          View Profile
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedStudentId(student._id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {!isLoading && students.length > 0 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 dark:text-slate-400 gap-4">
            <span>Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalStudents)} of {totalStudents} students</span>
            <div className="flex space-x-1">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 flex items-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1.5 font-medium text-slate-700 dark:text-slate-300">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 flex items-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View/Edit Profile Modal */}
      <AnimatePresence>
      {isViewModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-8 border border-slate-200 dark:border-slate-700"
          >
            <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/80 dark:bg-slate-800/80 sticky top-0 z-10 backdrop-blur-md">
              <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">
                {isEditMode ? 'Edit Student Profile' : 'Student Profile'}
              </h2>
              <div className="flex items-center space-x-2">
                {!isEditMode && studentDetails && (
                  <>
                    <button 
                      onClick={() => setIsEditMode(true)}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
                <button 
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {isDetailsLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : studentDetails && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column - Details Form/View */}
                  <div className="md:col-span-1 space-y-6">
                    <div className="text-center p-6 border border-gray-100 dark:border-slate-700 rounded-2xl bg-gray-50/50 dark:bg-slate-800/50">
                      <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-3xl mx-auto mb-4">
                        {studentDetails.student.name.charAt(0).toUpperCase()}
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-slate-100">{studentDetails.student.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-slate-400">{studentDetails.student.email}</p>
                      <div className="mt-4">
                        {studentDetails.student.roomId ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
                            Room {studentDetails.student.roomId.number}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50">
                            Unassigned Room
                          </span>
                        )}
                      </div>
                    </div>

                    {isEditMode ? (
                      <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">Full Name</label>
                          <input 
                            type="text" required value={editFormData.name} 
                            onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                            className="w-full p-2 text-sm border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">Email</label>
                          <input 
                            type="email" required value={editFormData.email} 
                            onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                            className="w-full p-2 text-sm border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">Phone Number</label>
                          <input 
                            type="text" value={editFormData.phone} 
                            onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                            className="w-full p-2 text-sm border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">Course</label>
                          <input 
                            type="text" value={editFormData.course} 
                            onChange={(e) => setEditFormData({...editFormData, course: e.target.value})}
                            className="w-full p-2 text-sm border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">Year</label>
                          <input 
                            type="text" value={editFormData.year} 
                            onChange={(e) => setEditFormData({...editFormData, year: e.target.value})}
                            className="w-full p-2 text-sm border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" 
                          />
                        </div>
                        <div className="flex space-x-2 pt-2">
                          <button type="button" onClick={() => setIsEditMode(false)} className="flex-1 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-600">Cancel</button>
                          <button type="submit" className="flex-1 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save</button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-slate-400">Phone Number</p>
                          <p className="text-sm text-gray-900 dark:text-slate-200 font-medium">{studentDetails.student.phone || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-slate-400">Course & Year</p>
                          <p className="text-sm text-gray-900 dark:text-slate-200 font-medium">
                            {studentDetails.student.course || 'N/A'} {studentDetails.student.year ? `(${studentDetails.student.year})` : ''}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-slate-400">Joined Date</p>
                          <p className="text-sm text-gray-900 dark:text-slate-200 font-medium">{new Date(studentDetails.student.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - History Tabs */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Complaints History */}
                    <div className="border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden">
                      <div className="bg-gray-50/50 dark:bg-slate-800/50 px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                        <h4 className="font-bold text-gray-800 dark:text-slate-200 text-sm">Complaint History</h4>
                      </div>
                      <div className="p-0">
                        {studentDetails.complaints.length === 0 ? (
                          <div className="p-6 text-center text-gray-500 dark:text-slate-400 text-sm">No complaints submitted.</div>
                        ) : (
                          <div className="max-h-[250px] overflow-y-auto divide-y divide-gray-50 dark:divide-slate-700/50">
                            {studentDetails.complaints.map(comp => (
                              <div key={comp._id} className="p-4 hover:bg-gray-50/50 dark:hover:bg-slate-700/30">
                                <div className="flex justify-between items-start mb-1">
                                  <p className="font-semibold text-sm text-gray-900 dark:text-slate-200">{comp.title}</p>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                    comp.status === 'Resolved' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                                    comp.status === 'In Progress' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                  }`}>
                                    {comp.status}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-1">{comp.description}</p>
                                <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">{new Date(comp.createdAt).toLocaleDateString()}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Leave History */}
                    <div className="border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden">
                      <div className="bg-gray-50/50 dark:bg-slate-800/50 px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                        <h4 className="font-bold text-gray-800 dark:text-slate-200 text-sm">Leave History</h4>
                      </div>
                      <div className="p-0">
                        {studentDetails.leaves.length === 0 ? (
                          <div className="p-6 text-center text-gray-500 dark:text-slate-400 text-sm">No leave requests submitted.</div>
                        ) : (
                          <div className="max-h-[250px] overflow-y-auto divide-y divide-gray-50 dark:divide-slate-700/50">
                            {studentDetails.leaves.map(leave => (
                              <div key={leave._id} className="p-4 hover:bg-gray-50/50 dark:hover:bg-slate-700/30">
                                <div className="flex justify-between items-start mb-1">
                                  <p className="font-semibold text-sm text-gray-900 dark:text-slate-200">{leave.reason}</p>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                    leave.status === 'Approved' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                                    leave.status === 'Rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                  }`}>
                                    {leave.status}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-slate-400">To: {leave.destination}</p>
                                <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">
                                  {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
      {isDeleteModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-sm shadow-2xl p-8 text-center border border-slate-100 dark:border-slate-700"
          >
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-rose-100 dark:bg-rose-900/30 rounded-full animate-ping opacity-20"></div>
              <AlertCircle className="w-10 h-10 text-rose-500" />
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2 tracking-tight">Delete Student?</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Are you sure you want to delete this student? This action cannot be undone and their room allocation will be cleared.
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default ManageStudents;
