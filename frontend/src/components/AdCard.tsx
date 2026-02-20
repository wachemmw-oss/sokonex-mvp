import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

interface AdCardProps {
    ad: any;
    promoted?: boolean;
}

const AdCard = ({ ad, promoted = false }: AdCardProps) => {
    return (
        <Link to={`/ad/${ad._id}`} className="flex flex-col h-full group pb-2">
            <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden rounded-sm">
                {ad.images?.[0] ? (
                    <img
                        src={ad.images[0].url}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Aucune image</div>
                )}
                {promoted && (
                    <div className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider z-10">
                        Promo
                    </div>
                )}
                <button
                    className="absolute bottom-2 right-2 bg-white/90 backdrop-blur rounded-full p-1.5 text-gray-400 hover:text-red-500 transition-colors z-10 shadow-sm"
                    onClick={(e) => {
                        e.preventDefault(); // Prevent navigation when liking
                        // Wishlist logic here later
                    }}
                >
                    <Heart className="w-4 h-4" />
                </button>
            </div>

            <div className="pt-2 flex flex-col flex-1 px-1">
                <h3 className="text-[12px] md:text-xs text-gray-700 font-normal line-clamp-1 group-hover:underline">
                    {ad.title}
                </h3>
                <div className="mt-1 flex items-baseline gap-1">
                    <p className="text-black font-bold text-sm">
                        {ad.priceType === 'fixed' || ad.priceType === 'negotiable'
                            ? `$${ad.price?.toLocaleString()}`
                            : ad.priceType === 'free' ? 'Gratuit' : 'Prix libre'}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default AdCard;
