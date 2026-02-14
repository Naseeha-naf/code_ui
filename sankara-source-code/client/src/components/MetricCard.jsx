export default function MetricCard({ title, value, icon = '📊', color = 'from-sky-500 to-emerald-500' }) {
  return (
    <div className="group card-base card-hover p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-xl shadow-lg shadow-sky-500/20 group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-shadow`}>
          {icon}
        </div>
      </div>
      <p className="text-sm font-medium text-gray-600 mb-2">
        {title}
      </p>
      <p className="text-4xl font-bold text-gray-900">
        {value ?? '-'}
      </p>
      <div className="mt-4 h-1 bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
