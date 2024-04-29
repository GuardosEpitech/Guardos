import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginSuccess: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('user', token);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return null;
};

export default LoginSuccess;