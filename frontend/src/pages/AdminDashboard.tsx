import { useQuery } from '@tanstack/react-query';
import { getStats } from '../services/admin';
import { Users, Package, Flag, TrendingUp, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: getStats,
    });

    if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>)}
    </div>;

    const cards = [
        { label: 'Utilisateurs Totaux', value: stats?.data?.totalUsers || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Annonces en Ligne', value: stats?.data?.totalAds || 0, icon: Package, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Signalements Actifs', value: stats?.data?.pendingReports || 0, icon: Flag, color: 'text-red-600', bg: 'bg-red-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight underline decoration-[#FFBA34] decoration-4 underline-offset-4 uppercase">VUE D'ENSEMBLE</h2>
                <p className="text-sm text-gray-500 mt-1">Résumé de l'activité sur SOKONEX.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={`p-4 rounded-xl ${card.bg} ${card.color}`}>
                            <card.icon size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{card.label}</p>
                            <p className="text-2xl font-black text-gray-900">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={20} className="text-[#FFBA34]" />
                        <h3 className="font-bold text-gray-900 uppercase text-sm">Activité Récente</h3>
                    </div>
                    <div className="h-48 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
                        <p className="text-gray-400 text-sm italic">Graphiques d'activité à venir...</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertCircle size={20} className="text-red-500" />
                        <h3 className="font-bold text-gray-900 uppercase text-sm">Alertes Système</h3>
                    </div>
                    {stats?.data?.pendingReports > 0 ? (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                            <p className="text-xs text-red-700 font-bold uppercase">
                                {stats.data.pendingReports} nouveaux signalements nécessitent votre attention.
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm italic">Aucune alerte critique.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
