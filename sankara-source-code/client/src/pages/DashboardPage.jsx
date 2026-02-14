import { useEffect, useState } from 'react';
import apiClient from '../api/client.js';
import MetricCard from '../components/MetricCard.jsx';

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await apiClient.get('/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setDashboard(data);
        setError('');
      } catch {
        setError('Dashboard requires a valid admin token. Use backend login endpoint first.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your system overview.</p>
      </div>

      {error && (
        <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3 animate-slide-in-up">
          <span className="text-2xl mt-0.5">⚠️</span>
          <div>
            <p className="font-semibold text-amber-900">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-sky-500"></div>
            <p className="text-gray-500 font-medium">Loading dashboard...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard 
            title="Total Patients Today" 
            value={dashboard?.total_patients_today} 
            icon="👥"
            color="from-sky-500 to-emerald-500"
          />
          <MetricCard 
            title="Tests in Progress" 
            value={dashboard?.tests_in_progress} 
            icon="🔬"
            color="from-indigo-500 to-blue-500"
          />
          <MetricCard 
            title="Emergency Cases" 
            value={dashboard?.emergency_cases} 
            icon="🚨"
            color="from-red-500 to-pink-500"
          />
        </div>
      )}
    </div>
  );
}
