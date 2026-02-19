
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/auth'; // Ensure this exists in services/auth.ts
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const { user, login } = useAuth(); // login is used to update context if needed, or we might need a setUser method
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        whatsapp: '',
        showPhone: true
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    // Populate form with user data
    useEffect(() => {
        if (user) {
            setFormData({
                name: (user as any).name || '', // Type casting if name missing in interface
                phone: user.phone || '',
                whatsapp: (user as any).whatsapp || '',
                showPhone: (user as any).showPhone !== false
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await updateProfile(formData);
            if (res.success) {
                setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
                // We should ideally update the auth context user here. 
                // For MVP, reloading page or using a context method is fine.
                // Assuming updateProfile returns updated user data.
                window.location.reload(); // Simple reload to refresh context
            }
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error?.message || 'Erreur lors de la mise à jour'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Paramètres du profil</h2>

            {message.text && (
                <div className={`p-4 rounded-md mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email (Read-only) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email (non modifiable)</label>
                    <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-500"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: +243 000 000 000"
                    />
                    <p className="text-xs text-gray-500 mt-1">Nécessaire pour être contacté par les acheteurs.</p>
                </div>

                {/* WhatsApp */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro WhatsApp (Optionnel)</label>
                    <input
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: +243 000 000 000"
                    />
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="showPhone"
                        id="showPhone"
                        checked={formData.showPhone}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="showPhone" className="ml-2 block text-sm text-gray-900">
                        Afficher mon numéro sur mes annonces
                    </label>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
