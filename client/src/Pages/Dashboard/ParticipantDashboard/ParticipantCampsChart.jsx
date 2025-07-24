import React from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import useAuth from "../../../Hooks/useAuth.jsx";
import useAxios from "../../../Hooks/useAxios.jsx";
import useAxiosSecure from '../../../Hooks/useAxiosSecure.jsx';


// Loading Skeleton Component
function ChartLoadingSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4 py-8">
            <div className="max-w-5xl mx-auto">
                <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-lg animate-pulse mb-6 max-w-xs"></div>
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
                    <div className="h-96 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}

const ParticipantCampsChart = () => {
    const { saveUser } = useAuth();
    const axios = useAxios();
    const axiosSecure = useAxiosSecure();

    const { data: camps = [], isLoading, error } = useQuery({
        queryKey: ["participantCampsChart", saveUser?.email],
        enabled: !!saveUser?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/participant/camps?email=${saveUser.email}`);
            return res.data.map(camp => ({
                campName: camp.campName,
                campFees: Number(camp.campFees),
                registeredAt: new Date(camp.registeredAt).toLocaleDateString()
            }));
        },
    });

    if (isLoading) return <ChartLoadingSkeleton />;

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4 py-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center justify-center py-20">
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-8 rounded-2xl shadow-xl max-w-md">
                            <div className="flex items-center space-x-3">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h3 className="font-semibold text-lg">Error Loading Data</h3>
                                    <p className="text-sm opacity-90">Failed to load camps data</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate statistics
    const totalCamps = camps.length;
    const totalFees = camps.reduce((sum, camp) => sum + camp.campFees, 0);
    const avgFees = totalCamps > 0 ? totalFees / totalCamps : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4 py-8 transition-colors duration-300">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">
                        Camp Analytics
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        Your registered camps and fees visualization
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Total Camps */}
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Total Camps
                                </p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                                    {totalCamps}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Total Fees */}
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Total Fees
                                </p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                                    ৳{totalFees.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Average Fees */}
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Average Fees
                                </p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                                    ৳{avgFees.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {camps.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-16">
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-12 max-w-md mx-auto">
                            <div className="w-20 h-20 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700/50 dark:to-slate-600/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">No Camps Found</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Your registered camps will appear here once you join a camp.
                            </p>
                        </div>
                    </div>
                ) : (
                    /* Chart Container */
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                Camp Fees Comparison
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">
                                Breakdown of fees for each registered camp
                            </p>
                        </div>

                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={camps}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="currentColor"
                                        className="text-slate-200 dark:text-slate-600"
                                    />
                                    <XAxis
                                        dataKey="campName"
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        tick={{
                                            fontSize: 12,
                                            fill: 'currentColor'
                                        }}
                                        className="text-slate-600 dark:text-slate-400"
                                    />
                                    <YAxis
                                        tick={{
                                            fontSize: 12,
                                            fill: 'currentColor'
                                        }}
                                        className="text-slate-600 dark:text-slate-400"
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '12px',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                            color: '#374151'
                                        }}
                                        className="dark:[&>div]:!bg-slate-800 dark:[&>div]:!text-slate-200 dark:[&>div]:!border-slate-600"
                                        formatter={(value) => [`৳${value}`, 'Camp Fees']}
                                    />
                                    <Legend
                                        wrapperStyle={{
                                            color: 'currentColor'
                                        }}
                                        className="text-slate-600 dark:text-slate-400"
                                    />
                                    <Bar
                                        dataKey="campFees"
                                        fill="url(#colorGradient)"
                                        name="Camp Fees (৳)"
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <defs>
                                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.7}/>
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParticipantCampsChart;