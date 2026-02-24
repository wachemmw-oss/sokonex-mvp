import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getAdById, getSimilarAds, reportAd } from '../services/ads';
import {
    Heart, Share2, ChevronLeft, ChevronRight, MessageCircle, Phone,
    Flag, ShieldCheck, Star, Briefcase, MapPin, Tag, Clock,
    TrendingDown, DollarSign, AlertTriangle
} from 'lucide-react';
import AdCard from '../components/AdCard';

// Taux de change approximatifs (1 USD)
const RATES = {
    CDF: 2800,   // Franc Congolais
    EUR: 0.92,   // Euro
};

const REPORT_REASONS = [
    { value: 'scam', label: 'Arnaque ou fraude' },
    { value: 'prohibited', label: 'Contenu interdit' },
    { value: 'duplicate', label: 'Annonce en double' },
    { value: 'wrong_category', label: 'Mauvaise catégorie' },
    { value: 'other', label: 'Autre raison' },
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
        onSuccess: () => setReportSent(true)
    });

    const handleReport = () => {
        if (!reportReason) return;
        reportMutation.mutate({ adId: id as string, reason: reportReason, note: reportNote });
    };

    const touchStartX = useRef(0);
    const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchEnd = (e: React.TouchEvent, maxImages: number) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
            if (diff > 0) setCurrentImage(prev => Math.min(prev + 1, maxImages - 1));
            else setCurrentImage(prev => Math.max(prev - 1, 0));
        }
    };

    if (isLoading) return (
        <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#D32F2F] rounded-full animate-spin" />
        </div>
    );
    if (error || !data?.success) return (
        <div className="min-h-screen bg-white flex items-center justify-center text-red-500">
            Erreur lors du chargement
        </div>
    );

    const ad = data.data;
    const images = ad.images?.length > 0 ? ad.images : [{ url: 'https://via.placeholder.com/600x800?text=Aucune+Image' }];
    const similarAds = similarData?.data?.items ?? [];
    const hasPrice = ad.priceType === 'fixed' || ad.priceType === 'negotiable';
    const priceLabel = hasPrice ? `$${ad.price?.toLocaleString()}` : ad.priceType === 'free' ? 'Gratuit' : 'Sur demande';
    const cdfPrice = hasPrice && ad.price ? Math.round(ad.price * RATES.CDF).toLocaleString() : null;
    const eurPrice = hasPrice && ad.price ? (ad.price * RATES.EUR).toFixed(0) : null;

    return (
        <div className="bg-[#FAFAF8] min-h-screen pb-32 font-sans">

            {/* Mobile Top Nav */}
            <div className="md:hidden fixed top-0 w-full z-50 flex justify-between items-center p-4 pointer-events-none">
                <button onClick={() => navigate(-1)} className="pointer-events-auto w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md">
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <div className="flex gap-2">
                    <button className="pointer-events-auto w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md">
                        <Share2 className="w-5 h-5 text-gray-800" />
                    </button>
                    <button className="pointer-events-auto w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md">
                        <Heart className="w-5 h-5 text-gray-800" />
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto md:pt-8 md:px-4 md:grid md:grid-cols-[1fr_380px] md:gap-8">

                {/* ── Image Gallery ── */}
                <div
                    ref={galleryRef}
                    className="relative aspect-[4/3] md:aspect-auto md:h-[560px] bg-gray-200 md:rounded-2xl overflow-hidden"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={(e) => handleTouchEnd(e, images.length)}
                >
                    <div
                        className="flex h-full transition-transform duration-500 ease-out"
                        style={{ transform: `translateX(-${currentImage * 100}%)` }}
                    >
                        {images.map((img: any, idx: number) => (
                            <div key={idx} className="w-full h-full flex-shrink-0">
                                <img
                                    src={img.url}
                                    alt={`Image ${idx + 1}`}
                                    loading={idx === 0 ? "eager" : "lazy"}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Image counter pill */}
                    {images.length > 1 && (
                        <div className="absolute top-4 right-4 bg-black/50 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                            {currentImage + 1} / {images.length}
                        </div>
                    )}

                    {/* Dot indicators */}
                    {images.length > 1 && (
                        <>
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                                {images.map((_: any, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImage(idx)}
                                        className={`h-1.5 rounded-full transition-all ${idx === currentImage ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentImage(prev => Math.max(0, prev - 1))}
                                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full items-center justify-center hover:bg-white shadow-sm"
                                disabled={currentImage === 0}
                            >
                                <ChevronLeft className="w-6 h-6 text-black" />
                            </button>
                            <button
                                onClick={() => setCurrentImage(prev => Math.min(images.length - 1, prev + 1))}
                                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full items-center justify-center hover:bg-white shadow-sm"
                                disabled={currentImage === images.length - 1}
                            >
                                <ChevronRight className="w-6 h-6 text-black" />
                            </button>
                        </>
                    )}
                </div>

                {/* ── Right Panel / Product Info ── */}
                <div className="px-4 py-5 md:py-0 flex flex-col gap-4">

                    {/* ── PRICE CARD ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-5">
                            {/* Main price */}
                            <div className="flex items-baseline gap-3 mb-2">
                                <span className="text-4xl font-extrabold tracking-tight" style={{ color: '#f7711c' }}>
                                    {priceLabel}
                                </span>
                                {hasPrice && ad.priceType === 'negotiable' && (
                                    <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <TrendingDown className="w-3 h-3" /> Négociable
                                    </span>
                                )}
                            </div>

                            {/* Currency equivalence */}
                            {hasPrice && cdfPrice && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <div className="flex items-center gap-1.5 bg-[#FAFAF8] border border-gray-100 rounded-lg px-3 py-1.5">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CDF</span>
                                        <span className="text-sm font-bold text-gray-700">{cdfPrice} FC</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-[#FAFAF8] border border-gray-100 rounded-lg px-3 py-1.5">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">EUR</span>
                                        <span className="text-sm font-bold text-gray-700">€{eurPrice}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-3 py-1.5">
                                        <DollarSign className="w-3 h-3 text-gray-400" />
                                        <span className="text-[10px] text-gray-400">Taux indicatif</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Title & meta inside card */}
                        <div className="px-5 pb-4 border-t border-gray-50 pt-4">
                            <h1 className="text-base font-bold text-gray-900 leading-snug mb-3">{ad.title}</h1>
                            <div className="flex flex-wrap gap-2">
                                <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
                                    <Tag className="w-3 h-3" /> {ad.subCategory || ad.category}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
                                    <MapPin className="w-3 h-3" /> {ad.city}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
                                    <Clock className="w-3 h-3" /> {new Date(ad.createdAt).toLocaleDateString('fr-FR')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── Seller Card ── */}
                    <Link to={`/store/${ad.sellerId?._id}`} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:border-[#D32F2F]/20 transition-all group">
                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-[#D32F2F] flex items-center justify-center text-white font-black text-xl shadow-sm">
                            {ad.sellerId?.avatar
                                ? <img src={ad.sellerId.avatar} className="w-full h-full object-cover" alt="" />
                                : ad.sellerId?.name?.charAt(0)?.toUpperCase() || 'V'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-bold text-gray-900 group-hover:text-[#D32F2F] transition-colors">{ad.sellerId?.name || 'Vendeur'}</p>
                                {ad.sellerId?.badge === 'founder' && (
                                    <span className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-2 py-0.5 rounded-full text-[9px] font-black">
                                        <Star size={8} className="fill-white" /> FONDATEUR
                                    </span>
                                )}
                                {ad.sellerId?.badge === 'pro' && (
                                    <span className="flex items-center gap-1 bg-[#D32F2F] text-white px-2 py-0.5 rounded-full text-[9px] font-black">
                                        <Briefcase size={8} /> PRO
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <ShieldCheck className="w-3 h-3 text-[#D32F2F]" /> Membre vérifié
                            </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#D32F2F] shrink-0 transition-colors" />
                    </Link>

                    {/* ── Contact Buttons ── */}
                    <div className="hidden md:flex gap-3">
                        {ad.sellerId?.showPhone && (
                            <a href={`tel:${ad.sellerId.phone}`} className="flex-1 text-center py-3.5 text-sm font-bold flex justify-center items-center gap-2 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white transition-colors shadow-sm">
                                <Phone className="w-4 h-4" /> Appeler
                            </a>
                        )}
                        {ad.sellerId?.whatsapp && (
                            <a href={`https://wa.me/${ad.sellerId.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-3.5 text-sm font-bold flex justify-center items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#22bf5b] text-white transition-colors shadow-sm">
                                <MessageCircle className="w-4 h-4" /> WhatsApp
                            </a>
                        )}
                    </div>

                    {/* ── Attributes ── */}
                    {ad.attributes && Object.keys(ad.attributes).length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-4">Caractéristiques</h3>
                            <div className="space-y-2.5">
                                {Object.entries(ad.attributes).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center border-b border-gray-50 pb-2.5">
                                        <span className="text-sm text-gray-500">{key.replace('attr_', '')}</span>
                                        <span className="text-sm font-bold text-gray-900">{String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Description ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-4">Description</h3>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{ad.description}</p>
                    </div>

                    {/* ── Security Warning ── */}
                    <div className="rounded-2xl p-4 bg-amber-50 border border-amber-100">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                            <h3 className="font-bold text-xs uppercase tracking-wider text-amber-700">Conseils de sécurité</h3>
                        </div>
                        <ul className="text-xs space-y-1 text-amber-800 list-disc list-inside">
                            <li>Ne payez jamais à l'avance sans avoir vu l'article.</li>
                            <li>Rencontrez le vendeur dans un endroit public.</li>
                            <li>Méfiez-vous des prix anormalement bas.</li>
                        </ul>
                    </div>

                    {/* ── Report ── */}
                    <button
                        onClick={() => setShowReportModal(true)}
                        className="flex items-center gap-2 text-xs text-gray-400 hover:text-red-500 transition"
                    >
                        <Flag className="w-3.5 h-3.5" /> Signaler cette annonce
                    </button>
                </div>
            </div>

            {/* ── Similar Ads ── */}
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

            {/* ── Mobile Sticky Bottom Bar ── */}
            <div className="md:hidden fixed bottom-20 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 p-3 z-50 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
                <div className="flex-1 flex flex-col justify-center">
                    <span className="text-xs text-gray-400">Prix</span>
                    <span className="text-xl font-extrabold" style={{ color: '#f7711c' }}>{priceLabel}</span>
                    {cdfPrice && <span className="text-[10px] text-gray-400">{cdfPrice} FC</span>}
                </div>
                <div className="flex gap-2">
                    {ad.sellerId?.showPhone && (
                        <a href={`tel:${ad.sellerId.phone}`} className="h-full px-4 py-3 text-sm font-bold flex items-center gap-2 rounded-xl bg-[#D32F2F] text-white">
                            <Phone className="w-4 h-4" />
                        </a>
                    )}
                    {ad.sellerId?.whatsapp ? (
                        <a href={`https://wa.me/${ad.sellerId.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center px-5 py-3 text-sm font-bold flex justify-center items-center gap-2 rounded-xl bg-[#25D366] text-white">
                            <MessageCircle className="w-4 h-4" /> WhatsApp
                        </a>
                    ) : (
                        <button className="flex-1 text-center px-5 py-3 text-sm font-bold flex justify-center items-center gap-2 rounded-xl bg-[#D32F2F] text-white">
                            <Phone className="w-4 h-4" /> Contacter
                        </button>
                    )}
                </div>
            </div>

            {/* ── Report Modal ── */}
            {showReportModal && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-end md:items-center justify-center p-4" onClick={() => setShowReportModal(false)}>
                    <div className="bg-white w-full max-w-md rounded-t-2xl md:rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        {reportSent ? (
                            <div className="text-center py-6">
                                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ShieldCheck className="w-8 h-8 text-[#D32F2F]" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Signalement envoyé</h3>
                                <p className="text-sm text-gray-500 mb-4">Merci. Notre équipe va examiner cette annonce.</p>
                                <button onClick={() => { setShowReportModal(false); setReportSent(false); setReportReason(''); setReportNote(''); }} className="bg-[#D32F2F] text-white px-6 py-2 rounded-xl text-sm font-bold">Fermer</button>
                            </div>
                        ) : (
                            <>
                                <h3 className="font-bold text-lg mb-1">Signaler cette annonce</h3>
                                <p className="text-xs text-gray-500 mb-4">Choisissez la raison qui correspond le mieux.</p>
                                <div className="space-y-2 mb-4">
                                    {REPORT_REASONS.map(r => (
                                        <label key={r.value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${reportReason === r.value ? 'border-[#D32F2F] bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <input type="radio" name="reason" value={r.value} checked={reportReason === r.value} onChange={e => setReportReason(e.target.value)} className="accent-[#D32F2F]" />
                                            <span className="text-sm font-medium">{r.label}</span>
                                        </label>
                                    ))}
                                </div>
                                <textarea
                                    placeholder="Détails supplémentaires (optionnel)..."
                                    value={reportNote}
                                    onChange={e => setReportNote(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#D32F2F] resize-none mb-4"
                                    rows={2}
                                />
                                <div className="flex gap-3">
                                    <button onClick={() => setShowReportModal(false)} className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-bold text-gray-600 hover:border-gray-400 transition">Annuler</button>
                                    <button
                                        onClick={handleReport}
                                        disabled={!reportReason || reportMutation.isPending}
                                        className="flex-1 bg-[#D32F2F] text-white py-3 rounded-xl text-sm font-bold hover:bg-[#B71C1C] transition disabled:opacity-50"
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
