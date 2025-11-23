import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../AuthContext';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } }
      }),
      signOut: jest.fn().mockResolvedValue({ error: null })
    }
  }
}));

// Test component to use the auth context
const TestComponent = () => {
  const { isAuthenticated, login, logout, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      </div>
      <button onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide initial auth state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should allow login with valid credentials', async () => {
    const user = userEvent.setup();
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for loading to finish
    await screen.findByTestId('auth-status');
    
    // Try to login with valid admin credentials
    await act(async () => {
      await user.click(screen.getByText('Login'));
    });
    
    // Should be authenticated now
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
  });

  it('should handle logout', async () => {
    const user = userEvent.setup();
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for loading to finish
    await screen.findByTestId('auth-status');
    
    // Login first
    await act(async () => {
      await user.click(screen.getByText('Login'));
    });
    
    // Should be authenticated
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    
    // Now logout
    await act(async () => {
      await user.click(screen.getByText('Logout'));
    });
    
    // Should not be authenticated anymore
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
  });
});