import { Link } from 'react-router-dom';
import { Heart, Star, Briefcase, MapPin, User, Search, ShoppingCart } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { getAdById } from '../services/ads';

interface AdCardProps {
    ad: any;
    promoted?: boolean;
    viewMode?: 'grid' | 'list';
}

const getConditionDetails = (condition: string) => {
    switch (condition?.toLowerCase()) {
        case 'new':
            return { label: 'Neuf', bg: 'bg-[#EBF5EE]', text: 'text-[#214829]' };
        case 'used':
            return { label: 'Occasion', bg: 'bg-orange-100', text: 'text-orange-700' };
        case 'refurbished':
            return { label: 'Reconditionné', bg: 'bg-blue-100', text: 'text-blue-700' };
        default:
            return { label: condition, bg: 'bg-gray-100', text: 'text-gray-700' };
    }
};

const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "À l'instant";
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 172800) return "Hier";
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

const AdCard = ({ ad, promoted = false, viewMode = 'grid' }: AdCardProps) => {
    const isList = viewMode === 'list';
    const queryClient = useQueryClient();

    // Prefetch ad detail on hover — so it's ready before the user clicks
    let prefetchTimer: ReturnType<typeof setTimeout>;
    const handleMouseEnter = () => {
        prefetchTimer = setTimeout(() => {
            queryClient.prefetchQuery({
                queryKey: ['ad', ad._id],
                queryFn: () => getAdById(ad._id),
                staleTime: 1000 * 60,
            });
        }, 150); // 150ms delay — only prefetch if hover is intentional
    };
    const handleMouseLeave = () => clearTimeout(prefetchTimer);

    return (
        <Link
            to={`/ad/${ad._id}`}
            className={`group bg-white flex ${isList ? 'flex-row border-b border-gray-100 p-4 gap-4' : 'flex-col h-full p-3 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#FFBA34]/30 transition-all duration-300'}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={`relative bg-gray-100 overflow-hidden rounded-sm shrink-0 ${isList ? 'w-28 h-28 md:w-36 md:h-36' : 'aspect-[3/4]'}`}>
                {ad.images?.[0] ? (
                    <img
                        src={ad.images[0].url}
                        alt={ad.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-2">Aucune image</div>
                )}
                {ad.promoted && (
                    <div className="absolute top-2 right-2 text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-wider z-10 bg-[var(--color-accent-pink)] text-white shadow-sm">
                        Deal Spécial
                    </div>
                )}
                <button
                    className="absolute bottom-2 right-2 bg-white/90 backdrop-blur rounded-full p-1.5 text-gray-400 hover:text-[#FFBA34] transition-colors z-10 shadow-sm"
                    onClick={(e) => {
                        e.preventDefault();
                        // Wishlist logic here later
                    }}
                >
                    <Heart className="w-4 h-4" />
                </button>

                {/* Import Badge (Dynamic/Mock for now) */}
                {ad.importFrom && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-white/95 backdrop-blur px-2 py-1 rounded-sm shadow-sm border border-gray-100/50">
                        <span className="text-[10px]">🇨🇳</span>
                        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tight">Import de {ad.importFrom}</span>
                    </div>
                )}
            </div>

            <div className={`flex flex-col flex-1 ${isList ? 'py-1 justify-start' : 'pt-2 px-1'}`}>
                {/* 1. Price & Badge */}
                <div className="flex flex-col gap-1 mb-1">
                    <div className="flex items-center justify-between">
                        <p className="font-black text-lg md:text-xl tracking-tighter text-[var(--color-accent-pink)] leading-none">
                            {ad.priceType === 'fixed' || ad.priceType === 'negotiable'
                                ? `$ ${ad.price?.toLocaleString()}`
                                : ad.priceType === 'free' ? 'Gratuit' : 'Sur demande'}
                        </p>

                        {ad.sellerId?.badge && ad.sellerId.badge !== 'none' && (
                            <div className="flex items-center">
                                {ad.sellerId.badge === 'founder' ? (
                                    <div className="bg-gradient-to-br from-[#FFD700] to-[#E8A520] text-white p-1 rounded-full border border-white/20">
                                        <Star size={10} className="fill-white" />
                                    </div>
                                ) : (
                                    <div className="bg-gradient-to-br from-[#10B981] to-[#047857] text-white p-1 rounded-full border border-white/20">
                                        <Briefcase size={10} className="fill-white" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Title & Specific Badges */}
                <div className="flex items-center gap-1.5 mb-1.5 scale-90 origin-left">
                    {ad.condition === 'new' && (
                        <div className="bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase">NEW</div>
                    )}
                    {ad.discount && (
                        <div className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase">-{ad.discount}%</div>
                    )}
                </div>

                <h3 className="text-[13px] md:text-[14px] text-gray-700 font-medium line-clamp-1 leading-snug hover:text-blue-600 transition-colors mb-2">
                    {ad.title}
                </h3>

                {/* 3. Stock Progress Bar (Optional) */}
                {ad.stockTotal && (
                    <div className="mb-3">
                        <div className="flex justify-between text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">
                            <span>Stock restant</span>
                            <span>{ad.stockCurrent}/{ad.stockTotal}</span>
                        </div>
                        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-orange-400 rounded-full"
                                style={{ width: `${(ad.stockCurrent / ad.stockTotal) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* 3 & 4. City and Condition */}
                <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between gap-2 overflow-hidden">
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1">
                            <User size={10} className="text-gray-400 shrink-0" />
                            <span className="text-[10px] text-gray-400 font-bold truncate leading-none">
                                {ad.sellerId?.businessName ||
                                    (ad.sellerId?.firstName ? `${ad.sellerId.firstName} ${ad.sellerId.lastName || ''}` : 'Vendeur')}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                            <MapPin size={9} className="text-gray-300 shrink-0" />
                            <span className="text-[9px] text-gray-400 font-medium uppercase tracking-tighter leading-none">
                                {ad.city || 'RDC'}
                            </span>
                        </div>
                    </div>
                    <button
                        className="bg-gray-50 hover:bg-blue-600 hover:text-white p-2 rounded-lg border border-gray-100 transition-all shadow-sm"
                        onClick={(e) => {
                            e.preventDefault();
                            // Cart logic
                        }}
                    >
                        <ShoppingCart size={14} />
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default AdCard;
