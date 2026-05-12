import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiPhone, FiBook, FiCalendar, FiCamera, FiTrash2, FiSave, FiX, FiEdit2, FiDownload } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../services/api';
import showToast from '../utils/toast';
import { generateStudentProfileReportPDF } from '../utils/pdfGenerator';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  // Edit form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    course: user?.course || ''
  });

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast.error('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
    
    uploadImage(file);
  };

  const uploadImage = async (file) => {
    setIsUploading(true);
    const form = new FormData();
    form.append('image', file);

    try {
      const response = await api.post('/api/auth/profile/image', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser({ profileImage: response.data.profileImage });
      showToast.success('Profile image updated successfully');
      setPreviewImage(null);
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Failed to upload image');
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteImage = async () => {
    if (!window.confirm('Are you sure you want to delete your profile image?')) return;
    
    setIsUploading(true);
    try {
      await api.delete('/api/auth/profile/image');
      updateUser({ profileImage: '' });
      showToast.success('Profile image removed');
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Failed to delete image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await api.put('/api/auth/profile', formData);
      updateUser(response.data);
      showToast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEdit = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      course: user?.course || '',
      year: user?.year || ''
    });
    setIsEditing(false);
  };

  const handleDownloadReport = async () => {
    try {
      // Optional: fetch real stats to include in the report
      const { data } = await api.get('/api/students/dashboard');
      generateStudentProfileReportPDF(user, data);
    } catch (error) {
      // If error fetching stats, just generate with 0s
      generateStudentProfileReportPDF(user, null);
    }
  };

  const currentImage = previewImage || user?.profileImage;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">My Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Manage your personal and academic information.</p>
        </div>
        <button 
          onClick={handleDownloadReport}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <FiDownload className="w-4 h-4" />
          <span>Download Report</span>
        </button>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700 overflow-hidden relative">
        {/* Cover Photo Area */}
        <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-500 relative">
          <div className="absolute inset-0 bg-black/10"></div>
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBoNDBWMEgwem0yMCAyMGgtdjIwSDIwem0wIDBoMjBWMjBIMjB6IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        </div>
        
        <div className="px-6 sm:px-10 pb-10">
          {/* Profile Header (Picture + Name) layout to prevent overlap */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 sm:-mt-20 mb-8 relative z-10">
            {/* Profile Picture */}
            <div className="relative group flex-shrink-0">
              <div className="relative border-4 border-white dark:border-slate-800 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shadow-lg overflow-hidden">
                {currentImage ? (
                  <img src={currentImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl sm:text-6xl font-black text-blue-500 dark:text-blue-400">{user?.name?.charAt(0).toUpperCase()}</span>
                )}
                
                {/* Overlay for uploading */}
                <div 
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm"
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <FiCamera className="w-8 h-8 text-white mb-1" />
                      <span className="text-white text-xs font-semibold tracking-wider uppercase">Change</span>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef} 
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isUploading}
                />
              </div>
              
              {user?.profileImage && !isUploading && (
                <button 
                  onClick={handleDeleteImage}
                  className="absolute bottom-0 right-0 sm:bottom-2 sm:right-2 p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-lg border-2 border-white dark:border-slate-800 transition-transform hover:scale-110 tooltip-trigger"
                  title="Remove Image"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Name and Status */}
            <div className="text-center sm:text-left pb-2 flex-1 w-full">
              {isEditing ? (
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleEditChange}
                  className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-2 w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-center sm:text-left"
                  placeholder="Your Name"
                />
              ) : (
                <>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{user?.name}</h2>
                  <div className="inline-flex items-center mt-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-800/50 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                    Active Student
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Contact Info Card */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center">
                  <FiMail className="mr-2 text-blue-500" /> Contact Information
                </h3>
              </div>
              
              <ul className="space-y-5">
                <li>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Email Address</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{user?.email}</p>
                </li>
                <li>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Phone Number</p>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-800 dark:text-slate-200"
                      placeholder="e.g. +1 234 567 890"
                    />
                  ) : (
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{user?.phone || <span className="text-slate-400 italic font-medium">Not provided</span>}</p>
                  )}
                </li>
              </ul>
            </div>

            {/* Academic Info Card */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center">
                  <FiBook className="mr-2 text-indigo-500" /> Academic Details
                </h3>
              </div>
              
              <ul className="space-y-5">
                <li>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Course / Program</p>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="course"
                      value={formData.course}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-800 dark:text-slate-200"
                      placeholder="e.g. Computer Science"
                    />
                  ) : (
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{user?.course || <span className="text-slate-400 italic font-medium">Not assigned</span>}</p>
                  )}
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end">
            {isEditing ? (
              <div className="flex gap-3 w-full sm:w-auto">
                <button 
                  onClick={cancelEdit}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 px-6 py-2.5 rounded-xl font-bold transition-all"
                >
                  <FiX className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FiSave className="w-4 h-4" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-slate-900/10"
              >
                <FiEdit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
