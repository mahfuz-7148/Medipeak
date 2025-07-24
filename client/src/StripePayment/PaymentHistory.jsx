import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../hooks/useAuth.jsx';
import { Helmet } from 'react-helmet';
import useAxiosSecure from '../Hooks/useAxiosSecure.jsx';

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100/50 dark:border-gray-700/50 p-8">
                            <div className="flex items-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl animate-pulse"></div>
                                <div className="ml-6 space-y-3 flex-1">
                                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full animate-pulse w-24"></div>
                                    <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full animate-pulse w-20"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100/50 dark:border-gray-700/50 p-8">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-6 py-5 border-b border-gray-100/50 dark:border-gray-700/50 last:border-b-0">
                            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full animate-pulse w-12"></div>
                            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full animate-pulse w-28"></div>
                            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full animate-pulse flex-1"></div>
                            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full animate-pulse w-40"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const PaymentHistory = () => {
    const { saveUser } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch payments
    const { isLoading, data: payments = [], error } = useQuery({
        queryKey: ['payments', saveUser?.email],
        enabled: !!saveUser?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${saveUser.email}`);
            return Array.isArray(res.data) ? res.data : [];
        },
    });

    // Filter payments based on search
    const filteredPayments = useMemo(() => {
        if (!searchTerm) return payments;
        const lower = searchTerm.toLowerCase();
        return payments.filter((payment) =>
            (payment.transactionId?.toLowerCase().includes(lower)) ||
            (payment.parcelId?.toLowerCase().includes(lower)) ||
            (payment.amount?.toString().toLowerCase().includes(lower)) ||
            (payment.date && new Date(payment.date).toLocaleString().toLowerCase().includes(lower))
        );
    }, [payments, searchTerm]);

    // Pagination logic
    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

    // Calculate statistics
    const totalAmount = filteredPayments.reduce((sum, p) => sum + Number(p.amount ?? 0), 0);
    const lastPaymentDate = filteredPayments.length > 0 ? filteredPayments[0]?.date : null;

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
                                    <p className="text-sm opacity-80">{error.message || "Failed to load payment history"}</p>
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
            <Helmet><title>Payment History | Medical Camp</title></Helmet>

            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-10 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-full blur-3xl transform -translate-y-4"></div>
                    <div className="relative">
                        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-3 animate-gradient">
                            Payment History
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                            Track your camp payment transactions and receipts
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
                            placeholder="Search by Transaction ID, Parcel ID, Amount or Date..."
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

                {/* Payment Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Total Payments */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                        <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100/50 dark:border-gray-700/50 p-8 hover:scale-105 transition-all duration-300 group-hover:shadow-blue-500/20 dark:group-hover:shadow-blue-400/20">
                            <div className="flex items-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="ml-6">
                                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">
                                        Total Payments
                                    </p>
                                    <p className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">
                                        {filteredPayments.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Total Amount */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-teal-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                        <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100/50 dark:border-gray-700/50 p-8 hover:scale-105 transition-all duration-300 group-hover:shadow-green-500/20 dark:group-hover:shadow-green-400/20">
                            <div className="flex items-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <div className="ml-6">
                                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">
                                        Total Amount
                                    </p>
                                    <p className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">
                                        ৳{totalAmount.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Last Payment */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                        <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100/50 dark:border-gray-700/50 p-8 hover:scale-105 transition-all duration-300 group-hover:shadow-purple-500/20 dark:group-hover:shadow-purple-400/20">
                            <div className="flex items-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="ml-6">
                                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">
                                        Last Payment
                                    </p>
                                    <p className="text-sm font-extrabold text-gray-800 dark:text-gray-100">
                                        {lastPaymentDate ? new Date(lastPaymentDate).toLocaleString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {filteredPayments.length === 0 ? (
                    <div className="text-center py-20 animate-fade-in">
                        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100/50 dark:border-gray-700/50 p-12 max-w-lg mx-auto">
                            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                <svg className="w-12 h-12 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">No Payments Found</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Your payment history will appear here once you make a payment.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100/50 dark:border-gray-700/50 overflow-hidden animate-fade-in">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px]">
                                <thead className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900 border-b border-gray-100/50 dark:border-gray-700/50">
                                <tr>
                                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">#</th>
                                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Transaction ID</th>
                                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Payment Date</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100/50 dark:divide-gray-700/50">
                                {paginatedPayments.map((payment, index) => (
                                    <tr key={payment.transactionId || index} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-200">
                                        <td className="px-6 py-5 text-lg font-medium text-gray-600 dark:text-gray-400">
                                            {startIndex + index + 1}
                                        </td>
                                        <td className="px-6 py-5">
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100/80 text-green-700 dark:bg-green-900/50 dark:text-green-300 border border-green-200/50 dark:border-green-800/50">
                                                    <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                    </svg>
                                                    ৳{Number(payment.amount ?? 0).toFixed(2)}
                                                </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="font-mono text-sm bg-gray-100/80 dark:bg-gray-700/80 border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-3 max-w-[250px] break-all backdrop-blur-sm">
                                                    <span
                                                        className="text-gray-700 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                                                        title="Click to copy"
                                                        onClick={() => navigator.clipboard.writeText(payment.transactionId)}
                                                    >
                                                        {payment.transactionId}
                                                    </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gray-50/50 dark:bg-gray-700/50 rounded-xl p-3 border border-gray-200/50 dark:border-gray-700/50">
                                                <svg className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-sm font-medium">{new Date(payment.date).toLocaleString()}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-between px-6 py-5 border-t border-gray-100/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/30 to-blue-50/30 dark:from-gray-800/20 dark:to-blue-900/20">
                            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPayments.length)} of {filteredPayments.length} payments
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

export default PaymentHistory;