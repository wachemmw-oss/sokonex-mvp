import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Home as HomeIcon, Car, Smartphone, Sofa, Shirt, Bike,
    Briefcase, Building2, Baby, MoreHorizontal, ChevronRight,
    Clock, LayoutGrid, List, Sparkles, TrendingUp
} from 'lucide-react';
import AdCard from '../components/AdCard';
import BannerCard from '../components/BannerCard';
import { useQuery } from '@tanstack/react-query';
import { getAds } from '../services/ads';
import { getCategories } from '../services/category';

// Icon mapping
const iconMap: Record<string, any> = {
    Home: HomeIcon,
    Car: Car,
    Smartphone: Smartphone,
    Sofa: Sofa,
    Shirt: Shirt,
    Bike: Bike,
    Briefcase: Briefcase,
    Building2: Building2,
    Baby: Baby,
    MoreHorizontal: MoreHorizontal
};


const Home = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'recommande' | 'nouveau' | 'tendance'>('recommande');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentBanner, setCurrentBanner] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);

    const banners = [
        {
            title: "Nouvelle Collection Gaming 2026",
            subtitle: "Exclusivité SOKONEX",
            description: "Découvrez les meilleures chaises et accessoires gaming pour une expérience immersive.",
            ctaText: "Acheter maintenant",
            ctaLink: "/results?q=gaming",
            image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1000&auto=format&fit=crop",
            bgColor: "bg-slate-50",
            dark: false
        },
        {
            title: "Votre Maison, Votre Style",
            subtitle: "Déco & Mobilier",
            description: "Une large gamme de meubles d'occasion et neufs pour sublimer votre intérieur.",
            ctaText: "Explorer",
            ctaLink: "/results?category=maison-meubles",
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop",
            bgColor: "bg-[#1A3620]",
            dark: true,
            reverse: true
        },
        {
            title: "Électronique Haute Performance",
            subtitle: "Tech & Gadgets",
            description: "Smartphones, ordinateurs et accessoires tech aux meilleurs prix du marché.",
            ctaText: "Découvrir",
            ctaLink: "/results?category=electronique",
            image: "https://images.unsplash.com/photo-1526738549149-8e07eca2c1b4?q=80&w=1000&auto=format&fit=crop",
            bgColor: "bg-[#FFBA34]",
            dark: false
        },
        {
            title: "Vendez en un Eclair !",
            subtitle: "Marketplace SOKONEX",
            description: "Publiez votre annonce gratuitement et touchez des milliers d'acheteurs en RDC.",
            ctaText: "Vendre maintenant",
            ctaLink: "/post",
            image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=1000&auto=format&fit=crop",
            bgColor: "bg-slate-900",
            dark: true,
            reverse: true
        },
        {
            title: "Vêtements & Accessoires",
            subtitle: "Mode & Beauté",
            description: "Rafraîchissez votre garde-robe avec les dernières tendances de notre communauté.",
            ctaText: "Voir la mode",
            ctaLink: "/results?category=mode",
            image: "https://images.unsplash.com/photo-1445205174273-59396b299912?q=80&w=1000&auto=format&fit=crop",
            bgColor: "bg-[#EBF5EE]",
            dark: false
        }
    ];

    // Banner Auto-play Logic
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % banners.length);
        }, 5000); // 5 seconds per banner

        return () => clearInterval(interval);
    }, [isPaused, banners.length]);

    // Scroll to active banner
    useEffect(() => {
        if (carouselRef.current) {
            const container = carouselRef.current;
            const bannerWidth = container.offsetWidth;
            container.scrollTo({
                left: currentBanner * bannerWidth,
                behavior: 'smooth'
            });
        }
    }, [currentBanner]);

    // Fetch Categories
    const { data: categoriesData, isLoading: isLoadingCats } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        staleTime: 1000 * 60 * 10,
    });

    const CATEGORIES_FROM_DB = categoriesData?.data || [];

    // Fetch Promoted Ads (Used as Flash Deals)
    const { data: promotedAds } = useQuery({
        queryKey: ['ads', 'promoted'],
        queryFn: () => getAds({ promoted: true, limit: 4 }),
        staleTime: 1000 * 60 * 2,
    });

    // Fetch feed Ads based on active tab — max 10
    const { data: feedAds, isLoading: feedLoading } = useQuery({
        queryKey: ['ads', 'feed', activeTab],
        queryFn: () => {
            if (activeTab === 'tendance') return getAds({ promoted: true, limit: 10 });
            if (activeTab === 'nouveau') return getAds({ sort: 'newest', limit: 10 });
            return getAds({ limit: 10 }); // recommande
        },
        staleTime: 1000 * 60 * 2,
    });

    return (
        <div className="font-sans min-h-screen pb-20 bg-white">
            {/* Desktop Spacer */}
            <div className="hidden md:block h-6 bg-[#FAFAFA]"></div>

            <div className="max-w-7xl mx-auto px-4">

                {/* ─── Hero Banner Section (Premium Auto-play Carousel) ─── */}
                <div
                    className="mt-4 mb-12 relative group"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div
                        ref={carouselRef}
                        className="flex gap-0 overflow-x-auto pb-8 scrollbar-hide snap-x h-full no-scrollbar"
                    >
                        {banners.map((b, idx) => (
                            <div key={idx} className="min-w-full snap-center px-0">
                                <BannerCard {...b} />
                            </div>
                        ))}
                    </div>

                    {/* Carousel Dots */}
                    <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-2 z-30">
                        {banners.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentBanner(idx)}
                                className={`h-1.5 transition-all duration-500 rounded-full ${currentBanner === idx
                                    ? 'w-8 bg-[#FFBA34]'
                                    : 'w-2 bg-white/40 hover:bg-white/60'
                                    }`}
                                aria-label={`Go to banner ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* ─── Premium Categories Section ─── */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#EBF5EE] flex items-center justify-center text-[#1A3620]">
                                <LayoutGrid size={20} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter italic">Catégories <span className="text-[#FFBA34]">Populaires</span></h2>
                        </div>
                    </div>

                    <div className="relative group">
                        {isLoadingCats ? (
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                    <div key={i} className="min-w-[120px] flex flex-col items-center gap-4">
                                        <div className="w-24 h-24 rounded-[2rem] bg-slate-50 border border-slate-100 animate-pulse" />
                                        <div className="h-2 w-16 bg-slate-100 rounded animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide snap-x px-2">
                                {CATEGORIES_FROM_DB.map((cat: any) => {
                                    const IconComponent = iconMap[cat.icon as string] || MoreHorizontal;
                                    return (
                                        <Link
                                            key={cat.slug}
                                            to={`/results?category=${cat.slug}`}
                                            className="flex flex-col items-center min-w-[100px] snap-start group/cat transition-premium hover:-translate-y-1"
                                        >
                                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] bg-white flex items-center justify-center text-[#1A3620] mb-4 border border-slate-100 group-hover/cat:border-[#FFBA34] group-hover/cat:shadow-premium transition-premium shadow-sm">
                                                <IconComponent className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
                                            </div>
                                            <span className="text-[11px] md:text-xs text-slate-500 font-black uppercase tracking-[0.1em] text-center max-w-[90px] group-hover/cat:text-[#1A3620]">{cat.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                {/* ─── Flash Deals (Ventes de Confiance) ─── */}
                {promotedAds?.data?.items?.length > 0 && (
                    <section className="mb-20">
                        <div className="bg-[#1A3620] rounded-premium p-8 md:p-12 relative overflow-hidden shadow-premium">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFBA34]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <div className="flex flex-col md:flex-row justify-between items-center mb-10 relative z-10 gap-6">
                                <div className="text-center md:text-left">
                                    <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                                        <div className="p-2 bg-[#FFBA34] rounded-lg text-[#1A3620]">
                                            <TrendingUp size={20} strokeWidth={3} />
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic">Ventes <span className="text-[#FFBA34]">de Confiance</span></h2>
                                    </div>
                                    <p className="text-white/60 text-sm font-bold uppercase tracking-widest">Les affaires du moment vérifiées par SOKONEX</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-black text-xs uppercase tracking-widest">
                                        <Clock size={16} className="text-[#FFBA34]" />
                                        <span>Expire dans: <span className="text-[#FFBA34]">23:59:59</span></span>
                                    </div>
                                    <Link to="/results?promoted=true" className="hidden md:flex items-center gap-2 text-white/80 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors">
                                        Tout voir <ChevronRight size={14} />
                                    </Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-10">
                                {promotedAds.data.items.slice(0, 4).map((ad: any) => (
                                    <AdCard key={ad._id} ad={ad} promoted />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ─── Main Discovery Feed ─── */}
                <section>
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-2xl bg-[#FFF3D4] flex items-center justify-center text-[#FFBA34]">
                                    <Sparkles size={20} strokeWidth={2.5} />
                                </div>
                                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter italic text-[#1A3620]">Découvrez <span className="text-[#FFBA34]">vos coups de cœur</span></h2>
                            </div>
                            <p className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">Explorez des milliers d'annonces locales basées sur vos préférences.</p>
                        </div>
                    </div>

                    <div className="bg-white py-6 mb-8 sticky top-[62px] md:top-[80px] z-30 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex gap-8 overflow-x-auto scrollbar-hide w-full md:w-auto">
                            {[
                                { id: 'recommande', label: 'Recommandé' },
                                { id: 'nouveau', label: 'Nouveautés' },
                                { id: 'tendance', label: 'Tendances' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`relative py-2 text-[11px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-[#1A3620]' : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FFBA34] rounded-full" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest hidden lg:block">Affichage</span>
                            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-premium ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#1A3620]' : 'text-slate-400 hover:text-slate-600'}`}>
                                    <LayoutGrid size={18} strokeWidth={2.5} />
                                </button>
                                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-premium ${viewMode === 'list' ? 'bg-white shadow-sm text-[#1A3620]' : 'text-slate-400 hover:text-slate-600'}`}>
                                    <List size={18} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 3 états : chargement / résultats / vide */}
                    {feedLoading ? (
                        /* Skeleton — s'affiche pendant la requête */
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4 px-2 md:px-0">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i: number) => (
                                <div key={i} className="rounded-sm overflow-hidden bg-white">
                                    <div className="aspect-square bg-gray-200 animate-pulse" />
                                    <div className="p-2 space-y-1.5">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : feedAds?.data?.items?.length > 0 ? (
                        <>
                            {/* Grid/List d'annonces */}
                            <div className={viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4 px-2 md:px-0" : "flex flex-col gap-0 md:gap-2"}>
                                {feedAds.data.items.map((ad: any) => (
                                    <AdCard key={ad._id} ad={ad} viewMode={viewMode} />
                                ))}
                            </div>

                            {/* Bouton Voir plus */}
                            <div className="flex justify-center mt-12 mb-2 px-2">
                                <Link
                                    to="/results"
                                    className="w-full md:w-auto flex items-center justify-center gap-3 px-12 py-4 font-black text-xs rounded-xl bg-[#1A3620] text-white uppercase tracking-widest transition-premium hover:scale-[1.02] shadow-lg shadow-[#1A3620]/20 active:scale-95"
                                >
                                    Voir plus d'annonces
                                    <ChevronRight size={16} strokeWidth={3} />
                                </Link>
                            </div>
                        </>
                    ) : (
                        /* Vide — seulement quand la requête est terminée et il n'y a rien */
                        <div className="text-center py-12 bg-white rounded-lg mt-2">
                            <p className="text-gray-500">Aucun article trouvé.</p>
                            <Link to="/post" className="border border-black text-black font-bold mt-4 px-6 py-2 rounded-sm inline-block hover:bg-black hover:text-white transition">
                                Vendre un article
                            </Link>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Home;
