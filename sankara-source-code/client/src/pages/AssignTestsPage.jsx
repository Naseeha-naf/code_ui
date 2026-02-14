import { useEffect, useState } from 'react';
import { getPatients, createTests } from '../api/client';

const TEST_OPTIONS = [
    { value: 'vision', label: 'Vision Test', duration: '5 min' },
    { value: 'refraction', label: 'Refraction Test', duration: '10 min' },
    { value: 'iop', label: 'IOP Test', duration: '5 min' },
    { value: 'oct', label: 'OCT Test', duration: '15 min' },
    { value: 'field', label: 'Field Test', duration: '20 min' },
    { value: 'preop', label: 'Pre-op Test', duration: '25 min' }
];

export default function AssignTestsPage() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedTests, setSelectedTests] = useState([]);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const data = await getPatients();
            const registeredPatients = data.filter(p => p.current_stage === 'registered');
            setPatients(registeredPatients);
            setError('');
        } catch (err) {
            setError('Failed to load patients');
        } finally {
            setLoading(false);
        }
    };

    const handleTestToggle = (testValue) => {
        setSelectedTests(prev =>
            prev.includes(testValue)
                ? prev.filter(t => t !== testValue)
                : [...prev, testValue]
        );
    };

    const handleAssignTests = async () => {
        if (!selectedPatient) {
            setError('Please select a patient');
            return;
        }
        if (selectedTests.length === 0) {
            setError('Please select at least one test');
            return;
        }

        setError('');
        setSuccess('');

        try {
            await createTests(selectedPatient.id, selectedTests);
            setSuccess(`Successfully assigned ${selectedTests.length} test(s) to ${selectedPatient.name}`);
            setSelectedPatient(null);
            setSelectedTests([]);
            await fetchPatients();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to assign tests');
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
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Assign Tests</h1>
                <p className="text-gray-600 mt-2">Select a patient and assign diagnostic tests from available options.</p>
            </div>

            {success && (
                <div className="mb-6 bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-start space-x-3 animate-scale-in">
                    <span className="text-2xl flex-shrink-0">✅</span>
                    <p className="text-emerald-700 font-medium">{success}</p>
                </div>
            )}

            {error && (
                <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3 animate-slide-in-up">
                    <span className="text-2xl flex-shrink-0">⚠️</span>
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            )}

            {patients.length === 0 ? (
                <div className="card-base p-12 text-center">
                    <span className="text-6xl mb-4 block">📋</span>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No patients awaiting test assignment</h3>
                    <p className="text-gray-500">All registered patients have been assigned tests!</p>
                </div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Patient Selection */}
                    <div className="card-base p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                            <span>👥</span>
                            <span>Select Patient</span>
                        </h2>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {patients.map((patient) => (
                                <div
                                    key={patient.id}
                                    onClick={() => setSelectedPatient(patient)}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedPatient?.id === patient.id
                                            ? 'border-sky-500 bg-gradient-to-r from-sky-50 to-cyan-50'
                                            : 'border-gray-200 hover:border-sky-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                                            <p className="text-sm text-gray-600 mt-1">Token: <strong>#{patient.token_number}</strong> | UHID: {patient.uhid}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold flex-shrink-0 ${patient.priority_level === 'emergency' ? 'bg-red-100 text-red-700' :
                                                patient.priority_level === 'vip' ? 'bg-indigo-100 text-indigo-700' :
                                                    patient.priority_level === 'senior' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-sky-100 text-sky-700'
                                            }`}>
                                            {patient.priority_level.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Test Selection */}
                    <div className="card-base p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                            <span>🔬</span>
                            <span>Select Tests</span>
                        </h2>

                        {selectedPatient ? (
                            <>
                                <div className="mb-4 p-3 bg-gradient-to-r from-sky-50 to-emerald-50 rounded-lg border border-sky-200">
                                    <p className="text-sm text-gray-700">
                                        <strong className="text-sky-600">Patient:</strong> <span className="font-semibold">{selectedPatient.name}</span>
                                    </p>
                                </div>

                                <div className="space-y-3 mb-6">
                                    {TEST_OPTIONS.map((test) => (
                                        <label
                                            key={test.value}
                                            className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedTests.includes(test.value)
                                                    ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-green-50'
                                                    : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTests.includes(test.value)}
                                                    onChange={() => handleTestToggle(test.value)}
                                                    className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                                                />
                                                <div>
                                                    <p className="font-semibold text-gray-900">{test.label}</p>
                                                    <p className="text-sm text-gray-600">Duration: {test.duration}</p>
                                                </div>
                                            </div>
                                            {selectedTests.includes(test.value) && (
                                                <span className="text-emerald-600 text-lg font-bold">✓</span>
                                            )}
                                        </label>
                                    ))}
                                </div>

                                <button
                                    onClick={handleAssignTests}
                                    disabled={selectedTests.length === 0}
                                    className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:from-sky-600 hover:to-emerald-600 focus:ring-4 focus:ring-sky-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-600/30 active:scale-95"
                                >
                                    Assign {selectedTests.length} Test{selectedTests.length !== 1 ? 's' : ''}
                                </button>
                            </>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <span className="text-4xl block mb-2">👈</span>
                                <p className="font-medium">Please select a patient first</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
