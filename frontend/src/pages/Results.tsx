import { useSearchParams, Link } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getAds } from '../services/ads';
import FilterSidebar from '../components/FilterSidebar';

const Results = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const params = Object.fromEntries([...searchParams]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['ads', params],
        queryFn: () => getAds(params),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60, // 1 minute
    }) as any;

    if (error) return <div className="p-8 text-center text-red-500">Erreur de chargement des annonces. Veuillez réessayer.</div>;

    return (
        <div className="max-w-7xl mx-auto p-4 lg:p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
                {params.q ? `Résultats pour "${params.q}"` : 'Toutes les annonces'}
                <span className="text-gray-500 text-lg font-normal ml-2">({data?.data?.total || 0})</span>
            </h1>

            {/* Sort Dropdown */}
            <div className="flex justify-end mb-4">
                <select
                    className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={params.sort || ''}
                    onChange={(e) => {
                        const newParams = new URLSearchParams(searchParams);
                        if (e.target.value) newParams.set('sort', e.target.value);
                        else newParams.delete('sort');
                        // Reset page on sort change
                        newParams.set('page', '1');
                        setSearchParams(newParams);
                    }}
                >
                    <option value="">Trier par : Plus récents</option>
                    <option value="price_asc">Prix : Croissant</option>
                    <option value="price_desc">Prix : Décroissant</option>
                </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <FilterSidebar />
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-64 bg-gray-200 rounded animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {data?.data?.items?.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {data.data.items.map((ad: any) => (
                                        <Link key={ad._id} to={`/ad/${ad._id}`} className="block group">
                                            <div className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                                                <div className="h-48 bg-gray-100 relative overflow-hidden">
                                                    {ad.images && ad.images.length > 0 ? (
                                                        <img src={ad.images[0].url} alt={ad.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <span>Pas d'image</span>
                                                        </div>
                                                    )}
                                                    {ad.priceType === 'free' && (
                                                        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">Gratuit</span>
                                                    )}
                                                </div>
                                                <div className="p-4 flex flex-col flex-grow">
                                                    <h3 className="font-bold text-gray-800 mb-1 truncate">{ad.title}</h3>
                                                    <p className="text-blue-600 font-bold text-lg mb-2">
                                                        {ad.priceType === 'fixed' || ad.priceType === 'negotiable'
                                                            ? `$${ad.price?.toLocaleString()}`
                                                            : ad.priceType === 'on_request' ? 'Sur demande' : 'Gratuit'}
                                                    </p>
                                                    <div className="mt-auto flex items-center text-gray-500 text-xs">
                                                        <span className="truncate max-w-[100px]">{ad.city}</span>
                                                        <span className="mx-1">•</span>
                                                        <span>{new Date(ad.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
                                    <div className="text-gray-400 mb-2">
                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    </div>
                                    <p className="text-gray-600 text-lg font-medium">Aucune annonce trouvée.</p>
                                    <p className="text-gray-500">Essayez de modifier vos filtres ou effectuez une nouvelle recherche.</p>
                                    <button onClick={() => window.location.href = '/results'} className="mt-4 text-blue-600 hover:underline">
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
