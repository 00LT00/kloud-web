import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '../models/useUser';

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, requesting } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate, requesting]);

  return children;
}

export default RequireAuth;
