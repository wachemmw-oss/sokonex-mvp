import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Home as HomeIcon, Car, Smartphone, Sofa, Shirt, Bike,
    Briefcase, Building2, Baby, MoreHorizontal, ChevronRight,
    Clock, LayoutGrid, List
} from 'lucide-react';
import AdCard from '../components/AdCard';
import { useQuery } from '@tanstack/react-query';
import { getAds } from '../services/ads';
import { getCategories } from '../services/category';
import banner1 from '../assets/banner1.webp';
import banner2 from '../assets/banner2.webp';
import banner3 from '../assets/banner3.webp';

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

const BANNERS = [
    "/banners/Banner 1.jpg",
];

const Home = () => {
    const navigate = useNavigate();
    const [currentBanner, setCurrentBanner] = useState(0);
    const [activeTab, setActiveTab] = useState<'recommande' | 'nouveau' | 'tendance'>('recommande');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
        <div className="font-sans min-h-screen pb-20" style={{ backgroundColor: '#FAFAF8' }}>
            {/* Desktop spacer */}
            <div className="hidden md:block h-6 bg-gray-100"></div>

            {/* Hero Banners */}
            <div className="relative w-full max-w-7xl mx-auto md:px-4 md:rounded-lg overflow-hidden aspect-[2/1] md:aspect-[3/1] bg-gray-200">
                {BANNERS.map((banner, idx) => (
                    <img
                        key={idx}
                        src={banner}
                        alt={`Banner ${idx}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${idx === currentBanner ? 'opacity-100' : 'opacity-0'}`}
                    />
                ))}
                {/* Explorer Button */}
                <div className="absolute bottom-8 left-4 md:bottom-10 md:left-8 z-10">
                    <Link
                        to="/results"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm font-bold text-sm text-white shadow-lg transition hover:opacity-90 active:scale-95"
                        style={{ backgroundColor: '#214829' }}
                    >
                        Explorer
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
                {/* Banner Indicators */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                    {BANNERS.map((_, idx) => (
                        <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === currentBanner ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}></div>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-0 md:px-4">
                {/* Category Slider */}
                <div className="bg-white mt-2 md:mt-6 py-5 px-2 md:rounded-lg">
                    {isLoadingCats ? (
                        <div className="flex gap-4 overflow-x-auto pb-2 px-3 scrollbar-hide">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="min-w-[80px] flex flex-col items-center gap-2">
                                    <div className="w-[72px] h-[72px] rounded-full bg-gray-100 animate-pulse" />
                                    <div className="h-2 w-12 bg-gray-100 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex gap-3 overflow-x-auto pb-2 px-3 scrollbar-hide snap-x">
                            {CATEGORIES_FROM_DB.map((cat: any) => {
                                const IconComponent = iconMap[cat.icon as string] || MoreHorizontal;
                                return (
                                    <Link key={cat.slug} to={`/results?category=${cat.slug}`} className="flex flex-col items-center min-w-[80px] snap-start group">
                                        <div className="w-[72px] h-[72px] rounded-full bg-white flex items-center justify-center text-gray-800 mb-2 border border-gray-100 group-hover:border-black transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
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
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
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
