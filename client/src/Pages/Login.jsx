import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../Contexts/Authprovider.jsx';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import useAxios from '../Hooks/useAxios.jsx';

const Login = () => {
    const { googleAuth, loginUser } = useContext(AuthContext);
    const axios = useAxios();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await loginUser(data.email, data.password);
            toast.success('Logged in successfully!', { autoClose: 1800 });
            navigate('/');
        } catch (error) {
            toast.error(error.message || 'Invalid email or password', { autoClose: 1800 });
        } finally {
            setLoading(false);
        }
    };

    const googleLogin = async () => {
        setLoading(true);
        const toastId = 'google-register-toast';
        try {
            const result = await googleAuth();
            if (!result || !result.user) throw new Error('Google authentication failed');
            const user = result.user;
            const userInfo = {
                email: user?.email,
                role: 'user',
                name: user?.displayName || '',
                photoURL: user?.photoURL || '',
                created_at: new Date().toISOString(),
                last_log_in: new Date().toISOString()
            };
            await axios.post('/users', userInfo);
            toast.success('Registered with Google successfully!', { toastId, autoClose: 2000 });
            navigate('/');
        } catch (error) {
            toast.error(error.message || 'Google login failed', { autoClose: 1800 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main
            className="min-h-screen w-full flex items-center justify-center px-4 py-14 bg-gradient-to-br from-indigo-100 via-sky-100 to-white dark:from-gray-950 dark:via-indigo-900 dark:to-gray-900 transition-colors duration-500"
            style={{ minHeight: '100dvh' }}
        >
            <Helmet>
                <title>Sign In | Camp Portal</title>
            </Helmet>

            <motion.div
                initial={{ opacity: 0, y: 44 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-700 rounded-2xl bg-white/95 dark:bg-gradient-to-br dark:from-gray-900 dark:to-indigo-900/95 backdrop-blur-sm p-8"
            >
                <div className="text-center mb-8">
                    <motion.h1
                        initial={{ scale: 0.92 }}
                        animate={{ scale: 1 }}
                        className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-sky-500 dark:from-indigo-300 dark:to-cyan-400"
                    >
                        Sign in to your account
                    </motion.h1>
                    <p className="mt-2 text-[15px] text-gray-600 dark:text-gray-200">
                        Unlock all features by logging in.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6" aria-label="Login form">
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block mb-1.5 text-[15px] font-medium text-gray-700 dark:text-gray-200">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="Enter your email address"
                            disabled={loading}
                            className={`block w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border rounded-lg focus:ring-2 focus:outline-none ring-offset-2 transition-all duration-150 ${
                                errors.email ? 'border-red-500 focus:ring-red-500 border-opacity-100' : 'border-gray-300 dark:border-gray-700'
                            }`}
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value:
                                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i,
                                    message: 'Invalid email address',
                                },
                            })}
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block mb-1.5 text-[15px] font-medium text-gray-700 dark:text-gray-200">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            disabled={loading}
                            className={`block w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border rounded-lg focus:ring-2 focus:outline-none ring-offset-2 transition-all duration-150 ${
                                errors.password ? 'border-red-500 focus:ring-red-500 border-opacity-100' : 'border-gray-300 dark:border-gray-700'
                            }`}
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' },
                            })}
                        />
                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                    </div>

                    <div className="flex items-center justify-between text-sm mt-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" className="accent-indigo-500 focus:ring-0" tabIndex={-1} />
                            <span className="text-gray-600 dark:text-gray-300">Remember me</span>
                        </label>
                        <Link
                            to="/forgot-password"
                            className="font-medium text-indigo-600 dark:text-indigo-300 hover:text-indigo-400 transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.025 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-bold text-white shadow-xl text-lg transition-all duration-200 focus:outline-none ${
                            loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-sky-700 hover:to-indigo-700'
                        }`}
                        aria-busy={loading}
                    >
                        {loading ? (
                            <div className="inline-flex items-center justify-center gap-2">
                                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C6.477 0 2 4.477 2 10h2zm2 5.291l1.646 1.647A8.014 8.014 0 0112 20v-2a6.01 6.01 0 01-4.646-2.709z"
                                    />
                                </svg>
                                Signing in...
                            </div>
                        ) : (
                            'Sign In'
                        )}
                    </motion.button>
                </form>

                <div className="flex items-center space-x-2 my-8">
                    <span className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    <span className="text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold">or continue with</span>
                    <span className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                </div>

                <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={googleLogin}
                    disabled={loading}
                    className={`w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 font-semibold shadow-sm gap-3 text-base transition-all duration-200 ${
                        loading ? 'cursor-not-allowed opacity-60' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    aria-label="Login with Google"
                >
                    <svg className="w-5 h-5" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
                        <g>
                            <path fill="#4285F4" d="M47.5 24.6c0-1.64-.13-3.28-.41-4.85H24v9.19h13.2c-.57 3.15-2.52 5.82-5.31 7.56v6.29h8.58C45.32 36.06 47.5 30.89 47.5 24.6z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.92-2.13 15.9-5.78l-8.58-6.29c-2.38 1.6-5.43 2.54-9.25 2.54-7.1 0-13.13-4.79-15.29-11.22H3.05v7.1C7.06 43.9 14.91 48 24 48z" />
                            <path fill="#FBBC05" d="M8.71 28.25A14.95 14.95 0 0 1 6.55 24c0-1.49.24-2.93.7-4.25v-7.09H3.03A24 24 0 0 0 0 24c0 3.86.93 7.51 2.59 10.75l6.12-6.5z" />
                            <path fill="#EA4335" d="M24 9.5c3.53 0 6.71 1.21 9.21 3.58l6.88-6.88C35.92 2.15 30.48 0 24 0 14.92 0 7.06 4.1 3.05 10.66l6.12 7.09C10.87 13.59 16.9 9.5 24 9.5z" />
                        </g>
                    </svg>

                    {loading ? 'Please wait...' : 'Continue with Google'}
                </motion.button>

                <div className="text-center mt-8 text-[15px]">
                    <span className="text-gray-600 dark:text-gray-300">Don't have an account? </span>
                    <Link
                        to="/register"
                        className="font-bold underline text-indigo-600 dark:text-indigo-300 hover:text-sky-500 transition-colors"
                    >
                        Sign up
                    </Link>
                </div>
            </motion.div>
        </main>
    );
};

export default Login;
