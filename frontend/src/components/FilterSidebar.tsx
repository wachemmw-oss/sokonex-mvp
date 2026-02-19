
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES, PROVINCES } from '../data/categories';

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
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Filtres</h3>
                <button onClick={handleClear} className="text-xs text-blue-600 hover:underline">Tout effacer</button>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
                {/* Search */}
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Recherche</label>
                    <input name="q" value={filters.q} onChange={handleChange} placeholder="Mots-clés..." className="w-full border p-2 rounded text-sm" />
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
                    <select name="province" value={filters.province} onChange={(e) => { handleChange(e); updateParams({ ...filters, province: e.target.value }) }} className="w-full border p-2 rounded text-sm">
                        <option value="">Toute la RDC</option>
                        {PROVINCES.map(p => (
                            <option key={p.id} value={p.id}>{p.label}</option>
                        ))}
                    </select>
                </div>

                {/* Price Range */}
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Prix ($)</label>
                    <div className="flex gap-2">
                        <input type="number" name="priceMin" value={filters.priceMin} onChange={handleChange} placeholder="Min" className="w-full border p-2 rounded text-sm" />
                        <input type="number" name="priceMax" value={filters.priceMax} onChange={handleChange} placeholder="Max" className="w-full border p-2 rounded text-sm" />
                    </div>
                </div>

                {/* Apply Button */}
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded text-sm font-semibold hover:bg-blue-700 transition">
                    Appliquer
                </button>
            </form>
        </div>
    );
};

export default FilterSidebar;
