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
        <div className="min-h-screen  text-gray-900 dark:text-gray-100">
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
                        <LoadingCards />
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {popularCamps.map((camp) => (
                                    <Card
                                        key={camp._id}
                                        hoverable
                                        cover={
                                            <div className="relative overflow-hidden">
                                                <img
                                                    alt={camp.campName}
                                                    src={camp.image}
                                                    className="h-56 w-full object-cover transition-transform duration-500 hover:scale-110"
                                                />
                                                <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                    ${Number(camp.campFees).toFixed(2)}
                                                </div>
                                            </div>
                                        }
                                        className="shadow-lg bg-white dark:bg-gray-800 border-0 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                                        actions={[
                                            <Button
                                                type="primary"
                                                className="bg-gradient-to-r from-blue-500 to-indigo-500 border-0 hover:from-blue-600 hover:to-indigo-600"
                                                icon={<ArrowRightOutlined />}
                                                onClick={() => navigate(`/camp/${camp._id}`)}
                                            >
                                                Learn More
                                            </Button>
                                        ]}
                                    >
                                        <div className="p-2">
                                            <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white line-clamp-2">
                                                {camp.campName}
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                    <CalendarOutlined className="mr-3 text-blue-500" />
                                                    <span className="text-sm">{new Date(camp.dateTime).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                    <EnvironmentOutlined className="mr-3 text-green-500" />
                                                    <span className="text-sm truncate">{camp.location}</span>
                                                </div>
                                                <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                    <UserOutlined className="mr-3 text-purple-500" />
                                                    <span className="text-sm truncate">{camp.healthcareProfessionalName}</span>
                                                </div>
                                                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                                                    <div className="flex items-center text-orange-500">
                                                        <TeamOutlined className="mr-2" />
                                                        <span className="font-semibold">{camp.participantCount} joined</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            <div className="text-center mt-12">
                                <Button
                                    type="primary"
                                    size="large"
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 px-8 py-6 h-auto text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
                                    icon={<ArrowRightOutlined />}
                                    onClick={() => navigate("/available-camps")}
                                >
                                    View All Medical Camps
                                </Button>
                            </div>
                        </>
                    )}
                </section>

                {/* NEW FEATURE 1: Flash Sale Banner */}
                <section className=" rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-4 left-4 w-32 h-32 bg-yellow-400 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-4 right-4 w-24 h-24 bg-orange-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
                    </div>
                    <div className="relative text-center">
                        <div className="flex justify-center items-center mb-4">
                            <FireOutlined className="text-6xl animate-bounce mr-4" />
                            <div className="bg-yellow-400 text-black px-4 py-2 rounded-full font-bold text-xl animate-pulse">
                                🔥 FLASH SALE
                            </div>
                            <FireOutlined className="text-6xl animate-bounce ml-4" />
                        </div>
                        <h2 className="text-5xl font-bold mb-4">⚡ 24 HOURS ONLY ⚡</h2>
                        <p className="text-2xl mb-6 font-semibold">Get up to 70% OFF on Premium Health Camps!</p>
                        <div className="flex justify-center items-center space-x-8 mb-6">
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                                <div className="text-3xl font-bold">12</div>
                                <div className="text-sm">Hours</div>
                            </div>
                            <div className="text-4xl animate-pulse">:</div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                                <div className="text-3xl font-bold">35</div>
                                <div className="text-sm">Minutes</div>
                            </div>
                            <div className="text-4xl animate-pulse">:</div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                                <div className="text-3xl font-bold">47</div>
                                <div className="text-sm">Seconds</div>
                            </div>
                        </div>
                        <Button
                            type="primary"
                            size="large"
                            className="bg-yellow-400 text-black border-0 px-12 py-6 h-auto text-2xl font-bold hover:bg-yellow-300 shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-110 rounded-full"
                            icon={<ThunderboltOutlined />}
                        >
                            🛒 SHOP FLASH SALE NOW!
                        </Button>
                    </div>
                </section>

                <section className="">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { icon: <HeartOutlined />, number: "500+", label: "Lives Touched", color: "bg-red-500" },
                            { icon: <TeamOutlined />, number: "1000+", label: "Children Vaccinated", color: "bg-green-500" },
                            { icon: <SafetyOutlined />, number: "300+", label: "Eye Care Patients", color: "bg-blue-500" },
                            { icon: <CheckCircleOutlined />, number: "50+", label: "Successful Camps", color: "bg-purple-500" }
                        ].map((stat, index) => (
                            <Card
                                key={index}
                                className="text-center shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className={`w-16 h-16 ${stat.color} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                                    {stat.icon}
                                </div>
                                <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{stat.number}</h3>
                                <p className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</p>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* NEW FEATURE 2: Newsletter Subscription */}
                <section className=" rounded-3xl p-12 text-white shadow-2xl">
                    <div className="text-center mb-12">
                        <div className="bg-white/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                            <BookOutlined className="text-4xl" />
                        </div>
                        <h2 className="text-5xl font-bold mb-4">📧 Stay Updated!</h2>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Subscribe to our newsletter and never miss exclusive health camp deals, tips, and updates!
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                                <div className="text-4xl mb-4">💌</div>
                                <h3 className="text-xl font-bold mb-2">Weekly Deals</h3>
                                <p className="opacity-90">Get exclusive discounts every week</p>
                            </div>
                            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                                <div className="text-4xl mb-4">🏥</div>
                                <h3 className="text-xl font-bold mb-2">Health Tips</h3>
                                <p className="opacity-90">Expert advice from healthcare professionals</p>
                            </div>
                            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                                <div className="text-4xl mb-4">⚡</div>
                                <h3 className="text-xl font-bold mb-2">Early Access</h3>
                                <p className="opacity-90">Be first to know about new camps</p>
                            </div>
                        </div>

                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8">
                            <div className="flex flex-col md:flex-row gap-4">
                                <input
                                    type="email"
                                    placeholder="Enter your email address..."
                                    className="flex-1 px-6 py-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent backdrop-blur-sm text-lg"
                                />
                                <Button
                                    type="primary"
                                    size="large"
                                    className="bg-white text-green-600 border-0 px-8 py-4 h-auto text-lg font-bold hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                                >
                                    🚀 Subscribe Now!
                                </Button>
                            </div>
                            <p className="text-center text-sm opacity-80 mt-4">
                                🔒 Your email is safe with us. No spam, unsubscribe anytime.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Feedback and Ratings Section */}
                <section className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                            Community Feedback
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Hear from our community members about their experiences with our medical camps
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-teal-500 mx-auto mt-4 rounded-full"></div>
                    </div>

                    {feedbackLoading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, index) => (
                                <Card key={index} className="shadow-md">
                                    <Skeleton loading active avatar paragraph={{ rows: 3 }} />
                                </Card>
                            ))}
                        </div>
                    ) : feedback.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {feedback.slice(0, 4).map((item, index) => (
                                <Card
                                    key={index}
                                    className="shadow-lg bg-white dark:bg-gray-700 border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
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
                                                <Rate value={item.rating} disabled className="text-sm" />
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
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <StarOutlined className="text-6xl text-gray-400 mb-4" />
                            <p className="text-xl text-gray-500 dark:text-gray-400">No feedback available yet.</p>
                            <p className="text-gray-400 dark:text-gray-500">Be the first to share your experience!</p>
                        </div>
                    )}
                </section>

                {/* NEW FEATURE 3: Loyalty Program */}
                <section className=" rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full">
                            <div className="absolute top-8 left-8 w-16 h-16 bg-yellow-400 rounded-full blur-xl animate-pulse"></div>
                            <div className="absolute top-16 right-16 w-12 h-12 bg-pink-400 rounded-full blur-lg animate-pulse delay-500"></div>
                            <div className="absolute bottom-16 left-16 w-20 h-20 bg-green-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="text-center mb-12">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                                <GiftOutlined className="text-4xl text-white" />
                            </div>
                            <h2 className="text-5xl font-bold mb-4">🎁 VIP Loyalty Program</h2>
                            <p className="text-xl opacity-90 max-w-3xl mx-auto">
                                Join our exclusive loyalty program and earn points with every camp booking. More camps = More rewards!
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <Card className="bg-white/10 backdrop-blur-sm border-0 text-white hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 text-center">
                                <div className="text-6xl mb-4">🥉</div>
                                <h3 className="text-2xl font-bold mb-4">Bronze Level</h3>
                                <div className="space-y-2 text-left">
                                    <div>✅ 5% cashback on all bookings</div>
                                    <div>✅ Priority customer support</div>
                                    <div>✅ Monthly health newsletters</div>
                                </div>
                                <div className="mt-6 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-3">
                                    <span className="font-bold">0-2 Camps Required</span>
                                </div>
                            </Card>

                            <Card className="bg-white/10 backdrop-blur-sm border-0 text-white hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 text-center border-2 border-yellow-400">
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                                    MOST POPULAR
                                </div>
                                <div className="text-6xl mb-4">🥈</div>
                                <h3 className="text-2xl font-bold mb-4">Silver Level</h3>
                                <div className="space-y-2 text-left">
                                    <div>✅ 10% cashback on all bookings</div>
                                    <div>✅ Free health consultations</div>
                                    <div>✅ Early access to new camps</div>
                                    <div>✅ Exclusive member-only events</div>
                                </div>
                                <div className="mt-6 bg-gradient-to-r from-gray-400 to-gray-600 rounded-lg p-3">
                                    <span className="font-bold">3-5 Camps Required</span>
                                </div>
                            </Card>

                            <Card className="bg-white/10 backdrop-blur-sm border-0 text-white hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 text-center">
                                <div className="text-6xl mb-4">🥇</div>
                                <h3 className="text-2xl font-bold mb-4">Gold Level</h3>
                                <div className="space-y-2 text-left">
                                    <div>✅ 20% cashback on all bookings</div>
                                    <div>✅ Free premium health checkups</div>
                                    <div>✅ Personal health coordinator</div>
                                    <div>✅ VIP camp experiences</div>
                                    <div>✅ Partner clinic discounts</div>
                                </div>
                                <div className="mt-6 bg-gradient-to-r from-yellow-500 to-yellow-700 rounded-lg p-3">
                                    <span className="font-bold">6+ Camps Required</span>
                                </div>
                            </Card>
                        </div>

                        <div className="text-center">
                            <Button
                                type="primary"
                                size="large"
                                className="bg-gradient-to-r from-yellow-500 to-orange-600 border-0 px-12 py-6 h-auto text-2xl font-bold hover:from-yellow-600 hover:to-orange-700 shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-110 rounded-full"
                                icon={<GiftOutlined />}
                            >
                                🎯 Join Loyalty Program FREE!
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Health Resources Section */}
                <section className=" rounded-3xl p-12 text-white shadow-2xl">
                    <div className="text-center mb-12">
                        <BookOutlined className="text-6xl mb-6 opacity-80" />
                        <h2 className="text-4xl font-bold mb-4">Health Resources</h2>
                        <p className="text-xl opacity-90 max-w-3xl mx-auto">
                            Explore valuable resources for your well-being, updated as of 12:57 PM +06, Sunday, July 20, 2025
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
                                className="bg-white/10 backdrop-blur-sm border-0 text-white hover:bg-white/20 transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className="text-center">
                                    <div className={`w-16 h-16 ${resource.color} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                                        {resource.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{resource.title}</h3>
                                    <p className="opacity-90">{resource.description}</p>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Button
                            type="primary"
                            size="large"
                            className="bg-white text-indigo-600 border-0 px-8 py-6 h-auto text-lg font-semibold hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
                            icon={<ArrowRightOutlined />}
                            onClick={() => navigate("/health-resources")}
                        >
                            Explore All Resources
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;