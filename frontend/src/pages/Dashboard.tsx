
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
            <h2 className="text-2xl font-extrabold mb-6 tracking-tight uppercase">Mon Compte</h2>
            <div className="bg-white p-6 shadow-sm rounded-sm mb-6 border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-lg font-bold text-black">{user?.email}</p>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">{user?.role}</p>
                    </div>
                    {user?.isPhoneVerified ? (
                        <span className="bg-gray-100 text-black text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider">Vérifié</span>
                    ) : (
                        <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider">Non vérifié</span>
                    )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Téléphone
                    </p>
                    <p className="text-black font-medium mt-1">{user?.phone || 'Non défini'}</p>
                    {user?.phone && !user?.isPhoneVerified && (
                        <button onClick={handleVerify} className="mt-3 text-xs bg-black hover:bg-gray-800 text-white font-bold px-4 py-2 rounded-sm uppercase tracking-wide transition-colors">
                            Vérifier maintenant
                        </button>
                    )}
                </div>
                {msg && <p className="mt-3 text-black text-sm font-semibold">{msg}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/account/my-ads" className="block p-6 bg-white border border-gray-100 rounded-sm shadow-sm hover:border-black transition-colors group">
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-black group-hover:underline">Mes Annonces</h5>
                    <p className="font-normal text-sm text-gray-500">Gérer vos annonces publiées.</p>
                </Link>
                <Link to="/account/settings" className="block p-6 bg-white border border-gray-100 rounded-sm shadow-sm hover:border-black transition-colors group">
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-black group-hover:underline">Paramètres</h5>
                    <p className="font-normal text-sm text-gray-500">Modifier votre profil et vos informations.</p>
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
