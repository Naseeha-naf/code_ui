import { useEffect, useState } from 'react';
import { getPatients, startConsultation, endConsultation } from '../api/client';
import QueueCard from '../components/QueueCard';
import { useAuth } from '../context/AuthContext';

export default function ConsultationPage() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    const fetchPatients = async () => {
        try {
            const data = await getPatients();
            const doctorQueue = data.filter(p => p.current_stage === 'doctor');
            setPatients(doctorQueue);
            setError('');
        } catch (err) {
            setError('Failed to load patient queue');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
        const interval = setInterval(fetchPatients, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleStartConsultation = async (patientId) => {
        try {
            await startConsultation(patientId);
            await fetchPatients();
        } catch (err) {
            alert('Failed to start consultation');
        }
    };

    const handleEndConsultation = async (patientId) => {
        try {
            await endConsultation(patientId);
            await fetchPatients();
        } catch (err) {
            alert('Failed to end consultation');
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
        <div className="max-w-6xl mx-auto animate-fade-in">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Doctor Consultation</h1>
                <p className="text-gray-600 mt-2">Manage patient consultations and check-ups.</p>
                {user && <p className="text-sm text-sky-600 font-medium mt-3 flex items-center space-x-2">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center text-white font-bold text-xs">👨</span>
                    <span>Dr. {user.name}</span>
                </p>}
            </div>

            {error && (
                <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3 animate-slide-in-up">
                    <span className="text-2xl flex-shrink-0">⚠️</span>
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            )}

            {patients.length === 0 ? (
                <div className="card-base p-12 text-center">
                    <span className="text-6xl mb-4 block">👨‍⚕️</span>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No patients waiting</h3>
                    <p className="text-gray-500">All consultations completed!</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {patients.map((patient) => (
                        <QueueCard key={patient.id} patient={patient}>
                            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                <div>
                                    <span className="text-gray-600">UHID:</span>
                                    <span className="ml-2 font-semibold text-gray-900">{patient.uhid}</span>
                                </div>
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

                            <div className={`mb-4 px-3 py-2 rounded-xl text-sm font-semibold inline-block ${patient.status === 'in_progress'
                                    ? 'bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 border border-indigo-200'
                                    : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200'
                                }`}>
                                {patient.status === 'in_progress' ? '▶️ In Consultation' : '⏸️ Waiting'}
                            </div>

                            <div className="flex space-x-3 mt-4">
                                {patient.status === 'waiting' && (
                                    <button
                                        onClick={() => handleStartConsultation(patient.id)}
                                        className="flex-1 bg-gradient-to-r from-sky-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:from-sky-600 hover:to-emerald-600 transition-all shadow-lg shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-600/30 active:scale-95"
                                    >
                                        ▶️ Start Consultation
                                    </button>
                                )}
                                {patient.status === 'in_progress' && (
                                    <button
                                        onClick={() => handleEndConsultation(patient.id)}
                                        className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-600/30 active:scale-95"
                                    >
                                        ✅ End Consultation
                                    </button>
                                )}
                            </div>
                        </QueueCard>
                    ))}
                </div>
            )}
        </div>
    );
}
