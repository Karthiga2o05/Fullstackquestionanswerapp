import { Navigate } from 'react-router';
import { useAuth } from '@/app/contexts/AuthContext';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  role: 'ADMIN' | 'USER';
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== role) {
    // Redirect to appropriate dashboard based on user role
    if (user?.role === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/user" replace />;
  }

  return <>{children}</>;
}
