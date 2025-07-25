import axios from 'axios';
import useAuth from './useAuth.jsx';
import {useEffect} from 'react'

const axiosSecure = axios.create({
    baseURL: 'https://medipeak.vercel.app',
});

const useAxiosSecure = () => {
    const { saveUser } = useAuth();

    useEffect(() => {
        const reqInt =  axiosSecure.interceptors.request.use(
            (config) => {
                if (saveUser || saveUser?.accessToken) {
                    config.headers.authorization = `Bearer ${saveUser?.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
        return () => {
            axiosSecure.interceptors.request.eject(reqInt)
        }
    }, [saveUser]);

    return axiosSecure;
};

export default useAxiosSecure;