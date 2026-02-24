import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getAds } from '../services/ads';
import { getCategories } from '../services/category';
import FilterSidebar from '../components/FilterSidebar';
import AdCard from '../components/AdCard';
import { LayoutGrid, List, Filter, X, Loader2 } from 'lucide-react';

const LIMIT = 12;

const Results = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const params = Object.fromEntries([...searchParams]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    // Mobile Filter Drawer State
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Fetch categories
    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories
    });

    const CATEGORIES_FROM_DB = categoriesData?.data || [];

    // Listen for custom event from Navbar to open filters
    useEffect(() => {
        const handleOpenFilters = () => setIsFilterOpen(true);
        window.addEventListener('open-mobile-filters', handleOpenFilters);
        return () => window.removeEventListener('open-mobile-filters', handleOpenFilters);
    }, []);
    const loaderRef = useRef<HTMLDivElement>(null);

    const {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['ads-infinite', params],
        queryFn: ({ pageParam = 1 }) =>
            getAds({ ...params, page: pageParam, limit: LIMIT }),
        initialPageParam: 1,
        getNextPageParam: (lastPage: any) => {
            const { page, pages } = lastPage?.data ?? {};
            return page < pages ? page + 1 : undefined;
        },
        staleTime: 1000 * 60 * 2,
    }) as any;

    // Intersection Observer — auto-load when user scrolls to bottom sentinel
    useEffect(() => {
        const el = loaderRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { rootMargin: '200px' }   // start loading 200px before the sentinel
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Flatten all pages into one ad list
    const allAds = data?.pages?.flatMap((page: any) => page?.data?.items ?? []) ?? [];
    const total = data?.pages?.[0]?.data?.total ?? 0;

    if (error) return (
        <div className="p-8 text-center text-red-500">
            Erreur de chargement des annonces. Veuillez réessayer.
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-4 lg:p-6 pb-24">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
                {params.q ? `Résultats pour "${params.q}"` : 'Toutes les annonces'}
                <span className="text-gray-500 text-lg font-normal ml-2">({total})</span>
            </h1>

            {/* Mobile Filter Bar — Le Bon Coin style horizontal chips */}
            <div className="lg:hidden -mx-4 mb-4">
                <div className="flex items-center gap-2 px-4 overflow-x-auto scrollbar-hide pb-1 pt-1">
                    {/* Main filter button */}
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center gap-1.5 shrink-0 px-3 py-2 rounded-full border text-sm font-medium transition"
                        style={Object.keys(params).some(k => ['category', 'city', 'condition', 'sort'].includes(k))
                            ? { backgroundColor: '#D32F2F', color: 'white', borderColor: '#D32F2F' }
                            : { backgroundColor: 'white', color: '#333', borderColor: '#ccc' }}
                    >
                        <Filter className="w-3.5 h-3.5" />
                        Filtres
                    </button>

                    {/* Active filter chips */}
                    {params.sort && (
                        <button
                            onClick={() => { const p = new URLSearchParams(searchParams); p.delete('sort'); setSearchParams(p); }}
                            className="flex items-center gap-1.5 shrink-0 px-3 py-2 rounded-full text-sm font-medium border"
                            style={{ backgroundColor: '#FEE2E2', color: '#D32F2F', borderColor: '#D32F2F' }}
                        >
                            {params.sort === 'price_asc' ? 'Prix ↑' : 'Prix ↓'}
                            <X className="w-3 h-3" />
                        </button>
                    )}
                    {params.category && (
                        <button
                            onClick={() => { const p = new URLSearchParams(searchParams); p.delete('category'); p.delete('subCategory'); setSearchParams(p); }}
                            className="flex items-center gap-1.5 shrink-0 px-3 py-2 rounded-full text-sm font-medium border"
                            style={{ backgroundColor: '#FEE2E2', color: '#D32F2F', borderColor: '#D32F2F' }}
                        >
                            {CATEGORIES_FROM_DB.find((c: any) => c.slug === params.category)?.name || params.category}
                            <X className="w-3 h-3" />
                        </button>
                    )}
                    {params.city && (
                        <button
                            onClick={() => { const p = new URLSearchParams(searchParams); p.delete('city'); setSearchParams(p); }}
                            className="flex items-center gap-1.5 shrink-0 px-3 py-2 rounded-full text-sm font-medium border"
                            style={{ backgroundColor: '#FEE2E2', color: '#D32F2F', borderColor: '#D32F2F' }}
                        >
                            {params.city}
                            <X className="w-3 h-3" />
                        </button>
                    )}
                    {params.condition && (
                        <button
                            onClick={() => { const p = new URLSearchParams(searchParams); p.delete('condition'); setSearchParams(p); }}
                            className="flex items-center gap-1.5 shrink-0 px-3 py-2 rounded-full text-sm font-medium border"
                            style={{ backgroundColor: '#FEE2E2', color: '#D32F2F', borderColor: '#D32F2F' }}
                        >
                            {params.condition === 'new' ? 'Neuf' : params.condition === 'used' ? 'Occasion' : 'Reconditionné'}
                            <X className="w-3 h-3" />
                        </button>
                    )}
                    {params.delivery && (
                        <button
                            onClick={() => { const p = new URLSearchParams(searchParams); p.delete('delivery'); setSearchParams(p); }}
                            className="flex items-center gap-1.5 shrink-0 px-3 py-2 rounded-full text-sm font-medium border"
                            style={{ backgroundColor: '#FEE2E2', color: '#D32F2F', borderColor: '#D32F2F' }}
                        >
                            Livraison <X className="w-3 h-3" />
                        </button>
                    )}

                    {/* Sort chips */}
                    {!params.sort && (
                        <>
                            <button
                                onClick={() => { const p = new URLSearchParams(searchParams); p.set('sort', 'price_asc'); setSearchParams(p); }}
                                className="flex items-center shrink-0 px-3 py-2 rounded-full text-sm font-medium border bg-white text-gray-600 border-gray-300"
                            >
                                Prix ↑
                            </button>
                            <button
                                onClick={() => { const p = new URLSearchParams(searchParams); p.set('sort', 'price_desc'); setSearchParams(p); }}
                                className="flex items-center shrink-0 px-3 py-2 rounded-full text-sm font-medium border bg-white text-gray-600 border-gray-300"
                            >
                                Prix ↓
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-50 lg:hidden font-sans">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
                    <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl overflow-y-auto">
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
                                onClick={() => {
                                    const form = document.getElementById('mobile-filter-form') as HTMLFormElement;
                                    if (form) form.requestSubmit();
                                    setIsFilterOpen(false);
                                }}
                                className="w-full font-bold py-3 rounded-xl active:scale-95 transition bg-[#D32F2F] hover:bg-[#B71C1C] text-white shadow-sm"
                            >
                                Afficher les résultats
                            </button>
                        </div>
                    </div>
                </div>
            )
            }

            {/* Sort & View Toggles — Desktop */}
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
                        className="border border-gray-200 rounded-sm py-2 px-3 text-sm focus:outline-none focus:border-[#214829] focus:ring-1 focus:ring-[#214829]"
                        value={params.sort || ''}
                        onChange={(e) => {
                            const p = new URLSearchParams(searchParams);
                            if (e.target.value) p.set('sort', e.target.value);
                            else p.delete('sort');
                            p.delete('page');
                            setSearchParams(p);
                        }}
                    >
                        <option value="">Trier par : Plus récents</option>
                        <option value="price_asc">Prix : Croissant</option>
                        <option value="price_desc">Prix : Décroissant</option>
                    </select>
                </div>
            </div>

            {/* Sort & View Toggles — Mobile */}
            <div className="flex lg:hidden justify-end mb-4 gap-2">
                <select
                    className="flex-1 border border-gray-200 rounded-sm py-2 px-3 text-sm focus:outline-none focus:border-[#214829] bg-white"
                    value={params.sort || ''}
                    onChange={(e) => {
                        const p = new URLSearchParams(searchParams);
                        if (e.target.value) p.set('sort', e.target.value);
                        else p.delete('sort');
                        p.delete('page');
                        setSearchParams(p);
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
                            {[1, 2, 3, 4, 5, 6].map((i: number) => (
                                <div key={i} className="h-64 bg-gray-200 rounded animate-pulse" />
                            ))}
                        </div>
                    ) : allAds.length > 0 ? (
                        <>
                            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                                {allAds.map((ad: any) =>
                                    viewMode === 'grid' ? (
                                        <AdCard key={ad._id} ad={ad} />
                                    ) : (
                                        <Link key={ad._id} to={`/ad/${ad._id}`} className="flex bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition h-32 md:h-40">
                                            <div className="w-1/3 md:w-48 bg-gray-200 relative flex-shrink-0">
                                                {ad.images?.[0] ? (
                                                    <img src={ad.images[0].url} alt={ad.title} className="w-full h-full object-cover" loading="lazy" />
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
                                                        <p className="font-bold" style={{ color: '#f7711c' }}>
                                                            {ad.priceType === 'fixed' || ad.priceType === 'negotiable' ? `$${ad.price?.toLocaleString()}` : ad.priceType === 'free' ? 'Gratuit' : 'Sur demande'}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1">{ad.city} • {new Date(ad.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                )}
                            </div>

                            {/* Infinite scroll sentinel */}
                            <div ref={loaderRef} className="flex justify-center py-8">
                                {isFetchingNextPage && (
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <Loader2 className="w-5 h-5 animate-spin text-[#D32F2F]" />
                                        <span>Chargement...</span>
                                    </div>
                                )}
                                {!hasNextPage && allAds.length > 0 && (
                                    <p className="text-gray-400 text-sm">Vous avez vu toutes les annonces 🎉</p>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-sm border border-dashed border-gray-200">
                            <div className="text-gray-300 mb-2">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <p className="text-black text-lg font-medium">Aucune annonce trouvée.</p>
                            <p className="text-gray-500 text-sm mt-1">Essayez de modifier vos filtres ou effectuez une nouvelle recherche.</p>
                            <button onClick={() => window.location.href = '/results'} className="mt-4 text-[#D32F2F] font-bold hover:underline transition">
                                Voir toutes les annonces
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default Results;
