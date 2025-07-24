import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router'; // ঠিক করলেন!
import { useForm } from 'react-hook-form';
import { AuthContext } from '../Contexts/Authprovider.jsx';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useAxios from '../Hooks/useAxios.jsx';

const Register = () => {
    const { googleAuth, createUser } = useContext(AuthContext) || {};
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [profilePic, setProfilePic] = useState('');   // image url
    const [uploading, setUploading] = useState(false);  // uploading state
    const [showPassword, setShowPassword] = useState(false);
    const axios = useAxios();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    // imgBB upload handler
    const handleImageUpload = async (e) => {
        const imageFile = e.target.files?.[0];
        if(!imageFile) {
            setProfilePic('');
            return;
        }
        setUploading(true);
        const formData = new FormData();
        formData.append('image', imageFile);
        const imgbbApi = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;
        try {
            const res = await axios.post(imgbbApi, formData);
            if(res.data && res.data.data && res.data.data.url){
                setProfilePic(res.data.data.url);
                toast.success("Image uploaded!");
            } else {
                setProfilePic('');
                toast.error("Image upload failed! Try again.");
            }
        } catch {
            setProfilePic('');
            toast.error("Image upload failed! Try again.");
        }
        setUploading(false);
    };

    // Register submit handler
    const onSubmit = async (data) => {
        setLoading(true);
        const toastId = 'register-toast';
        try {
            const imageUrl = profilePic || ''; // ফাইল আপলোডিং থেকে আসা url
            await createUser(data.email, data.password, data.name.trim(), imageUrl);

            const userInfo = {
                email: data.email,
                role: 'user',
                name: data.name.trim(),
                photoURL: imageUrl,
                created_at: new Date().toISOString(),
                last_log_in: new Date().toISOString()
            };
            await axios.post('/users', userInfo);
            toast.success('Registration successful!', { toastId, autoClose: 2000 });
            navigate('/');
        } catch (error) {
            const errorMessages = {
                'auth/email-already-in-use': 'This email is already registered.',
                'auth/invalid-email': 'Invalid email format.',
                'auth/weak-password': 'Password is too weak.',
            };
            const message = errorMessages[error.code] || error.message || 'Registration failed';
            toast.error(message, { toastId, autoClose: 2000 });
            console.error('Registration error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Google Register
    const googleRegister = async () => {
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
            const msg = error.message || 'Google registration failed';
            toast.error(msg, { toastId, autoClose: 2000 });
        } finally {
            setLoading(false);
        }
    };

    if (!googleAuth || !createUser) {
        return (
            <div className="text-center text-red-500 dark:text-red-400">
                Error: Authentication context is not available. Please check if AuthProvider is set up correctly.
            </div>
        );
    }

    return (
        <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-100 via-sky-100 to-white dark:from-gray-950 dark:via-indigo-900 dark:to-gray-900 transition-colors duration-500"
              style={{ minHeight: '100dvh' }}
        >
            <Helmet>
                <title>Register | Camp Portal</title>
            </Helmet>

            <motion.div
                initial={{ opacity: 0, y: 44 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-xl border border-gray-200 dark:border-gray-700 dark:bg-gradient-to-br dark:from-gray-900 dark:to-indigo-900/95 backdrop-blur-sm"
            >
                <div className="text-center mb-8">
                    <motion.h1
                        initial={{ scale: 0.92 }}
                        animate={{ scale: 1 }}
                        className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-sky-500 dark:from-indigo-300 dark:to-cyan-400"
                    >
                        Create an Account
                    </motion.h1>
                    <p className="mt-2 text-[15px] text-gray-600 dark:text-gray-200">
                        Join our health camps to get expert care.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Register form" className="space-y-6">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            disabled={loading}
                            aria-label="Name"
                            placeholder="Enter your full name"
                            {...register('name', {
                                required: 'Name is required',
                                validate: v => v.trim() !== '' || 'Name cannot be empty',
                            })}
                            className={`w-full mt-1 px-4 py-3 rounded-lg border transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-800 dark:bg-gray-700 dark:text-gray-200 ${
                                errors.name ? 'border-red-500 border-opacity-100' : 'border-gray-300 dark:border-gray-600'
                            }`}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600" role="alert">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            disabled={loading}
                            aria-label="Email"
                            placeholder="Enter your email address"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Invalid email address',
                                },
                            })}
                            className={`w-full mt-1 px-4 py-3 rounded-lg border transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-800 dark:bg-gray-700 dark:text-gray-200 ${
                                errors.email ? 'border-red-500 border-opacity-100' : 'border-gray-300 dark:border-gray-600'
                            }`}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600" role="alert">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Image file input & preview */}
                    <div>
                        <label htmlFor="photoURL" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                            Upload Profile Picture
                        </label>
                        <input
                            id="photoURL"
                            type="file"
                            accept="image/*"
                            disabled={loading || uploading}
                            onChange={handleImageUpload}
                            className="w-full mt-1 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                        />
                        {profilePic && (
                            <img src={profilePic} alt="Profile preview"
                                 className="mt-2 w-20 h-20 object-cover rounded-full border" />
                        )}
                        {uploading && <p className="text-xs text-blue-500 mt-1">Uploading...</p>}
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            disabled={loading}
                            aria-label="Password"
                            placeholder="Enter your password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' },
                                validate: value =>
                                    /[a-z]/.test(value) &&
                                    /[A-Z]/.test(value) &&
                                    /\d/.test(value) ||
                                    'Password must have uppercase, lowercase and a number',
                            })}
                            className={`w-full mt-1 px-4 py-3 rounded-lg border transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-800 dark:bg-gray-700 dark:text-gray-200 ${
                                errors.password ? 'border-red-500 border-opacity-100' : 'border-gray-300 dark:border-gray-600'
                            }`}
                        />
                        <button
                            type="button"
                            tabIndex={-1}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {showPassword ? (
                                <FaEyeSlash className="w-5 h-5" />
                            ) : (
                                <FaEye className="w-5 h-5" />
                            )}
                        </button>
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600" role="alert">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={loading || uploading}
                        aria-label="Register"
                        className={`w-full py-3 rounded-lg font-bold text-white shadow-xl text-lg transition-all duration-200 focus:outline-none ${
                            loading || uploading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-sky-700 hover:to-indigo-700'
                        }`}
                        aria-busy={loading || uploading}
                    >
                        {loading
                            ? (
                                <div className="inline-flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C6.477 0 2 4.477 2 10h2zm2 5.291l1.646 1.647A8.014 8.014 0 0112 20v-2a6.01 6.01 0 01-4.646-2.709z" />
                                    </svg>
                                    Registering...
                                </div>
                            )
                            : uploading
                                ? 'Uploading Image...'
                                : 'Register'
                        }
                    </motion.button>
                </form>

                <div className="flex items-center space-x-2 my-8">
                    <span className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    <span className="text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold">or register with</span>
                    <span className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                </div>

                <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={googleRegister}
                    disabled={loading}
                    aria-label="Register with Google"
                    className={`w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 font-semibold shadow-sm gap-3 text-base transition-all duration-200 ${
                        loading ? 'cursor-not-allowed opacity-60' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                >
                    <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none">
                        <g>
                            <path fill="#4285F4" d="M47.5 24.6c0-1.64-.13-3.28-.41-4.85H24v9.19h13.2c-.57 3.15-2.52 5.82-5.31 7.56v6.29h8.58C45.32 36.06 47.5 30.89 47.5 24.6z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.92-2.13 15.9-5.78l-8.58-6.29c-2.38 1.6-5.43 2.54-9.25 2.54-7.1 0-13.13-4.79-15.29-11.22H3.05v7.1C7.06 43.9 14.91 48 24 48z" />
                            <path fill="#FBBC05" d="M8.71 28.25A14.95 14.95 0 0 1 6.55 24c0-1.49.24-2.93.7-4.25v-7.09H3.03A24 24 0 0 0 0 24c0 3.86.93 7.51 2.59 10.75l6.12-6.5z" />
                            <path fill="#EA4335" d="M24 9.5c3.53 0 6.71 1.21 9.21 3.58l6.88-6.88C35.92 2.15 30.48 0 24 0 14.92 0 7.06 4.1 3.05 10.66l6.12 7.09C10.87 13.59 16.9 9.5 24 9.5z" />
                        </g>
                    </svg>
                    {loading ? 'Please wait...' : 'Continue with Google'}
                </motion.button>

                <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-8">
                    Already have an account?{' '}
                    <Link
                        to="/join-us"
                        className="font-semibold text-indigo-600 dark:text-indigo-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200"
                    >
                        Login
                    </Link>
                </p>
            </motion.div>
        </main>
    );
};

export default Register;
