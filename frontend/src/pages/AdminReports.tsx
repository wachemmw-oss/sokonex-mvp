import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReports, removeAd, restoreAd, suspendUser } from '../services/admin';
import { Flag, Eye, Trash2, RotateCcw, AlertTriangle } from 'lucide-react';

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

    if (isLoading) return <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        <div className="h-64 bg-gray-100 rounded"></div>
    </div>;

    const reports = data?.data || [];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight underline decoration-[#FFBA34] decoration-4 underline-offset-4 uppercase">Signalements</h2>
                <p className="text-sm text-gray-500 mt-1">Modérez les annonces signalées par la communauté.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Raison</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Annonce / Auteur</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Note</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {reports.map((report: any) => (
                                <tr key={report._id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                        {new Date(report.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-0.5 inline-flex text-[10px] font-black rounded uppercase tracking-tighter ${report.reason === 'scam' ? 'bg-black text-white' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {report.reason}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-gray-900">{report.adId?.title || 'Annonce supprimée'}</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase">{report.adId?.subCategory}</div>
                                        <div className="text-[10px] text-blue-500 mt-1">Signalé par: {report.reporterUserId?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate italic">
                                        "{report.text || '-'}"
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                                        <a href={`/ad/${report.adId?._id}`} target="_blank" rel="noopener noreferrer" className="p-2 inline-flex text-gray-400 hover:text-black transition-colors" title="Voir l'annonce">
                                            <Eye size={18} />
                                        </a>
                                        <button
                                            onClick={() => { if (window.confirm('Retirer cette annonce ?')) removeMutation.mutate(report.adId?._id) }}
                                            className="p-2 inline-flex text-red-400 hover:text-red-700 transition-colors"
                                            title="Supprimer l'annonce"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => { if (window.confirm('Suspendre l\'auteur de ce signalement ?')) suspendMutation.mutate(report.reporterUserId?._id) }}
                                            className="p-2 inline-flex text-orange-400 hover:text-orange-700 transition-colors"
                                            title="Suspendre le signalant"
                                        >
                                            <AlertTriangle size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {reports.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium italic">Aucun signalement en attente</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
