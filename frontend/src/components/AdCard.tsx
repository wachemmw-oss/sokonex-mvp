import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

interface AdCardProps {
    ad: any;
    promoted?: boolean;
}

const AdCard = ({ ad, promoted = false }: AdCardProps) => {
    return (
        <Link to={`/ad/${ad._id}`} className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 flex flex-col h-full group">
            <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                {ad.images?.[0] ? (
                    <img
                        src={ad.images[0].url}
                        alt={ad.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                )}
                {promoted && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow-sm">
                        Promo
                    </div>
                )}
            </div>
            <div className="p-3 flex flex-col flex-1">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                    {ad.title}
                </h3>
                <div className="mt-auto">
                    <p className="text-gray-900 font-bold text-base">
                        {ad.priceType === 'fixed' || ad.priceType === 'negotiable'
                            ? `$${ad.price?.toLocaleString()}`
                            : ad.priceType === 'free' ? 'Gratuit' : 'Sur demande'}
                    </p>
                    <div className="flex items-center mt-1 text-xs text-gray-400">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="truncate">{ad.city}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default AdCard;
