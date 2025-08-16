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
    CheckCircleOutlined
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
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
                <Banner />
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <ErrorAlert error={campsError || feedbackError} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
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

                {/* Health Resources Section */}
                <section className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-12 text-white shadow-2xl">
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