import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Helmet } from 'react-helmet';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxios from '../Hooks/useAxios.jsx';
import useAuth from '../Hooks/useAuth.jsx';

const CampDetails = () => {
    const { id } = useParams();
    const axios = useAxios();
    const { saveUser } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        participantName: saveUser?.displayName || '',
        participantEmail: saveUser?.email || '',
        age: '',
        phoneNumber: '',
        gender: '',
        emergencyContact: ''
    });

    const { data: camp, isLoading, error } = useQuery({
        queryKey: ['camp', id],
        queryFn: async () => {
            const res = await axios.get(`/camp/${id}`);
            return res.data;
        },
    });

    

    const registerMutation = useMutation({
        mutationFn: async (data) => {
            if (!saveUser?.email) throw new Error('Please login to join the camp');
            return axios.post(`/participant/register/${id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['camp', id]);
            queryClient.invalidateQueries(['participantCamps']);
            Swal.fire('Success', 'You have successfully registered for the camp!', 'success');
            setIsModalOpen(false);
        },
        onError: (err) => {
            Swal.fire('Error', err.response?.data?.message || err.message || 'Failed to register', 'error');
            if ((err.message || '').includes('login')) navigate('/login');
        },
    });

    const handleOpenModal = () => {
        if (!saveUser?.email) {
            Swal.fire('Error', 'Please login first to register.', 'error');
            navigate('/login');
            return;
        }
        setIsModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (!formData.participantName || !formData.participantEmail || !formData.age || !formData.phoneNumber || !formData.gender || !formData.emergencyContact) {
            Swal.fire('Validation Error', 'Please fill all required fields.', 'warning');
            return;
        }
        registerMutation.mutate(formData);
    };

    if (isLoading) return <div className="text-center py-10">Loading camp details...</div>;
    if (error) return <div className="text-center py-10 text-red-600">Failed to load camp details</div>;

    return (
        <section className="max-w-6xl min-h-screen mx-auto px-4 py-12">
            <Helmet><title>{camp.campName} - Details</title></Helmet>
            <h2 className="text-3xl font-bold mb-8 text-center">{camp.campName}</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 max-w-3xl mx-auto">
                <img src={camp.image} alt={camp.campName} className="w-full h-64 object-cover rounded-lg mb-6" />
                <p className="text-gray-600 dark:text-gray-400 mb-2"><strong>Date & Time:</strong> {new Date(camp.dateTime).toLocaleString()}</p>
                <p className="text-gray-600 dark:text-gray-400 mb-2"><strong>Location:</strong> {camp.location}</p>
                <p className="text-gray-600 dark:text-gray-400 mb-2"><strong>Healthcare Professional:</strong> {camp.healthcareProfessionalName || 'N/A'}</p>
                <p className="text-gray-600 dark:text-gray-400 mb-2"><strong>Camp Fees:</strong> ${camp.campFees.toFixed(2)}</p>
                <p className="text-gray-600 dark:text-gray-400 mb-6"><strong>Participants:</strong> {camp.participantCount}</p>
                <p className="text-gray-600 dark:text-gray-400 mb-6"><strong>Description:</strong> {camp.description}</p>
                <button onClick={handleOpenModal} disabled={registerMutation.isLoading} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                    {registerMutation.isLoading && <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C6.477 0 2 4.477 2 10c0 1.042.17 2.047.488 3.001l1.464-1.001z" /></svg>}
                    {registerMutation.isLoading ? 'Registering...' : 'Join Camp'}
                </button>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-xl w-full p-6 relative">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Register for Camp</h3>
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div><label className="block font-semibold text-gray-700 dark:text-gray-300">Camp Name</label><input type="text" readOnly value={camp.campName} className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded" /></div>
                            <div><label className="block font-semibold text-gray-700 dark:text-gray-300">Camp Fees</label><input type="text" readOnly value={`$${camp.campFees.toFixed(2)}`} className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded" /></div>
                            <div><label className="block font-semibold text-gray-700 dark:text-gray-300">Location</label><input type="text" readOnly value={camp.location} className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded" /></div>
                            <div><label className="block font-semibold text-gray-700 dark:text-gray-300">Healthcare Professional</label><input type="text" readOnly value={camp.healthcareProfessionalName || 'N/A'} className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded" /></div>
                            <div><label className="block font-semibold text-gray-700 dark:text-gray-300">Participant Name</label><input type="text" name="participantName" value={formData.participantName} onChange={(e) => setFormData((prev) => ({ ...prev, participantName: e.target.value }))} className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200" required /></div>
                            <div><label className="block font-semibold text-gray-700 dark:text-gray-300">Participant Email</label><input type="email" name="participantEmail" value={formData.participantEmail} readOnly className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300" required /></div>
                            <div><label className="block font-semibold text-gray-700 dark:text-gray-300">Age</label><input type="number" name="age" value={formData.age} onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))} className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200" required min={0} /></div>
                            <div><label className="block font-semibold text-gray-700 dark:text-gray-300">Phone Number</label><input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))} className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200" required /></div>
                            <div><label className="block font-semibold text-gray-700 dark:text-gray-300">Gender</label><select name="gender" value={formData.gender} onChange={(e) => setFormData((prev) => ({ ...prev, gender: e.target.value }))} className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200" required><option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
                            <div><label className="block font-semibold text-gray-700 dark:text-gray-300">Emergency Contact</label><input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={(e) => setFormData((prev) => ({ ...prev, emergencyContact: e.target.value }))} className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200" required /></div>
                            <div className="flex justify-end space-x-2 pt-4"><button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-semibold">Cancel</button><button type="submit" disabled={registerMutation.isLoading} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50">{registerMutation.isLoading ? 'Registering...' : 'Register'}</button></div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default CampDetails;