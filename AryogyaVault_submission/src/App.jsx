import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layouts
import AppLayout from './components/AppLayout';
import PublicLayout from './components/PublicLayout';
import DoctorLayout from './components/DoctorLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorLogin from './pages/DoctorLogin';
import DoctorRegister from './pages/DoctorRegister';
import Dashboard from './pages/Dashboard';
import MedicalProfile from './pages/MedicalProfile';
import FamilyDashboard from './pages/FamilyDashboard';
import Documents from './pages/Documents';
import EmergencyQRPage from './pages/EmergencyQRPage';
import Emergency from './pages/Emergency';
import DoctorDashboard from './pages/DoctorDashboard';
import Settings from './pages/Settings';

// Protected Route Component
function PrivateRoute({ children, allowedRoles }) {
  const { currentUser, userData, loading } = useAuth();
  
  if (loading) return <div className="loading-page"><div className="spinner"></div><p>Verifying session...</p></div>;
  if (!currentUser) return <Navigate to="/login" />;
  
  if (allowedRoles && userData) {
    if (!allowedRoles.includes(userData.role)) {
      // Redirect based on role
      return userData.role === 'doctor' ? <Navigate to="/doctor-dashboard" /> : <Navigate to="/dashboard" />;
    }
  }
  
  return children;
}

function App() {
  return (
    <Routes>
      {/* Public Routes with Navbar/Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/doctor-register" element={<DoctorRegister />} />
      </Route>

      {/* Emergency Access Route (Public but no standard layout) */}
      <Route path="/emergency/:userId" element={<Emergency />} />

      {/* Protected Routes inside App Layout */}
      <Route element={<AppLayout />}>
        {/* Patient Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute allowedRoles={['patient']}><Dashboard /></PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute allowedRoles={['patient']}><MedicalProfile /></PrivateRoute>
        } />
        <Route path="/family" element={
          <PrivateRoute allowedRoles={['patient']}><FamilyDashboard /></PrivateRoute>
        } />
        <Route path="/documents" element={
          <PrivateRoute allowedRoles={['patient']}><Documents /></PrivateRoute>
        } />
        <Route path="/qr" element={
          <PrivateRoute allowedRoles={['patient']}><EmergencyQRPage /></PrivateRoute>
        } />
        <Route path="/settings" element={
          <PrivateRoute allowedRoles={['patient']}><Settings /></PrivateRoute>
        } />
      </Route>

      {/* Doctor Layout */}
      <Route element={<DoctorLayout />}>
        <Route path="/doctor-dashboard" element={
          <PrivateRoute allowedRoles={['doctor']}><DoctorDashboard /></PrivateRoute>
        } />
      </Route>
    </Routes>
  );
}

export default App;
