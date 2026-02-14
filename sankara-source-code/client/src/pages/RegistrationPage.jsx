import { useState } from 'react';
import { createPatient } from '../api/client';

export default function RegistrationPage() {
    const [formData, setFormData] = useState({
        uhid: '',
        name: '',
        age: '',
        gender: 'Male',
        phone: '',
        priority_level: 'normal'
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(null);
        setLoading(true);

        try {
            const data = await createPatient({
                ...formData,
                age: parseInt(formData.age)
            });
            setSuccess(data);
            setFormData({ uhid: '', name: '', age: '', gender: 'Male', phone: '', priority_level: 'normal' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register patient');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Patient Registration</h1>
                <p className="text-gray-600 mt-2">Register a new patient into the system and assign them a token.</p>
            </div>

            {success && (
                <div className="mb-6 bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 border border-emerald-300 p-6 rounded-xl shadow-lg animate-scale-in">
                    <div className="flex items-start space-x-4">
                        <span className="text-3xl flex-shrink-0">✅</span>
                        <div>
                            <h3 className="text-lg font-bold text-emerald-900">Registration Successful!</h3>
                            <p className="text-emerald-700 text-base mt-2">
                                Token Number: <span className="font-bold text-2xl text-emerald-600">#{success.token_number}</span>
                            </p>
                            <p className="text-emerald-600 text-sm mt-2">Patient ID: <code className="bg-white px-2 py-1 rounded font-mono">{success.id}</code></p>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3 animate-slide-in-up">
                    <span className="text-2xl flex-shrink-0">⚠️</span>
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            )}

            <div className="card-base p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                UHID <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.uhid}
                                onChange={(e) => setFormData({ ...formData, uhid: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition bg-gray-50 placeholder-gray-400"
                                placeholder="e.g., UH2024001"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Patient Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition bg-gray-50 placeholder-gray-400"
                                placeholder="Full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Age <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                required
                                min="0"
                                max="120"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition bg-gray-50 placeholder-gray-400"
                                placeholder="Age"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Gender <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition bg-gray-50"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition bg-gray-50 placeholder-gray-400"
                                placeholder="+91 XXXXXXXXXX"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Priority Level <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.priority_level}
                                onChange={(e) => setFormData({ ...formData, priority_level: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition bg-gray-50"
                            >
                                <option value="normal">Normal</option>
                                <option value="senior">Senior Citizen</option>
                                <option value="vip">VIP</option>
                                <option value="emergency">Emergency</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => setFormData({ uhid: '', name: '', age: '', gender: 'Male', phone: '', priority_level: 'normal' })}
                            className="px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all active:scale-95"
                        >
                            Clear Form
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-sky-600 hover:to-emerald-600 focus:ring-4 focus:ring-sky-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-600/30 active:scale-95"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Registering...</span>
                                </span>
                            ) : (
                                'Register Patient'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
