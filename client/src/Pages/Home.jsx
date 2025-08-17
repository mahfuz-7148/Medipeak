import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Button, List, Rate, Skeleton, Alert } from "antd";
import { useNavigate } from "react-router";
import {
    CalendarOutlined,
    EnvironmentOutlined,
    UserOutlined,
    TeamOutlined,
    StarOutlined,
    ArrowRightOutlined,
    HeartOutlined,
    SafetyOutlined,
    BookOutlined,
    CheckCircleOutlined,
    FireOutlined,
    GiftOutlined,
    ThunderboltOutlined
} from "@ant-design/icons";
import useAxios from "../Hooks/useAxios.jsx";
import Banner from "../Components/Banner.jsx";

const Home = () => {
    const axios = useAxios();
    const navigate = useNavigate();

    const { data: popularCamps = [], isLoading: campsLoading, error: campsError } = useQuery({
        queryKey: ["popularCamps"],
        queryFn: async () => {
            const res = await axios.get("/organizer-camps?sort=participantCount&limit=6");
            return res.data;
        },
    });

    const { data: feedback = [], isLoading: feedbackLoading, error: feedbackError } = useQuery({
        queryKey: ["feedback"],
        queryFn: async () => {
            const res = await axios.get("/feedback");
            return res.data;
        },
    });

    // Loading Component
    const LoadingCards = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
                <Card key={index} className="shadow-lg">
                    <Skeleton loading active>
                        <Card.Meta
                            title="Loading..."
                            description="Please wait while we load the content..."
                        />
                    </Skeleton>
                </Card>
            ))}
        </div>
    );

    // Error Component
    const ErrorAlert = ({ error }) => (
        <Alert
            message="Something went wrong"
            description={error?.message || "Unable to load data. Please try again later."}
            type="error"
            showIcon
            className="mb-6"
        />
    );

    if (campsError || feedbackError) {
        return (
            <div className="min-h-screen text-gray-900 dark:text-gray-100">
                <Banner />
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <ErrorAlert error={campsError || feedbackError} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-gray-900 dark:text-gray-100">
            <Banner />

            <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
                {/* Popular Medical Camps Section */}
                <section>
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Popular Medical Camps
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Join thousands of participants in our most popular health camps, designed to promote community wellness
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full"></div>
                    </div>

                    {campsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                            {[...Array(4)].map((_, index) => (
                                <div key={index} className="animate-pulse">
                                    <div className="bg-gray-300 dark:bg-gray-700 h-56 rounded-t-lg"></div>
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-b-lg shadow-lg">
                                        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
                                        <div className="space-y-2">
                                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                                {popularCamps.slice(0, 4).map((camp) => (
                                    <div
                                        key={camp._id}
                                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl dark:hover:shadow-2xl dark:hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col h-full"
                                    >
                                        <div className="relative overflow-hidden">
                                            <img
                                                alt={camp.campName}
                                                src={camp.image}
                                                className="h-56 w-full object-cover transition-transform duration-500 hover:scale-110"
                                            />
                                            <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                                                ${Number(camp.campFees).toFixed(2)}
                                            </div>
                                        </div>

                                        <div className="p-4 flex flex-col flex-grow">
                                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white h-14 flex items-start">
                                                <span className="line-clamp-2">{camp.campName}</span>
                                            </h3>
                                            <div className="space-y-3 mb-4 flex-grow">
                                                <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                    <svg className="w-4 h-4 mr-3 text-blue-500 dark:text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                                                    </svg>
                                                    <span className="text-sm text-gray-600 dark:text-gray-300">{new Date(camp.dateTime).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                    <svg className="w-4 h-4 mr-3 text-green-500 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                                    </svg>
                                                    <span className="text-sm truncate text-gray-600 dark:text-gray-300">{camp.location}</span>
                                                </div>
                                                <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                    <svg className="w-4 h-4 mr-3 text-purple-500 dark:text-purple-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 4V6C15 7.1 14.1 8 13 8S11 7.1 11 6V4L5 7V9C5 10.1 5.9 11 7 11H9.5V12C9.5 12.8 10.2 13.5 11 13.5S12.5 12.8 12.5 12V11H15C16.1 11 17 10.1 17 9Z"/>
                                                    </svg>
                                                    <span className="text-sm truncate text-gray-600 dark:text-gray-300">{camp.healthcareProfessionalName}</span>
                                                </div>
                                                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                                                    <div className="flex items-center text-orange-500 dark:text-orange-400">
                                                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.996 1.996 0 0 0 18.04 7c-.8 0-1.54.5-1.85 1.26l-1.92 5.77c-.26.77.14 1.61.91 1.87L16 16.41V22h2zm-5.5-2c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S13 21.83 13 20.5s.67-1.5 1.5-1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-6H5.96l.54-2c.2-.78-.22-1.59-1-1.79-.78-.2-1.59.22-1.79 1L2.75 18H5.5V22H7.5z"/>
                                                        </svg>
                                                        <span className="font-semibold text-orange-500 dark:text-orange-400">{camp.participantCount} joined</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-semibold py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 mt-auto"
                                                onClick={() => navigate(`/camps/${camp._id}`)}
                                            >
                                                <span>Learn More</span>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center mt-12">
                                <button
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center space-x-2"
                                    onClick={() => navigate("/available-camps")}
                                >
                                    <span>View All Medical Camps</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </>
                    )}
                </section>

                {/* Flash Sale Banner */}
                <section className="rounded-3xl p-8 text-gray-900 dark:text-white shadow-2xl relative overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-4 left-4 w-32 h-32 bg-yellow-400 dark:bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-4 right-4 w-24 h-24 bg-orange-400 dark:bg-purple-500 rounded-full blur-2xl animate-pulse delay-1000"></div>
                    </div>
                    <div className="relative text-center">
                        <div className="flex justify-center items-center mb-4">
                            <svg className="w-16 h-16 text-yellow-400 dark:text-orange-400 animate-bounce mr-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
                            </svg>
                            <div className="bg-yellow-400 dark:bg-orange-500 text-black dark:text-white px-4 py-2 rounded-full font-bold text-lg animate-pulse">
                                🔥 FLASH SALE
                            </div>
                            <svg className="w-16 h-16 text-yellow-400 dark:text-orange-400 animate-bounce ml-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
                            </svg>
                        </div>
                        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">⚡ 24 HOURS ONLY ⚡</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Get up to 70% OFF on Premium Health Camps!</p>
                        <div className="flex justify-center items-center space-x-8 mb-6">
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4">
                                <div className="text-3xl font-bold">12</div>
                                <div className="text-sm">Hours</div>
                            </div>
                            <div className="text-4xl animate-pulse">:</div>
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4">
                                <div className="text-3xl font-bold">35</div>
                                <div className="text-sm">Minutes</div>
                            </div>
                            <div className="text-4xl animate-pulse">:</div>
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4">
                                <div className="text-3xl font-bold">47</div>
                                <div className="text-sm">Seconds</div>
                            </div>
                        </div>
                        <button
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M11.5,22C11.64,22 11.77,22 11.9,21.96C12.55,21.82 13.09,21.38 13.34,20.78C13.44,20.54 13.5,20.27 13.5,20H9.5A2,2 0 0,0 11.5,22M18,10.5C18,7.43 15.86,4.86 13,4.18V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V4.18C7.13,4.86 5,7.43 5,10.5V16L3,18V19H20V18L18,16M11.5,7C13.71,7 15.5,8.79 15.5,11C15.5,13.21 13.71,15 11.5,15C9.29,15 7.5,13.21 7.5,11C7.5,8.79 9.29,7 11.5,7Z"/>
                            </svg>
                            <span>🛒 SHOP FLASH SALE NOW!</span>
                        </button>
                    </div>
                </section>

                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { icon: <HeartOutlined />, number: "500+", label: "Lives Touched", color: "bg-red-500" },
                                { icon: <TeamOutlined />, number: "1000+", label: "Children Vaccinated", color: "bg-green-500" },
                                { icon: <SafetyOutlined />, number: "300+", label: "Eye Care Patients", color: "bg-blue-500" },
                                { icon: <CheckCircleOutlined />, number: "50+", label: "Successful Camps", color: "bg-purple-500" }
                            ].map((stat, index) => (
                                <Card
                                    key={index}
                                    className="text-center shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 rounded-xl"
                                >
                                    <div className={`w-16 h-16 ${stat.color} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                                        {stat.icon}
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</h3>
                                    <p className="text-gray-600 font-medium">{stat.label}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Newsletter Subscription */}
                <section className="rounded-3xl p-12 text-gray-900 dark:text-white shadow-2xl border border-gray-200 dark:border-gray-700">
                    <div className="text-center mb-12">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-blue-500 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
                            </svg>
                        </div>
                        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">📧 Stay Updated!</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Subscribe to our newsletter and never miss exclusive health camp deals, tips, and updates!
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="text-center bg-gray-100 dark:bg-gray-800 rounded-2xl p-6">
                                <div className="text-4xl mb-4">💌</div>
                                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Weekly Deals</h3>
                                <p className="text-gray-600 dark:text-gray-300">Get exclusive discounts every week</p>
                            </div>
                            <div className="text-center bg-gray-100 dark:bg-gray-800 rounded-2xl p-6">
                                <div className="text-4xl mb-4">🏥</div>
                                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Health Tips</h3>
                                <p className="text-gray-600 dark:text-gray-300">Expert advice from healthcare professionals</p>
                            </div>
                            <div className="text-center bg-gray-100 dark:bg-gray-800 rounded-2xl p-6">
                                <div className="text-4xl mb-4">⚡</div>
                                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Early Access</h3>
                                <p className="text-gray-600 dark:text-gray-300">Be first to know about new camps</p>
                            </div>
                        </div>

                        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-600">
                            <div className="flex flex-col md:flex-row gap-4">
                                <input
                                    type="email"
                                    placeholder="Enter your email address..."
                                    className="flex-1 px-6 py-4 rounded-xl bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                                />
                                <button
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center space-x-2"
                                >
                                    <span>🚀 Subscribe Now!</span>
                                </button>
                            </div>
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                                🔒 Your email is safe with us. No spam, unsubscribe anytime.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Feedback and Ratings Section */}
                <section className="rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Community Feedback
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Hear from our community members about their experiences with our medical camps
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full"></div>
                    </div>

                    {feedbackLoading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg p-6 animate-pulse">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                                        <div className="flex-1 space-y-3">
                                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                                            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                                            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                                            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                                            <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : feedback.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {feedback.slice(0, 4).map((item, index) => (
                                <div
                                    key={index}
                                    className="shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            {item.campName?.charAt(0) || "U"}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-2">
                                                {item.campName || "Medical Camp"}
                                            </h4>
                                            <div className="flex items-center mb-3">
                                                <div className="flex space-x-1">
                                                    {[...Array(5)].map((_, starIndex) => (
                                                        <svg
                                                            key={starIndex}
                                                            className={`w-4 h-4 ${
                                                                starIndex < item.rating
                                                                    ? "text-yellow-400 fill-current"
                                                                    : "text-gray-300 dark:text-gray-600"
                                                            }`}
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                <span className="ml-2 text-gray-600 dark:text-gray-300 text-sm">
                                                    ({item.rating}/5)
                                                </span>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300 mb-3 italic">
                                                "{item.comment}"
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(item.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                            <p className="text-xl text-gray-500 dark:text-gray-400 mb-2">No feedback available yet.</p>
                            <p className="text-gray-400 dark:text-gray-500">Be the first to share your experience!</p>
                        </div>
                    )}
                </section>

                {/* Loyalty Program */}
                <section className="rounded-3xl p-12 shadow-2xl relative overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full">
                            <div className="absolute top-8 left-8 w-16 h-16 bg-yellow-400 rounded-full blur-xl animate-pulse"></div>
                            <div className="absolute top-16 right-16 w-12 h-12 bg-pink-400 rounded-full blur-lg animate-pulse delay-500"></div>
                            <div className="absolute bottom-16 left-16 w-20 h-20 bg-green-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="text-center mb-12">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                                <GiftOutlined className="text-4xl text-white" />
                            </div>
                            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">🎁 VIP Loyalty Program</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                Join our exclusive loyalty program and earn points with every camp booking. More camps = More rewards!
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <Card className="border transition-all duration-300 hover:-translate-y-2 text-center text-gray-800">
                                <div className="text-6xl mb-4">🥉</div>
                                <h3 className="text-xl font-bold mb-4">Bronze Level</h3>
                                <div className="space-y-2 text-left">
                                    <div>✅ 5% cashback on all bookings</div>
                                    <div>✅ Priority customer support</div>
                                    <div>✅ Monthly health newsletters</div>
                                </div>
                                <div className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-3">
                                    <span className="font-bold text-white">0-2 Camps Required</span>
                                </div>
                            </Card>

                            <Card className="transition-all duration-300 hover:-translate-y-2 text-center border-2 border-blue-400 text-gray-800">
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                                    MOST POPULAR
                                </div>
                                <div className="text-6xl mb-4">🥈</div>
                                <h3 className="text-xl font-bold mb-4">Silver Level</h3>
                                <div className="space-y-2 text-left">
                                    <div>✅ 10% cashback on all bookings</div>
                                    <div>✅ Free health consultations</div>
                                    <div>✅ Early access to new camps</div>
                                    <div>✅ Exclusive member-only events</div>
                                </div>
                                <div className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-3">
                                    <span className="font-bold text-white">3-5 Camps Required</span>
                                </div>
                            </Card>

                            <Card className="transition-all duration-300 hover:-translate-y-2 text-center text-gray-800">
                                <div className="text-6xl mb-4">🥇</div>
                                <h3 className="text-xl font-bold mb-4">Gold Level</h3>
                                <div className="space-y-2 text-left">
                                    <div>✅ 20% cashback on all bookings</div>
                                    <div>✅ Free premium health checkups</div>
                                    <div>✅ Personal health coordinator</div>
                                    <div>✅ VIP camp experiences</div>
                                    <div>✅ Partner clinic discounts</div>
                                </div>
                                <div className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-3">
                                    <span className="font-bold text-white">6+ Camps Required</span>
                                </div>
                            </Card>
                        </div>


                    </div>
                </section>

                <section className="rounded-3xl p-12 shadow-2xl border border-gray-200 dark:border-gray-700">
                    <div className="text-center mb-12">
                        <BookOutlined className="text-6xl mb-6 text-gray-600" />
                        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Health Resources</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Explore valuable resources for your well-being, updated as of 10:27 PM +06, Saturday, August 16, 2025
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <SafetyOutlined />,
                                title: "First Aid Guide",
                                description: "Learn basic first aid techniques for emergencies at camps.",
                                color: "bg-red-500"
                            },
                            {
                                icon: <HeartOutlined />,
                                title: "Nutrition Plans",
                                description: "Access diet plans to prepare for medical camp activities.",
                                color: "bg-green-500"
                            },
                            {
                                icon: <BookOutlined />,
                                title: "Health FAQs",
                                description: "Get answers to common health questions from our professionals.",
                                color: "bg-blue-500"
                            }
                        ].map((resource, index) => (
                            <Card
                                key={index}
                                className="bg-gray-50 border hover:bg-gray-100 transition-all duration-300 hover:-translate-y-2 text-gray-800"
                            >
                                <div className="text-center">
                                    <div className={`w-16 h-16 ${resource.color} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                                        {resource.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{resource.title}</h3>
                                    <p className="text-gray-600">{resource.description}</p>
                                </div>
                            </Card>
                        ))}
                    </div>


                </section>
            </div>
        </div>
    );
};

export default Home;