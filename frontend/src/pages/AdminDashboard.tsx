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
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Administration - Modération</h1>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raison</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Annonce</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {reports.map((report: any) => (
                            <tr key={report._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(report.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${report.reason === 'scam' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {report.reason}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {report.adId?.title || 'Annonce supprimée'}
                                    <div className="text-xs text-gray-500">{report.adId?.subCategory}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                    {report.text || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <a href={`/ad/${report.adId?._id}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900">Voir</a>
                                    <button
                                        onClick={() => { if (window.confirm('Retirer cette annonce ?')) removeMutation.mutate(report.adId?._id) }}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Retirer
                                    </button>
                                    <button
                                        onClick={() => { if (window.confirm('Suspendre l\'auteur de ce signalement ? (Attention, logic to suspend REPORTER or AD OWNER needed)')) suspendMutation.mutate(report.reporterUserId?._id) }}
                                        className="text-orange-600 hover:text-orange-900"
                                        title="Suspendre le signalant (debug)"
                                    >
                                        Suspendre
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {reports.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Aucun signalement</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
