import { useEffect, useState } from 'react';

const TEST_DURATIONS = {
    vision: 5,
    refraction: 10,
    iop: 5,
    oct: 15,
    field: 20,
    preop: 25
};

export default function TestTimer({ test, onComplete }) {
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        if (test.status !== 'in_progress' || !test.start_time) return;

        const duration = TEST_DURATIONS[test.test_type] * 60; // Convert to seconds
        const startTime = new Date(test.start_time).getTime();

        const interval = setInterval(() => {
            const now = Date.now();
            const elapsed = Math.floor((now - startTime) / 1000);
            const remaining = duration - elapsed;

            if (remaining <= 0) {
                clearInterval(interval);
                setTimeLeft(0);
                if (onComplete) onComplete(test.id);
            } else {
                setTimeLeft(remaining);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [test, onComplete]);

    if (test.status !== 'in_progress') return null;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const totalDuration = TEST_DURATIONS[test.test_type] * 60;
    const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

    return (
        <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-white text-sm animate-pulse">⏱️</span>
                    <span className="text-sm font-semibold text-indigo-900">Timer Active</span>
                </div>
                <span className="text-3xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text font-mono">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
            </div>
            <div className="w-full bg-indigo-200 rounded-full h-2.5 overflow-hidden shadow-inner">
                <div
                    className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 h-2.5 transition-all duration-1000 rounded-full shadow-lg shadow-indigo-500/50"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
