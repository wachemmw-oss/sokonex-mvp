import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/category';
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp, Save, X, Settings2, Grid, Loader2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const AdminCategories: React.FC = () => {
    const queryClient = useQueryClient();
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [newCat, setNewCat] = useState({ name: '', slug: '', icon: 'Grid' });

    const { data, isLoading } = useQuery({
        queryKey: ['admin-categories'],
        queryFn: getCategories,
    });

    const createMutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
            setNewCat({ name: '', slug: '', icon: 'Grid' });
            setIsAddFormOpen(false);
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
        }
    });

    // Auto-slug generation
    useEffect(() => {
        if (!isAddFormOpen) return;
        const slug = newCat.name
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
        setNewCat(prev => ({ ...prev, slug }));
    }, [newCat.name]);

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#FFBA34]" />
            <p className="font-bold uppercase tracking-widest text-xs">Chargement de la structure...</p>
        </div>
    );

    const categories = data?.data || [];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight underline decoration-[#FFBA34] decoration-4 underline-offset-4 uppercase">CATÉGORIES</h2>
                    <p className="text-sm text-gray-500 mt-1">Structurez votre marketplace dynamiquement.</p>
                </div>
                {!isAddFormOpen && (
                    <button
                        onClick={() => setIsAddFormOpen(true)}
                        className="flex items-center gap-2 bg-[#1A3620] text-white px-6 py-2.5 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg hover:shadow-[#1A3620]/20"
                    >
                        <Plus size={16} /> Nouvelle Catégorie
                    </button>
                )}
            </div>

            {/* Add New Category Form */}
            {isAddFormOpen && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-bold uppercase text-[#1A3620] flex items-center gap-2">
                            <Grid size={16} /> Créer une catégorie principale
                        </h3>
                        <button onClick={() => setIsAddFormOpen(false)} className="text-gray-400 hover:text-black">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nom Public</label>
                            <input
                                type="text"
                                placeholder="ex: Immobilier"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-[#FFBA34] focus:bg-white outline-none transition-all"
                                value={newCat.name}
                                onChange={e => setNewCat({ ...newCat, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Identifiant URL (Slug)</label>
                            <input
                                type="text"
                                placeholder="ex: immobilier"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-[#FFBA34] focus:bg-white outline-none transition-all font-mono"
                                value={newCat.slug}
                                onChange={e => setNewCat({ ...newCat, slug: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Icône (Lucide name)</label>
                            <input
                                type="text"
                                placeholder="ex: Home, Car, Smartphone..."
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-[#FFBA34] focus:bg-white outline-none transition-all"
                                value={newCat.icon}
                                onChange={e => setNewCat({ ...newCat, icon: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end mt-8 gap-4">
                        <button
                            onClick={() => setIsAddFormOpen(false)}
                            className="text-gray-400 font-bold uppercase text-[10px] tracking-widest hover:text-black transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={() => createMutation.mutate(newCat)}
                            className="bg-[#FFBA34] text-[#1A3620] font-black px-8 py-3 rounded-sm hover:brightness-110 transition-all uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg"
                            disabled={!newCat.name || !newCat.slug || createMutation.isPending}
                        >
                            {createMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            Confirmer la création
                        </button>
                    </div>
                </div>
            )}

            {/* Categories List */}
            <div className="space-y-4">
                {categories.map((cat: any) => (
                    <CategoryItem
                        key={cat._id}
                        category={cat}
                        onUpdate={(data: any) => updateMutation.mutate({ id: cat._id, data })}
                        onDelete={() => { if (window.confirm('Supprimer cette catégorie définitivement ?')) deleteMutation.mutate(cat._id) }}
                        isUpdating={updateMutation.isPending}
                    />
                ))}
            </div>
        </div>
    );
};

const CategoryItem = ({ category, onUpdate, onDelete, isUpdating }: any) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [catData, setCatData] = useState(category);

    const IconComponent = (LucideIcons as any)[category.icon] || LucideIcons.Grid;

    const addSub = () => {
        const updated = { ...catData, subCategories: [...catData.subCategories, { name: '', slug: '' }] };
        setCatData(updated);
    };

    const removeSub = (idx: number) => {
        const subs = [...catData.subCategories];
        subs.splice(idx, 1);
        setCatData({ ...catData, subCategories: subs });
    };

    const addAttr = () => {
        const updated = { ...catData, attributes: [...catData.attributes, { id: '', label: '', type: 'text', options: [] }] };
        setCatData(updated);
    };

    const removeAttr = (idx: number) => {
        const attrs = [...catData.attributes];
        attrs.splice(idx, 1);
        setCatData({ ...catData, attributes: attrs });
    };

    return (
        <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 ${isExpanded ? 'border-[#FFBA34] shadow-lg ring-1 ring-[#FFBA34]/10' : 'border-gray-100'}`}>
            <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-all duration-500 ${isExpanded ? 'bg-[#FFBA34] text-[#1A3620] rotate-12' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                        <IconComponent size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-[#1A3620] uppercase tracking-tight text-base">{category.name}</h4>
                            <span className="text-[10px] font-mono bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded border border-gray-100">{category.slug}</span>
                        </div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                            {category.subCategories.length} sous-catégories • {category.attributes.length} filtres
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                    </button>
                    <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown size={20} className="text-gray-400" />
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-gray-50 space-y-8 animate-in slide-in-from-top-2 duration-300">
                    <div className="h-px bg-gradient-to-r from-transparent via-[#FFBA34]/20 to-transparent mb-6" />

                    {/* Subcategories */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h5 className="text-[10px] font-black uppercase text-[#1A3620] tracking-[0.2em]">STRUCTURE (SOUS-CATÉGORIES)</h5>
                            <button onClick={addSub} className="bg-gray-50 text-[#1A3620] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-gray-200 flex items-center gap-1.5 hover:bg-[#FFBA34] hover:border-transparent transition-all">
                                <Plus size={10} /> Ajouter
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {catData.subCategories.map((sub: any, i: number) => (
                                <div key={i} className="flex flex-col gap-1 bg-gray-50/50 p-3 rounded-xl border border-gray-100 hover:bg-white hover:shadow-md transition-all group/sub">
                                    <div className="flex items-center justify-between">
                                        <input
                                            type="text"
                                            value={sub.name}
                                            placeholder="Nom affiché"
                                            className="w-full bg-transparent border-none text-xs font-bold text-gray-900 focus:ring-0 p-0 placeholder:text-gray-300"
                                            onChange={e => {
                                                const subs = [...catData.subCategories];
                                                subs[i].name = e.target.value;
                                                // auto-slug for sub
                                                subs[i].slug = e.target.value.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
                                                setCatData({ ...catData, subCategories: subs });
                                            }}
                                        />
                                        <button onClick={() => removeSub(i)} className="text-gray-300 hover:text-red-500 p-1 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                                            <X size={12} />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={sub.slug}
                                        placeholder="identifiant-du-slug"
                                        className="w-full bg-transparent border-none text-[10px] text-gray-400 focus:ring-0 p-0 font-mono tracking-tighter"
                                        onChange={e => {
                                            const subs = [...catData.subCategories];
                                            subs[i].slug = e.target.value;
                                            setCatData({ ...catData, subCategories: subs });
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Attributes */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h5 className="text-[10px] font-black uppercase text-[#1A3620] tracking-[0.2em]">FILTRES (ATTRIBUTS SPÉCIFIQUES)</h5>
                            <button onClick={addAttr} className="bg-gray-50 text-[#1A3620] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-gray-200 flex items-center gap-1.5 hover:bg-[#FFBA34] hover:border-transparent transition-all">
                                <Plus size={10} /> Ajouter un filtre
                            </button>
                        </div>
                        <div className="space-y-3">
                            {catData.attributes.map((attr: any, i: number) => (
                                <div key={i} className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative group/attr">
                                    <div className="flex-1 space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Libellé</label>
                                        <input
                                            type="text"
                                            placeholder="Kilométrage, Marque, etc."
                                            className="w-full bg-gray-50 border-none rounded-lg px-3 py-2 text-xs font-bold text-gray-900 focus:ring-1 focus:ring-[#FFBA34]"
                                            value={attr.label}
                                            onChange={e => {
                                                const attrs = [...catData.attributes];
                                                attrs[i].label = e.target.value;
                                                attrs[i].id = e.target.value.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '_');
                                                setCatData({ ...catData, attributes: attrs });
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Clé JSON (Unique)</label>
                                        <input
                                            type="text"
                                            placeholder="mileage, fuel_type"
                                            className="w-full bg-gray-50 border-none rounded-lg px-3 py-2 text-xs font-mono text-gray-400"
                                            value={attr.id}
                                            onChange={e => {
                                                const attrs = [...catData.attributes];
                                                attrs[i].id = e.target.value;
                                                setCatData({ ...catData, attributes: attrs });
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Type d'entrée</label>
                                        <select
                                            className="w-full bg-gray-50 border-none rounded-lg px-3 py-2 text-xs font-bold text-[#1A3620] outline-none"
                                            value={attr.type}
                                            onChange={e => {
                                                const attrs = [...catData.attributes];
                                                attrs[i].type = e.target.value;
                                                setCatData({ ...catData, attributes: attrs });
                                            }}
                                        >
                                            <option value="text">Texte libre</option>
                                            <option value="number">Nombre uniquement</option>
                                            <option value="select">Liste de choix</option>
                                            <option value="boolean">Case à cocher</option>
                                        </select>
                                    </div>
                                    {attr.type === 'select' && (
                                        <div className="flex-[2] space-y-1 animate-in zoom-in-95 duration-200">
                                            <label className="text-[9px] font-black text-[#FFBA34] uppercase tracking-widest pl-1">Options (virgules)</label>
                                            <input
                                                type="text"
                                                placeholder="Essence, Diesel, Hybride, Electrique"
                                                className="w-full bg-[#FFF9EB] border border-[#FFBA34]/20 rounded-lg px-3 py-2 text-[11px] text-[#1A3620]"
                                                value={attr.options?.join(', ') || ''}
                                                onChange={e => {
                                                    const attrs = [...catData.attributes];
                                                    attrs[i].options = e.target.value.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '');
                                                    setCatData({ ...catData, attributes: attrs });
                                                }}
                                            />
                                        </div>
                                    )}
                                    <button
                                        onClick={() => removeAttr(i)}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-white shadow-md rounded-full flex items-center justify-center text-red-500 opacity-0 group-hover/attr:opacity-100 transition-opacity border border-gray-50"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                        <p className="text-[10px] text-gray-300 font-medium italic">Dernière modification : {new Date().toLocaleDateString()}</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => { setCatData(category); setIsExpanded(false); }}
                                className="px-6 py-2.5 rounded-sm text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-black transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => onUpdate(catData)}
                                className="px-10 py-2.5 rounded-sm bg-[#1A3620] text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center gap-2"
                                disabled={isUpdating}
                            >
                                {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                Déployer la structure
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
