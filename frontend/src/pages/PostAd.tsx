import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query'; // Import Query client hooks
import { createAd } from '../services/ads';
import { uploadImage } from '../services/upload';
import { useAuth } from '../context/AuthContext';

import { CATEGORIES, PROVINCES } from '../data/categories';

const PostAd = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '', description: '',
        category: CATEGORIES[0].id,
        subCategory: CATEGORIES[0].subCategories[0].id,
        province: 'kinshasa', city: 'kinshasa', priceType: 'fixed', price: '',
        delivery: { available: false, included: false, national: false },
        condition: 'used'
    });
    const [images, setImages] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const mutation = useMutation({
        mutationFn: createAd,
        onSuccess: (data: any) => {
            navigate(`/ad/${data.data._id}`);
        },
        onError: (err: any) => {
            setError(err.response?.data?.error?.message || 'Failed to create ad');
            setUploading(false);
        }
    });

    // Helper to get subcategories based on selected category
    const currentSubCategories = CATEGORIES.find(c => c.id === formData.category)?.subCategories || [];

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
                images: uploadedImages,
                price: formData.price ? Number(formData.price) : undefined
            });
        } catch (err: any) {
            console.error("Upload error details:", err);
            // Check for specific axios error response
            const details = err.response?.data?.error?.message || err.message || 'Inconnu';
            setError(`Erreur lors de l'upload des images: ${details}`);
            setUploading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            // Reset subcategory if category changes
            if (name === 'category') {
                const newCat = CATEGORIES.find(c => c.id === value);
                if (newCat && newCat.subCategories.length > 0) {
                    newData.subCategory = newCat.subCategories[0].id;
                }
            }
            return newData;
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Publier une annonce</h1>
            {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Titre de l'annonce</label>
                    <input name="title" required value={formData.title} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder="Ex: iPhone 13 Pro Max 256GB" />
                </div>

                {/* Category & Subcategory */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Catégorie</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500">
                            {CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Sous-catégorie</label>
                        <select name="subCategory" value={formData.subCategory} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500">
                            {currentSubCategories.map(sub => (
                                <option key={sub.id} value={sub.id}>{sub.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Province</label>
                        <select name="province" value={formData.province} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500">
                            {PROVINCES.map(p => (
                                <option key={p.id} value={p.id}>{p.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Ville / Commune</label>
                        <input name="city" required value={formData.city} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Ex: Gombe, Limete..." />
                    </div>
                </div>

                {/* Price & Condition */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Type de prix</label>
                        <select name="priceType" value={formData.priceType} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option value="fixed">Fixe</option>
                            <option value="negotiable">Négociable</option>
                            <option value="on_request">Sur demande</option>
                            <option value="free">Gratuit</option>
                        </select>
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Prix ($)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} disabled={formData.priceType === 'on_request' || formData.priceType === 'free'} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">État</label>
                        <select name="condition" value={formData.condition} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option value="new">Neuf</option>
                            <option value="used">Occasion</option>
                            <option value="refurbished">Reconditionné</option>
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description détaillée</label>
                    <textarea name="description" required value={formData.description} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg h-40 focus:ring-2 focus:ring-blue-500" placeholder="Décrivez votre article en détail..." />
                </div>

                {/* Photos */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="space-y-2">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="text-gray-600">
                            <span className="font-medium text-blue-600">Cliquez pour ajouter des photos</span> ou glissez-déposez
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP jusqu'à 5MB (Max 8 photos)</p>
                    </div>
                    {images.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                            {images.map((img, idx) => (
                                <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{img.name}</span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="pt-4">
                    <button disabled={uploading || mutation.isPending} type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg">
                        {uploading ? 'Upload des images...' : mutation.isPending ? 'Publication en cours...' : 'Publier mon annonce'}
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-3">En publiant, vous acceptez nos conditions d'utilisation.</p>
                </div>
            </form>
        </div>
    );
};

export default PostAd;
