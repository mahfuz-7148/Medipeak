import {use} from 'react';
import {AuthContext} from '../Contexts/Authprovider.jsx';


const useAuth = () => {
     return use(AuthContext)
};

export default useAuth;