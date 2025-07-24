import { Navigate } from 'react-router';
import useAuth from '../Hooks/useAuth.jsx';
import useUserRole from '../Hooks/useUserRole.jsx';

const AdminRoute = ({ children }) => {
    const { saveUser, loading } = useAuth();
    const { role, roleLoading } = useUserRole();

    if (roleLoading || loading) {
        return <span className="loading loading-spinner loading-xl"></span>
    }

    if (!saveUser || role !== 'admin') {
        return <Navigate state={{ from: location.pathname }} to="/forbidden"></Navigate>
    }

    return children;
};

export default AdminRoute;