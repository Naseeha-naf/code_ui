import { useEffect, useState } from 'react';
import { getWaitingTests, startTest, completeTest } from '../api/client';
import QueueCard from '../components/QueueCard';
import TestTimer from '../components/TestTimer';

export default function ScreeningPage() {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTests = async () => {
        try {
            const data = await getWaitingTests();
            setTests(data);
            setError('');
        } catch (err) {
            setError('Failed to load tests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTests();
        const interval = setInterval(fetchTests, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const handleStartTest = async (testId) => {
        try {
            await startTest(testId);
            await fetchTests();
        } catch (err) {
            alert('Failed to start test');
        }
    };

    const handleCompleteTest = async (testId) => {
        try {
            await completeTest(testId);
            await fetchTests();
        } catch (err) {
            alert('Failed to complete test');
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Screening Tests</h1>
                <p className="text-gray-600">Manage diagnostic tests with timers</p>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {tests.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
                    <span className="text-6xl mb-4 block">🎯</span>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No tests in queue</h3>
                    <p className="text-gray-500">All tests are completed!</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {tests.map((test) => (
                        <QueueCard key={test.id} patient={test}>
                            <div className="mb-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Test Type:</span>
                                    <span className="font-semibold text-gray-900 uppercase">{test.test_type}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm mt-1">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`font-semibold px-2 py-1 rounded ${test.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {test.status === 'in_progress' ? '▶️ In Progress' : '⏸️ Pending'}
                                    </span>
                                </div>
                            </div>

                            <TestTimer test={test} onComplete={handleCompleteTest} />

                            <div className="flex space-x-3 mt-4">
                                {test.status === 'pending' && (
                                    <button
                                        onClick={() => handleStartTest(test.id)}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all"
                                    >
                                        ▶️ Start Test
                                    </button>
                                )}
                                {test.status === 'in_progress' && (
                                    <button
                                        onClick={() => handleCompleteTest(test.id)}
                                        className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all"
                                    >
                                        ✅ Complete Test
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
