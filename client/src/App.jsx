import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import RoomDetails from './pages/RoomDetails';
import Complaints from './pages/Complaints';
import LeaveRequests from './pages/LeaveRequests';
import Downloads from './pages/Downloads';
import AdminLayout from './layouts/AdminLayout';
import DashboardOverview from './pages/admin/DashboardOverview';
import ManageStudents from './pages/admin/ManageStudents';
import ManageRooms from './pages/admin/ManageRooms';
import ManageComplaints from './pages/admin/ManageComplaints';
import ManageLeaves from './pages/admin/ManageLeaves';
import Reports from './pages/admin/Reports';
import PrivateRoute from './components/PrivateRoute';
import StudentLayout from './layouts/StudentLayout';
import { Toaster } from 'react-hot-toast';

// Layout wrapper for public pages (with Navbar)
const PublicLayout = ({ children, showNavbar = true }) => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 flex flex-col font-sans text-slate-900 dark:text-slate-100">
    {showNavbar && <Navbar />}
    <main className="flex-grow container mx-auto px-4 py-8">
      {children}
    </main>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster 
            position="top-right" 
            toastOptions={{
              className: 'font-sans dark:bg-slate-800 dark:text-slate-100 dark:border dark:border-slate-700',
            style: {
              borderRadius: '12px',
              background: '#333',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '500',
              padding: '16px',
            },
            success: { style: { background: '#10b981' } },
            error: { style: { background: '#ef4444' } },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout showNavbar={false}><Login /></PublicLayout>} />
          <Route path="/register" element={<PublicLayout showNavbar={false}><Register /></PublicLayout>} />
          <Route path="/admin-login" element={<PublicLayout showNavbar={false}><AdminLogin /></PublicLayout>} />

          {/* Protected Student Routes with Sidebar Layout */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute requireAdmin={false}>
                <StudentLayout />
              </PrivateRoute>
            } 
          >
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="room" element={<RoomDetails />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="leaves" element={<LeaveRequests />} />
            <Route path="downloads" element={<Downloads />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route 
            path="/admin-dashboard" 
            element={
              <PrivateRoute requireAdmin={true}>
                <AdminLayout />
              </PrivateRoute>
            } 
          >
            <Route index element={<DashboardOverview />} />
            <Route path="students" element={<ManageStudents />} />
            <Route path="rooms" element={<ManageRooms />} />
            <Route path="complaints" element={<ManageComplaints />} />
            <Route path="leaves" element={<ManageLeaves />} />
            <Route path="reports" element={<Reports />} />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
