import { useState, useEffect } from 'react';
import { FiPlus, FiAlertCircle, FiCheckCircle, FiClock, FiX, FiDownload } from 'react-icons/fi';
import { getMyComplaints, createComplaint } from '../services/complaintService';
import showToast from '../utils/toast';
import { generateComplaintReportPDF } from '../utils/pdfGenerator';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Electricity',
    description: ''
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      const data = await getMyComplaints();
      setComplaints(data);
    } catch (err) {
      setError('Failed to load complaints. Please try again later.');
      showToast.error('Failed to load complaints');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Resolved': return <FiCheckCircle className="text-emerald-500 w-5 h-5" />;
      case 'In Progress': return <FiClock className="text-blue-500 w-5 h-5" />;
      default: return <FiAlertCircle className="text-amber-500 w-5 h-5" />;
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center space-x-1";
    if (status === 'Resolved') return <span className={`${base} bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400`}>{getStatusIcon(status)}<span>{status}</span></span>;
    if (status === 'In Progress') return <span className={`${base} bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400`}>{getStatusIcon(status)}<span>{status}</span></span>;
    return <span className={`${base} bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400`}>{getStatusIcon(status)}<span>{status}</span></span>;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await createComplaint(formData);
      showToast.success('Complaint submitted successfully!');
      setIsModalOpen(false);
      setFormData({ title: '', type: 'Electricity', description: '' });
      fetchComplaints(); // Refresh the list
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to submit complaint';
      setError(errMsg);
      showToast.error(errMsg);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">My Complaints</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Track and manage your maintenance requests</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-colors font-medium shadow-sm shadow-blue-600/20 w-full sm:w-auto justify-center"
        >
          <FiPlus className="w-5 h-5" />
          <span>New Complaint</span>
        </button>
      </div>

      {error && !isModalOpen && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center">
          <FiAlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : complaints.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-12 text-center shadow-sm">
          <div className="mx-auto w-16 h-16 bg-gray-50 dark:bg-slate-700/50 text-gray-400 dark:text-slate-500 rounded-full flex items-center justify-center mb-4">
            <FiCheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">No Complaints</h3>
          <p className="text-gray-500 dark:text-slate-400 mt-1">You haven't raised any complaints yet.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-100 dark:border-slate-700 text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Type</th>
                    <th className="p-4 font-semibold">Issue Details</th>
                    <th className="p-4 font-semibold text-right">Status</th>
                    <th className="p-4 font-semibold text-right">Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50">
                  {complaints.map((comp) => (
                    <tr key={comp._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="p-4 text-sm text-gray-500 dark:text-slate-400 whitespace-nowrap">
                        {new Date(comp.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm font-medium text-gray-700 dark:text-slate-300 whitespace-nowrap">{comp.type}</td>
                      <td className="p-4">
                        <p className="text-sm font-semibold text-gray-900 dark:text-slate-200">{comp.title}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 truncate max-w-xs md:max-w-md">{comp.description}</p>
                        {comp.adminResponse && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 bg-blue-50 dark:bg-blue-900/30 p-1 rounded inline-block">
                            Admin Note: {comp.adminResponse}
                          </p>
                        )}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">{getStatusBadge(comp.status)}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => generateComplaintReportPDF(comp)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          title="Download Report"
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
            {complaints.map((comp) => (
              <div key={comp._id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-slate-200 truncate">{comp.title}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{comp.type} • {new Date(comp.createdAt).toLocaleDateString()}</p>
                  </div>
                  {getStatusBadge(comp.status)}
                </div>
                <p className="text-xs text-gray-600 dark:text-slate-400 line-clamp-2">{comp.description}</p>
                {comp.adminResponse && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg">
                    Admin: {comp.adminResponse}
                  </p>
                )}
                <div className="flex justify-end">
                  <button 
                    onClick={() => generateComplaintReportPDF(comp)}
                    className="flex items-center space-x-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 p-2 rounded-lg transition-colors"
                  >
                    <FiDownload className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Complaint Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Log a Complaint</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors p-1"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {error && isModalOpen && (
                <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start">
                  <FiAlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Category</label>
                  <select 
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full border-gray-200 dark:border-slate-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 p-2.5 border outline-none bg-gray-50 dark:bg-slate-900 transition-all text-sm dark:text-slate-200"
                    required
                  >
                    <option value="Electricity">Electricity</option>
                    <option value="Water">Water</option>
                    <option value="Internet">Internet</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Issue Title</label>
                  <input 
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border-gray-200 dark:border-slate-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 p-2.5 border outline-none bg-gray-50 dark:bg-slate-900 transition-all text-sm dark:text-slate-200" 
                    placeholder="E.g., AC not cooling"
                    required
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Description</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4" 
                    className="w-full border-gray-200 dark:border-slate-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 p-2.5 border outline-none bg-gray-50 dark:bg-slate-900 transition-all text-sm resize-none dark:text-slate-200" 
                    placeholder="Describe the issue in detail..."
                    required
                  ></textarea>
                </div>
              </div>
              <div className="mt-6 flex space-x-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-5 py-2.5 text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl font-medium transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors shadow-sm shadow-blue-600/20 text-sm"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;
