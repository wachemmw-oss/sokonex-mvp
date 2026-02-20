import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReports, removeAd, restoreAd, suspendUser } from '../services/admin';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user, loading } = useAuth();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['reports'],
        queryFn: getReports,
    });

    const removeMutation = useMutation({
        mutationFn: removeAd,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            alert('Annonce retirée');
        }
    });

    const restoreMutation = useMutation({
        mutationFn: restoreAd,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            alert('Annonce restaurée');
        }
    });

    const suspendMutation = useMutation({
        mutationFn: suspendUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            alert('Utilisateur suspendu/activé');
        }
    });

    if (loading) return <div>Chargement...</div>;
    if (!user || user.role !== 'admin') return <Navigate to="/login" />;

    if (isLoading) return <div className="p-8">Chargement des rapports...</div>;

    const reports = data?.data || [];

    return (
        <div className="max-w-6xl mx-auto p-6 font-sans">
            <h1 className="text-2xl font-extrabold mb-8 tracking-tight uppercase">Administration - Modération</h1>

            <div className="bg-white shadow-sm border border-gray-100 rounded-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Raison</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Annonce</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Note</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {reports.map((report: any) => (
                            <tr key={report._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                    {new Date(report.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-sm uppercase tracking-wider ${report.reason === 'scam' ? 'bg-black text-white' : 'bg-gray-200 text-black'
                                        }`}>
                                        {report.reason}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black font-bold">
                                    {report.adId?.title || 'Annonce supprimée'}
                                    <div className="text-xs text-gray-400 font-normal">{report.adId?.subCategory}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                    {report.text || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold space-x-3">
                                    <a href={`/ad/${report.adId?._id}`} target="_blank" rel="noopener noreferrer" className="text-black underline hover:text-gray-600">Voir</a>
                                    <button
                                        onClick={() => { if (window.confirm('Retirer cette annonce ?')) removeMutation.mutate(report.adId?._id) }}
                                        className="text-red-600 hover:text-red-800 underline"
                                    >
                                        Retirer
                                    </button>
                                    <button
                                        onClick={() => { if (window.confirm('Suspendre l\'auteur de ce signalement ? (Attention, logic to suspend REPORTER or AD OWNER needed)')) suspendMutation.mutate(report.reporterUserId?._id) }}
                                        className="text-orange-600 hover:text-orange-800 underline"
                                        title="Suspendre le signalant (debug)"
                                    >
                                        Suspendre
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {reports.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">Aucun signalement</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
