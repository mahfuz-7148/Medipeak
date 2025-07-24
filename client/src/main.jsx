import {createRoot} from 'react-dom/client';
import './index.css';
import {RouterProvider} from 'react-router';
import {router} from './Router/Routes.jsx';
import Authprovider from './Contexts/Authprovider.jsx';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
    <Authprovider>
        <RouterProvider router={router} />

    </Authprovider>
    </QueryClientProvider>
);