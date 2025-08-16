import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router';
import { AuthContext } from '../Contexts/Authprovider.jsx';
import { toast } from 'react-toastify';
import ThemeContext from '../Contexts/ThemeContext.jsx';
import { Avatar, Dropdown, Button } from 'antd';
import { AiOutlineClose } from 'react-icons/ai';
import {
    UserOutlined,
    LogoutOutlined,
    PlusOutlined,
    UnorderedListOutlined,
    CheckCircleOutlined,
    SearchOutlined,
    HomeOutlined,
    UserAddOutlined,
    LoginOutlined,
    MenuOutlined, InfoCircleOutlined, MessageOutlined
} from '@ant-design/icons';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { signOutUser, saveUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showNavbar, setShowNavbar] = useState(true);
    const lastScrollY = useRef(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const avatarRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show/hide navbar based on scroll direction
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                // Scrolling down and past threshold - hide navbar
                setShowNavbar(false);
            } else {
                // Scrolling up or at top - show navbar
                setShowNavbar(true);
            }

            // Add shadow when scrolled
            setIsScrolled(currentScrollY > 20);

            lastScrollY.current = currentScrollY;
        };

        let ticking = false;
        const smoothHandleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', smoothHandleScroll, { passive: true });
        return () => window.removeEventListener('scroll', smoothHandleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(e.target) &&
                avatarRef.current && !avatarRef.current.contains(e.target)
            ) {
                // Handle outside click if needed
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const clickSignOut = () => {
        signOutUser()
            .then(() => {
                navigate('/join-us');
                toast.success('Logged out successfully!', { autoClose: 2000 });
            })
            .catch(() => toast.error('Logout failed!', { autoClose: 2000 }));
    };

    const isActiveLink = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const navLinks = [
        { key: 'home', path: '/', label: 'Home', icon: <HomeOutlined /> },
        { 
            key: 'about', 
            path: '/about', 
            label: 'About',
            icon: <InfoCircleOutlined />
        },
        { 
            key: 'contact', 
            path: '/contact', 
            label: 'Contact',
            icon: <MessageOutlined />
        },
        saveUser && {
            key: 'items',
            path: '/available-camps',
            label: 'Available Camps',
        },
        !saveUser && {
            key: 'register',
            path: '/register',
            label: 'Register',
            icon: <UserAddOutlined />,
        },
        !saveUser && {
            key: 'login',
            path: '/join-us',
            label: 'Login',
            icon: <LoginOutlined />,
        },
    ].filter(Boolean);

    const userMenuItems = [
        {
            key: 'dashboard',
            label: (
                <Link to="/dashboard" className="flex items-center gap-3 py-1">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-md flex items-center justify-center">
                        <PlusOutlined className="text-blue-600 dark:text-blue-300" />
                    </div>
                    <span>Dashboard</span>
                </Link>
            ),
        },
        { type: 'divider' },
        {
            key: 'logout',
            label: (
                <div className="flex items-center gap-3 py-1 text-red-600 dark:text-red-400">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-800 rounded-md flex items-center justify-center">
                        <LogoutOutlined />
                    </div>
                    <span>Logout</span>
                </div>
            ),
            onClick: clickSignOut,
        },
    ];

    const userMenuHeader = (
        <div className="px-4 py-3 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white rounded-t-lg">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Avatar src={saveUser?.photoURL} icon={<UserOutlined />} size={48} className="ring-2 ring-white/30" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                </div>
                <div className="truncate">
                    <p className="font-semibold">{saveUser?.displayName || 'User'}</p>
                    <p className="text-sm text-blue-100 truncate">{saveUser?.email}</p>
                </div>
            </div>
        </div>
    );

    // Drawer motion variants
    const drawerVariants = {
        hidden: { x: '100%' },
        visible: { x: 0 },
        exit: { x: '100%' },
    };

    return (
        <>
            <header className={clsx(
                'fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b px-6 py-0 flex items-center justify-between h-16 transition-all duration-300 ease-in-out',
                {
                    'shadow-lg border-gray-200 dark:border-neutral-700': isScrolled,
                    'border-transparent': !isScrolled,
                    'transform translate-y-0 opacity-100 visible': showNavbar,
                    'transform -translate-y-full opacity-0 invisible': !showNavbar,
                }
            )}>
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-lg shadow-md flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-cyan-600/20 rounded-lg"></div>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-white relative z-10 drop-shadow-sm">
                            <circle cx="12" cy="12" r="2" fill="currentColor" fillOpacity="0.8" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 bg-clip-text text-transparent">MediPeak</span>
                </Link>

                <div className="hidden md:flex items-center gap-3">
                    <nav className="flex items-center gap-3">
                        {navLinks.map(({ key, path, label, icon }) => (
                            <NavLink
                                key={key}
                                to={path}
                                className={clsx(
                                    'font-medium flex items-center gap-2 transition duration-200',
                                    key !== 'home' && 'px-5 py-2 rounded-xl',
                                    key === 'home'
                                        ? isActiveLink(path)
                                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-md border border-emerald-400 px-5 py-2 rounded-xl'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-[#27272a] hover:text-[#34d399] px-5 py-2 rounded-xl'
                                        : isActiveLink(path)
                                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-md border border-emerald-400'
                                            : key === 'login' || key === 'register'
                                                ? 'text-gray-700 dark:text-gray-300 hover:bg-[#27272a] hover:text-[#34d399]'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-neutral-800 hover:text-emerald-600'
                                )}
                            >
                                {icon}
                                {label}
                            </NavLink>
                        ))}
                    </nav>

                    <ThemeContext />

                    {saveUser && (
                        <Dropdown
                            menu={{ items: userMenuItems }}
                            trigger={['click']}
                            placement="bottomRight"
                            arrow
                            dropdownRender={(menu) => (
                                <div className="min-w-[260px] bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-gray-100 dark:border-neutral-700 overflow-hidden" ref={dropdownRef}>
                                    {userMenuHeader}
                                    <div className="py-2">{menu}</div>
                                </div>
                            )}
                        >
                            <div className="cursor-pointer transform hover:scale-105 transition-transform duration-200" ref={avatarRef}>
                                <Avatar
                                    src={saveUser?.photoURL}
                                    icon={<UserOutlined />}
                                    size="large"
                                    className="border-2 border-blue-500 hover:border-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                                />
                            </div>
                        </Dropdown>
                    )}
                </div>

                <div className="md:hidden flex items-center gap-3">
                    <ThemeContext />
                    <Button icon={<MenuOutlined />} onClick={() => setMobileMenuOpen(true)} />
                </div>
            </header>

            {/* Add padding to prevent content from hiding behind fixed navbar */}
            <div className="h-16"></div>

            {/* Animated Mobile Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Dark overlay */}
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-50 z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            aria-hidden="true"
                        />

                        {/* Drawer panel */}
                        <motion.nav
                            className="fixed top-0 right-0 bottom-0 w-72 bg-white dark:bg-neutral-900 shadow-lg z-50 flex flex-col p-6"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={drawerVariants}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            aria-label="Mobile menu drawer"
                            role="dialog"
                            aria-modal="true"
                        >
                            <div className="mb-6 flex items-center justify-between bg-white dark:bg-neutral-900 rounded-t-lg px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                                <h2 className="text-xl font-bold">Menu</h2>
                                <Button
                                    type="text"
                                    size="large"
                                    onClick={() => setMobileMenuOpen(false)}
                                    aria-label="Close Menu"
                                    className="!text-gray-900 dark:!text-white hover:!text-red-500 dark:hover:!text-red-400 text-2xl"
                                    style={{
                                        background: 'transparent',
                                        boxShadow: 'none',
                                        border: 'none',
                                    }}
                                    icon={<AiOutlineClose className="fill-current" />}
                                />
                            </div>

                            <div className="flex flex-col gap-4 overflow-y-auto">
                                {navLinks.map(({ key, path, label, icon }) => (
                                    <NavLink
                                        key={key}
                                        to={path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={({ isActive }) =>
                                            clsx(
                                                'flex items-center gap-4 px-4 py-3 rounded-lg text-lg font-semibold transition-colors',
                                                isActive
                                                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-neutral-800 hover:text-emerald-600'
                                            )
                                        }
                                    >
                                        {icon}
                                        {label}
                                    </NavLink>
                                ))}

                                {saveUser ? (
                                    <>
                                        <hr className="border-gray-300 dark:border-gray-700 my-4" />
                                        {userMenuItems.map(({ key, label, onClick, type }) =>
                                            type === 'divider' ? (
                                                <hr key={key} className="border-gray-300 dark:border-gray-700 my-2" />
                                            ) : (
                                                <button
                                                    key={key}
                                                    onClick={() => {
                                                        onClick && onClick();
                                                        setMobileMenuOpen(false);
                                                    }}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 font-semibold transition-colors"
                                                >
                                                    {label}
                                                </button>
                                            )
                                        )}
                                    </>
                                ) : (
                                    ''
                                )}
                            </div>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;