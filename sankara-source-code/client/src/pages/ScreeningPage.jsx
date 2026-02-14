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
        <div className="max-w-6xl mx-auto animate-fade-in">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Screening Tests</h1>
                <p className="text-gray-600 mt-2">Manage diagnostic tests with built-in timers and status tracking.</p>
            </div>

            {error && (
                <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3 animate-slide-in-up">
                    <span className="text-2xl flex-shrink-0">⚠️</span>
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            )}

            {tests.length === 0 ? (
                <div className="card-base p-12 text-center">
                    <span className="text-6xl mb-4 block">🎯</span>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No tests in queue</h3>
                    <p className="text-gray-500">All tests are completed!</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {tests.map((test) => (
                        <QueueCard key={test.id} patient={test}>
                            <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-600 text-xs font-medium">Test Type</p>
                                    <p className="font-semibold text-gray-900 uppercase mt-1">{test.test_type}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-xs font-medium">Status</p>
                                    <span className={`inline-block font-semibold px-3 py-1 rounded-lg mt-1 ${test.status === 'in_progress' ? 'bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 border border-indigo-200' : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200'
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
                                        className="flex-1 bg-gradient-to-r from-sky-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:from-sky-600 hover:to-emerald-600 transition-all shadow-lg shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-600/30 active:scale-95"
                                    >
                                        ▶️ Start Test
                                    </button>
                                )}
                                {test.status === 'in_progress' && (
                                    <button
                                        onClick={() => handleCompleteTest(test.id)}
                                        className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-600/30 active:scale-95"
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
