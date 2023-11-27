import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
  const { token } = useSelector((state) => state.account);

  if (!token) return <Navigate to="/auth/login" replace />;

  return <Outlet />;
};

export default ProtectedRoutes;
