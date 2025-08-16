import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router';

const banners = [
    {
        id: 1,
        image: 'https://www.shutterstock.com/image-photo/surgeon-medical-people-handshakingdoctors-nurses-260nw-633923255.jpg',
        alt: 'Community Health Camp',
        title: 'Empowering Communities',
        subtitle: 'Over 500 lives touched in our 2024 Free Health Checkup Camp.',
    },
    {
        id: 2,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdKSattgUr55arIzOYr-nFMaDrXBFRw9o0hA&s',
        alt: 'Medical Outreach Success',
        title: 'Healing with Care',
        subtitle: 'Provided critical eye care to 300+ patients in rural areas.',
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        alt: 'Vaccination Drive',
        title: 'Protecting Futures',
        subtitle: 'Successfully vaccinated 1,000 children in our 2023 campaign.',
    },
];

export default function Banner() {
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
        }, 4000);
        return () => clearInterval(interval);
    }, [isPaused]);

    const prevSlide = () => setCurrent(current === 0 ? banners.length - 1 : current - 1);
    const nextSlide = () => setCurrent(current === banners.length - 1 ? 0 : current + 1);

    return (
        <div
            className="relative overflow-hidden block"
            style={{
                width: '100vw',
                height: '100vh',
                margin: 0,
                padding: 0,
                marginLeft: 'calc(-50vw + 50%)',
                marginRight: 'calc(-50vw + 50%)',
                maxWidth: '100vw'
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`absolute top-0 left-0 w-full h-full transition-all duration-1000 ease-in-out ${
                        index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                    style={{ width: '100%', height: '100%' }}
                >
                    <img
                        src={banner.image}
                        alt={banner.alt}
                        className="w-full h-full object-cover brightness-75"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                        <div className="relative max-w-3xl px-4">
                            <h2
                                className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 drop-shadow-2xl ${
                                    index === current ? 'animate-slideIn' : ''
                                }`}
                            >
                                {banner.title}
                            </h2>
                            <p
                                className={`text-lg sm:text-xl md:text-2xl font-medium mb-8 drop-shadow-lg ${
                                    index === current ? 'animate-slideIn' : ''
                                }`}
                            >
                                {banner.subtitle}
                            </p>
                            <div className="text-end">
                                <button
                                    className={`px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 ${
                                        index === current ? 'animate-bounceIn' : ''
                                    }`}
                                >
                                    <Link to="/available-camps" className="text-white">
                                        Join Our Camps
                                    </Link>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <button
                onClick={prevSlide}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-gray-900/70 hover:bg-gray-900/90 p-4 rounded-full text-white z-10 transition-all duration-300 hover:scale-110 shadow-md"
                aria-label="Previous slide"
            >
                <ChevronLeftIcon className="w-8 h-8" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-gray-900/70 hover:bg-gray-900/90 p-4 rounded-full text-white z-10 transition-all duration-300 hover:scale-110 shadow-md"
                aria-label="Next slide"
            >
                <ChevronRightIcon className="w-8 h-8" />
            </button>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-4 h-4 rounded-full transition-all duration-300 shadow-sm ${
                            index === current
                                ? 'bg-blue-500 scale-150'
                                : 'bg-gray-300/60 hover:bg-gray-200/80'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
            <style>
                {`
                    * {
                        box-sizing: border-box;
                    }
                    body, html {
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                        height: 100% !important;
                        overflow-x: hidden;
                    }
                    .banner-fullwidth {
                        width: 100vw;
                        position: relative;
                        left: 50%;
                        right: 50%;
                        margin-left: -50vw;
                        margin-right: -50vw;
                    }
                    @keyframes slideIn {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    @keyframes bounceIn {
                        from {
                            opacity: 0;
                            transform: scale(0.8);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                    .animate-slideIn {
                        animation: slideIn 0.8s ease-out;
                    }
                    .animate-bounceIn {
                        animation: bounceIn 0.6s ease-out;
                    }
                `}
            </style>
        </div>
    );
}