import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAd, updateAd, getAdById } from '../services/ads';
import { uploadImage } from '../services/upload';
import { useAuth } from '../context/AuthContext';

import { CATEGORIES } from '../data/categories';
import { LOCATIONS } from '../data/locations';

const PostAd = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams(); // For edit mode
    const queryClient = useQueryClient();

    // Fetch ad if in edit mode
    const { data: adData, isLoading: isLoadingAd } = useQuery({
        queryKey: ['adToEdit', id],
        queryFn: () => getAdById(id as string),
        enabled: !!id
    });

    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: '', description: '',
        category: CATEGORIES[0].id,
        subCategory: CATEGORIES[0].subCategories[0].id,
        province: LOCATIONS[0].province, city: LOCATIONS[0].cities[0], priceType: 'fixed', price: '',
        delivery: { available: false, included: false, national: false },
        condition: 'used'
    });
    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<{ url: string, publicId: string }[]>([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [attributes, setAttributes] = useState<Record<string, any>>({});

    // Populate form data when editing
    useEffect(() => {
        if (isEditMode && adData?.success) {
            const ad = adData.data;
            setFormData({
                title: ad.title || '',
                description: ad.description || '',
                category: ad.category || CATEGORIES[0].id,
                subCategory: ad.subCategory || CATEGORIES[0].subCategories[0].id,
                province: ad.province || LOCATIONS[0].province,
                city: ad.city || LOCATIONS[0].cities[0],
                priceType: ad.priceType || 'fixed',
                price: ad.price?.toString() || '',
                delivery: ad.delivery || { available: false, included: false, national: false },
                condition: ad.condition || 'used'
            });
            setAttributes(ad.attributes || {});
            setExistingImages(ad.images || []);
        }
    }, [isEditMode, adData]);

    const mutation = useMutation({
        mutationFn: isEditMode ? (data: any) => updateAd(id as string, data) : createAd,
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ['myAds'] });
            queryClient.invalidateQueries({ queryKey: ['ad', id] });
            navigate(isEditMode ? '/account/my-ads' : `/ad/${data.data._id}`);
        },
        onError: (err: any) => {
            setError(err.response?.data?.error?.message || (isEditMode ? 'Échec de la modification' : 'Échec de la création'));
            setUploading(false);
        }
    });

    // Derived state for current category attributes
    const currentCategory = CATEGORIES.find(c => c.id === formData.category);
    const currentSubCategories = currentCategory?.subCategories || [];
    const currentAttributes = currentCategory?.attributes || [];

    const handleAttributeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setAttributes(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.isPhoneVerified) {
            setError("Veuillez vérifier votre téléphone dans les paramètres (Mon Compte) avant de publier.");
            return;
        }
        setError('');
        setUploading(true);

        try {
            const uploadedImages = [];
            for (const file of images) {
                const result = await uploadImage(file);
                uploadedImages.push(result);
            }

            mutation.mutate({
                ...formData,
                attributes: attributes, // Include dynamic attributes
                images: [...existingImages, ...uploadedImages], // Combine old and new images
                price: formData.price ? Number(formData.price) : undefined
            });
        } catch (err: any) {
            console.error("Upload error details:", err);
            const details = err.response?.data?.error?.message || err.message || 'Inconnu';
            setError(`Erreur lors de l'upload des images: ${details}`);
            setUploading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            // Reset subcategory and attributes if category changes
            if (name === 'category') {
                const newCat = CATEGORIES.find(c => c.id === value);
                if (newCat && newCat.subCategories.length > 0) {
                    newData.subCategory = newCat.subCategories[0].id;
                }
                setAttributes({}); // Reset attributes
            }
            return newData;
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    if (isEditMode && isLoadingAd) {
        return <div className="p-8 text-center text-gray-500">Chargement de l'annonce...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6 lg:p-10 bg-white border border-gray-100 shadow-sm rounded-sm mt-8 font-sans pb-24">
            <h1 className="text-2xl font-extrabold mb-8 text-black tracking-tight uppercase">
                {isEditMode ? 'Modifier l\'annonce' : 'Publier une annonce'}
            </h1>
            {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-sm mb-6 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Title */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Titre de l'annonce</label>
                    <input name="title" required value={formData.title} onChange={handleChange} className="w-full border border-gray-200 p-3 rounded-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all" placeholder="Ex: iPhone 13 Pro Max 256GB" />
                </div>

                {/* Category & Subcategory */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Catégorie</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-200 p-3 rounded-sm focus:ring-1 focus:ring-black focus:border-black outline-none bg-white">
                            {CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Sous-catégorie</label>
                        <select name="subCategory" value={formData.subCategory} onChange={handleChange} className="w-full border border-gray-200 p-3 rounded-sm focus:ring-1 focus:ring-black focus:border-black outline-none bg-white">
                            {currentSubCategories.map(sub => (
                                <option key={sub.id} value={sub.id}>{sub.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Province</label>
                        <select name="province" value={formData.province} onChange={handleChange} className="w-full border border-gray-200 p-3 rounded-sm focus:ring-1 focus:ring-black focus:border-black outline-none bg-white">
                            {LOCATIONS.map(p => (
                                <option key={p.province} value={p.province}>{p.province}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Ville / Commune</label>
                        <select name="city" value={formData.city} onChange={handleChange} className="w-full border border-gray-200 p-3 rounded-sm focus:ring-1 focus:ring-black focus:border-black outline-none bg-white">
                            {LOCATIONS.find(l => l.province === formData.province)?.cities.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Dynamic Attributes */}
                {currentAttributes.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-700 mb-3 block">Détails spécifiques</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentAttributes.map(attr => (
                                <div key={attr.id}>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">{attr.label}</label>
                                    {attr.type === 'select' ? (
                                        <select name={attr.id} value={attributes[attr.id] || ''} onChange={handleAttributeChange} className="w-full border border-gray-200 p-2.5 rounded-sm text-sm bg-white focus:ring-1 focus:ring-black outline-none focus:border-black">
                                            <option value="">Sélectionner...</option>
                                            {attr.options?.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    ) : attr.type === 'boolean' ? (
                                        <select name={attr.id} value={attributes[attr.id] || ''} onChange={handleAttributeChange} className="w-full border border-gray-200 p-2.5 rounded-sm text-sm bg-white focus:ring-1 focus:ring-black outline-none focus:border-black">
                                            <option value="">Sélectionner...</option>
                                            <option value="true">Oui</option>
                                            <option value="false">Non</option>
                                        </select>
                                    ) : (
                                        <input
                                            type={attr.type === 'number' ? 'number' : 'text'}
                                            name={attr.id}
                                            value={attributes[attr.id] || ''}
                                            onChange={handleAttributeChange}
                                            className="w-full border border-gray-200 p-2.5 rounded-sm text-sm bg-white focus:ring-1 focus:ring-black outline-none focus:border-black"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Price & Condition */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Type de prix</label>
                        <select name="priceType" value={formData.priceType} onChange={handleChange} className="w-full border border-gray-200 p-3 rounded-sm focus:ring-1 focus:ring-black focus:border-black outline-none bg-white">
                            <option value="fixed">Fixe</option>
                            <option value="negotiable">Négociable</option>
                            <option value="on_request">Sur demande</option>
                            <option value="free">Gratuit</option>
                        </select>
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Prix ($)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} disabled={formData.priceType === 'on_request' || formData.priceType === 'free'} className="w-full border border-gray-200 p-3 rounded-sm focus:ring-1 focus:ring-black focus:border-black outline-none disabled:bg-gray-100" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">État</label>
                        <select name="condition" value={formData.condition} onChange={handleChange} className="w-full border border-gray-200 p-3 rounded-sm focus:ring-1 focus:ring-black focus:border-black outline-none bg-white">
                            <option value="new">Neuf</option>
                            <option value="used">Occasion</option>
                            <option value="refurbished">Reconditionné</option>
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Description détaillée</label>
                    <textarea name="description" required value={formData.description} onChange={handleChange} className="w-full border border-gray-200 p-3 rounded-sm h-40 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all" placeholder="Décrivez votre article en détail..." />
                </div>

                {/* Photos */}
                <div className="border-2 border-dashed border-gray-300 rounded-sm p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="space-y-2">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="text-gray-600 font-medium">
                            <span className="text-black underline">Cliquez pour ajouter des photos</span> ou glissez-déposez
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP jusqu'à 5MB</p>
                    </div>
                    {/* Display existing images */}
                    {existingImages.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-4 justify-center">
                            {existingImages.map((img, idx) => (
                                <div key={idx} className="relative w-16 h-16 bg-white border border-gray-200 rounded-sm overflow-hidden">
                                    <img src={img.url} alt={`Existing ${idx}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); removeExistingImage(idx); }}
                                        className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white w-6 h-6 flex flex-col items-center justify-center text-sm font-bold shadow-sm"
                                        title="Supprimer cette photo"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Display new files */}
                    {images.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                            {images.map((img, idx) => (
                                <div key={idx} className="flex items-center gap-1 bg-black text-white text-xs pl-2 pr-1 py-1 rounded-sm">
                                    <span className="max-w-[100px] truncate">{img.name}</span>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); removeNewImage(idx); }}
                                        className="w-4 h-4 rounded-full hover:bg-white hover:text-black flex items-center justify-center font-bold"
                                    >×</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="pt-4">
                    <button
                        disabled={uploading || mutation.isPending}
                        type="submit"
                        className="w-full py-4 rounded-sm font-bold tracking-wide transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: '#FFBA34', color: '#1A3620' }}
                    >
                        {uploading ? 'Upload des images...' : mutation.isPending ? 'Enregistrement en cours...' : (isEditMode ? 'Enregistrer les modifications' : 'Publier mon annonce')}
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-3">En publiant, vous acceptez nos conditions d'utilisation.</p>
                </div>
            </form>
        </div>
    );
};

export default PostAd;
