import axios from 'axios';
import useAuth from './useAuth.jsx';
import {useEffect} from 'react'

const axiosSecure = axios.create({
    baseURL: 'http://localhost:3000',
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