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
        <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-blue-900">Timer Active</span>
                <span className="text-2xl font-bold text-blue-700">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
