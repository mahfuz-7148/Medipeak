import React, { useState } from 'react';
import {NavLink, Outlet, useLocation, useNavigate} from 'react-router';
import { Layout, Menu, Drawer, Button, Typography } from 'antd';
import {
    HomeOutlined,
    MenuOutlined,
    UserOutlined,
    PlusOutlined,
    SettingOutlined,
    BarChartOutlined,
    CreditCardOutlined,
    CalendarOutlined,
    FileTextOutlined, LogoutOutlined,
} from '@ant-design/icons';
import useUserRole from '../Hooks/useUserRole.jsx';
import {getAuth, signOut} from 'firebase/auth';
import {app} from '../firebase.js';

const { Sider, Header, Content } = Layout;
const { Title } = Typography;

const DashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const auth = getAuth(app);
    const { role, roleLoading } = useUserRole();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            // Clear any user data from state/context if needed
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
            // You can add a notification here if needed
        }
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const showDrawer = () => {
        setDrawerVisible(true);
    };

    const onCloseDrawer = () => {
        setDrawerVisible(false);
    };

    // Fixed menu items array structure
    const menuItems = [
        {
            key: '/dashboard',
            icon: <HomeOutlined />,
            label: <NavLink to="/dashboard">Home</NavLink>, // Fixed path
        },
        // Fixed conditional rendering
        ...((!roleLoading && role === 'admin') ? [{
            key: '/dashboard/organizer-profile',
            icon: <UserOutlined />,
            label: <NavLink to="/dashboard/organizer-profile">Organizer Profile</NavLink>,
        },
            {
                key: '/dashboard/add-camp',
                icon: <PlusOutlined />,
                label: <NavLink to="/dashboard/add-camp">Add A Camp</NavLink>,
            },
            {
                key: '/dashboard/organizer-manager-camps',
                icon: <SettingOutlined />,
                label: <NavLink to="/dashboard/organizer-manager-camps">Manage Camps</NavLink>,
            },
            {
                key: '/dashboard/organizer-manager-reg',
                icon: <FileTextOutlined />,
                label: <NavLink to="/dashboard/organizer-manager-reg">Manage Registered Camps</NavLink>,
            }] : []),

        {
            key: '/dashboard/participant-charts',
            icon: <BarChartOutlined />,
            label: <NavLink to="/dashboard/participant-charts">Analytics</NavLink>,
        },
        {
            key: '/dashboard/participant-profile',
            icon: <UserOutlined />,
            label: <NavLink to="/dashboard/participant-profile">Participant Profile</NavLink>,
        },
        {
            key: '/dashboard/participant-camps',
            icon: <CalendarOutlined />,
            label: <NavLink to="/dashboard/participant-camps">Registered Camps</NavLink>,
        },
        {
            key: '/dashboard/paymentHistory',
            icon: <CreditCardOutlined />,
            label: <NavLink to="/dashboard/paymentHistory">Payment History</NavLink>,
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Desktop Sidebar */}

            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                breakpoint="lg"
                collapsedWidth="80"
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    height: '100vh',
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column'
                }}
                className="site-layout-background"
                width={250}
            >
                <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '120px' }}>
                    <div className="logo" style={{ padding: '16px', textAlign: 'center' }}>
                        {/* Add logo or text here if needed */}
                    </div>
                    <Menu
                        theme="light"
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        items={menuItems}
                        style={{ borderRight: 0 }}
                    />
                </div>
                <div style={{
                    padding: '16px',
                    borderTop: '1px solid #f0f0f0',
                    backgroundColor: '#fff',
                    position: 'absolute',
                    bottom: '40px',
                    left: 0,
                    right: 0,
                    zIndex: 1
                }}>
                    <Button
                        block
                        type="primary"
                        icon={<HomeOutlined />}
                        onClick={handleBackToHome}
                        style={{
                            marginBottom: '8px',
                            textAlign: 'left',
                            padding: '8px 16px',
                            height: 'auto',
                            lineHeight: '1.5',
                            backgroundColor: '#1A9B9B',
                            borderColor: '#1A9B9B'
                        }}
                    >
                        {!collapsed && 'Back to Home'}
                    </Button>
                    <Button
                        block
                        type="primary"
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        style={{
                            textAlign: 'left',
                            padding: '8px 16px',
                            height: 'auto',
                            lineHeight: '1.5',
                            backgroundColor: '#651C18',
                            borderColor: '#651C18'
                        }}
                    >
                        {!collapsed && 'Logout'}
                    </Button>
                </div>
            </Sider>

            {/* Mobile Drawer */}
            <Drawer
                title="Menu"
                placement="left"
                closable
                onClose={onCloseDrawer}
                open={drawerVisible}
                bodyStyle={{ padding: 0 }}
                headerStyle={{ textAlign: 'center', padding: '16px 0' }}
            >
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={() => setDrawerVisible(false)}
                    style={{ borderRight: 0, height: '100%' }}
                />
            </Drawer>

            <Layout
                className="site-layout"
                style={{
                    marginLeft: collapsed ? 80 : 250,
                    transition: 'margin-left 0.2s',
                    '@media (max-width: 991px)': { // Mobile responsive
                        marginLeft: 0
                    }
                }}
            >
                <Header
                    className="site-layout-background"
                    style={{
                        padding: '0 16px',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 1px 4px rgba(0,21,41,.08)',
                        position: 'sticky', // Added sticky header
                        top: 0,
                        zIndex: 999,
                    }}
                >
                    {/* Mobile menu button */}
                    <Button
                        type="text"
                        icon={<MenuOutlined />}
                        onClick={showDrawer}
                        className="trigger-button"
                        style={{
                            fontSize: '18px',
                            padding: 0,
                            display: 'block'
                        }}
                    />


                    {/* Desktop Toggle Button */}
                    <Button
                        type="text"
                        icon={<MenuOutlined />}
                        onClick={toggleCollapsed}
                        className="trigger-button desktop-toggle"
                        style={{
                            fontSize: '18px',
                            display: 'none' // Hidden by default, show on desktop with CSS
                        }}
                    />
                </Header>

                <Content
                    style={{
                        margin: '24px 16px 0',
                        overflow: 'initial',
                        minHeight: 'calc(100vh - 64px)',
                        padding: '16px' // Added padding for better content spacing
                    }}
                >
                    <div>
                        <Outlet />
                    </div>
                </Content>
            </Layout>

            {/* Add CSS for responsive behavior */}
            <style jsx>{`
                @media (min-width: 992px) {
                    .site-layout {
                        margin-left: ${collapsed ? '80px' : '250px'} !important;
                    }
                    .trigger-button:not(.desktop-toggle) {
                        display: none !important;
                    }
                    .desktop-toggle {
                        display: inline-block !important;
                    }
                }
                @media (max-width: 991px) {
                    .site-layout {
                        margin-left: 0 !important;
                    }
                    .desktop-toggle {
                        display: none !important;
                    }
                }
            `}</style>
        </Layout>
    );
};

export default DashboardLayout;