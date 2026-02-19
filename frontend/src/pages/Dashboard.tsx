
import { useAuth } from '../context/AuthContext';
import { verifyPhone } from '../services/auth';
import { useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import Settings from './Settings';

// Placeholder for MyAds
const MyAds = () => <div className="p-4 bg-white shadow rounded">Mes Annonces (À venir)</div>;

const DashboardHome = () => {
    const { user, loading } = useAuth();
    const [msg, setMsg] = useState('');

    const handleVerify = async () => {
        try {
            await verifyPhone();
            setMsg('Phone verified! (Refresh to see changes)');
            window.location.reload();
        } catch (err: any) {
            setMsg('Error: ' + err.message);
        }
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Mon Compte</h2>
            <div className="bg-white p-6 shadow-sm rounded-lg mb-6 border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-lg font-medium text-gray-900">{user?.email}</p>
                        <p className="text-sm text-gray-500 uppercase tracking-wider">{user?.role}</p>
                    </div>
                    {user?.isPhoneVerified ? (
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Vérifié</span>
                    ) : (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">Non vérifié</span>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-gray-700">
                        <strong>Téléphone:</strong> {user?.phone || 'Non défini'}
                    </p>
                    {user?.phone && !user?.isPhoneVerified && (
                        <button onClick={handleVerify} className="mt-2 text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors">
                            Vérifier maintenant (Mode Test)
                        </button>
                    )}
                </div>
                {msg && <p className="mt-2 text-blue-600 text-sm">{msg}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/account/my-ads" className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">Mes Annonces</h5>
                    <p className="font-normal text-gray-700">Gérer vos annonces publiées.</p>
                </Link>
                <Link to="/account/settings" className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">Paramètres</h5>
                    <p className="font-normal text-gray-700">Modifier votre profil et vos informations.</p>
                </Link>
            </div>
        </div>
    )
}

const Dashboard = () => {
    return (
        <div className="max-w-4xl mx-auto p-4 py-8">
            <Routes>
                <Route path="/" element={<DashboardHome />} />
                <Route path="/my-ads" element={<MyAds />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </div>
    );
};

export default Dashboard;
