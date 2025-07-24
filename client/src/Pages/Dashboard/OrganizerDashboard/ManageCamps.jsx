import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from '../../../Hooks/useAxios.jsx';
import useAuth from '../../../Hooks/useAuth.jsx';
import useAxiosSecure from '../../../Hooks/useAxiosSecure.jsx';

// Enhanced Spinner Component
function Spinner({ className = "" }) {
    return (
        <div className="relative inline-flex items-center justify-center">
            <svg className={`animate-spin h-5 w-5 text-blue-500 ${className}`}
                 viewBox="0 0 24 24" fill="none">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-80" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C6.477 0 2 4.477 2 10c0 1.042.17 2.047.488 3.001l1.464-1.001z" />
            </svg>
        </div>
    );
}

// Toast Notification Component
function Toast({ message, type, onClose }) {
    return (
        <div className={`fixed top-6 right-6 z-50 flex items-center p-4 max-w-sm rounded-xl shadow-2xl border transition-all duration-300 transform animate-slide-in ${
            type === 'success'
                ? 'bg-green-50 border-green-100 text-green-800 dark:bg-green-900/30 dark:border-green-800/50 dark:text-green-300'
                : type === 'error'
                    ? 'bg-red-50 border-red-100 text-red-800 dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-300'
                    : 'bg-blue-50 border-blue-100 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800/50 dark:text-blue-300'
        }`}>
            <div className="flex items-center">
                {type === 'success' && (
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                )}
                {type === 'error' && (
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    </svg>
                )}
                <span className="font-semibold">{message}</span>
            </div>
            <button
                onClick={onClose}
                className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
            >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
            </button>
        </div>
    );
}

