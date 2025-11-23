import { useEffect } from 'react';
import { useLocation } from 'wouter';

const Admin = () => {
  const [, navigate] = useLocation();

  useEffect(() => {
    navigate('/admin/login');
  }, [navigate]);

  return null;
};

export default Admin;