// prettier-ignore
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAuth from "../../../Hooks/useAuth.jsx";
import useAxios from "../../../Hooks/useAxios.jsx";
import { Helmet } from "react-helmet";
import { Modal, message, Rate, Input } from "antd";
import useAxiosSecure from '../../../Hooks/useAxiosSecure.jsx';



const { TextArea } = Input;

// Enhanced Spinner Component
function Spinner({ className = "" }) {
    return (
        <div className="relative inline-flex items-center justify-center">
            <svg className={`animate-spin h-5 w-5 text-blue-500 ${className}`} viewBox="0 0 24 24" fill="none">
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

const ParticipantCamps = () => {
    const { saveUser } = useAuth();
    const axios = useAxios();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [feedbackModal, setFeedbackModal] = useState({ open: false, regId: null });
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch camps
    const { data: camps = [], isLoading, error } = useQuery({
        queryKey: ["participantCamps", saveUser?.email],
        enabled: !!saveUser?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/participant/camps?email=${saveUser.email}`);
            return Array.isArray(res.data) ? res.data : [];
        },
        retry: 1,
    });

    // Cancel registration
    const cancelRegistration = useMutation({
        mutationFn: (regId) =>
            axios.delete(`/participant/camp/${regId}/cancel`),
        onSuccess: () => {
            message.success("Registration cancelled");
            queryClient.invalidateQueries(["participantCamps", saveUser?.email]);
        },
        onError: (err) =>
            message.error(
                `Failed to cancel registration: ${err?.response?.data?.message || err.message}`
            ),
    });

    // Feedback submit
    const feedbackSubmit = useMutation({
        mutationFn: async () => {
            if (!feedbackModal.regId) throw new Error("Registration ID is missing");
            if (!rating || rating === 0) throw new Error("Rating is required");
            if (!comment.trim()) throw new Error("Comment is required");

            const payload = {
                rating: Number(rating),
                comment: comment.trim(),
            };

            const res = await axios.post(`/participant/camp/${feedbackModal.regId}/feedback`, payload);
            return res.data;
        },
        onSuccess: () => {
            message.success("Feedback submitted successfully!");
            setFeedbackModal({ open: false, regId: null });
            setRating(0);
            setComment("");
            queryClient.invalidateQueries(["participantCamps", saveUser?.email]);
        },
        onError: (err) => {
            message.error(`Failed to submit feedback: ${err?.response?.data?.message || err.message}`);
        },
    });

    // Payment redirect
    const handlePayClick = (record) => {
        if (!record?._id) return;
        navigate(`/dashboard/payment/${record._id}`);
    };

    // Feedback modal handlers
    const handleFeedbackSubmit = () => {
        if (!rating || rating === 0) {
            message.error("Please provide a rating");
            return;
        }
        if (!comment.trim()) {
            message.error("Please provide a comment");
            return;
        }
        feedbackSubmit.mutate();
    };
    const handleFeedbackCancel = () => {
        setFeedbackModal({ open: false, regId: null });
        setRating(0);
        setComment("");
    };

    // Filter and paginate camps
    const filteredCamps = camps.filter(camp =>
        camp.campName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camp.participantName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredCamps.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCamps = filteredCamps.slice(startIndex, startIndex + itemsPerPage);

    if (isLoading) return <LoadingSkeleton />;

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 px-4 py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center py-20">
                        <div className="bg-red-50/80 dark:bg-red-950/80 backdrop-blur-xl border-2 border-red-200/50 dark:border-red-800/50 text-red-800 dark:text-red-300 p-10 rounded-3xl shadow-2xl max-w-md">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-2xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl">Error Loading Data</h3>
                                    <p className="text-sm opacity-80">{error.message || "Failed to load camps"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 px-4 py-12 transition-all duration-500">
            <Helmet><title>My Camps | Medical Camp Participant</title></Helmet>

            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-10 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-full blur-3xl transform -translate-y-4"></div>
                    <div className="relative">
                        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-3 animate-gradient">
                            My Registered Camps
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                            Track and manage your medical camp registrations
                        </p>
                        <div className="mt-6 w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto"></div>
                    </div>
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
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setCurrentPage(1);
                                }}
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
                                        onClick={() => {
                                            setSearchTerm('');
                                            setCurrentPage(1);
                                        }}
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
                                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">No Camps Registered</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
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
                            <table className="w-full min-w-[800px]">
                                <thead className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900 border-b border-gray-100/50 dark:border-gray-700/50">
                                <tr>
                                    {["Camp Name", "Participant Name", "Camp Fees", "Payment Status", "Confirmation Status", "Actions"].map((label) => (
                                        <th key={label} className="px-6 py-5 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                                            {label}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100/50 dark:divide-gray-700/50">
                                {paginatedCamps.map((camp) => (
                                    <tr key={camp._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-200">
                                        <td className="px-6 py-5">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">{camp.campName}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                <svg className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                {camp.participantName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100/80 text-green-700 dark:bg-green-900/50 dark:text-green-300 border border-green-200/50 dark:border-green-800/50">
                                                    <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                    </svg>
                                                    ৳{Number(camp.campFees || 0).toFixed(2)}
                                                </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            {camp.paymentStatus === "paid" ? (
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100/80 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50">
                                                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                                                        Paid
                                                    </span>
                                            ) : (
                                                <button
                                                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300"
                                                    onClick={() => handlePayClick(camp)}
                                                >
                                                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                    </svg>
                                                    Pay
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-5">
                                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border border-${camp.confirmationStatus === "Confirmed" ? "green-200/50 dark:border-green-800/50" : "orange-200/50 dark:border-orange-800/50"} ${camp.confirmationStatus === "Confirmed" ? "bg-green-100/80 text-green-700 dark:bg-green-900/50 dark:text-green-300" : "bg-orange-100/80 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300"}`}>
                                                    <div className={`w-2 h-2 rounded-full mr-2 ${camp.confirmationStatus === "Confirmed" ? "bg-green-500" : "bg-orange-500"}`}></div>
                                                    {camp.confirmationStatus || "Pending"}
                                                </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center space-x-4">
                                                {camp.paymentStatus === "unpaid" ? (
                                                    <button
                                                        className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300"
                                                        onClick={() => cancelRegistration.mutate(camp._id)}
                                                        disabled={cancelRegistration.isLoading}
                                                    >
                                                        {cancelRegistration.isLoading ? (
                                                            <>
                                                                <Spinner className="mr-2 h-4 w-4" />
                                                                Cancelling...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                                Cancel
                                                            </>
                                                        )}
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300"
                                                        onClick={() => setFeedbackModal({ open: true, regId: camp._id })}
                                                        disabled={camp.feedbackSubmitted}
                                                    >
                                                        {camp.feedbackSubmitted ? (
                                                            <>
                                                                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                </svg>
                                                                Feedback Submitted
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                                Give Feedback
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-between px-6 py-4 bg-white/90 dark:bg-gray-800/90 border-t border-gray-100/50 dark:border-gray-700/50 rounded-b-3xl shadow-inner">
                            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCamps.length)} of {filteredCamps.length} camps
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                            currentPage === page
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-800'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Feedback Modal */}
                <Modal
                    open={feedbackModal.open}
                    onOk={handleFeedbackSubmit}
                    onCancel={handleFeedbackCancel}
                    okText="Submit"
                    cancelText="Cancel"
                    confirmLoading={feedbackSubmit.isLoading}
                    okButtonProps={{
                        disabled: rating === 0 || !comment.trim() || feedbackSubmit.isLoading,
                        className: "px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-sm hover:shadow-md transform hover:scale-105 disabled:transform-none transition-all duration-300"
                    }}
                    cancelButtonProps={{
                        className: "px-6 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                    }}
                    className="!top-20 rounded-3xl"
                    destroyOnClose
                    bodyStyle={{
                        backgroundColor: document.documentElement.classList.contains('dark') ? '#1e293b' : '#ffffff',
                        borderRadius: '1.5rem',
                        padding: '2rem',
                        border: '1px solid rgba(209, 213, 219, 0.3)',
                    }}
                >
                    <div className="space-y-6 py-4">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">Submit Feedback</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">Share your experience about the camp</p>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                            <Rate value={rating} onChange={setRating} style={{ fontSize: "24px", color: '#3b82f6' }} allowClear />
                            {rating === 0 && (
                                <p className="text-red-500 text-sm mt-2 font-medium">Please provide a rating</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Comment</label>
                            <TextArea
                                rows={5}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your experience about the camp..."
                                maxLength={500}
                                showCount
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 transition-all duration-300 shadow-sm outline-none"
                            />
                            {!comment.trim() && (
                                <p className="text-red-500 text-sm mt-2 font-medium">Please provide a comment</p>
                            )}
                        </div>
                    </div>
                </Modal>
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                }

                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 8s ease infinite;
                }
            `}</style>
        </div>
    );
};

export default ParticipantCamps;