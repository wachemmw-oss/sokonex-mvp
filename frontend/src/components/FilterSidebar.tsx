
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES } from '../data/categories';
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
    };

    const currentSubCategories = CATEGORIES.find(c => c.id === filters.category)?.subCategories || [];

    return (
        <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm">Filtres</h3>
                <button onClick={handleClear} className="text-xs text-black underline hover:text-gray-600 transition">Tout effacer</button>
            </div>

            <form onSubmit={handleApply} className="space-y-5">
                {/* Search */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Recherche</label>
                    <input name="q" value={filters.q} onChange={handleChange} placeholder="Mots-clés..." className="w-full border border-gray-200 bg-gray-50 focus:bg-white p-2 rounded-sm text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors" />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Catégorie</label>
                    <select name="category" value={filters.category} onChange={(e) => { handleChange(e); updateParams({ ...filters, category: e.target.value, subCategory: '' }) }} className="w-full border p-2 rounded text-sm">
                        <option value="">Toutes les catégories</option>
                        {CATEGORIES.map(c => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                    </select>
                </div>

                {/* SubCategory - Only show if category selected */}
                {filters.category && currentSubCategories.length > 0 && (
                    <div className="pl-2 border-l-2 border-gray-100">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Sous-catégorie</label>
                        <select name="subCategory" value={filters.subCategory} onChange={(e) => { handleChange(e); updateParams({ ...filters, subCategory: e.target.value }) }} className="w-full border p-2 rounded text-sm">
                            <option value="">Toutes</option>
                            {currentSubCategories.map(sub => (
                                <option key={sub.id} value={sub.id}>{sub.label}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Location */}
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Province</label>
                    <select name="province" value={filters.province} onChange={(e) => { handleChange(e); updateParams({ ...filters, province: e.target.value, city: '' }) }} className="w-full border p-2 rounded text-sm">
                        <option value="">Toute la RDC</option>
                        {LOCATIONS.map(p => (
                            <option key={p.province} value={p.province}>{p.province}</option>
                        ))}
                    </select>
                </div>

                {/* City - Only show if province selected */}
                {filters.province && (
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Ville</label>
                        <select name="city" value={filters.city} onChange={(e) => { handleChange(e); updateParams({ ...filters, city: e.target.value }) }} className="w-full border p-2 rounded text-sm">
                            <option value="">Toutes</option>
                            {LOCATIONS.find(l => l.province === filters.province)?.cities.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                )}

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
                {filters.category && CATEGORIES.find(c => c.id === filters.category)?.attributes?.map(attr => (
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
                                {attr.options?.map(opt => (
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

                {/* Apply Button */}
                <button type="submit" className="w-full bg-black text-white py-2.5 rounded-sm text-sm font-semibold hover:bg-gray-800 transition active:scale-95">
                    Appliquer
                </button>
            </form>
        </div>
    );
};

export default FilterSidebar;
