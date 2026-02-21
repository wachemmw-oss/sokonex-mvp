import { useSearchParams, Link } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getAds } from '../services/ads';
import FilterSidebar from '../components/FilterSidebar';
import AdCard from '../components/AdCard';
import { useState } from 'react';
import { LayoutGrid, List, Filter, X } from 'lucide-react';

const Results = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const params = Object.fromEntries([...searchParams]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const { data, isLoading, error } = useQuery({
        queryKey: ['ads', params],
        queryFn: () => getAds(params),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60, // 1 minute
    }) as any;

    if (error) return <div className="p-8 text-center text-red-500">Erreur de chargement des annonces. Veuillez réessayer.</div>;

    return (
        <div className="max-w-7xl mx-auto p-4 lg:p-6 pb-24">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
                {params.q ? `Résultats pour "${params.q}"` : 'Toutes les annonces'}
                <span className="text-gray-500 text-lg font-normal ml-2">({data?.data?.total || 0})</span>
            </h1>

            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-2.5 rounded-lg font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition"
                >
                    <Filter className="w-4 h-4" />
                    Filtrer & Trier
                </button>
            </div>

            {/* Mobile Filter Modal/Drawer */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-50 lg:hidden font-sans">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsFilterOpen(false)} />
                    <div className="absolute inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl transform transition-transform overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-bold text-gray-900">Filtres</h2>
                            <button onClick={() => setIsFilterOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4">
                            <FilterSidebar />
                        </div>
                        <div className="p-4 border-t sticky bottom-0 bg-white">
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="w-full font-bold py-3 rounded-sm active:scale-95 transition"
                                style={{ backgroundColor: '#FFBA34', color: '#1A3620' }}
                            >
                                Afficher les résultats
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sort Dropdown & View Toggles */}
            <div className="hidden lg:flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2 bg-gray-50 p-1 rounded-sm">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-sm transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-black'}`}
                    >
                        <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-sm transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-black'}`}
                    >
                        <List className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-1 justify-end">
                    <select
                        className="border border-gray-200 rounded-sm py-2 px-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                        value={params.sort || ''}
                        onChange={(e) => {
                            const newParams = new URLSearchParams(searchParams);
                            if (e.target.value) newParams.set('sort', e.target.value);
                            else newParams.delete('sort');
                            newParams.set('page', '1');
                            setSearchParams(newParams);
                        }}
                    >
                        <option value="">Trier par : Plus récents</option>
                        <option value="price_asc">Prix : Croissant</option>
                        <option value="price_desc">Prix : Décroissant</option>
                    </select>
                </div>
            </div>

            {/* View Toggle Mobile */}
            <div className="flex lg:hidden justify-end mb-4 gap-2">
                <select
                    className="flex-1 border border-gray-200 rounded-sm py-2 px-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-white"
                    value={params.sort || ''}
                    onChange={(e) => {
                        const newParams = new URLSearchParams(searchParams);
                        if (e.target.value) newParams.set('sort', e.target.value);
                        else newParams.delete('sort');
                        newParams.set('page', '1');
                        setSearchParams(newParams);
                    }}
                >
                    <option value="">Récents</option>
                    <option value="price_asc">Prix Croissant</option>
                    <option value="price_desc">Prix Décroissant</option>
                </select>
                <div className="flex items-center space-x-1 bg-gray-50 p-1 rounded-sm">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-sm transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-black'}`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-sm transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-black'}`}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar - Desktop */}
                <div className="hidden lg:block lg:col-span-1">
                    <FilterSidebar />
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-64 bg-gray-200 rounded animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {data?.data?.items?.length > 0 ? (
                                <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                                    {data.data.items.map((ad: any) => (
                                        viewMode === 'grid' ? (
                                            <AdCard key={ad._id} ad={ad} />
                                        ) : (
                                            <Link key={ad._id} to={`/ad/${ad._id}`} className="flex bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition h-32 md:h-40">
                                                <div className="w-1/3 md:w-48 bg-gray-200 relative flex-shrink-0">
                                                    {ad.images?.[0] ? (
                                                        <img src={ad.images[0].url} alt={ad.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                                    )}
                                                </div>
                                                <div className="p-3 flex flex-col justify-between flex-1">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">{ad.title}</h3>
                                                        <p className="text-sm text-gray-500 line-clamp-2 hidden md:block">{ad.description}</p>
                                                    </div>
                                                    <div className="flex justify-between items-end">
                                                        <div>
                                                            <p className="font-bold" style={{ color: '#214829' }}>
                                                                {ad.priceType === 'fixed' || ad.priceType === 'negotiable' ? `$${ad.price?.toLocaleString()}` : ad.priceType === 'free' ? 'Gratuit' : 'Sur demande'}
                                                            </p>
                                                            <p className="text-xs text-gray-400 mt-1">{ad.city} • {new Date(ad.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white rounded-sm border border-dashed border-gray-200">
                                    <div className="text-gray-300 mb-2">
                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    </div>
                                    <p className="text-black text-lg font-medium">Aucune annonce trouvée.</p>
                                    <p className="text-gray-500 text-sm mt-1">Essayez de modifier vos filtres ou effectuez une nouvelle recherche.</p>
                                    <button onClick={() => window.location.href = '/results'} className="mt-4 text-black font-bold underline hover:text-gray-700 transition">
                                        Voir toutes les annonces
                                    </button>
                                </div>
                            )}

                            {/* Pagination (Simple Next/Prev for MVP) */}
                            {data?.data?.pages > 1 && (
                                <div className="mt-8 flex justify-center gap-2">
                                    <button
                                        disabled={Number(data.data.page) <= 1}
                                        onClick={() => { const p = new URLSearchParams(searchParams); p.set('page', String(Number(data.data.page) - 1)); }}
                                        className="px-4 py-2 border rounded disabled:opacity-50"
                                    >Précédent</button>
                                    <span className="px-4 py-2">Page {data.data.page} sur {data.data.pages}</span>
                                    <button
                                        disabled={Number(data.data.page) >= data.data.pages}
                                        onClick={() => { const p = new URLSearchParams(searchParams); p.set('page', String(Number(data.data.page) + 1)); }}
                                        className="px-4 py-2 border rounded disabled:opacity-50"
                                    >Suivant</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Results;
