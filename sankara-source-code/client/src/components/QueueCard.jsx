const PRIORITY_COLORS = {
    emergency: 'from-red-500 to-pink-500',
    vip: 'from-indigo-500 to-purple-500',
    senior: 'from-amber-500 to-orange-500',
    normal: 'from-sky-500 to-cyan-500'
};

const PRIORITY_BADGES = {
    emergency: '🚨 Emergency',
    vip: '⭐ VIP',
    senior: '👴 Senior',
    normal: '👤 Normal'
};

const PRIORITY_ICON_COLORS = {
    emergency: 'bg-gradient-to-br from-red-100 to-pink-100 text-red-600',
    vip: 'bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600',
    senior: 'bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600',
    normal: 'bg-gradient-to-br from-sky-100 to-cyan-100 text-sky-600'
};

export default function QueueCard({ patient, children }) {
    const priorityLevel = patient.priority_level || 'normal';
    const iconColor = PRIORITY_ICON_COLORS[priorityLevel] || PRIORITY_ICON_COLORS.normal;
    const badgeGradient = PRIORITY_COLORS[priorityLevel] || PRIORITY_COLORS.normal;

    return (
        <div className="group card-base card-hover p-6 border-l-4 border-l-transparent hover:border-l-sky-500 animate-fade-in">
            <div className="flex items-start justify-between mb-5">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-sky-600 transition-colors">{patient.patient_name || patient.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Token: <span className="font-semibold text-gray-700">#{patient.token_number}</span></p>
                </div>
                <div className={`px-3 py-2 rounded-lg text-xs font-semibold ${iconColor} flex-shrink-0`}>
                    {PRIORITY_BADGES[priorityLevel]}
                </div>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-transparent rounded-lg p-4 mb-4">
                {children}
            </div>
            <div className={`h-1 bg-gradient-to-r ${badgeGradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity`} />
        </div>
    );
}
