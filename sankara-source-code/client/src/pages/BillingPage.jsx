import { useEffect, useState } from 'react';
import { getPatients, createBill, payBill } from '../api/client';

export default function BillingPage() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [billAmount, setBillAmount] = useState({});

    const fetchPatients = async () => {
        try {
            const data = await getPatients();
            const billingQueue = data.filter(p => p.current_stage === 'billing');
            setPatients(billingQueue);
            setError('');
        } catch (err) {
            setError('Failed to load billing queue');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
        const interval = setInterval(fetchPatients, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleCreateBill = async (patientId) => {
        const amount = billAmount[patientId];
        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        try {
            await createBill({ patient_id: patientId, amount: parseFloat(amount) });
            setBillAmount({ ...billAmount, [patientId]: '' });
            await fetchPatients();
        } catch (err) {
            alert('Failed to create bill');
        }
    };

    const handlePayBill = async (billId, patientId) => {
        const paymentMode = prompt('Enter payment mode (cash/card/upi):');
        if (!paymentMode) return;

        try {
            await payBill(billId, { payment_mode: paymentMode });
            await fetchPatients();
        } catch (err) {
            alert('Failed to process payment');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Payments</h1>
                <p className="text-gray-600">Manage patient billing and payments</p>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {patients.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
                    <span className="text-6xl mb-4 block">💰</span>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No pending bills</h3>
                    <p className="text-gray-500">All payments completed!</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {patients.map((patient) => (
                        <div key={patient.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{patient.name}</h3>
                                    <p className="text-sm text-gray-600">Token: #{patient.token_number} | UHID: {patient.uhid}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Age:</span>
                                    <span className="ml-2 font-semibold text-gray-900">{patient.age} years</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Gender:</span>
                                    <span className="ml-2 font-semibold text-gray-900">{patient.gender}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Phone:</span>
                                    <span className="ml-2 font-semibold text-gray-900">{patient.phone}</span>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₹)</label>
                                        <input
                                            type="number"
                                            value={billAmount[patient.id] || ''}
                                            onChange={(e) => setBillAmount({ ...billAmount, [patient.id]: e.target.value })}
                                            placeholder="Enter amount"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleCreateBill(patient.id)}
                                        className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all"
                                    >
                                        Generate Bill
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
