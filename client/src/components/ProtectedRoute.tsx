import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocation, Redirect } from 'wouter';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, logout } = useAuth();
  const [location, navigate] = useLocation();

  useEffect(() => {
    // If not authenticated and not already on login page, redirect to login
    console.log('ProtectedRoute check:', { isAuthenticated, loading, location });
    
    // Additional check to ensure user is still authenticated
    if (!loading && !isAuthenticated && location.startsWith('/admin-panel')) {
      console.log('User not authenticated, redirecting to login');
      navigate('/admin/login');
    }
  }, [isAuthenticated, loading, location, navigate]);

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