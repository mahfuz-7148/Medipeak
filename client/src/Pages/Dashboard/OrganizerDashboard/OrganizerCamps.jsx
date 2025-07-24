import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router';
import { Helmet } from 'react-helmet';
import useAxios from '../../../Hooks/useAxios.jsx';
import useAuth from '../../../Hooks/useAuth.jsx';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure.jsx';


// Enhanced Spinner with smooth animation
function Spinner({ className = "" }) {
    return (
        <div className="relative inline-flex items-center justify-center">
            <svg className={`animate-spin h-5 w-5 text-blue-500 ${className}`}
                 viewBox="0 0 24 24" fill="none">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-80" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
        </div>
    );
}

// Modern Loading Skeleton with gradient animation
function LoadingSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 px-4 py-12">
            <div className="max-w-7xl mx-auto">
                <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse mb-10 mx-auto max-w-md"></div>
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100/50 dark:border-gray-700/50 p-8">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-6 py-5 border-b border-gray-100/50 dark:border-gray-700/50 last:border-b-0">
                            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse flex-1"></div>
                            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse w-36"></div>
                            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse w-28"></div>
                            <div className="flex space-x-3">
                                <div className="h-9 w-20 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                                <div className="h-9 w-20 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const OrganizerCamps = () => {
    const { saveUser } = useAuth();
    const axios = useAxios();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const axiosSecure = useAxiosSecure();
    const [selectedCamp, setSelectedCamp] = useState(null);
    const [formData, setFormData] = useState({
        campName: '',
        dateTime: '',
        location: '',
        healthcareProfessionalName: '',
    });
    const [updateLoading, setUpdateLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch camps
    const { data: camps = [], isLoading, error } = useQuery({
        queryKey: ['organizerCamps', saveUser?.email],
        queryFn: async () => {
            if (!saveUser?.email) throw new Error('Please login to view your camps');
            const response = await axiosSecure.get(`/organizer-camp?email=${saveUser?.email}`);
            return response.data || [];
        },
        enabled: !!saveUser?.email,
    });

    // Filter camps based on search term
    const filteredCamps = camps.filter(camp =>
        camp.campName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camp.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (camp.healthcareProfessionalName &&
            camp.healthcareProfessionalName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredCamps.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCamps = filteredCamps.slice(startIndex, startIndex + itemsPerPage);

    // Handle error
    if (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Failed to fetch your camps',
            confirmButtonText: 'OK',
            background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
            color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#1f2937',
            customClass: {
                popup: 'rounded-2xl shadow-2xl',
                confirmButton: 'px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg',
            },
        });
    }

    // Delete camp with enhanced confirmation
    const handleDelete = async (campId) => {
        const confirm = await Swal.fire({
            title: 'Delete Camp?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
            background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
            color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#1f2937',
            customClass: {
                popup: 'rounded-2xl shadow-2xl',
                confirmButton: 'px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg',
                cancelButton: 'px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg',
            },
        });

        if (!confirm.isConfirmed) return;

        try {
            const response = await axios.delete(`/delete-camp/${campId}`);
            if (response.data.deletedCount > 0) {
                queryClient.invalidateQueries(['organizerCamps', saveUser?.email]);
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Camp has been deleted successfully.',
                    timer: 2000,
                    showConfirmButton: false,
                    background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
                    color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#1f2937',
                    customClass: {
                        popup: 'rounded-2xl shadow-2xl',
                    },
                });
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'Not Found',
                    text: 'Camp not found or already deleted',
                    background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
                    color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#1f2937',
                    customClass: {
                        popup: 'rounded-2xl shadow-2xl',
                    },
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete camp.',
                background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
                color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#1f2937',
                customClass: {
                    popup: 'rounded-2xl shadow-2xl',
                },
            });
        }
    };

    // Open update modal
    const openUpdateModal = async (campId) => {
        setUpdateLoading(true);
        try {
            const response = await axios.get(`/camp/${campId}`);
            const camp = response.data;
            setFormData({
                campName: camp.campName,
                dateTime: new Date(camp.dateTime).toISOString().slice(0, 16),
                location: camp.location,
                healthcareProfessionalName: camp.healthcareProfessionalName || '',
            });
            setSelectedCamp(camp);
            setIsModalOpen(true);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch camp details',
                background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
                color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#1f2937',
                customClass: {
                    popup: 'rounded-2xl shadow-2xl',
                },
            });
        } finally {
            setUpdateLoading(false);
        }
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle update submit
    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            const response = await axios.put(`/update-camp/${selectedCamp._id}`, formData);
            if (response.data.modifiedCount > 0) {
                queryClient.invalidateQueries(['organizerCamps', saveUser?.email]);
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Camp details updated successfully.',
                    timer: 2000,
                    showConfirmButton: false,
                    background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
                    color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#1f2937',
                    customClass: {
                        popup: 'rounded-2xl shadow-2xl',
                    },
                });
                setIsModalOpen(false);
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'No Changes',
                    text: 'No changes were made to the camp.',
                    background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
                    color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#1f2937',
                    customClass: {
                        popup: 'rounded-2xl shadow-2xl',
                    },
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update camp.',
                background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
                color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#1f2937',
                customClass: {
                    popup: 'rounded-2xl shadow-2xl',
                },
            });
        }
        setUpdateLoading(false);
    };

    if (isLoading) return <LoadingSkeleton />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 px-4 py-12 transition-all duration-500">
            <Helmet><title>My Camps | Medical Camp Organizer</title></Helmet>

            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-3 animate-gradient">
                        My Organized Camps
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                        Manage and track your medical camp events effortlessly
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-8 max-w-3xl mx-auto">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search camps by name, location, or professional..."
                            className="block w-full pl-12 pr-4 py-3.5 bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 transition-all duration-300 shadow-sm hover:shadow-md outline-none"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-blue-500 transition-colors duration-200"
                            >
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {filteredCamps.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-20 animate-fade-in">
                        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100/50 dark:border-gray-700/50 p-12 max-w-lg mx-auto">
                            {searchTerm ? (
                                <>
                                    <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                        <svg className="w-12 h-12 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">No Matching Camps</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        No camps found matching your search criteria.
                                    </p>
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                    >
                                        Clear Search
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                        <svg className="w-12 h-12 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">No Camps Yet</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        You haven't created any medical camps yet. Start organizing your first camp!
                                    </p>
                                    <Link to="/dashboard/add-camp">
                                        <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Create Your First Camp
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Camps Table */
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100/50 dark:border-gray-700/50 overflow-hidden animate-fade-in">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px]">
                                <thead className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900 border-b border-gray-100/50 dark:border-gray-700/50">
                                <tr>
                                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Camp Name</th>
                                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Date & Time</th>
                                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Professional</th>
                                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100/50 dark:divide-gray-700/50">
                                {paginatedCamps.map((camp, i) => (
                                    <tr key={camp._id}
                                        className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-200">
                                        <td className="px-6 py-5">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                                {camp.campName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100/80 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50">
                                                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {new Date(camp.dateTime).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                <svg className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {camp.location}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {camp.healthcareProfessionalName ? (
                                                <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                    <svg className="w-4 h-4 mr-2 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    {camp.healthcareProfessionalName}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 dark:text-gray-500 italic">Not assigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center space-x-4">
                                                <button
                                                    onClick={() => openUpdateModal(camp._id)}
                                                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300"
                                                    title="Update Camp"
                                                >
                                                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(camp._id)}
                                                    className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300"
                                                    title="Delete Camp"
                                                >
                                                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-between px-6 py-5 border-t border-gray-100/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/30 to-blue-50/30 dark:from-gray-800/20 dark:to-blue-900/20">
                            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCamps.length)} of {filteredCamps.length} camps
                            </div>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm shadow-sm"
                                >
                                    Previous
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 shadow-sm ${
                                            currentPage === i + 1
                                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-blue-500/50 shadow-blue-500/25'
                                                : 'text-gray-600 dark:text-gray-400 bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-600 backdrop-blur-sm'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm shadow-sm"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Enhanced Update Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"
                        onClick={() => setIsModalOpen(false)}
                    ></div>

                    {/* Modal */}
                    <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-100/50 dark:border-gray-700/50 transform transition-all duration-300 scale-95 animate-modal-in">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100/50 dark:border-gray-700/50">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Update Camp</h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">Modify camp details</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                aria-label="Close modal"
                            >
                                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleUpdate} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Camp Name *
                                </label>
                                <input
                                    type="text"
                                    name="campName"
                                    value={formData.campName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 transition-all duration-300 shadow-sm outline-none"
                                    placeholder="Enter camp name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Date & Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    name="dateTime"
                                    value={formData.dateTime}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 transition-all duration-300 shadow-sm outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 transition-all duration-300 shadow-sm outline-none"
                                    placeholder="Enter camp location"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Healthcare Professional
                                </label>
                                <input
                                    type="text"
                                    name="healthcareProfessionalName"
                                    value={formData.healthcareProfessionalName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 transition-all duration-300 shadow-sm outline-none"
                                    placeholder="Enter healthcare professional name (optional)"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100/50 dark:border-gray-700/50">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateLoading}
                                    className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-sm hover:shadow-md transform hover:scale-105 disabled:transform-none transition-all duration-300"
                                >
                                    {updateLoading && <Spinner className="mr-2 h-4 w-4" />}
                                    Update Camp
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrganizerCamps;