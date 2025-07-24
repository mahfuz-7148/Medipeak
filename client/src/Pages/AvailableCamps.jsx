import React, { useState } from 'react';
import { Link } from 'react-router';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxios from '../Hooks/useAxios.jsx';

const AvailableCamps = () => {
    const axios = useAxios();
    const [inputValue, setInputValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [layout, setLayout] = useState('three-column');

    const { data: camps = [], isLoading, error } = useQuery({
        queryKey: ['availableCamps', searchTerm, sortBy],
        queryFn: async () => {
            const response = await axios.get('/camps', { params: { search: searchTerm, sort: sortBy } });
            return response.data || [];
        },
    });

    if (error) Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to fetch camps' });

    const handleInputChange = (e) => setInputValue(e.target.value);
    const doSearch = (e) => { e.preventDefault(); setSearchTerm(inputValue); };
    const handleSort = (e) => setSortBy(e.target.value);
    const toggleLayout = () => setLayout(layout === 'three-column' ? 'two-column' : 'three-column');

    if (isLoading) return <div className="flex min-h-[60vh] items-center justify-center text-xl text-gray-600 dark:text-gray-400">Loading camps...</div>;

    return (
        <section className="max-w-7xl min-h-screen mx-auto px-5 py-12">
            <Helmet><title>Available Camps</title></Helmet>
            <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-900 dark:text-gray-100">Available Camps</h2>
            <form onSubmit={doSearch} className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
                <div className="flex w-full md:w-1/2"><input type="text" placeholder="Search by name, date, or location..." value={inputValue} onChange={handleInputChange} className="flex-grow rounded-l-lg border border-gray-300 px-4 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400" /><button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-r-lg font-semibold shadow-md transition">Search</button></div>
                <div className="flex flex-wrap items-center gap-4"><select onChange={handleSort} value={sortBy} className="rounded-lg border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500"><option value="">Sort By</option><option value="most-registered">Most Registered</option><option value="fees">Camp Fees</option><option value="name">Alphabetical Order</option></select><button type="button" onClick={toggleLayout} title="Toggle Grid Layout" className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg px-4 py-3 hover:bg-gray-300 dark:hover:bg-gray-600 transition">{layout === 'three-column' ? '2 Columns' : '3 Columns'}</button></div>
            </form>
            <div className={`grid gap-8 ${layout === 'three-column' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                {camps.length === 0 ? <p className="text-center text-gray-600 dark:text-gray-400 col-span-full text-xl">No camps found.</p> : camps.map(camp => <article key={camp._id} className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-300 dark:border-gray-700 overflow-hidden flex flex-col hover:shadow-2xl transition"><img src={camp.image} alt={camp.campName} className="w-full h-52 object-cover shadow-md" loading="lazy" /><div className="p-6 flex flex-col flex-grow"><h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100 line-clamp-2">{camp.campName}</h3><p className="text-sm text-gray-600 dark:text-gray-400 mb-1"><strong>Date & Time:</strong> {new Date(camp.dateTime).toLocaleString()}</p><p className="text-sm text-gray-600 dark:text-gray-400 mb-1"><strong>Location:</strong> {camp.location}</p><p className="text-sm text-gray-600 dark:text-gray-400 mb-1"><strong>Healthcare Professional:</strong> {camp.healthcareProfessionalName || 'N/A'}</p><p className="text-sm text-gray-600 dark:text-gray-400 mb-4"><strong>Participants:</strong> {camp.participantCount}</p><p className="text-gray-700 dark:text-gray-300 flex-grow line-clamp-3">{camp.description}</p><Link to={`/camps/${camp._id}`} className="mt-6 block"><button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-200">View Details</button></Link></div></article>)}
            </div>
        </section>
    );
};

export default AvailableCamps;