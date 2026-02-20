import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAds } from '../services/ads';
import { CATEGORIES } from '../data/categories';
import { ChevronRight, Home as HomeIcon, Car, Smartphone, Sofa, Shirt, Bike, Briefcase, Building2, Baby, MoreHorizontal, Search, Bell, Clock } from 'lucide-react';
import AdCard from '../components/AdCard';

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
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop", // Clean Shopping
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop", // Fashion
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop"  // Sale
];

const Home = () => {
    const navigate = useNavigate();
    const [currentBanner, setCurrentBanner] = useState(0);

    // Auto-scroll banner
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // Fetch Promoted Ads (Used as Flash Deals)
    const { data: promotedAds } = useQuery({
        queryKey: ['ads', 'promoted'],
        queryFn: () => getAds({ promoted: true, limit: 4 }),
    });

    // Fetch Recent Ads
    const { data: recentAds } = useQuery({
        queryKey: ['ads', 'recent'],
        queryFn: () => getAds({ limit: 8 }),
    });

    return (
        <div className="font-sans bg-gray-100 min-h-screen pb-20">
            {/* Mobile Header (Hidden on Desktop since Navbar handles it) */}
            <div className="md:hidden bg-white px-4 py-3 flex justify-between items-center sticky top-0 z-40">
                <h1 className="text-xl font-bold tracking-tighter">SOKONEX</h1>
                <div className="flex gap-4">
                    <Search className="w-6 h-6 text-gray-800" onClick={() => navigate('/results')} />
                    <Bell className="w-6 h-6 text-gray-800" />
                </div>
            </div>

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
                {/* Banner Indicators */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                    {BANNERS.map((_, idx) => (
                        <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === currentBanner ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}></div>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-0 md:px-4">
                {/* Category Slider */}
                <div className="bg-white mt-2 md:mt-6 py-4 px-2 md:rounded-lg">
                    <div className="flex gap-4 overflow-x-auto pb-2 px-2 scrollbar-hide snap-x">
                        {CATEGORIES.map(cat => {
                            const IconComponent = iconMap[cat.icon as string] || MoreHorizontal;
                            return (
                                <Link key={cat.id} to={`/results?category=${cat.id}`} className="flex flex-col items-center min-w-[70px] snap-start group">
                                    <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-800 mb-2 border border-gray-100 group-hover:border-black transition-colors">
                                        <IconComponent className="w-6 h-6" strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[10px] text-gray-600 text-center font-medium leading-tight group-hover:text-black">{cat.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Flash Deals (Promoted Ads) */}
                {promotedAds?.data?.items?.length > 0 && (
                    <div className="mt-2 md:mt-6 bg-white p-4 md:rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-red-600 tracking-tight uppercase">Ventes Flash</h2>
                                <div className="flex items-center gap-1 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
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
                    <div className="bg-white py-3 px-4 mb-2 sticky top-[60px] md:top-[80px] z-30 border-b border-gray-100 md:rounded-t-lg">
                        <h2 className="text-lg font-bold tracking-tight text-center">RECOMMANDÉ POUR VOUS</h2>
                    </div>
                    {/* Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4 px-2 md:px-0">
                        {recentAds?.data?.items?.map((ad: any) => (
                            <AdCard key={ad._id} ad={ad} />
                        ))}
                    </div>

                    {(!recentAds?.data?.items || recentAds.data.items.length === 0) && (
                        <div className="text-center py-12 bg-white rounded-lg mt-2">
                            <p className="text-gray-500">Aucun article trouvé.</p>
                            <Link to="/post" className="border border-black text-black font-bold mt-4 px-6 py-2 rounded-sm inline-block hover:bg-black hover:text-white transition">Vendre un article</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
