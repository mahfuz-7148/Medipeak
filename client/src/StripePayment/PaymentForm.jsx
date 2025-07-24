import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../hooks/useAuth.jsx';
import useAxios from '../Hooks/useAxios.jsx';
import Swal from 'sweetalert2';
import useAxiosSecure from '../Hooks/useAxiosSecure.jsx';

const PaymentForm = () => {
    const { registrationId } = useParams();
    const { saveUser } = useAuth();
    const axios = useAxios();
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    const { isLoading, data: regData } = useQuery({
        queryKey: ['participantRegistration', registrationId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/participant/camps?email=${saveUser?.email}`);
            return Array.isArray(res.data) ? res.data.find((r) => r._id === registrationId) : null;
        },
        enabled: !!registrationId && !!saveUser?.email,
    });

    if (isLoading) return <div>Loading payment details...</div>;
    if (!regData) return <div>Registration not found or you are not authorized to pay for this registration.</div>;

    // Safely get campFees with a default value of 0 if null/undefined
    const amount = parseFloat(regData.campFees) || 0;
    const amountInCents = Math.round(amount * 100);

    // Early return if amount is 0 or invalid
    if (amount <= 0) {
        return <div className="text-red-600">Invalid payment amount. Please contact support.</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!stripe || !elements) {
            setError('Stripe has not loaded yet. Please try again later.');
            return;
        }

        setProcessing(true);

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setError('Card details not found.');
            setProcessing(false);
            return;
        }

        try {
            const { error: createError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: { name: saveUser?.name || saveUser?.displayName || 'Anonymous', email: saveUser?.email },
            });

            if (createError) {
                setError(createError.message);
                setProcessing(false);
                return;
            }

            const { data } = await axios.post('/create-payment-intent', { amountInCents });
            const { clientSecret } = data;

            const confirmResult = await stripe.confirmCardPayment(clientSecret, { payment_method: paymentMethod.id });

            if (confirmResult.error) {
                setError(confirmResult.error.message);
                setProcessing(false);
                return;
            }

            if (confirmResult.paymentIntent.status === 'succeeded') {
                const transactionId = confirmResult.paymentIntent.id;
                await axios.put(`/participant/camp/${registrationId}/pay`, { transactionId });
                await Swal.fire({
                    icon: 'success',
                    title: 'Payment Successful!',
                    html: `<strong>Transaction ID: </strong><code>${transactionId}</code>`,
                    confirmButtonText: 'Go to Dashboard'
                });
                navigate('/dashboard/participant-camps');
            }
        } catch (err) {
            setError(err.message || 'Payment failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow space-y-4">
            <h2 className="text-xl font-bold">Payment: ${amount.toFixed(2)}</h2>
            <CardElement
                className="p-3 border rounded"
                options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }}
            />
            {error && <p className="text-red-600">{error}</p>}
            <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={!stripe || processing || amount <= 0}
            >
                {processing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
            </button>
        </form>
    );
};

export default PaymentForm;