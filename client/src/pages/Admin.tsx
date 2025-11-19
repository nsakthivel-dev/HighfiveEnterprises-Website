import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/admin-panel');
  }, [navigate]);

  return null;
};

export default Admin;