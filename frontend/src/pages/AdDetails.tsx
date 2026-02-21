import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getAdById, getSimilarAds, reportAd } from '../services/ads';
import { Heart, Share2, ChevronLeft, ChevronRight, MessageCircle, Phone, Flag, ShieldCheck } from 'lucide-react';
import AdCard from '../components/AdCard';

const REPORT_REASONS = [
    { value: 'scam', label: '🚨 Arnaque ou fraude' },
    { value: 'prohibited', label: '🚫 Contenu interdit' },
    { value: 'duplicate', label: '♻️ Annonce en double' },
    { value: 'wrong_category', label: '📂 Mauvaise catégorie' },
    { value: 'other', label: '💬 Autre raison' },
];

const AdDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentImage, setCurrentImage] = useState(0);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportNote, setReportNote] = useState('');
    const [reportSent, setReportSent] = useState(false);
    const galleryRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, error } = useQuery({
        queryKey: ['ad', id],
        queryFn: () => getAdById(id as string),
        enabled: !!id,
        staleTime: 1000 * 60,
    });

    const { data: similarData } = useQuery({
        queryKey: ['similar', id],
        queryFn: () => getSimilarAds(id as string),
        enabled: !!id,
        staleTime: 1000 * 60 * 2,
    });

    const reportMutation = useMutation({
        mutationFn: reportAd,
        onSuccess: () => {
            setReportSent(true);
        }
    });

    const handleReport = () => {
        if (!reportReason) return;
        reportMutation.mutate({ adId: id as string, reason: reportReason, note: reportNote });
    };

    // Touch swipe handling for mobile gallery
    const touchStartX = useRef(0);
    const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchEnd = (e: React.TouchEvent, maxImages: number) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
            if (diff > 0) setCurrentImage(prev => Math.min(prev + 1, maxImages - 1));
            else setCurrentImage(prev => Math.max(prev - 1, 0));
        }
    };

    if (isLoading) return <div className="min-h-screen bg-white flex items-center justify-center">Chargement...</div>;
    if (error || !data?.success) return <div className="min-h-screen bg-white flex items-center justify-center text-red-500">Erreur lors du chargement</div>;

    const ad = data.data;
    const images = ad.images?.length > 0 ? ad.images : [{ url: 'https://via.placeholder.com/600x800?text=Aucune+Image' }];
    // FIX: backend now returns data.items (was returning data directly before)
    const similarAds = similarData?.data?.items ?? [];

    return (
        <div className="bg-white min-h-screen pb-24 font-sans">
            {/* Native-like Mobile Nav */}
            <div className="md:hidden fixed top-0 w-full z-50 flex justify-between items-center p-4">
                <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm">
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <div className="flex gap-2">
                    <button className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm">
                        <Share2 className="w-5 h-5 text-gray-800" />
                    </button>
                    <button className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm">
                        <Heart className="w-5 h-5 text-gray-800" />
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto md:pt-6 md:px-4 md:grid md:grid-cols-2 md:gap-8">

                {/* Image Gallery — touch-swipeable on mobile */}
                <div
                    ref={galleryRef}
                    className="relative aspect-[3/4] md:aspect-auto md:h-[600px] bg-gray-100 md:rounded-lg overflow-hidden"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={(e) => handleTouchEnd(e, images.length)}
                >
                    <div
                        className="flex h-full transition-transform duration-300 ease-in-out"
                        style={{ transform: `translateX(-${currentImage * 100}%)`, width: `${images.length * 100}%` }}
                    >
                        {images.map((img: any, idx: number) => (
                            <img
                                key={idx}
                                src={img.url}
                                alt={`Image ${idx + 1}`}
                                loading={idx === 0 ? "eager" : "lazy"}
                                className="h-full object-cover"
                                style={{ width: `${100 / images.length}%` }}
                            />
                        ))}
                    </div>

                    {/* Dot indicators */}
                    {images.length > 1 && (
                        <>
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                                {images.map((_: any, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImage(idx)}
                                        className={`h-1.5 rounded-full transition-all ${idx === currentImage ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                                    />
                                ))}
                            </div>
                            {/* Desktop arrow buttons */}
                            <button
                                onClick={() => setCurrentImage(prev => Math.max(0, prev - 1))}
                                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full items-center justify-center hover:bg-white"
                                disabled={currentImage === 0}
                            >
                                <ChevronLeft className="w-6 h-6 text-black" />
                            </button>
                            <button
                                onClick={() => setCurrentImage(prev => Math.min(images.length - 1, prev + 1))}
                                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full items-center justify-center hover:bg-white"
                                disabled={currentImage === images.length - 1}
                            >
                                <ChevronRight className="w-6 h-6 text-black" />
                            </button>
                        </>
                    )}
                </div>

                {/* Product Info */}
                <div className="px-4 py-5 md:py-0">
                    {/* Price and Title */}
                    <div className="mb-4">
                        <div className="flex items-baseline gap-2 mb-2">
                            <h2 className="text-4xl font-extrabold tracking-tight text-black">
                                {ad.priceType === 'fixed' || ad.priceType === 'negotiable' ? `$${ad.price?.toLocaleString()}` :
                                    ad.priceType === 'free' ? 'Gratuit' : 'Sur demande'}
                            </h2>
                            {(ad.priceType === 'fixed' || ad.priceType === 'negotiable') && <span className="text-sm font-medium text-gray-400 line-through">${(ad.price * 1.2).toLocaleString()}</span>}
                        </div>
                        <h1 className="text-base text-gray-800 font-medium leading-relaxed">{ad.title}</h1>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-6">
                        <span className="bg-gray-100 px-2.5 py-1 rounded-sm">{ad.subCategory}</span>
                        <span className="bg-gray-100 px-2.5 py-1 rounded-sm">{ad.city}</span>
                        <span className="bg-gray-100 px-2.5 py-1 rounded-sm">Réf: {ad._id.slice(-6).toUpperCase()}</span>
                    </div>

                    {/* Attributes Grid */}
                    {ad.attributes && Object.keys(ad.attributes).length > 0 && (
                        <div className="mb-8">
                            <h3 className="font-bold text-sm mb-3 text-black uppercase tracking-wider">Caractéristiques</h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                {Object.entries(ad.attributes).map(([key, value]) => (
                                    <div key={key} className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-sm text-gray-500">{key.replace('attr_', '')}</span>
                                        <span className="text-sm text-black font-medium">{String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className="mb-8">
                        <h3 className="font-bold text-sm mb-3 text-black uppercase tracking-wider">Description</h3>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{ad.description}</p>
                    </div>

                    {/* 🛡️ Security Warning Card */}
                    <div className="mb-6 rounded-sm p-4" style={{ backgroundColor: '#EBF5EE', borderWidth: 1, borderStyle: 'solid', borderColor: 'rgba(33,72,41,0.2)' }}>
                        <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck className="w-5 h-5 shrink-0" style={{ color: '#214829' }} />
                            <h3 className="font-bold text-sm uppercase tracking-wide" style={{ color: '#214829' }}>Conseils de sécurité</h3>
                        </div>
                        <ul className="text-xs space-y-1.5 list-disc list-inside" style={{ color: '#2D6138' }}>
                            <li>Ne payez jamais à l'avance sans avoir vu l'article.</li>
                            <li>Rencontrez le vendeur dans un endroit public et sûr.</li>
                            <li>Vérifiez l'article avant de payer.</li>
                            <li>Méfiez-vous des prix anormalement bas.</li>
                            <li>Ne partagez pas vos informations bancaires.</li>
                        </ul>
                    </div>

                    {/* Seller Summary (Desktop only) */}
                    <div className="hidden md:block p-6 rounded-lg" style={{ backgroundColor: '#EBF5EE' }}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 text-white rounded-full flex items-center justify-center font-bold text-xl" style={{ backgroundColor: '#214829' }}>
                                {ad.sellerId?.name?.charAt(0) || 'V'}
                            </div>
                            <div>
                                <p className="font-bold" style={{ color: '#1A3620' }}>{ad.sellerId?.name || 'Vendeur'}</p>
                                <p className="text-xs text-gray-500">Membre vérifié</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {ad.sellerId?.showPhone && (
                                <a href={`tel:${ad.sellerId.phone}`} className="flex-1 text-center py-3 text-sm font-bold flex justify-center items-center gap-2 transition hover:opacity-90 rounded-sm" style={{ backgroundColor: '#FFBA34', color: '#1A3620' }}>
                                    <Phone className="w-4 h-4" /> Appeler
                                </a>
                            )}
                            {ad.sellerId?.whatsapp && (
                                <a href={`https://wa.me/${ad.sellerId.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-3 text-sm font-bold flex justify-center items-center gap-2 transition hover:opacity-90 rounded-sm" style={{ backgroundColor: '#FFBA34', color: '#1A3620' }}>
                                    <MessageCircle className="w-4 h-4" /> WhatsApp
                                </a>
                            )}
                        </div>
                    </div>

                    {/* 🚩 Report Button */}
                    <button
                        onClick={() => setShowReportModal(true)}
                        className="flex items-center gap-2 text-xs text-gray-400 hover:text-red-500 transition mt-4"
                    >
                        <Flag className="w-3.5 h-3.5" /> Signaler cette annonce
                    </button>
                </div>
            </div>

            {/* ✨ Suggested Ads Section */}
            {similarAds.length > 0 && (
                <div className="max-w-5xl mx-auto mt-10 px-4">
                    <h2 className="text-base font-extrabold uppercase tracking-wide text-black mb-4">Suggéré pour vous</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {similarAds.slice(0, 8).map((a: any) => (
                            <AdCard key={a._id} ad={a} />
                        ))}
                    </div>
                </div>
            )}

            {/* Mobile Seller Info Block — visible uniquement sur mobile */}
            <div className="md:hidden px-4 pb-4 mt-6">
                <div className="p-4 rounded-sm" style={{ backgroundColor: '#EBF5EE' }}>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: '#214829' }}>
                            {ad.sellerId?.avatar ? (
                                <img src={ad.sellerId.avatar} alt="Vendeur" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                                    {ad.sellerId?.name?.charAt(0)?.toUpperCase() || 'V'}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-sm" style={{ color: '#1A3620' }}>{ad.sellerId?.name || 'Vendeur'}</p>
                            <p className="text-xs text-gray-500">Membre vérifié</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Bottom Action Bar */}
            <div className="md:hidden fixed bottom-16 left-0 right-0 bg-white border-t border-gray-100 p-3 z-50 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                {ad.sellerId?.showPhone && (
                    <a href={`tel:${ad.sellerId.phone}`} className="flex-1 text-center py-3 text-sm font-bold flex justify-center items-center gap-2 rounded-sm" style={{ backgroundColor: '#FFBA34', color: '#1A3620' }}>
                        <Phone className="w-4 h-4" /> Appeler
                    </a>
                )}
                {ad.sellerId?.whatsapp ? (
                    <a href={`https://wa.me/${ad.sellerId.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-3 text-sm font-bold flex justify-center items-center gap-2 rounded-sm" style={{ backgroundColor: '#FFBA34', color: '#1A3620' }}>
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                    </a>
                ) : (
                    <button className="flex-1 text-center py-3 text-sm font-bold flex justify-center items-center gap-2 rounded-sm" style={{ backgroundColor: '#FFBA34', color: '#1A3620' }}>
                        Contacter
                    </button>
                )}
            </div>

            {/* 🚩 Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-end md:items-center justify-center p-4" onClick={() => setShowReportModal(false)}>
                    <div className="bg-white w-full max-w-md rounded-t-2xl md:rounded-xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        {reportSent ? (
                            <div className="text-center py-6">
                                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ShieldCheck className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Signalement envoyé</h3>
                                <p className="text-sm text-gray-500 mb-4">Merci. Notre équipe va examiner cette annonce dans les plus brefs délais.</p>
                                <button onClick={() => { setShowReportModal(false); setReportSent(false); setReportReason(''); setReportNote(''); }} className="bg-black text-white px-6 py-2 rounded-sm text-sm font-bold">Fermer</button>
                            </div>
                        ) : (
                            <>
                                <h3 className="font-bold text-lg mb-1">Signaler cette annonce</h3>
                                <p className="text-xs text-gray-500 mb-4">Choisissez la raison qui correspond le mieux à votre signalement.</p>
                                <div className="space-y-2 mb-4">
                                    {REPORT_REASONS.map(r => (
                                        <label key={r.value} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${reportReason === r.value ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <input type="radio" name="reason" value={r.value} checked={reportReason === r.value} onChange={e => setReportReason(e.target.value)} className="accent-black" />
                                            <span className="text-sm font-medium">{r.label}</span>
                                        </label>
                                    ))}
                                </div>
                                <textarea
                                    placeholder="Détails supplémentaires (optionnel)..."
                                    value={reportNote}
                                    onChange={e => setReportNote(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black resize-none mb-4"
                                    rows={2}
                                />
                                <div className="flex gap-3">
                                    <button onClick={() => setShowReportModal(false)} className="flex-1 border border-gray-200 py-3 rounded-sm text-sm font-bold text-gray-600 hover:border-gray-400 transition">Annuler</button>
                                    <button
                                        onClick={handleReport}
                                        disabled={!reportReason || reportMutation.isPending}
                                        className="flex-1 bg-red-600 text-white py-3 rounded-sm text-sm font-bold hover:bg-red-700 transition disabled:opacity-50"
                                    >
                                        {reportMutation.isPending ? 'Envoi...' : 'Signaler'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdDetails;
