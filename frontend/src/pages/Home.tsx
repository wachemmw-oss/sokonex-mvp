import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAds } from '../services/ads';
import { CATEGORIES } from '../data/categories';

const Home = () => {
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
        <div className="font-sans">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                        Achetez et vendez <br className="hidden md:inline" /> <span className="text-orange-400">tout ce que vous voulez</span> en RDC.
                    </h1>
                    <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto">
                        La plateforme de référence pour l'immobilier, les véhicules, l'électronique et plus encore. Simple, rapide et sécurisé.
                    </p>
                    <div className="flex flex-col md:flex-row justify-center gap-4">
                        <Link to="/results" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                            Explorer les annonces
                        </Link>
                        <Link to="/post" className="bg-white text-blue-900 font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 hover:bg-gray-50">
                            Publier une annonce
                        </Link>
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 text-center">Catégories Populaires</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                    {CATEGORIES.map(cat => (
                        <Link key={cat.id} to={`/results?category=${cat.id}`} className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition text-center group">
                            <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{cat.label}</h3>
                            <p className="text-xs text-gray-500 mt-2">{cat.subCategories.length} sous-catégories</p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Promoted Section (Placeholder logic if API ready) */}
            {promotedAds?.data?.items?.length > 0 && (
                <div className="bg-orange-50 py-16">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex justify-between items-end mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">⭐️ Annonces en Vedette</h2>
                            <Link to="/results" className="text-blue-600 font-semibold hover:underline">Voir tout</Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {promotedAds.data.items.map((ad: any) => (
                                <Link key={ad._id} to={`/ad/${ad._id}`} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group">
                                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                                        {ad.images?.[0] ? (
                                            <img src={ad.images[0].url} alt={ad.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">Sans image</div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">PROMO</div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 truncate mb-1">{ad.title}</h3>
                                        <p className="text-blue-600 font-bold text-lg">${ad.price?.toLocaleString()}</p>
                                        <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                                            <span>{ad.city}</span>
                                            <span>{new Date(ad.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Ads */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Dernières Annonces</h2>
                    <Link to="/results" className="text-blue-600 font-semibold hover:underline">Voir tout</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recentAds?.data?.items?.map((ad: any) => (
                        <Link key={ad._id} to={`/ad/${ad._id}`} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
                            <div className="h-48 bg-gray-200 relative overflow-hidden">
                                {ad.images?.[0] ? (
                                    <img src={ad.images[0].url} alt={ad.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">Sans image</div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-gray-900 truncate mb-1">{ad.title}</h3>
                                <p className="text-gray-700 font-bold text-lg">
                                    {ad.priceType === 'fixed' || ad.priceType === 'negotiable' ? `$${ad.price?.toLocaleString()}` : ad.priceType === 'free' ? 'Gratuit' : 'Sur demande'}
                                </p>
                                <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                                    <span>{ad.city}</span>
                                    <span>{new Date(ad.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {(!recentAds?.data?.items || recentAds.data.items.length === 0) && (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            Aucune annonce pour le moment. Soyez le premier à publier !
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
