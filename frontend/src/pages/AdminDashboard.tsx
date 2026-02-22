import { useQuery } from '@tanstack/react-query';
import { getStats } from '../services/admin';
import { Users, Package, Flag, TrendingUp, AlertCircle, ArrowUpRight, Activity } from 'lucide-react';

const AdminDashboard = () => {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: getStats,
    });

    if (isLoading) return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-44 bg-white rounded-3xl border border-gray-100 shadow-sm"></div>
            ))}
        </div>
    );

    const cards = [
        { label: 'Utilisateurs', value: stats?.data?.totalUsers || 0, icon: Users, color: 'from-blue-600 to-blue-400', shadow: 'shadow-blue-500/10', trend: '+12%' },
        { label: 'Annonces', value: stats?.data?.totalAds || 0, icon: Package, color: 'from-emerald-600 to-emerald-400', shadow: 'shadow-emerald-500/10', trend: '+5%' },
        { label: 'Signalements', value: stats?.data?.pendingReports || 0, icon: Flag, color: 'from-rose-600 to-rose-400', shadow: 'shadow-rose-500/10', trend: '-2%' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header section moved to Layout, but keeping page-specific intro */}
            <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                    Bonjour, <span className="text-[#FFBA34]">Admin</span> 👋
                </h2>
                <p className="text-slate-500 font-medium mt-1">Voici ce qui s'est passé sur plateforme aujourd'hui.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {cards.map((card, idx) => (
                    <div key={idx} className={`relative bg-white p-8 rounded-[2.5rem] shadow-xl ${card.shadow} border border-gray-100 group hover:-translate-y-1 transition-all duration-300 overflow-hidden`}>
                        {/* Background Decoration Icon */}
                        <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity rotate-12 group-hover:rotate-0 duration-500">
                            <card.icon size={160} strokeWidth={1} />
                        </div>

                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div className="flex items-center justify-between mb-8">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg`}>
                                    <card.icon size={28} />
                                </div>
                                <span className="text-[10px] font-black px-2.5 py-1 bg-slate-50 text-slate-400 rounded-full border border-slate-100">
                                    {card.trend}
                                </span>
                            </div>

                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{card.label}</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-4xl font-black text-slate-900 tracking-tighter">{card.value}</p>
                                    <ArrowUpRight size={16} className="text-emerald-500 font-black" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Chart Area */}
                <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-gray-100 relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-[#FFBA34]">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-slate-800 text-lg tracking-tight">Activité Hebdomadaire</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Temps réel</p>
                            </div>
                        </div>
                        <button className="text-xs font-black text-slate-400 hover:text-[#FFBA34] transition-colors uppercase tracking-widest">En savoir plus</button>
                    </div>

                    <div className="h-64 flex flex-col items-center justify-center bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-3xl relative z-10 group-hover:bg-amber-50/20 transition-colors">
                        <div className="flex gap-2 items-end mb-4">
                            {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                <div key={i} className="w-8 bg-[#FFBA34]/20 rounded-t-lg group-hover:bg-[#FFBA34]/40 transition-all duration-700" style={{ height: `${h}%`, transitionDelay: `${i * 100}ms` }}></div>
                            ))}
                        </div>
                        <p className="text-slate-400 text-sm font-bold itali">Visualisation analytique disponible prochainement</p>
                    </div>
                </div>

                {/* Alerts Area */}
                <div className="bg-[#1A3620] p-10 rounded-[2.5rem] shadow-xl shadow-[#1A3620]/20 text-white relative overflow-hidden">
                    {/* Background accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFBA34]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="flex items-center gap-4 mb-8 relative z-10">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-[#FFBA34]">
                            <AlertCircle size={24} />
                        </div>
                        <h3 className="font-extrabold text-white text-lg tracking-tight">Alertes Critiques</h3>
                    </div>

                    <div className="space-y-4 relative z-10">
                        {stats?.data?.pendingReports > 0 ? (
                            <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl group hover:bg-white/10 transition-all">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
                                    <p className="text-[10px] text-rose-400 font-black uppercase tracking-widest">Signalements</p>
                                </div>
                                <p className="text-sm font-bold leading-relaxed">
                                    <span className="text-[#FFBA34] text-lg font-black">{stats.data.pendingReports}</span> signalements en attente de modération manuelle.
                                </p>
                            </div>
                        ) : (
                            <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl flex flex-col items-center justify-center py-10 opacity-60">
                                <Package className="text-white/20 mb-2" size={32} />
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Aucune alerte</p>
                            </div>
                        )}

                        <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl opacity-50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Serveur</p>
                            </div>
                            <p className="text-sm font-bold">Système opérationnel à 100%.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
