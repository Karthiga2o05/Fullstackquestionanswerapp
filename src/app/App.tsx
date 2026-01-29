import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/app/contexts/AuthContext';
import { DataProvider } from '@/app/contexts/DataContext';
import Login from '@/app/components/Login';
import Register from '@/app/components/Register';
import AdminDashboard from '@/app/components/AdminDashboard';
import UserDashboard from '@/app/components/UserDashboard';
import ProtectedRoute from '@/app/components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/*"
              element={
                <ProtectedRoute role="USER">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}
