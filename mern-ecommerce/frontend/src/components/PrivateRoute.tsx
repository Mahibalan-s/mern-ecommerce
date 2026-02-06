import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const PrivateRoute = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  // If user exists, show the child components (Outlet), otherwise redirect to login
  return userInfo ? <Outlet /> : <Navigate to='/login' replace />;
};

export default PrivateRoute;