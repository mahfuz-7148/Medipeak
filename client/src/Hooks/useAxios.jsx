import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `https://medipeak.vercel.app`
});

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;