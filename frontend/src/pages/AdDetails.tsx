import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAdById } from '../services/ads';
import { Heart, Share2, ChevronLeft, ChevronRight, MessageCircle, Phone } from 'lucide-react';

const AdDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentImage, setCurrentImage] = useState(0);

    const { data, isLoading, error } = useQuery({
        queryKey: ['ad', id],
        queryFn: () => getAdById(id as string),
        enabled: !!id
    });

    if (isLoading) return <div className="min-h-screen bg-white flex items-center justify-center">Chargement...</div>;
    if (error || !data?.success) return <div className="min-h-screen bg-white flex items-center justify-center text-red-500">Erreur lors du chargement</div>;

    const ad = data.data;
    const images = ad.images?.length > 0 ? ad.images : [{ url: 'https://via.placeholder.com/600x800?text=Aucune+Image' }];

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

                {/* Image Gallery */}
                <div className="relative aspect-[3/4] md:aspect-auto md:h-[600px] bg-gray-100 md:rounded-lg overflow-hidden snap-x snap-mandatory flex">
                    {images.map((img: any, idx: number) => (
                        <img
                            key={idx}
                            src={img.url}
                            alt={`Image ${idx + 1}`}
                            className="w-full h-full object-cover snap-center shrink-0"
                            style={{ transform: `translateX(-${currentImage * 100}%)`, transition: 'transform 0.3s ease-in-out' }}
                        />
                    ))}

                    {/* Image Controls */}
                    {images.length > 1 && (
                        <>
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                {images.map((_: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className={`h-1.5 rounded-full transition-all ${idx === currentImage ? 'w-4 bg-black' : 'w-1.5 bg-black/30'}`}
                                    />
                                ))}
                            </div>
                            {/* Slide Buttons Desktop */}
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
                            <h2 className="text-3xl font-extrabold text-black tracking-tight">
                                {ad.priceType === 'fixed' || ad.priceType === 'negotiable' ? `$${ad.price?.toLocaleString()}` :
                                    ad.priceType === 'free' ? 'Gratuit' : 'Sur demande'}
                            </h2>
                            {(ad.priceType === 'fixed' || ad.priceType === 'negotiable') && <span className="text-sm font-medium text-gray-500 line-through">${(ad.price * 1.2).toLocaleString()}</span>}
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
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                            {ad.description}
                        </p>
                    </div>

                    {/* Seller Summary (Desktop version, mobile uses sticky bar) */}
                    <div className="hidden md:block p-6 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl">
                                {ad.sellerId?.name?.charAt(0) || 'V'}
                            </div>
                            <div>
                                <p className="font-bold text-black">{ad.sellerId?.name || 'Vendeur'}</p>
                                <p className="text-xs text-gray-500">Membre vérifié</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {ad.sellerId?.showPhone && (
                                <a href={`tel:${ad.sellerId.phone}`} className="flex-1 bg-black text-white text-center py-3 text-sm font-bold flex justify-center items-center gap-2 hover:bg-gray-800 transition">
                                    <Phone className="w-4 h-4" /> Appeler
                                </a>
                            )}
                            {ad.sellerId?.whatsapp && (
                                <a href={`https://wa.me/${ad.sellerId.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-green-600 text-white text-center py-3 text-sm font-bold flex justify-center items-center gap-2 hover:bg-green-700 transition">
                                    <MessageCircle className="w-4 h-4" /> WhatsApp
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Bottom Action Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 pb-safe z-50 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                {ad.sellerId?.showPhone && (
                    <a href={`tel:${ad.sellerId.phone}`} className="flex-1 border border-black text-black text-center py-3 text-sm font-bold flex justify-center items-center gap-2">
                        <Phone className="w-4 h-4" /> Appeler
                    </a>
                )}
                {ad.sellerId?.whatsapp ? (
                    <a href={`https://wa.me/${ad.sellerId.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-black text-white text-center py-3 text-sm font-bold flex justify-center items-center gap-2">
                        <MessageCircle className="w-4 h-4" /> Contacter
                    </a>
                ) : (
                    <button className="flex-1 bg-black text-white text-center py-3 text-sm font-bold flex justify-center items-center gap-2">
                        Contacter le vendeur
                    </button>
                )}
            </div>
        </div>
    );
};

export default AdDetails;
