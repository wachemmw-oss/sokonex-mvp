import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyAds, deleteAd } from '../services/ads';
import { CheckCircle2, Info } from 'lucide-react';
import {
    UserCircleIcon,
    DocumentTextIcon,
    Cog8ToothIcon,
    CurrencyDollarIcon,
    QuestionMarkCircleIcon,
    PencilSquareIcon,
    TrashIcon,
    ArrowRightOnRectangleIcon,
    BuildingStorefrontIcon
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

    const ads = data?.data || [];

    return (
        <div className="bg-white shadow-sm border border-gray-100 rounded-sm overflow-hidden font-sans">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-bold uppercase tracking-tight" style={{ color: '#1A3620' }}>Mes Annonces ({ads.length})</h2>
                <Link to="/post" className="text-sm font-bold px-4 py-2 rounded-sm transition-colors hover:opacity-90" style={{ backgroundColor: '#FFBA34', color: '#1A3620' }}>
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
                                    <img src={ad.images[0].url} alt={ad.title} loading="lazy" className="w-full h-full object-cover" />
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
                                <p className="text-base font-bold text-black mb-1">
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

const EarnMoney = () => (
    <div className="p-6 md:p-8 bg-white border border-gray-100 rounded-sm">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#FFBA34] rounded-full flex items-center justify-center">
                <CurrencyDollarIcon className="w-7 h-7 text-[#1A3620]" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-black uppercase tracking-tight">Comment faire de l'argent ?</h2>
        </div>

        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-sm">
                    <h3 className="font-bold text-sm mb-2 flex items-center gap-2 text-black">
                        <CheckCircle2 className="w-4 h-4 text-green-600" /> Belles Photos
                    </h3>
                    <p className="text-xs text-gray-600">Prenez des photos à la lumière du jour. Les annonces avec de belles photos se vendent 3x plus vite.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-sm">
                    <h3 className="font-bold text-sm mb-2 flex items-center gap-2 text-black">
                        <CheckCircle2 className="w-4 h-4 text-green-600" /> Prix Juste
                    </h3>
                    <p className="text-xs text-gray-600">Comparez les prix des produits similaires. Un prix compétitif attire plus d'acheteurs.</p>
                </div>
            </div>

            <div className="p-5" style={{ backgroundColor: '#EBF5EE', borderLeft: '4px solid #214829' }}>
                <h3 className="font-bold text-sm mb-3 text-[#1A3620]">Conseils de pro :</h3>
                <ul className="text-xs space-y-2 text-[#2D6138]">
                    <li className="flex items-center gap-2">• Soyez réactif sur WhatsApp ou par appel.</li>
                    <li className="flex items-center gap-2">• Partagez vos annonces sur vos réseaux sociaux.</li>
                    <li className="flex items-center gap-2">• Demandez à vos clients de vous recommander.</li>
                </ul>
            </div>

            <Link to="/post" className="inline-block w-full text-center py-3 font-bold rounded-sm transition-opacity hover:opacity-90" style={{ backgroundColor: '#FFBA34', color: '#1A3620' }}>
                Publier une nouvelle annonce
            </Link>
        </div>
    </div>
);

const FAQ = () => (
    <div className="p-6 md:p-8 bg-white border border-gray-100 rounded-sm">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <QuestionMarkCircleIcon className="w-7 h-7 text-gray-600" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-black uppercase tracking-tight">Foire aux questions</h2>
        </div>

        <div className="space-y-4">
            {[
                { q: "Comment se passe la livraison ?", a: "SOKONEX ne gère pas la livraison. Vous devez vous entendre directement avec l'acheteur sur le lieu et le mode de remise de l'article." },
                { q: "Comment suis-je payé ?", a: "Le paiement se fait hors ligne, directement entre vous et l'acheteur. Nous déconseillons les paiements par avance non sécurisés." },
                { q: "Puis-je modifier mon annonce ?", a: "Oui, cliquez sur 'Mes Annonces' puis sur le bouton 'Modifier' de l'annonce concernée." },
            ].map((f, i) => (
                <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
                    <h3 className="font-bold text-sm text-black mb-1">{f.q}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{f.a}</p>
                </div>
            ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-sm border border-blue-100">
            <p className="text-xs text-blue-700 flex items-center gap-2">
                <Info className="w-4 h-4" /> Besoin d'aide supplémentaire ? Contactez notre support.
            </p>
        </div>
    </div>
);

const SidebarLink = ({ to, icon: Icon, text, active }: { to: string, icon: any, text: string, active: boolean }) => (
    <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${active
            ? 'bg-[#FFBA34] text-[#1A3620] font-bold border-r-4 border-[#1A3620]'
            : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
    >
        <Icon className="w-5 h-5 shrink-0" />
        {text}
    </Link>
);

const Dashboard = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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
                    <div className="shadow-sm rounded-sm overflow-hidden sticky top-24" style={{ backgroundColor: '#214829' }}>

                        {/* Vendor Profile Summary Block */}
                        <div className="p-6 text-center border-b border-white/10">
                            <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-dashed border-white/30" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Profil" loading="lazy" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <UserCircleIcon className="w-12 h-12 text-white/60" />
                                )}
                            </div>
                            <h2 className="font-bold text-lg text-white truncate">{user?.name}</h2>
                            <p className="text-xs text-white/60 mb-2 truncate">{user?.email}</p>
                            {user?.whatsapp && (
                                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs font-bold font-mono" style={{ backgroundColor: '#FFBA34', color: '#1A3620' }}>
                                    WA: {user.whatsapp}
                                </div>
                            )}
                        </div>

                        {/* Navigation Links */}
                        <div className="py-2 flex flex-col">
                            <SidebarLink to={`/store/${user?._id}`} icon={BuildingStorefrontIcon} text="Ma Boutique" active={false} />
                            <SidebarLink to="/account/my-ads" icon={DocumentTextIcon} text="Mes Annonces" active={isActive('/account/my-ads') || isActive('/account')} />
                            <SidebarLink to="/account/earn" icon={CurrencyDollarIcon} text="Comment faire de l'argent" active={isActive('/account/earn')} />
                            <SidebarLink to="/account/settings" icon={Cog8ToothIcon} text="Paramètres" active={isActive('/account/settings')} />
                            <SidebarLink to="/account/faq" icon={QuestionMarkCircleIcon} text="Foire aux questions" active={isActive('/account/faq')} />

                            {/* Mobile Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="flex md:hidden items-center gap-3 px-4 py-4 text-sm font-bold text-red-400 hover:bg-white/10 transition-colors border-t border-white/10 mt-2"
                            >
                                <ArrowRightOnRectangleIcon className="w-5 h-5 shrink-0" />
                                Se déconnecter
                            </button>
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
