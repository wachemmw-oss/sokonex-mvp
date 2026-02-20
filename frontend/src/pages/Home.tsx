import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAds } from '../services/ads';
import { CATEGORIES } from '../data/categories';
import { LOCATIONS } from '../data/locations'; // Ensure this exists
import { Search, MapPin, ChevronRight } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('');

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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery) params.append('q', searchQuery);
        if (location) params.append('city', location);
        navigate(`/results?${params.toString()}`);
    };

    return (
        <div className="font-sans bg-gray-50 min-h-screen">
            {/* Unique Hero & Search Section */}
            <div className="bg-blue-800 text-white pt-12 pb-24 px-4 sticky top-16 z-0"> {/* Reduced height */}
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-2xl md:text-4xl font-bold mb-6">
                        Tout vendre, tout acheter en RDC.
                    </h1>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="bg-white p-2 rounded-lg shadow-xl flex flex-col md:flex-row gap-2">
                        <div className="flex-1 flex items-center px-4 bg-gray-100 rounded-md">
                            <Search className="w-5 h-5 text-gray-500 mr-2" />
                            <input
                                type="text"
                                placeholder="Que cherchez-vous ?"
                                className="w-full bg-transparent py-3 focus:outline-none text-gray-800 placeholder-gray-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 flex items-center px-4 bg-gray-100 rounded-md">
                            <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                            {/* Simple select for MVP, can be autocomplete later */}
                            <select
                                className="w-full bg-transparent py-3 focus:outline-none text-gray-800"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            >
                                <option value="">Toute la RDC</option>
                                {LOCATIONS.map(prov => (
                                    <optgroup key={prov.province} label={prov.province}>
                                        {prov.cities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-md transition duration-200">
                            Rechercher
                        </button>
                    </form>
                </div>
            </div>

            <div className="relative z-10 -mt-12 max-w-7xl mx-auto px-4 pb-12">
                {/* Compact Categories Grid */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Parcourir par catégorie</h2>
                    <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-4">
                        {CATEGORIES.map(cat => (
                            <Link key={cat.id} to={`/results?category=${cat.id}`} className="flex flex-col items-center group">
                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                                    {/* Placeholder Icon - You would map actual icons here */}
                                    <span className="text-xl font-bold">{cat.label.charAt(0)}</span>
                                </div>
                                <span className="text-xs text-center text-gray-600 font-medium group-hover:text-blue-600 truncate w-full">{cat.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Promoted Section */}
                {promotedAds?.data?.items?.length > 0 && (
                    <div className="mb-10">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <span className="text-yellow-500">★</span> En Vedette
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {promotedAds.data.items.map((ad: any) => (
                                <Link key={ad._id} to={`/ad/${ad._id}`} className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 flex flex-col h-full">
                                    <div className="aspect-[4/3] bg-gray-200 relative">
                                        {ad.images?.[0] ? (
                                            <img src={ad.images[0].url} alt={ad.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                        )}
                                        <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Promo</div>
                                    </div>
                                    <div className="p-3 flex flex-col flex-1">
                                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{ad.title}</h3>
                                        <div className="mt-auto">
                                            <p className="text-blue-600 font-bold text-base">
                                                {ad.priceType === 'fixed' || ad.priceType === 'negotiable' ? `$${ad.price?.toLocaleString()}` : 'Sur demande'}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1 truncate">{ad.city}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Ads */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Récemment publiés</h2>
                        <Link to="/results" className="text-sm text-blue-600 font-medium hover:underline flex items-center">
                            Tout voir <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    {/* Mobile: 2 Columns, Desktop: 4 Columns */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                        {recentAds?.data?.items?.map((ad: any) => (
                            <Link key={ad._id} to={`/ad/${ad._id}`} className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 flex flex-col h-full">
                                <div className="aspect-square bg-gray-200 relative">
                                    {ad.images?.[0] ? (
                                        <img src={ad.images[0].url} alt={ad.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                    )}
                                </div>
                                <div className="p-3 flex flex-col flex-1">
                                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{ad.title}</h3>
                                    <div className="mt-auto">
                                        <p className="text-gray-900 font-bold text-base">
                                            {ad.priceType === 'fixed' || ad.priceType === 'negotiable' ? `$${ad.price?.toLocaleString()}` : ad.priceType === 'free' ? 'Gratuit' : 'Contact'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1 truncate">{ad.city}</p>
                                    </div>
                                </div>
                            </Link>
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
