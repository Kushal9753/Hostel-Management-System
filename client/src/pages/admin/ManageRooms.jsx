import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Users, ChevronLeft, ChevronRight, Filter, Home, RefreshCw, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import showToast from '../../utils/toast';
import { getAllRooms, addRoom, updateRoom, deleteRoom, assignStudentToRoom } from '../../services/roomService';
import { getStudents } from '../../services/studentService';
import { generateRoomOccupancyReportPDF } from '../../utils/pdfGenerator';
import { FiDownload } from 'react-icons/fi';

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search, Filter, Sort, Pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBlock, setFilterBlock] = useState('All');
  const [sortOrder, setSortOrder] = useState('roomNumber:asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Forms state
  const [formData, setFormData] = useState({
    roomNumber: '',
    block: '',
    floor: '',
    capacity: 2,
    status: 'Available'
  });

  // Assign Student state
  const [studentSearch, setStudentSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search rooms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [filterStatus, filterBlock, sortOrder]);

  useEffect(() => {
    fetchRooms();
  }, [debouncedSearch, filterStatus, filterBlock, sortOrder, page]);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const data = await getAllRooms({
        page,
        limit: 10,
        search: debouncedSearch,
        status: filterStatus,
        block: filterBlock,
        sort: sortOrder
      });
      setRooms(data.rooms);
      setTotalPages(data.totalPages);
    } catch (err) {
      showToast.error('Failed to fetch rooms');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setFormData({ roomNumber: '', block: '', floor: '', capacity: 2, status: 'Available' });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (room) => {
    setSelectedRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      block: room.block,
      floor: room.floor,
      capacity: room.capacity,
      status: room.status
    });
    setIsEditModalOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await addRoom(formData);
      showToast.success('Room added successfully');
      setIsAddModalOpen(false);
      fetchRooms();
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to add room');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateRoom(selectedRoom._id, formData);
      showToast.success('Room updated successfully');
      setIsEditModalOpen(false);
      fetchRooms();
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to update room');
    }
  };

  const handleDeleteRoom = async () => {
    try {
      await deleteRoom(selectedRoom._id);
      showToast.success('Room deleted successfully');
      setIsDeleteModalOpen(false);
      fetchRooms();
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to delete room');
    }
  };

  const fetchUnassignedStudents = async (term = '') => {
    try {
      setIsSearching(true);
      const data = await getStudents({ search: term, limit: 10, unassigned: true });
      setSearchResults(data.students);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchStudents = (e) => {
    const term = e.target.value;
    setStudentSearch(term);
    fetchUnassignedStudents(term);
  };

  const handleAssignStudent = async (studentId) => {
    try {
      await assignStudentToRoom(selectedRoom._id, studentId);
      showToast.success('Student assigned to room successfully');
      setIsAssignModalOpen(false);
      fetchRooms();
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to assign student');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">Manage Rooms</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Add, edit, or remove hostel rooms and view occupancy.</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchRooms}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-slate-600 dark:text-slate-300 text-sm font-semibold"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-500' : ''}`} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => generateRoomOccupancyReportPDF(rooms)}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 border border-transparent shadow-sm rounded-xl transition-all text-sm font-semibold"
            title="Download Report"
          >
            <FiDownload className="w-4 h-4" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenAddModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors shadow-lg shadow-emerald-600/20 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Room</span>
          </motion.button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between gap-4 bg-slate-50/30 dark:bg-slate-800/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by room number..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm dark:text-slate-200"
            />
          </div>
          <div className="flex space-x-2 items-center flex-wrap gap-2">
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <option value="roomNumber:asc">Room No (Asc)</option>
              <option value="roomNumber:desc">Room No (Desc)</option>
              <option value="createdAt:desc">Newest Added</option>
            </select>
            
            <div className="flex items-center space-x-2">
              <div className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </div>
              <select 
                value={filterBlock}
                onChange={(e) => setFilterBlock(e.target.value)}
                className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <option value="All">All Blocks</option>
                <option value="Block A">Block A</option>
                <option value="Block B">Block B</option>
                <option value="Block C">Block C</option>
              </select>

              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Full">Full</option>
                <option value="Under Maintenance">Under Maintenance</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        ) : rooms.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 text-slate-500">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-lg font-bold text-slate-700">No rooms found</p>
            <p className="text-sm font-medium text-slate-500 mt-1">Try adjusting your search or filters.</p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-700/50 border-b border-slate-200/80 dark:border-slate-700">
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Room No.</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Floor & Block</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Occupancy</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {rooms.map((room, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={room._id} 
                    className="hover:bg-emerald-50/30 dark:hover:bg-slate-700/30 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">{room.roomNumber}</span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{room.block}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Floor {room.floor}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2 overflow-hidden">
                          {[...Array(room.occupiedBeds || 0)].map((_, i) => (
                            <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-800 bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                              <Users className="w-4 h-4" />
                            </div>
                          ))}
                          {[...Array(Math.max(0, (room.capacity || 0) - (room.occupiedBeds || 0)))].map((_, i) => (
                            <div key={`empty-${i}`} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-800 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 border-dashed flex items-center justify-center" />
                          ))}
                        </div>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-2">
                          {room.occupiedBeds || 0}/{room.capacity}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        room.status === 'Available' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50' : 
                        room.status === 'Under Maintenance' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50' :
                        'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/50'
                      }`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => { 
                            setSelectedRoom(room); 
                            setStudentSearch(''); 
                            setIsAssignModalOpen(true); 
                            fetchUnassignedStudents('');
                          }}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" 
                          title="Assign Student"
                        >
                          <Users className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenEditModal(room)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Room"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { setSelectedRoom(room); setIsDeleteModalOpen(true); }}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Room"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

      {/* Add / Edit Room Modal */}
      <AnimatePresence>
        {(isAddModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
            >
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{isEditModalOpen ? 'Edit Room' : 'Add New Room'}</h2>
                <button 
                  onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={isEditModalOpen ? handleEditSubmit : handleAddSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Room Number</label>
                  <input 
                    type="text" required value={formData.roomNumber}
                    onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Block</label>
                    <input 
                      type="text" required value={formData.block}
                      onChange={(e) => setFormData({...formData, block: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Floor</label>
                    <input 
                      type="number" required min="0" value={formData.floor}
                      onChange={(e) => setFormData({...formData, floor: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Capacity</label>
                    <input 
                      type="number" required min="1" value={formData.capacity}
                      onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  {isEditModalOpen && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
                      <select 
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      >
                        <option value="Available">Available</option>
                        <option value="Full">Full</option>
                        <option value="Under Maintenance">Under Maintenance</option>
                      </select>
                    </div>
                  )}
                </div>
                <div className="pt-4 flex space-x-3">
                  <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors">{isEditModalOpen ? 'Save Changes' : 'Add Room'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Assign Student Modal */}
        {isAssignModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col max-h-[80vh]"
            >
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 flex-shrink-0">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Assign Student to {selectedRoom?.roomNumber}</h2>
                <button 
                  onClick={() => setIsAssignModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search unassigned students..." 
                    value={studentSearch}
                    onChange={handleSearchStudents}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm dark:text-slate-200"
                  />
                </div>
                
                {isSearching ? (
                  <div className="py-8 text-center text-slate-500 dark:text-slate-400">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map(student => (
                      <div key={student._id} className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <div>
                          <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{student.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{student.course} • {student.email}</p>
                        </div>
                        <button 
                          onClick={() => handleAssignStudent(student._id)}
                          className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold text-xs rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                        >
                          Assign
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">No unassigned students found matching "{studentSearch}"</div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
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
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2 tracking-tight">Delete Room {selectedRoom?.roomNumber}?</h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                Are you sure you want to delete this room? This action cannot be undone. You can only delete rooms that are not currently occupied.
              </p>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteRoom}
                  className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20"
                >
                  Delete Room
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageRooms;
