import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Home as HomeIcon, Car, Smartphone, Sofa, Shirt, Bike,
    Briefcase, Building2, Baby, MoreHorizontal, ChevronRight,
    Clock, LayoutGrid, List
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
                    className="relative w-full max-w-7xl mx-auto md:rounded-[2rem] overflow-hidden group mb-8 shadow-2xl"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div
                        ref={carouselRef}
                        className="flex gap-0 overflow-x-auto scrollbar-hide snap-x h-full no-scrollbar"
                    >
                        {banners.map((b, idx) => (
                            <div key={idx} className="min-w-full snap-center">
                                <BannerCard {...b} />
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows (PC only) */}
                    <button
                        onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
                        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-[#FFBA34] hover:text-[#1A3620] hover:scale-110 hidden md:flex"
                    >
                        <ChevronRight className="rotate-180" size={24} strokeWidth={3} />
                    </button>
                    <button
                        onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-[#FFBA34] hover:text-[#1A3620] hover:scale-110 hidden md:flex"
                    >
                        <ChevronRight size={24} strokeWidth={3} />
                    </button>

                    {/* Carousel Dots */}
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-30">
                        {banners.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentBanner(idx)}
                                className={`h-2 transition-all duration-500 rounded-full ${currentBanner === idx
                                    ? 'w-10 bg-[#FFBA34]'
                                    : 'w-2 bg-white/30 hover:bg-white/60'
                                    }`}
                                aria-label={`Go to banner ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* ─── Categories Section (Standard Styling) ─── */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold tracking-tight uppercase" style={{ color: '#214829' }}>Catégories</h2>
                    </div>

                    {isLoadingCats ? (
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="min-w-[80px] h-24 bg-gray-100 rounded animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-x-2 gap-y-4 md:gap-x-4 md:gap-y-6">
                            {CATEGORIES_FROM_DB.map((cat: any) => {
                                const IconComponent = iconMap[cat.icon as string] || MoreHorizontal;
                                return (
                                    <Link
                                        key={cat.slug}
                                        to={`/results?category=${cat.slug}`}
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-[#FFBA34]/10 group-hover:text-[#214829] transition-all">
                                            <IconComponent className="w-7 h-7" strokeWidth={1.5} />
                                        </div>
                                        <span className="text-[11px] text-gray-600 font-bold max-w-[76px] text-center leading-[1.1] whitespace-normal group-hover:text-black">{cat.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Flash Deals (Promoted Ads) */}
                {promotedAds?.data?.items?.length > 0 && (
                    <div className="mt-2 md:mt-6 bg-white p-4 md:rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold tracking-tight uppercase" style={{ color: '#FFBA34' }}>Ventes Flash</h2>
                                <div className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: '#214829', color: '#FFBA34' }}>
                                    <Clock className="w-3 h-3" />
                                    <span>23:59:59</span>
                                </div>
                            </div>
                            <Link to="/results?promoted=true" className="text-sm text-gray-500 font-medium flex items-center">
                                Tout voir <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {promotedAds.data.items.slice(0, 4).map((ad: any) => (
                                <AdCard key={ad._id} ad={ad} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Feed */}
                <div className="mt-2 md:mt-6">
                    <div className="bg-white py-4 px-4 mb-2 sticky top-[62px] md:top-[80px] z-30 md:rounded-t-lg shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex gap-4 overflow-x-auto scrollbar-hide flex-1">
                                <button
                                    onClick={() => setActiveTab('recommande')}
                                    className={`text-[12px] md:text-[13px] font-extrabold tracking-wide uppercase whitespace-nowrap pb-1 border-b-2 transition-colors ${activeTab === 'recommande' ? 'border-[#FFBA34] text-[#214829]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                >
                                    Recommandé pour vous
                                </button>
                                <button
                                    onClick={() => setActiveTab('nouveau')}
                                    className={`text-[12px] md:text-[13px] font-extrabold tracking-wide uppercase whitespace-nowrap pb-1 border-b-2 transition-colors ${activeTab === 'nouveau' ? 'border-[#FFBA34] text-[#214829]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                >
                                    Nouveau
                                </button>
                                <button
                                    onClick={() => setActiveTab('tendance')}
                                    className={`text-[12px] md:text-[13px] font-extrabold tracking-wide uppercase whitespace-nowrap pb-1 border-b-2 transition-colors ${activeTab === 'tendance' ? 'border-[#FFBA34] text-[#214829]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                >
                                    Tendance
                                </button>
                            </div>

                            <div className="flex gap-1 shrink-0 bg-gray-100 p-0.5 rounded-sm">
                                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-sm transition-all shadow-none ${viewMode === 'grid' ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-black' : 'text-gray-400 hover:text-gray-600'}`}>
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-sm transition-all shadow-none ${viewMode === 'list' ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-black' : 'text-gray-400 hover:text-gray-600'}`}>
                                    <List className="w-4 h-4" />
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
                            <div className="flex justify-center mt-6 mb-2 px-2">
                                <Link
                                    to="/results"
                                    className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 font-bold text-sm rounded-sm border-2 transition hover:opacity-80 active:scale-95"
                                    style={{ borderColor: '#214829', color: '#214829' }}
                                >
                                    Voir plus d'annonces
                                    <ChevronRight className="w-4 h-4" />
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
                </div>
            </div>
        </div>
    );
};

export default Home;
