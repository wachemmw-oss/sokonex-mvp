import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPublicProfile } from '../services/user';
import { getAds } from '../services/ads';
import { Phone, MessageCircle, Calendar, ShieldCheck, Package, MapPin, Share2, Star, Briefcase } from 'lucide-react';
import AdCard from '../components/AdCard';

const Store: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const { data: profileData, isLoading: profileLoading } = useQuery({
        queryKey: ['user-profile', id],
        queryFn: () => getPublicProfile(id as string),
        enabled: !!id,
    });

    const { data: adsData, isLoading: adsLoading } = useQuery({
        queryKey: ['user-ads', id],
        queryFn: () => getAds({ sellerId: id, limit: 50 }),
        enabled: !!id,
    });

    if (profileLoading || adsLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-[#214829] rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Chargement de la boutique...</p>
                </div>
            </div>
        );
    }

    const seller = profileData?.data;
    const ads = adsData?.data?.items || [];

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-[#FFBA34] selection:text-black">
            {/* Store Header / Hero Section */}
            <div className="bg-[#1A3620] text-white pt-12 pb-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFBA34]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
                        {/* Avatar */}
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-gradient-to-br from-[#FFBA34] to-[#f97316] p-1.5 shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="w-full h-full rounded-[2.2rem] bg-[#1A3620] overflow-hidden flex items-center justify-center border-4 border-[#1A3620]">
                                {seller?.avatar ? (
                                    <img src={seller.avatar} alt={seller.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-5xl font-black text-[#FFBA34]">{seller?.name?.charAt(0)}</span>
                                )}
                            </div>
                        </div>

                        {/* Name & Info */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">{seller?.name}</h1>
                                    {seller?.badge === 'founder' && (
                                        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-4 py-1 rounded-xl shadow-lg border border-white/20">
                                            <Star size={20} className="fill-white" />
                                            <span className="text-xs font-black tracking-[0.1em] uppercase">FONDATEUR</span>
                                        </div>
                                    )}
                                    {seller?.badge === 'pro' && (
                                        <div className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-1 rounded-xl shadow-lg border border-white/20">
                                            <Briefcase size={20} className="fill-white" />
                                            <span className="text-xs font-black tracking-[0.1em] uppercase">VENDEUR PRO</span>
                                        </div>
                                    )}
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFBA34] text-black rounded-full text-[10px] font-black uppercase tracking-widest self-center md:self-auto shadow-lg shadow-[#FFBA34]/20">
                                    <ShieldCheck size={14} strokeWidth={3} />
                                    Vendeur Vérifié
                                </div>
                            </div>
                            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-bold text-white/60 uppercase tracking-widest">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-[#FFBA34]" />
                                    Membre depuis {new Date(seller?.createdAt).getFullYear()}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Package size={16} className="text-[#FFBA34]" />
                                    {adsData?.data?.total || ads.length} Annonces en ligne
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions (Desktop) */}
                        <div className="hidden lg:flex gap-4">
                            <button className="p-4 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition-all border border-white/10">
                                <Share2 size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-12 mb-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar / Info Panel */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-gray-100">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">À propos du vendeur</h3>
                            <p className="text-slate-600 leading-relaxed font-medium text-sm mb-8">
                                {seller?.bio || "Ce vendeur n'a pas encore ajouté de description à sa boutique."}
                            </p>

                            <div className="space-y-3">
                                {seller?.phone && (
                                    <a
                                        href={`tel:${seller.phone}`}
                                        className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-[#1A3620] text-white font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#1A3620]/20"
                                    >
                                        <Phone size={16} strokeWidth={3} />
                                        Appeler
                                    </a>
                                )}
                                {seller?.whatsapp && (
                                    <a
                                        href={`https://wa.me/${seller.whatsapp.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-[#FFBA34] text-black font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#FFBA34]/20"
                                    >
                                        <MessageCircle size={16} strokeWidth={3} />
                                        WhatsApp
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="bg-[#1A3620] rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFBA34]/10 rounded-full blur-2xl"></div>
                            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Garantie SOKONEX</h3>
                            <p className="text-white/80 text-xs leading-relaxed font-bold">
                                Effectuez vos transactions en toute sécurité en suivant nos conseils de prudence.
                            </p>
                            <Link to="/aide" className="mt-4 inline-block text-[10px] font-black text-[#FFBA34] uppercase tracking-widest hover:underline">Voir les conseils</Link>
                        </div>
                    </div>

                    {/* Main Products Grid */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic">Les Annonces <span className="text-[#FFBA34] not-italic">({adsData?.data?.total || ads.length})</span></h2>
                        </div>

                        {ads.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {ads.map((ad: any) => (
                                    <AdCard key={ad._id} ad={ad} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[2.5rem] py-24 flex flex-col items-center justify-center border border-dashed border-slate-200">
                                <Package size={64} className="text-slate-100 mb-4" />
                                <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Aucune annonce disponible</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Store;
