import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyAds, deleteAd } from '../services/ads';
import {
    UserCircleIcon,
    DocumentTextIcon,
    Cog8ToothIcon,
    CurrencyDollarIcon,
    QuestionMarkCircleIcon,
    PencilSquareIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import Settings from './Settings';

const MyAds = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['myAds', user?._id],
        queryFn: getMyAds,
        enabled: !!user?._id
    });

    const deleteMutation = useMutation({
        mutationFn: deleteAd,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myAds'] });
        },
        onError: (err: any) => {
            alert(err.response?.data?.error?.message || 'Erreur lors de la suppression');
        }
    });

    const handleDelete = (id: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Chargement de vos annonces...</div>;

    const ads = data?.data?.items || [];

    return (
        <div className="bg-white shadow-sm border border-gray-100 rounded-sm overflow-hidden font-sans">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-black uppercase tracking-tight">Mes Annonces ({ads.length})</h2>
                <Link to="/post" className="bg-[#1a1c29] text-white px-4 py-2 rounded-sm text-sm font-bold hover:bg-black transition-colors">
                    Nouvelle Annonce
                </Link>
            </div>

            {ads.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                    <DocumentTextIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Vous n'avez publié aucune annonce pour le moment.</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {ads.map((ad: any) => (
                        <div key={ad._id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:bg-gray-50 transition-colors">
                            {/* Image */}
                            <div className="w-full sm:w-24 h-24 shrink-0 bg-gray-100 rounded-sm overflow-hidden">
                                {ad.images?.[0] ? (
                                    <img src={ad.images[0].url} alt={ad.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Pas d'image</div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide ${ad.status === 'active' ? 'bg-green-100 text-green-700' : ad.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {ad.status === 'active' ? 'Actif' : ad.status === 'pending' ? 'En attente' : ad.status}
                                    </span>
                                    <span className="text-xs text-gray-500">{new Date(ad.createdAt).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <h3 className="font-bold text-black text-base truncate mb-1">{ad.title}</h3>
                                <p className="text-sm font-bold text-black mb-1">
                                    {ad.priceType === 'fixed' || ad.priceType === 'negotiable' ? `$${ad.price?.toLocaleString()}` : ad.priceType === 'free' ? 'Gratuit' : 'Sur demande'}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{ad.category} • {ad.city}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                <Link to={`/edit-ad/${ad._id}`} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 text-sm font-medium text-gray-700 rounded-sm hover:border-black hover:text-black transition-colors">
                                    <PencilSquareIcon className="w-4 h-4" /> Modifier
                                </Link>
                                <button
                                    onClick={() => handleDelete(ad._id)}
                                    disabled={deleteMutation.isPending}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 border border-red-100 text-sm font-medium text-red-600 rounded-sm hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-50"
                                >
                                    <TrashIcon className="w-4 h-4" /> Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const EarnMoney = () => <div className="p-8 bg-white shadow-sm border border-gray-100 rounded-sm text-center">
    <CurrencyDollarIcon className="w-16 h-16 mx-auto mb-4 text-green-600" />
    <h2 className="text-2xl font-bold mb-2">Comment faire de l'argent ?</h2>
    <p className="text-gray-600 max-w-md mx-auto">Découvrez nos astuces et outils pour maximiser vos ventes sur SOKONEX Marketplace.</p>
</div>;

const FAQ = () => <div className="p-8 bg-white shadow-sm border border-gray-100 rounded-sm text-center">
    <QuestionMarkCircleIcon className="w-16 h-16 mx-auto mb-4 text-blue-600" />
    <h2 className="text-2xl font-bold mb-2">Foire aux questions</h2>
    <p className="text-gray-600 max-w-md mx-auto">Trouvez les réponses à vos questions concernant la gestion de votre boutique et de vos annonces.</p>
</div>;

const SidebarLink = ({ to, icon: Icon, text, active }: { to: string, icon: any, text: string, active: boolean }) => (
    <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${active
            ? 'bg-gray-100 text-black border-r-4 border-black'
            : 'text-gray-600 hover:bg-gray-50 hover:text-black'
            }`}
    >
        <Icon className="w-5 h-5 shrink-0" />
        {text}
    </Link>
);

const Dashboard = () => {
    const { user } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === '/account' && location.pathname === '/account') return true;
        if (path !== '/account' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <div className="max-w-[1200px] mx-auto p-4 md:py-8 font-sans">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-6 md:mb-8 text-black tracking-tight uppercase">Mon Espace Vendeur</h1>

            <div className="flex flex-col md:flex-row gap-6">

                {/* Sidebar */}
                <div className="w-full md:w-72 shrink-0">
                    <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden sticky top-24">

                        {/* Vendor Profile Summary Block */}
                        <div className="p-6 text-center border-b border-gray-100">
                            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-dashed border-gray-300">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Profil" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <UserCircleIcon className="w-12 h-12 text-gray-400" />
                                )}
                            </div>
                            <h2 className="font-bold text-lg text-black truncate">{user?.name}</h2>
                            <p className="text-xs text-gray-500 mb-2 truncate">{user?.email}</p>
                            {user?.whatsapp && (
                                <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-2 py-1 rounded-sm text-xs font-bold font-mono">
                                    WA: {user.whatsapp}
                                </div>
                            )}
                        </div>

                        {/* Navigation Links */}
                        <div className="py-2 flex flex-col">
                            <SidebarLink to="/account/my-ads" icon={DocumentTextIcon} text="Mes Annonces" active={isActive('/account/my-ads') || isActive('/account')} />
                            <SidebarLink to="/account/earn" icon={CurrencyDollarIcon} text="Comment faire de l'argent" active={isActive('/account/earn')} />
                            <SidebarLink to="/account/settings" icon={Cog8ToothIcon} text="Paramètres" active={isActive('/account/settings')} />
                            <SidebarLink to="/account/faq" icon={QuestionMarkCircleIcon} text="Foire aux questions" active={isActive('/account/faq')} />
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0">
                    <Routes>
                        <Route path="/" element={<MyAds />} />
                        <Route path="/my-ads" element={<MyAds />} />
                        <Route path="/earn" element={<EarnMoney />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/faq" element={<FAQ />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
