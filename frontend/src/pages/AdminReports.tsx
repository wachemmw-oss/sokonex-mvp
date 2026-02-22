import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReports, removeAd, restoreAd, suspendUser } from '../services/admin';
import { Flag, Eye, Trash2, AlertTriangle, Calendar, User, ExternalLink } from 'lucide-react';

const AdminReports = () => {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['reports'],
        queryFn: getReports,
    });

    const removeMutation = useMutation({
        mutationFn: removeAd,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        }
    });

    const restoreMutation = useMutation({
        mutationFn: restoreAd,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        }
    });

    const suspendMutation = useMutation({
        mutationFn: suspendUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        }
    });

    if (isLoading) return (
        <div className="space-y-6 animate-pulse">
            <div className="h-12 bg-white rounded-3xl w-1/3 border border-gray-100 shadow-sm"></div>
            <div className="h-[500px] bg-white rounded-[2.5rem] border border-gray-100 shadow-sm"></div>
        </div>
    );

    const reports = data?.data || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Modération</h2>
                <p className="text-slate-500 font-medium mt-1">Gérez les signalements et maintenez la sécurité du marché.</p>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-gray-100 overflow-hidden relative">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y-2 divide-slate-50">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Signalement</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Raison</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Détails Annonce</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Commentaire</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Décisions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y-2 divide-slate-50">
                            {reports.map((report: any) => (
                                <tr key={report._id} className="hover:bg-slate-50/40 transition-colors group/row">
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                                                <Calendar size={14} className="text-slate-300" />
                                                {new Date(report.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] text-blue-500 font-black uppercase tracking-tight">
                                                <User size={12} />
                                                {report.reporterUserId?.name || 'Inconnu'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${report.reason === 'fraud' || report.reason === 'scam'
                                                ? 'bg-rose-600 text-white shadow-lg shadow-rose-200'
                                                : 'bg-amber-100 text-amber-700 border border-amber-200'
                                            }`}>
                                            <Flag size={10} className="mr-1.5" />
                                            {report.reason}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex flex-col max-w-[200px]">
                                            <span className="text-sm font-black text-slate-800 truncate tracking-tight">{report.adId?.title || 'Annonce supprimée'}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{report.adId?.subCategory || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-xs text-slate-500 italic max-w-[240px] truncate group-hover/row:whitespace-normal group-hover/row:overflow-visible transition-all">
                                            "{report.text || 'Aucune note'}"
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-right space-x-2">
                                        <a
                                            href={`/ad/${report.adId?._id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 inline-flex bg-slate-100 text-slate-400 hover:bg-slate-800 hover:text-[#FFBA34] rounded-2xl transition-all shadow-sm"
                                            title="Inspecter l'annonce"
                                        >
                                            <ExternalLink size={18} strokeWidth={2.5} />
                                        </a>
                                        <button
                                            onClick={() => { if (window.confirm('Action radicale : Retirer cette annonce du marché ?')) removeMutation.mutate(report.adId?._id) }}
                                            className="p-3 inline-flex bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white rounded-2xl transition-all shadow-sm hover:shadow-lg hover:shadow-rose-500/20"
                                            title="Supprimer l'annonce"
                                        >
                                            <Trash2 size={18} strokeWidth={2.5} />
                                        </button>
                                        <button
                                            onClick={() => { if (window.confirm('Action de sécurité : Suspendre l\'auteur de cette annonce ?')) suspendMutation.mutate(report.adId?.userId) }}
                                            className="p-3 inline-flex bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white rounded-2xl transition-all shadow-sm hover:shadow-lg hover:shadow-amber-500/20"
                                            title="Suspendre l'auteur"
                                        >
                                            <AlertTriangle size={18} strokeWidth={2.5} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {reports.length === 0 && (
                    <div className="py-24 flex flex-col items-center justify-center bg-slate-50/20">
                        <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-300 mb-4 rotate-12 border border-emerald-100">
                            <Flag size={40} />
                        </div>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Tout est en ordre. Aucun signalement.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReports;
