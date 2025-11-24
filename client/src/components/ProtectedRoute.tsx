import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocation, Redirect } from 'wouter';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  const [location] = useLocation();

  // Show loading state while checking auth
  if (loading) {
    console.log('Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Redirect to="/admin/login" />;
  }

  // If authenticated, render children
  console.log('Authenticated, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;