// Loading Skeleton Component
function LoadingSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 px-4 py-12">
            <div className="max-w-7xl mx-auto">
                <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse mb-10 max-w-md mx-auto"></div>
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100/50 dark:border-gray-700/50 p-8">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-6 py-5 border-b border-gray-100/50 dark:border-gray-700/50 last:border-b-0">
                            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse flex-1"></div>
                            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse w-20"></div>
                            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse w-36"></div>
                            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse w-28"></div>
                            <div className="flex space-x-3">
                                <div className="h-9 w-24 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                                <div className="h-9 w-20 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const ManageCamps = () => {
    const axios = useAxios();
    const axiosSecure = useAxiosSecure();
    const { saveUser } = useAuth();
    const queryClient = useQueryClient();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [	selectedCampId, setSelectedCampId] = useState(null);
    const [selectedCampName, setSelectedCampName] = useState('');
    const [toast, setToast] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 5;


    // Show toast notification
    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const { data: camps = [], isLoading } = useQuery({
        queryKey: ['participantCamps', saveUser?.email],
        queryFn: async () => {
            const response = await axiosSecure.get(`/participant/camps?email=${saveUser.email}`);
            return Array.isArray(response.data) ? response.data : [];
        },
        enabled: !!saveUser?.email,
    });

    const cancelRegistration = useMutation({
        mutationFn: async (campId) => axios.delete(`/participant/camp/${campId}/cancel`),
        onSuccess: () => {
            showToast('Registration cancelled successfully!', 'success');
            queryClient.invalidateQueries(['participantCamps', saveUser?.email]);
        },
        onError: () => showToast('Failed to cancel registration', 'error'),
    });

    const showCancelModal = (campId, campName) => {
        setSelectedCampId(campId);
        setSelectedCampName(campName);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        cancelRegistration.mutate(selectedCampId);
        setIsModalVisible(false);
    };

    // Filter camps based on search term
    const filteredCamps = camps.filter(camp =>
        camp.campName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camp.participantName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredCamps.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCamps = filteredCamps.slice(startIndex, startIndex + itemsPerPage);

    // Reset to first page when search term changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    if (isLoading) return <LoadingSkeleton />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 px-4 py-12 transition-all duration-500">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent mb-3 animate-gradient">
                        Manage Registered Camps
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                        Track and manage your camp registrations effortlessly
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
                            placeholder="Search camps by name or participant..."
                            className="block w-full pl-12 pr-4 py-3.5 bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 transition-all duration-300 shadow-sm hover:shadow-md outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                                    <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                        <svg className="w-12 h-12 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                    <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                        <svg className="w-12 h-12 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">No Registrations Yet</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        You haven't registered for any medical camps yet.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Camps Table */
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100/50 dark:border-gray-700/50 overflow-hidden animate-fade-in">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px]">
                                <thead className="bg-gradient-to-r from-gray-50 to-purple-50 dark:from-gray-800 dark:to-purple-900 border-b border-gray-100/50 dark:border-gray-700/50">
                                <tr>
                                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Camp Name</th>
                                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Camp Fees</th>
                                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Participant</th>
                                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Payment Status</th>
                                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Confirmation</th>
                                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100/50 dark:divide-gray-700/50">
                                {paginatedCamps.map((camp) => (
                                    <tr key={camp._id}
                                        className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-200">
                                        <td className="px-6 py-5">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                                {camp.campName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100/80 text-green-700 dark:bg-green-900/50 dark:text-green-300 border border-green-200/50 dark:border-green-800/50">
                                                    <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                                                    </svg>
                                                    ${camp.campFees}
                                                </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                <svg className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                                </svg>
                                                {camp.participantName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${
                                                    camp.paymentStatus === 'paid'
                                                        ? 'bg-green-100/80 text-green-700 border-green-200/50 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800/50'
                                                        : 'bg-red-100/80 text-red-700 border-red-200/50 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800/50'
                                                }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                                        camp.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-red-500'
                                                    }`}></div>
                                                    {camp.paymentStatus.charAt(0).toUpperCase() + camp.paymentStatus.slice(1)}
                                                </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            {camp.paymentStatus === 'paid' ? (
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100/80 text-green-700 dark:bg-green-900/50 dark:text-green-300 border border-green-200/50 dark:border-green-800/50">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></div>
                                                    Confirmed
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 dark:text-gray-500 italic text-sm">
                                                    Payment required
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5">
                                            <button
                                                onClick={() => showCancelModal(camp._id, camp.campName)}
                                                disabled={camp.paymentStatus === 'paid'}
                                                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl shadow-sm transition-all duration-300 ${
                                                    camp.paymentStatus === 'paid'
                                                        ? 'bg-gray-100/80 text-gray-400 border border-gray-200/50 dark:bg-gray-800/80 dark:text-gray-600 dark:border-gray-700/50 cursor-not-allowed'
                                                        : 'bg-red-600 hover:bg-red-700 text-white transform hover:scale-105'
                                                }`}
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                                </svg>
                                                Cancel
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100/50 dark:border-gray-700/50">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCamps.length)} of {filteredCamps.length} results
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-600/50 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                >
                                    Previous
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                                            currentPage === i + 1
                                                ? 'bg-blue-600 text-white shadow-sm'
                                                : 'text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-600/50 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-600/50 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Enhanced Confirmation Modal */}
            {isModalVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"
                        onClick={() => setIsModalVisible(false)}
                    ></div>

                    {/* Modal */}
                    <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full border border-gray-100/50 dark:border-gray-700/50 transform transition-all duration-300 scale-95 animate-modal-in">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100/50 dark:border-gray-700/50">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-red-100/80 dark:bg-red-900/50 rounded-full flex items-center justify-center mr-3">
                                    <svg className="w-6 h-6 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Confirm Cancellation</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsModalVisible(false)}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                aria-label="Close modal"
                            >
                                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <p className="text-gray-700 dark:text-gray-300 mb-3">
                                Are you sure you want to cancel your registration for:
                            </p>
                            <p className="font-semibold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700/50 px-4 py-2 rounded-xl">
                                {selectedCampName}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-100/50 dark:border-gray-700/50">
                            <button
                                onClick={() => setIsModalVisible(false)}
                                className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                Keep Registration
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={cancelRegistration.isLoading}
                                className="inline-flex items-center px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-sm hover:shadow-md transform hover:scale-105 disabled:transform-none transition-all duration-300"
                            >
                                {cancelRegistration.isLoading && <Spinner className="mr-2 h-4 w-4" />}
                                Yes, Cancel Registration
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(100%); }
                    to { opacity: 1; transform: translateX(0); }
                }

                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes modal-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }

                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                .animate-slide-in {
                    animation: slideIn 0.3s ease-out;
                }

                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }

                .animate-modal-in {
                    animation: modal-in 0.3s ease-out forwards;
                }

                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 6s ease infinite;
                }
            `}</style>
        </div>
    );
};

export default ManageCamps;