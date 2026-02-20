import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAds } from '../services/ads';
import { CATEGORIES } from '../data/categories';
import { ChevronRight, Home as HomeIcon, Car, Smartphone, Sofa, Shirt, Bike, Briefcase, Building2, Baby, MoreHorizontal, Search, Bell, Navigation } from 'lucide-react';
import AdCard from '../components/AdCard';
import logo from '../assets/sokonex-logo-png.png';

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
            {/* Custom Mobile-first Hero Section */}
            <div className="bg-[#4D148C] bg-gradient-to-br from-[#4D148C] via-[#6A1B9A] to-[#8E24AA] relative rounded-b-[2.5rem] md:rounded-b-[4rem] px-5 pt-12 pb-20 shadow-xl overflow-hidden">
                {/* Background decoration elements */}
                <div className="absolute top-0 right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl mix-blend-overlay pointer-events-none"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

                {/* Header Top Row with Logo, Bell */}
                <div className="flex justify-between items-center relative z-10 mb-8 mt-2 h-10">
                    {/* Logo */}
                    <div className="flex items-center flex-1 h-full">
                        <img
                            src={logo}
                            alt="SOKONEX"
                            className="h-8 md:h-10 w-auto object-contain drop-shadow-md"
                        />
                    </div>

                    {/* Bell Icon */}
                    <div className="relative shrink-0">
                        <Bell className="w-7 h-7 text-white" />
                        <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#F7D116] border-2 border-[#4D148C] rounded-full"></div>
                    </div>
                </div>

                {/* Main Home Search Bar */}
                <div className="relative z-10 w-full max-w-2xl mx-auto">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const query = new FormData(e.currentTarget).get('q');
                            if (query && query.toString().trim()) {
                                navigate(`/results?q=${encodeURIComponent(query.toString())}`);
                            }
                        }}
                        className="bg-white rounded-xl shadow-xl flex items-center px-4 py-2 h-14 w-full"
                    >
                        <Search className="w-6 h-6 text-gray-500 shrink-0" strokeWidth={2} />
                        <input
                            type="text"
                            name="q"
                            placeholder="Que recherchez-vous ?"
                            className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-gray-800 text-base ml-3 placeholder:text-gray-400 font-medium"
                        />
                        <button type="submit" className="text-gray-400 hover:text-[#6A1B9A] transition-colors p-2 -mr-2 flex items-center justify-center">
                            <Navigation className="w-5 h-5 transform rotate-45 text-gray-400" strokeWidth={2.5} />
                        </button>
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-8">
                {/* Horizontal Scroll Categories with Icons */}
                <div className="relative z-20 -mt-20 mb-8">
                    <div className="flex gap-4 overflow-x-auto pb-4 pt-2 px-2 -mx-2 scrollbar-hide snap-x">
                        {CATEGORIES.map(cat => {
                            const IconComponent = iconMap[cat.icon as string] || MoreHorizontal;
                            return (
                                <Link key={cat.id} to={`/results?category=${cat.id}`} className="flex flex-col items-center min-w-[100px] w-[100px] bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group snap-center border border-gray-50 shrink-0 transform hover:-translate-y-1">
                                    <div className="w-12 h-12 flex items-center justify-center text-[#6A1B9A] mb-3 group-hover:scale-110 transition-transform bg-purple-50 rounded-xl">
                                        <IconComponent className="w-7 h-7" strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[11px] sm:text-xs text-gray-700 font-medium text-center truncate w-full group-hover:text-[#6A1B9A] transition-colors">{cat.label}</span>
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
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Annonces récentes</h2>
                        <Link to="/results" className="text-gray-400 hover:text-[#6A1B9A] transition-colors">
                            <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
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
