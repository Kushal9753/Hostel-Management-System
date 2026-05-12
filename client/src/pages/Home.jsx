import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    if (user?.role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // If not logged in, redirect to login page
  return <Navigate to="/login" replace />;
};

export default Home;
