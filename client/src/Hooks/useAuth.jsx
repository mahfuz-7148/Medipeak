import {use} from 'react';
import {AuthContext} from '../Contexts/Authprovider.jsx';


const useAuth = () => {
     const auth =  use(AuthContext);
     return auth
};

export default useAuth;