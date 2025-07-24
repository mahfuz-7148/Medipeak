
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Button, List, Rate } from "antd";
import { useNavigate } from "react-router";
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


    if (campsLoading || feedbackLoading) return <div className="text-center">Loading...</div>;
    if (campsError || feedbackError) return <div className="text-center text-red-500 dark:text-red-400">Error: {campsError?.message || feedbackError?.message}</div>;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Banner />
            <div className="max-w-7xl mx-auto mt-8 py-6">
                {/* Popular Medical Camps Section */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Popular Medical Camps</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {popularCamps.map((camp) => (
                            <Card
                                key={camp._id}
                                hoverable
                                cover={<img alt={camp.campName} src={camp.image} className="h-48 object-cover" />}
                                className="bg-white dark:bg-gray-800"
                            >
                                <Card.Meta
                                    title={camp.campName}
                                    description={
                                        <>
                                            <p><strong>Fees:</strong> ${Number(camp.campFees).toFixed(2)}</p>
                                            <p><strong>Date & Time:</strong> {new Date(camp.dateTime).toLocaleString()}</p>
                                            <p><strong>Location:</strong> {camp.location}</p>
                                            <p><strong>Healthcare Professional:</strong> {camp.healthcareProfessionalName}</p>
                                            <p><strong>Participants:</strong> {camp.participantCount}</p>
                                        </>
                                    }
                                />
                            </Card>
                        ))}
                    </div>
                    <div className="text-center mt-6">
                        <Button type="primary" onClick={() => navigate("/available-camps")}>See All Camps</Button>
                    </div>
                </div>

                {/* Feedback and Ratings Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-4">Feedback and Ratings</h2>
                    {feedback.length > 0 ? (
                        <List
                            itemLayout="horizontal"
                            dataSource={feedback.slice(0, 5)}
                            renderItem={(item) => (
                                <List.Item className="bg-white dark:bg-gray-800  p-4 rounded-lg">
                                    <List.Item.Meta
                                        title={<span className="text-lg dark:text-gray-200">{item.campName || "Unnamed Camp"}</span>}
                                        description={
                                            <div className='dark:text-gray-200'>
                                                <p><strong>Rating:</strong> <Rate value={item.rating} disabled /></p>
                                                <p><strong>Comment:</strong> {item.comment}</p>
                                                <p><strong>Date:</strong> {new Date(item.date).toLocaleString()}</p>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    ) : (
                        <p className="text-center">No feedback available yet.</p>
                    )}
                </div>

                {/* Health Resources Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-4">Health Resources</h2>
                    <p className="mb-2">Explore valuable resources for your well-being, updated as of 12:57 PM +06, Sunday, July 20, 2025:</p>
                    <ul className="list-disc pl-5">
                        <li><strong>First Aid Guide:</strong> Learn basic first aid techniques for emergencies at camps.</li>
                        <li><strong>Nutrition Plans:</strong> Access diet plans to prepare for medical camp activities.</li>
                        <li><strong>Health FAQs:</strong> Get answers to common health questions from our professionals.</li>
                    </ul>
                    <p className="mt-2">Visit our <a href="/health-resources" className="text-blue-500 dark:text-blue-400 underline">Health Resources</a> page for more details!</p>
                </div>
            </div>
        </div>
    );
};

export default Home;