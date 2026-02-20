import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAds } from '../services/ads';
import { CATEGORIES } from '../data/categories';
import { ChevronRight, Home as HomeIcon, Car, Smartphone, Sofa, Shirt, Bike, Briefcase, Building2, Baby, MoreHorizontal, Search } from 'lucide-react';
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
    "https://images.unsplash.com/photo-1605218427324-ee5a911f3252?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3", // Real Estate
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3", // Cars
    "https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"  // Electronics
];

const Home = () => {
    const navigate = useNavigate();
    const [currentBanner, setCurrentBanner] = useState(0);

    // Auto-scroll banner
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Fetch Promoted Ads
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
        <div className="font-sans bg-gray-50 min-h-screen pb-24">
            {/* Hero Carousel Section */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden bg-gray-200">
                {BANNERS.map((banner, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBanner ? 'opacity-100' : 'opacity-0'} `}
                    >
                        <img src={banner} alt="Banner" className="w-full h-full object-cover" />
                    </div>
                ))}
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center px-4">
                    <div className="text-center text-white mb-6 w-full mt-4">
                        <h1 className="text-3xl md:text-5xl font-extrabold mb-2 drop-shadow-lg tracking-tight">SOKONEX</h1>
                        <p className="text-base md:text-xl font-medium opacity-95 drop-shadow-md">Le marché de confiance en RDC</p>
                    </div>

                    {/* Main Home Search Bar */}
                    <div className="w-full max-w-2xl px-2">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const query = new FormData(e.currentTarget).get('q');
                                if (query && query.toString().trim()) {
                                    navigate(`/results?q=${encodeURIComponent(query.toString())}`);
                                }
                            }}
                            className="w-full flex bg-white/95 backdrop-blur-sm rounded-full p-1.5 shadow-2xl ring-4 ring-black/10 focus-within:ring-blue-500/30 transition-all border border-transparent hover:border-white"
                        >
                            <div className="pl-4 pr-2 flex items-center justify-center">
                                <Search className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="q"
                                placeholder="Que cherchez-vous ?"
                                className="flex-1 bg-transparent py-2.5 md:py-3 text-sm md:text-base text-gray-900 placeholder-gray-500 focus:outline-none w-full"
                            />
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold text-sm md:text-base transition-colors shadow-md">
                                Chercher
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-6">
                {/* Horizontal Scroll Categories with Icons */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6 relative z-10 -mt-12 md:mt-0 md:bg-transparent md:shadow-none">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 md:hidden">Catégories</h2>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide md:grid md:grid-cols-5 lg:grid-cols-10 md:overflow-visible">
                        {CATEGORIES.map(cat => {
                            const IconComponent = iconMap[cat.icon as string] || MoreHorizontal;
                            return (
                                <Link key={cat.id} to={`/results?category=${cat.id}`} className="flex flex-col items-center min-w-[70px] group">
                                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-600 mb-2 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200 shadow-sm border border-gray-100">
                                        <IconComponent className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] text-center text-gray-600 font-medium group-hover:text-blue-600 truncate w-full leading-tight">{cat.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Promoted Section */}
                {promotedAds?.data?.items?.length > 0 && (
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <span className="text-yellow-500">★</span> En Vedette
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {promotedAds.data.items.map((ad: any) => (
                                <AdCard key={ad._id} ad={ad} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Ads */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-lg font-bold text-gray-900">Récents</h2>
                        <Link to="/results" className="text-xs text-blue-600 font-medium hover:underline flex items-center">
                            Tout voir <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    {/* Mobile: 2 Columns, Desktop: 4 Columns */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {recentAds?.data?.items?.map((ad: any) => (
                            <AdCard key={ad._id} ad={ad} />
                        ))}
                    </div>
                    {(!recentAds?.data?.items || recentAds.data.items.length === 0) && (
                        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-500">Aucune annonce récente.</p>
                            <Link to="/post" className="text-blue-600 font-bold mt-2 inline-block">Publier une annonce</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
