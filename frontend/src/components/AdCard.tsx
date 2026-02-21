import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

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

const AdCard = ({ ad, promoted = false, viewMode = 'grid' }: AdCardProps) => {
    const isList = viewMode === 'list';

    return (
        <Link
            to={`/ad/${ad._id}`}
            className={`group bg-white flex ${isList ? 'flex-row border-b border-gray-100 p-3 gap-3' : 'flex-col h-full pb-2'}`}
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
                {/* 1. Price */}
                <p className="font-extrabold text-sm md:text-base leading-none mb-1.5" style={{ color: '#FFBA34' }}>
                    {ad.priceType === 'fixed' || ad.priceType === 'negotiable'
                        ? `$${ad.price?.toLocaleString()}`
                        : ad.priceType === 'free' ? 'Gratuit' : 'Sur demande'}
                </p>

                {/* 2. Title (Max 2 lines) */}
                <h3 className="text-[12px] md:text-[13px] text-gray-800 font-medium line-clamp-2 leading-tight group-hover:underline mb-1">
                    {ad.title}
                </h3>

                {/* 3 & 4. City and Condition */}
                <div className="mt-auto pt-1 flex flex-wrap items-center gap-1.5">
                    {ad.city && (
                        <span className="text-[10px] md:text-xs text-gray-500 font-medium whitespace-nowrap">
                            {ad.city}
                        </span>
                    )}
                    {ad.condition && (
                        <span className={`text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap ${getConditionDetails(ad.condition).bg} ${getConditionDetails(ad.condition).text}`}>
                            {getConditionDetails(ad.condition).label}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default AdCard;
