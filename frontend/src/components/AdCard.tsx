import { Link } from 'react-router-dom';
import { Heart, Star, Briefcase } from 'lucide-react';
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
                {promoted && (
                    <div className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider z-10" style={{ backgroundColor: '#FFBA34', color: '#1A3620' }}>
                        Promo
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
            </div>

            <div className={`flex flex-col flex-1 ${isList ? 'py-1 justify-start' : 'pt-2 px-1'}`}>
                {/* 1. Price & Badge */}
                <div className="flex flex-col gap-2 mb-2">
                    <div className="flex items-center justify-between">
                        <p className="font-black text-xl md:text-2xl tracking-tighter text-[#1A3620] leading-none">
                            {ad.priceType === 'fixed' || ad.priceType === 'negotiable'
                                ? `$${ad.price?.toLocaleString()}`
                                : ad.priceType === 'free' ? 'Gratuit' : 'Sur demande'}
                        </p>

                        {ad.sellerId?.badge && ad.sellerId.badge !== 'none' && (
                            <div className="flex items-center translate-y-[-2px]">
                                {ad.sellerId.badge === 'founder' ? (
                                    <div className="flex items-center gap-1.5 bg-gradient-to-br from-[#FFD700] via-[#FFBA34] to-[#E8A520] text-white px-2.5 py-1 rounded-full shadow-[0_2px_8px_rgba(255,186,52,0.4)] border border-white/20">
                                        <Star size={12} className="fill-white" />
                                        <span className="text-[10px] font-black tracking-widest uppercase">FONDATEUR</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 bg-gradient-to-br from-[#10B981] to-[#047857] text-white px-2.5 py-1 rounded-full shadow-[0_2px_8px_rgba(16,185,129,0.3)] border border-white/20">
                                        <Briefcase size={12} className="fill-white" />
                                        <span className="text-[10px] font-black tracking-widest uppercase">PRO</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Title (Max 2 lines) */}
                <h3 className="text-sm md:text-base text-gray-900 font-bold line-clamp-2 leading-snug group-hover:text-[#214829] transition-colors mb-2 min-h-[2.5rem]">
                    {ad.title}
                </h3>

                {/* 3 & 4. City and Condition */}
                <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                        {ad.city && (
                            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                                {ad.city}
                            </span>
                        )}
                        <span className="w-1 h-1 bg-gray-200 rounded-full shrink-0"></span>
                        <span className="text-[11px] text-gray-400 font-bold">
                            {formatRelativeDate(ad.createdAt)}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default AdCard;
