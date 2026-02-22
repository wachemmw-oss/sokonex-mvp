
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronRight, ChevronLeft, ChevronDown, Search } from 'lucide-react';
import { getCategories } from '../services/category';
import { useQuery } from '@tanstack/react-query';
import { LOCATIONS } from '../data/locations';

const FilterSidebar = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filters, setFilters] = useState({
        q: searchParams.get('q') || '',
        category: searchParams.get('category') || '',
        subCategory: searchParams.get('subCategory') || '',
        province: searchParams.get('province') || '',
        city: searchParams.get('city') || '',
        priceMin: searchParams.get('min') || '',
        priceMax: searchParams.get('max') || '',
        condition: searchParams.get('condition') || ''
    });

    const [drilldownCategory, setDrilldownCategory] = useState<string | null>(searchParams.get('category'));
    const [drilldownProvince, setDrilldownProvince] = useState<string | null>(searchParams.get('province'));

    // Fetch categories
    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories
    });

    const CATEGORIES_FROM_DB = categoriesData?.data || [];

    // Update local state when URL params change
    useEffect(() => {
        setFilters({
            q: searchParams.get('q') || '',
            category: searchParams.get('category') || '',
            subCategory: searchParams.get('subCategory') || '',
            province: searchParams.get('province') || '',
            city: searchParams.get('city') || '',
            priceMin: searchParams.get('min') || '',
            priceMax: searchParams.get('max') || '',
            condition: searchParams.get('condition') || ''
        });
    }, [searchParams]);

    const updateParams = (newFilters: any) => {
        const params = new URLSearchParams(searchParams);

        // Helper to set or delete param
        const setOrDel = (key: string, val: string) => {
            if (val) params.set(key, val);
            else params.delete(key);
        };

        setOrDel('q', newFilters.q);
        setOrDel('category', newFilters.category);
        setOrDel('subCategory', newFilters.subCategory);
        setOrDel('province', newFilters.province);
        setOrDel('city', newFilters.city);
        setOrDel('min', newFilters.priceMin);
        setOrDel('max', newFilters.priceMax);
        setOrDel('condition', newFilters.condition);

        // Reset page on filter change
        params.set('page', '1');

        setSearchParams(params);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };

        // Reset subcategory if category changes
        if (name === 'category') {
            newFilters.subCategory = '';
        }

        setFilters(newFilters);
        // Debounce search input? For now, update on blur or simple button, 
        // but let's try direct update for selects and button for text inputs to avoid too many refreshes
    };

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        updateParams(filters);
    };

    const handleClear = () => {
        setSearchParams({});
        setFilters({
            q: '', category: '', subCategory: '', province: '', city: '',
            priceMin: '', priceMax: '', condition: ''
        });
        setDrilldownCategory(null);
    };

    const currentSubCategories = CATEGORIES_FROM_DB.find((c: any) => c.slug === filters.category)?.subCategories || [];

    return (
        <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm">Filtres</h3>
                <button onClick={handleClear} className="text-xs text-black underline hover:text-gray-600 transition">Tout effacer</button>
            </div>

            <form id="mobile-filter-form" onSubmit={handleApply} className="space-y-5">
                {/* Search */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Recherche</label>
                    <input name="q" value={filters.q} onChange={handleChange} placeholder="Mots-clés..." className="w-full border border-gray-200 bg-gray-50 focus:bg-white p-2 rounded-sm text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors" />
                </div>

                {/* Category Drill-down — Mobile/Sidebar style */}
                <div className="space-y-4">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Catégorie</label>

                    {!drilldownCategory ? (
                        /* List of all categories */
                        <div className="space-y-1">
                            <button
                                type="button"
                                onClick={() => {
                                    const newF = { ...filters, category: '', subCategory: '' };
                                    setFilters(newF);
                                    updateParams(newF);
                                }}
                                className={`w-full flex items-center justify-between p-3 rounded-sm text-sm transition ${!filters.category ? 'bg-[#FFBA34]/10 text-[#1A3620] font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
                            >
                                <span>Toutes les catégories</span>
                                {!filters.category && <div className="w-1.5 h-1.5 rounded-full bg-[#FFBA34]" />}
                            </button>
                            {CATEGORIES_FROM_DB.map((c: any) => (
                                <button
                                    key={c.slug}
                                    type="button"
                                    onClick={() => setDrilldownCategory(c.slug)}
                                    className={`w-full flex items-center justify-between p-3 rounded-sm text-sm transition ${filters.category === c.slug ? 'bg-[#FFBA34]/10 text-[#1A3620] font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg opacity-70 group-hover:opacity-100 transition-opacity">
                                            {/* We could add category-specific icons here if we had a map */}
                                        </span>
                                        <span>{c.name}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        /* Sub-categories for selected category */
                        <div className="space-y-2 animate-in slide-in-from-right duration-200">
                            <button
                                type="button"
                                onClick={() => setDrilldownCategory(null)}
                                className="flex items-center gap-2 text-xs font-bold text-[#214829] mb-2 hover:underline"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                Retour aux catégories
                            </button>

                            <div className="p-3 bg-gray-50 rounded-sm mb-2 border border-gray-100">
                                <span className="text-xs text-gray-500 uppercase font-medium">Sélectionné : </span>
                                <span className="text-sm font-bold text-gray-900 ml-1">{CATEGORIES_FROM_DB.find((c: any) => c.slug === drilldownCategory)?.name}</span>
                            </div>

                            <div className="space-y-1 ml-2 border-l border-gray-100 pl-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newF = { ...filters, category: drilldownCategory, subCategory: '' };
                                        setFilters(newF);
                                        updateParams(newF);
                                    }}
                                    className={`w-full text-left p-2.5 rounded-sm text-sm transition ${!filters.subCategory ? 'text-[#1A3620] font-bold' : 'text-gray-600 hover:text-black hover:bg-gray-50'}`}
                                >
                                    Toutes les sous-catégories
                                </button>
                                {CATEGORIES_FROM_DB.find((c: any) => c.slug === drilldownCategory)?.subCategories.map((sub: any) => (
                                    <button
                                        key={sub.slug}
                                        type="button"
                                        onClick={() => {
                                            const newF = { ...filters, category: drilldownCategory, subCategory: sub.slug };
                                            setFilters(newF);
                                            updateParams(newF);
                                        }}
                                        className={`w-full text-left p-2.5 rounded-sm text-sm transition ${filters.subCategory === sub.slug ? 'text-[#1A3620] font-bold' : 'text-gray-600 hover:text-black hover:bg-gray-50'}`}
                                    >
                                        {sub.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Location Drill-down — Consistent with Category style */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Localisation</label>

                    {!drilldownProvince ? (
                        <button
                            type="button"
                            onClick={() => setDrilldownProvince('DRC_ROOT')}
                            className={`w-full flex items-center justify-between p-3 border border-gray-100 rounded-sm text-sm transition ${filters.province ? 'bg-gray-50 text-black font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400">📍</span>
                                <span>{filters.province || 'Toute la RDC'}</span>
                                {filters.city && <span className="text-gray-400 font-normal">, {filters.city}</span>}
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                    ) : drilldownProvince === 'DRC_ROOT' ? (
                        <div className="space-y-1 animate-in slide-in-from-right duration-200">
                            <button
                                type="button"
                                onClick={() => setDrilldownProvince(null)}
                                className="flex items-center gap-2 text-xs font-bold text-[#214829] mb-2 hover:underline"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                Retour aux filtres
                            </button>
                            <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newF = { ...filters, province: '', city: '' };
                                        setFilters(newF);
                                        updateParams(newF);
                                        setDrilldownProvince(null);
                                    }}
                                    className={`w-full text-left p-2.5 rounded-sm text-sm transition ${!filters.province ? 'bg-[#FFBA34]/10 text-[#1A3620] font-bold' : 'hover:bg-gray-50'}`}
                                >
                                    Toute la RDC
                                </button>
                                {LOCATIONS.map(p => (
                                    <button
                                        key={p.province}
                                        type="button"
                                        onClick={() => setDrilldownProvince(p.province)}
                                        className={`w-full flex items-center justify-between p-2.5 rounded-sm text-sm transition ${filters.province === p.province ? 'text-[#1A3620] font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        <span>{p.province}</span>
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-1 animate-in slide-in-from-right duration-200">
                            <button
                                type="button"
                                onClick={() => setDrilldownProvince('DRC_ROOT')}
                                className="flex items-center gap-2 text-xs font-bold text-[#214829] mb-2 hover:underline"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                Retour aux provinces
                            </button>
                            <div className="p-3 bg-gray-50 rounded-sm mb-2">
                                <span className="text-xs text-gray-500 font-medium">Province : </span>
                                <span className="text-sm font-bold text-gray-900 ml-1">{drilldownProvince}</span>
                            </div>
                            <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide ml-2 border-l border-gray-100 pl-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newF = { ...filters, province: drilldownProvince, city: '' };
                                        setFilters(newF);
                                        updateParams(newF);
                                        setDrilldownProvince(null);
                                    }}
                                    className={`w-full text-left p-2.5 rounded-sm text-sm transition ${filters.province === drilldownProvince && !filters.city ? 'text-[#1A3620] font-bold' : 'text-gray-600 hover:text-black hover:bg-gray-50'}`}
                                >
                                    Toute la province
                                </button>
                                {LOCATIONS.find(l => l.province === drilldownProvince)?.cities.map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => {
                                            const newF = { ...filters, province: drilldownProvince, city: c };
                                            setFilters(newF);
                                            updateParams(newF);
                                            setDrilldownProvince(null);
                                        }}
                                        className={`w-full text-left p-2.5 rounded-sm text-sm transition ${filters.city === c ? 'text-[#1A3620] font-bold' : 'text-gray-600 hover:text-black hover:bg-gray-50'}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Price Range */}
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Prix ($)</label>
                    <div className="flex gap-2 mb-2">
                        <input type="number" name="priceMin" value={filters.priceMin} onChange={handleChange} placeholder="Min" className="w-full border p-2 rounded text-sm" />
                        <input type="number" name="priceMax" value={filters.priceMax} onChange={handleChange} placeholder="Max" className="w-full border p-2 rounded text-sm" />
                    </div>
                    {/* Budget Tranches */}
                    <div className="flex flex-wrap gap-1">
                        {['0-50', '50-100', '100-300', '300-1000', '1000+'].map(range => (
                            <button
                                key={range}
                                type="button"
                                onClick={() => {
                                    const [min, max] = range.split('-');
                                    updateParams({ ...filters, priceMin: min, priceMax: max === '1000+' ? '' : max });
                                }}
                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs rounded-full"
                            >
                                {range === '1000+' ? '$1000+' : `$${range}`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dynamic Attributes Filters */}
                {filters.category && CATEGORIES_FROM_DB.find((c: any) => c.slug === filters.category)?.attributes?.map((attr: any) => (
                    <div key={attr.id}>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">{attr.label}</label>
                        {attr.type === 'select' ? (
                            <select
                                name={`attr_${attr.id}`}
                                value={searchParams.get(`attr_${attr.id}`) || ''}
                                onChange={(e) => {
                                    const newParams = new URLSearchParams(searchParams);
                                    if (e.target.value) newParams.set(`attr_${attr.id}`, e.target.value);
                                    else newParams.delete(`attr_${attr.id}`);
                                    setSearchParams(newParams);
                                }}
                                className="w-full border p-2 rounded text-sm"
                            >
                                <option value="">Tous</option>
                                {attr.options?.map((opt: string) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        ) : attr.type === 'boolean' ? (
                            <select
                                name={`attr_${attr.id}`}
                                value={searchParams.get(`attr_${attr.id}`) || ''}
                                onChange={(e) => {
                                    const newParams = new URLSearchParams(searchParams);
                                    if (e.target.value) newParams.set(`attr_${attr.id}`, e.target.value);
                                    else newParams.delete(`attr_${attr.id}`);
                                    setSearchParams(newParams);
                                }}
                                className="w-full border p-2 rounded text-sm"
                            >
                                <option value="">Tous</option>
                                <option value="true">Oui</option>
                                <option value="false">Non</option>
                            </select>
                        ) : (
                            <input
                                type={attr.type === 'number' ? 'number' : 'text'}
                                name={`attr_${attr.id}`}
                                value={searchParams.get(`attr_${attr.id}`) || ''}
                                onChange={(e) => {
                                    // For text/number inputs, maybe wait for Apply button or debounce?
                                    // For now let's bind it to searchParams only on Apply? 
                                    // Actually strict requirements say "select/boolean/number (pas de texte libre pour filtrer)"
                                    // But some attributes are text (Brand). Let's support them as inputs for now.
                                    // Better UX: Update local state via updateParams on change? 
                                    // The current pattern uses handleChange for local state and updateParams for URL.
                                    // But here we are reading directly from searchParams. Let's fix this consistency in next step if needed.
                                    // For MVP speed: direct URL update on change for selects, what about text?
                                    const newParams = new URLSearchParams(searchParams);
                                    if (e.target.value) newParams.set(`attr_${attr.id}`, e.target.value);
                                    else newParams.delete(`attr_${attr.id}`);
                                    setSearchParams(newParams);
                                }}
                                className="w-full border p-2 rounded text-sm"
                            />
                        )}
                    </div>
                ))}

            </form>
        </div>
    );
};

export default FilterSidebar;
