import { useQuery } from '@tanstack/react-query'
import useAuth from './useAuth.jsx';
import useAxiosSecure from './useAxiosSecure.jsx';


const useUserRole = () => {
    const { saveUser, loading: authLoading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const {
        data: role = 'user',
        isLoading: roleLoading,
        refetch,
    } = useQuery({
        queryKey: ['userRole', saveUser?.email],
        enabled: !authLoading && !!saveUser?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${saveUser.email}/role`);
            return res.data.role;
        },
    });

    return { role, roleLoading: roleLoading, refetch };
};

export default useUserRole;