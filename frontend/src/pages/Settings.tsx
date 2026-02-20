import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile as updateProfileService, verifyPhone as verifyPhoneService } from '../services/auth';

const Settings = () => {
    const { user, updateProfile: updateAuthProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        whatsapp: user?.whatsapp || '',
        showPhone: user?.settings?.showPhone ?? true,
        showWhatsApp: user?.settings?.showWhatsApp ?? user?.showWhatsApp ?? true
    });
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Populate form with user data
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                whatsapp: user.whatsapp || '',
                showPhone: user.showPhone ?? true,
                showWhatsApp: user.whatsapp ? true : false
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
            const res = await updateAuthProfile(formData);
            if (res.success) {
                setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
                setTimeout(() => window.location.reload(), 1000);
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

    const handleVerifyPhone = async () => {
        setVerifying(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await verifyPhoneService();
            if (res.success) {
                setMessage({ type: 'success', text: res.data.message || 'Téléphone vérifié avec succès !' });
                setTimeout(() => window.location.reload(), 1500);
            }
        } catch (error: any) {
            console.error(error);
            const code = error.response?.data?.error?.code;
            if (code === 'OTP_REQUIRED') {
                setMessage({ type: 'info', text: 'Un code OTP a été envoyé (Simulation: Mode Test activé côté serveur pour MVP)' });
            } else {
                setMessage({ type: 'error', text: error.response?.data?.error?.message || 'Erreur de vérification' });
            }
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white shadow-sm border border-gray-100 rounded-sm p-8 mt-8 font-sans">
            <h2 className="text-2xl font-extrabold mb-8 text-black tracking-tight uppercase">Paramètres du profil</h2>

            {message.text && (
                <div className={`p-4 rounded-sm mb-6 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-gray-50 text-gray-700 border border-gray-200'
                    }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email (Read-only) */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Email (non modifiable)</label>
                    <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full border border-gray-200 rounded-sm px-3 py-2 bg-gray-50 text-gray-400 focus:outline-none"
                    />
                </div>

                {/* Name */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Nom complet</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-sm px-3 py-2 focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Numéro de téléphone</label>
                    <div className="flex gap-2">
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-sm px-3 py-2 focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors"
                            placeholder="Ex: +243 000 000 000"
                        />
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-gray-400">Nécessaire pour être contacté.</p>
                        {!user?.isPhoneVerified && formData.phone && (
                            <button
                                type="button"
                                onClick={handleVerifyPhone}
                                disabled={verifying}
                                className="text-xs font-bold uppercase tracking-wide bg-black text-white px-3 py-1.5 rounded-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                {verifying ? 'Vérification...' : 'Vérifier maintenant'}
                            </button>
                        )}
                        {user?.isPhoneVerified && (
                            <span className="text-xs text-black font-bold border border-black px-2 py-1 rounded-sm uppercase tracking-wide">Vérifié</span>
                        )}
                    </div>
                </div>

                {/* WhatsApp */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Numéro WhatsApp (Optionnel)</label>
                    <input
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-sm px-3 py-2 focus:ring-1 focus:ring-black focus:border-black outline-none transition-colors"
                        placeholder="Ex: +243 000 000 000"
                    />
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-center mt-6">
                    <input
                        type="checkbox"
                        name="showPhone"
                        id="showPhone"
                        checked={formData.showPhone}
                        onChange={handleChange}
                        className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded-sm transition-colors cursor-pointer accent-black"
                    />
                    <label htmlFor="showPhone" className="ml-2 block text-sm font-medium text-gray-700 cursor-pointer">
                        Afficher mon numéro sur mes annonces
                    </label>
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 px-4 rounded-sm font-bold tracking-wide hover:bg-gray-800 focus:outline-none transition-colors active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
