import React, { useEffect, useRef, useState } from 'react';
import {
    Users,
    Shield,
    Heart,
    MapPin,
    Clock,
    Phone,
    Mail
} from 'lucide-react';

// Simple CountUp component
const CountUp = ({ end, duration = 2, separator = ",", suffix = "", start = false }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!start) return;

        let startTime = null;
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

            // Use easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutQuart * end));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [start, end, duration]);

    // Format number with separator
    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    };

    return <span>{formatNumber(count)}{suffix}</span>;
};

const About = () => {
    const features = [
        {
            icon: <Users className="w-8 h-8" />,
            title: 'Trusted Organizers',
            description: 'Verified professionals with a track record of quality service.',
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: 'Quality & Safety',
            description: 'Standardized protocols and participant-first experiences.',
        },
        {
            icon: <Heart className="w-8 h-8" />,
            title: 'Community Impact',
            description: 'Improving public health awareness through accessible camps.',
        },
    ];

    const StatCard = ({ icon, value, label, color, duration = 2 }) => {
        const [isVisible, setIsVisible] = useState(false);
        const statRef = useRef(null);

        useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && !isVisible) {
                        setIsVisible(true);
                    }
                },
                { threshold: 0.3 }
            );

            if (statRef.current) {
                observer.observe(statRef.current);
            }

            return () => {
                if (statRef.current) {
                    observer.unobserve(statRef.current);
                }
            };
        }, [isVisible]);

        // Parse numeric value and suffix
        const parseValue = (val) => {
            if (typeof val === 'string') {
                const match = val.match(/^(\d+(?:\.\d+)?)(.*)/);
                if (match) {
                    return {
                        numeric: parseFloat(match[1]),
                        suffix: match[2]
                    };
                }
                return { numeric: 0, suffix: val };
            }
            return { numeric: val, suffix: '' };
        };

        const { numeric, suffix } = parseValue(value);

        return (
            <div ref={statRef} className="text-center p-4">
                <div className="mb-3 text-4xl flex justify-center">{icon}</div>
                <p className={`text-4xl font-bold mb-2 ${color}`}>
                    <CountUp
                        end={numeric}
                        duration={duration}
                        separator=","
                        suffix={suffix}
                        start={isVisible}
                    />
                </p>
                <p className="text-lg text-gray-600">{label}</p>
            </div>
        );
    };

    return (
        <div className="min-h-screen ">
            {/* Hero Section */}
            <div className=" text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-blue-100 bg-blue-800/30 rounded-full backdrop-blur-sm">
                        About Our Mission
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
                        Connecting Communities with Quality Healthcare
                    </h1>
                    <p className="text-xl text-gray-800 dark:text-white max-w-3xl mx-auto">
                        MediPeak is dedicated to making preventive healthcare accessible to all through our network of trusted medical camps and healthcare professionals.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                {/* Features Section */}
                <section className="mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Why Choose MediPeak?
                        </h2>
                        <div className="w-24 mx-auto h-1 bg-blue-500 rounded"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="h-full border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 p-6 bg-white"
                            >
                                <div className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-blue-100 text-blue-600">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Mission Section */}
                <section className="mb-16">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold mb-4 text-gray-900">
                                    Our Mission & Vision
                                </h2>
                                <div className="w-24 mx-auto h-1 bg-blue-500 rounded"></div>
                            </div>

                            <div className="space-y-6 text-lg text-gray-700">
                                <p>
                                    At MediPeak, we believe that quality healthcare should be accessible to everyone, regardless of their location or background.
                                    Our platform bridges the gap between healthcare providers and communities in need.
                                </p>
                                <p>
                                    We envision a future where preventive healthcare is not a privilege but a standard part of community well-being.
                                    Through our network of medical camps, we're making this vision a reality, one community at a time.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
                                <StatCard
                                    icon={<Users className="w-10 h-10" />}
                                    value={1000}
                                    label="Happy Campers"
                                    color="text-blue-500"
                                    duration={2.5}
                                />
                                <StatCard
                                    icon={<Shield className="w-10 h-10" />}
                                    value={250}
                                    label="Successful Camps"
                                    color="text-green-500"
                                    duration={2.5}
                                />
                                <StatCard
                                    icon={<Heart className="w-10 h-10" />}
                                    value={5}
                                    label="Years of Experience"
                                    color="text-purple-500"
                                    duration={2.5}
                                />
                            </div>

                            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    {
                                        icon: <MapPin className="w-6 h-6 text-blue-500" />,
                                        title: 'Our Location',
                                        text: '123 Health Street, Medical District, City'
                                    },
                                    {
                                        icon: <Clock className="w-6 h-6 text-blue-500" />,
                                        title: 'Working Hours',
                                        text: 'Mon - Fri: 9:00 AM - 6:00 PM'
                                    },
                                    {
                                        icon: <Phone className="w-6 h-6 text-blue-500" />,
                                        title: 'Contact Us',
                                        text: '+1 (555) 123-4567',
                                        email: 'info@medipeak.com'
                                    }
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-white p-6 rounded-xl shadow-sm"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                                            {item.icon}
                                        </div>
                                        <h4 className="text-lg font-semibold mb-2 text-gray-900">
                                            {item.title}
                                        </h4>
                                        <p className="text-gray-600">
                                            {item.text}
                                        </p>
                                        {item.email && (
                                            <p className="mt-2 flex items-center gap-2 text-blue-500">
                                                <Mail className="w-4 h-4" />
                                                {item.email}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Values Section */}
                <section>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Our Core Values
                        </h2>
                        <div className="w-24 mx-auto h-1 bg-blue-500 rounded"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                title: 'Excellence',
                                description: 'We maintain the highest standards in healthcare delivery and camp organization.'
                            },
                            {
                                title: 'Compassion',
                                description: 'We approach every individual with empathy, respect, and understanding.'
                            },
                            {
                                title: 'Innovation',
                                description: 'We continuously improve our services through technology and best practices.'
                            },
                            {
                                title: 'Community',
                                description: 'We believe in the power of community to drive positive health outcomes.'
                            }
                        ].map((value, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-xl hover:shadow-md transition-shadow duration-300 bg-white"
                            >
                                <div className="text-center p-4">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                        <span className="text-xl font-bold">{index + 1}</span>
                                    </div>
                                    <h4 className="text-lg font-semibold mb-2 text-gray-900">
                                        {value.title}
                                    </h4>
                                    <p className="text-gray-600">
                                        {value.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;