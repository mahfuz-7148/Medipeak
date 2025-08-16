import { createBrowserRouter } from 'react-router';
import Home from '../Pages/Home.jsx';
import Login from '../Pages/Login.jsx';
import Register from '../Pages/Register.jsx';
import Root from '../Layouts/Root.jsx';
import NotFound from '../Components/NotFound.jsx';
import DashboardLayout from '../Layouts/DashboardLayout.jsx';
import AvailableCamps from '../Pages/AvailableCamps.jsx';
import AddCamp from '../Pages/Dashboard/OrganizerDashboard/AddCamp.jsx';
import OrganizerProfile from '../Pages/Dashboard/OrganizerDashboard/OrganizerProfile.jsx';
import OrganizerCamps from '../Pages/Dashboard/OrganizerDashboard/OrganizerCamps.jsx';
import CampDetails from '../Pages/CampDetails.jsx';
import ManageCamps from '../Pages/Dashboard/OrganizerDashboard/ManageCamps.jsx';
import ParticipantCamps from '../Pages/Dashboard/ParticipantDashboard/ParticipantCamps.jsx';
import Payment from '../StripePayment/Payment.jsx';
import PaymentHistory from '../StripePayment/PaymentHistory.jsx';
import ParticipantCampsChart from '../Pages/Dashboard/ParticipantDashboard/ParticipantCampsChart.jsx';
import ParticipantProfile from '../Pages/Dashboard/ParticipantDashboard/ParticipantProfile.jsx';
import Forbidden from '../Pages/Forbidden.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import AdminRoute from './AdminRoute.jsx';
import About from '../Pages/About.jsx';
import Contact from '../Pages/Contact.jsx';



export const router = createBrowserRouter([
    {
        path: '/',
        Component: Root,
        children: [
            {
                index: true,
                Component: Home,
            },
            {
                path: '/available-camps',
                Component: AvailableCamps,
            },
            {
                path: '/camps/:id',
                Component: CampDetails,
            },
            {
                path: '/join-us',
                Component: Login,
            },
            {
                path: '/register',
                Component: Register
            },
            {
                path: '/about',
                Component: About
            },
            {
                path: '/contact',
                Component: Contact
            },
            {
                path: '/forbidden',
                Component: Forbidden
            },
        ],
    },
    {
        path: '/dashboard',
        element: <PrivateRoute>
            <DashboardLayout />
        </PrivateRoute>,
        children: [
            {
                path: 'organizer-profile',
                element: <AdminRoute>
                    <OrganizerProfile />
                </AdminRoute>
            },
            {
                path: 'add-camp',
                element: <AdminRoute>
                    <AddCamp />
                </AdminRoute>
            },
            {
                path: 'organizer-manager-camps',
                element: <AdminRoute>
                    <OrganizerCamps />
                </AdminRoute>
            },
            {
                path: 'organizer-manager-reg',
                element: <AdminRoute>
                    <ManageCamps />
                </AdminRoute>
            },
            {
                path: 'participant-profile',
                element: <PrivateRoute>
                    <ParticipantProfile />
                </PrivateRoute>
            },
            {
                path: 'participant-camps',
                element: <PrivateRoute>
                    <ParticipantCamps />
                </PrivateRoute>
            },
            {
                path: 'participant-charts',
                element: <PrivateRoute>
                    <ParticipantCampsChart />
                </PrivateRoute>
            },
            {
                path: 'payment/:registrationId',
                Component: Payment
            },
            {
                path: 'paymentHistory',
                element: <PrivateRoute>
                    <PaymentHistory />
                </PrivateRoute>
            },

        ],
    },
    {
        path: '/*',
        Component: NotFound,
    },
]);